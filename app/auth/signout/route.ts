import { signout } from "@/app/(auth)/actions";
import { redirect } from "next/navigation";

export async function POST() {
    await signout();
    redirect("/login");
}
