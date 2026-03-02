"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addTestimonial(formData: FormData) {
    const supabase = await createClient();
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;
    const content = formData.get("content") as string;
    const rating = parseInt(formData.get("rating") as string) || 5;

    const { error } = await supabase
        .from("testimonials")
        .insert([{ name, role, content, rating }]);

    if (error) {
        console.error(error);
        return { error: error.message };
    }

    revalidatePath("/admin/testimonials");
    revalidatePath("/testimonials");
    revalidatePath("/");
    redirect("/admin/testimonials");
}

export async function deleteTestimonial(formData: FormData) {
    const supabase = await createClient();
    const id = formData.get("id") as string;

    const { error } = await supabase
        .from("testimonials")
        .delete()
        .eq("id", id);

    if (error) {
        console.error(error);
        throw new Error("Failed to delete testimonial");
    }

    revalidatePath("/admin/testimonials");
    revalidatePath("/testimonials");
    revalidatePath("/");
}
