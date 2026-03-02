"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function markAsRead(formData: FormData) {
    const id = formData.get("id") as string;
    const supabase = await createClient();

    await supabase
        .from("inquiries")
        .update({ status: "read" })
        .eq("id", id);

    revalidatePath("/admin/inquiries");
    revalidatePath("/admin/dashboard");
}

export async function deleteInquiry(formData: FormData) {
    const id = formData.get("id") as string;
    const supabase = await createClient();

    await supabase
        .from("inquiries")
        .delete()
        .eq("id", id);

    revalidatePath("/admin/inquiries");
    revalidatePath("/admin/dashboard");
}
