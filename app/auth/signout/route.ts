import { redirect } from "next/navigation";
import { signout } from "@/app/admin/auth/actions";

export async function POST() {
    await signout();
    redirect("/admin/login");
}
