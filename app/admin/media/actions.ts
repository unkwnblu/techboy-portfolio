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

    revalidatePath("/admin/media");
    revalidatePath("/admin/dashboard");
    revalidatePath("/portfolio");
}

export async function uploadProjectAndMedia(formData: FormData) {
    const supabase = await createClient();

    // Create Project Record
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const client = formData.get("client") as string;
    const category = formData.get("category") as 'photo' | 'video' | 'drone' | 'edit';
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

    revalidatePath("/admin/media");
    revalidatePath("/admin/dashboard");
    revalidatePath("/portfolio");
    revalidatePath("/");

    return { success: true };
}
