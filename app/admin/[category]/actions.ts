"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteProject(formData: FormData) {
    const id = formData.get("id") as string;
    const supabase = await createClient();

    // Storage cleanup is complicated if we don't know the file URLs directly,
    // typically we'd fetch the media records first, delete storage objects, then delete DB.
    // For simplicity, we just delete DB and let cascade handle related tables. 
    // (Note: Supabase does not auto-delete storage files on table cascade currently).

    const { data: media } = await supabase.from("media").select("file_url").eq("project_id", id);
    if (media && media.length > 0) {
        const filePaths = media.map(m => {
            // Extract path from the URL
            const url = new URL(m.file_url);
            const pathSegments = url.pathname.split('/media/');
            return pathSegments[1];
        }).filter(Boolean);

        if (filePaths.length > 0) {
            await supabase.storage.from('media').remove(filePaths);
        }
    }

    await supabase
        .from("projects")
        .delete()
        .eq("id", id);

    revalidatePath("/admin", "layout");
    revalidatePath("/admin/dashboard");
    revalidatePath("/portfolio");
}

export async function uploadProjectAndMedia(formData: FormData) {
    const supabase = await createClient();

    // Create Project Record
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const client = formData.get("client") as string;
    const category = formData.get("category") as 'videography' | 'drone pilot' | 'photography' | 'video editor' | 'motion graphics';
    const description = formData.get("description") as string;
    const is_featured = formData.get("is_featured") === "true";

    const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert([
            { title, slug, client, category, description, is_featured }
        ])
        .select()
        .single();

    if (projectError) {
        return { error: projectError.message };
    }

    // Upload Media
    const mediaFile = formData.get("mediaFile") as File;
    if (mediaFile && mediaFile.size > 0) {
        const fileExt = mediaFile.name.split('.').pop();
        const fileName = `${project.id}-${Date.now()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('media')
            .upload(fileName, mediaFile);

        if (uploadError) {
            // Rollback project if media fails
            await supabase.from("projects").delete().eq("id", project.id);
            return { error: uploadError.message };
        }

        const { data: publicUrlData } = supabase.storage
            .from('media')
            .getPublicUrl(fileName);

        const media_type = mediaFile.type.startsWith('video/') ? 'video' : 'image';

        await supabase
            .from("media")
            .insert([
                {
                    project_id: project.id,
                    file_url: publicUrlData.publicUrl,
                    media_type: media_type,
                    sort_order: 0
                }
            ]);
    }

    revalidatePath("/admin", "layout");
    revalidatePath("/admin/dashboard");
    revalidatePath("/portfolio");
    revalidatePath("/");

    return { success: true };
}

export async function createProjectRecord(data: {
    title: string;
    slug: string;
    client: string;
    category: 'videography' | 'drone pilot' | 'photography' | 'video editor' | 'motion graphics';
    description: string;
    is_featured: boolean;
}) {
    const supabase = await createClient();
    const { data: project, error } = await supabase
        .from("projects")
        .insert([data])
        .select()
        .single();

    if (error) return { error: error.message };
    return { project };
}

export async function addMediaRecord(projectId: string, fileName: string, mediaType: 'image' | 'video', sortOrder: number) {
    const supabase = await createClient();
    const { data: publicUrlData } = supabase.storage
        .from('media')
        .getPublicUrl(fileName);

    const { error } = await supabase
        .from("media")
        .insert([
            {
                project_id: projectId,
                file_url: publicUrlData.publicUrl,
                media_type: mediaType,
                sort_order: sortOrder
            }
        ]);

    if (error) return { error: error.message };

    revalidatePath("/admin", "layout");
    revalidatePath("/portfolio");
    revalidatePath("/");
    return { success: true };
}

export async function updateProject(formData: FormData) {
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const client = formData.get("client") as string;
    const category = formData.get("category") as 'videography' | 'drone pilot' | 'photography' | 'video editor' | 'motion graphics';
    const description = formData.get("description") as string;
    const is_featured = formData.get("is_featured") === "on";

    const supabase = await createClient();

    const { error } = await supabase
        .from("projects")
        .update({
            title,
            client,
            category,
            description,
            is_featured,
        })
        .eq("id", id);

    if (error) throw new Error(error.message);

    revalidatePath("/admin", "layout");
    revalidatePath(`/admin/${category}/${id}`);
    revalidatePath("/portfolio");
    revalidatePath("/");

    // Redirect must be imported and called directly or returned, depending on Nextjs usage.
    // For simplicity with server actions as forms, we'll throw if error, letting Nextjs error boundaries catch it, 
    // or return a redirect. But wait, `redirect` triggers an error that Next.js catches for navigation.
}
