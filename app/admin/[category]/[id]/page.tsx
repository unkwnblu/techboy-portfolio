import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { updateProject } from "../actions";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default async function EditProjectPage({
    params,
}: {
    params: Promise<{ category: string; id: string }>;
}) {
    const { id, category } = await params;
    const supabase = await createClient();

    const { data: project } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

    if (!project) {
        redirect("/admin/dashboard");
    }

    return (
        <div className="max-w-2xl space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href={`/admin/${category}`}
                    className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] transition-colors text-white/50 hover:text-white"
                >
                    <ArrowLeft className="w-4 h-4" />
                </Link>
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/25 mb-0.5">
                        Edit Project
                    </p>
                    <h1 className="text-xl font-bold tracking-tight truncate">{project.title}</h1>
                </div>
            </div>

            <form action={updateProject} className="space-y-4">
                <input type="hidden" name="id" value={project.id} />
                <input type="hidden" name="category" value={project.category} />

                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 space-y-5">
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                        Project Details
                    </h2>

                    <div>
                        <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.18em] mb-2">
                            Title <span className="text-red-400/80">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            defaultValue={project.title}
                            required
                            className="w-full bg-black/40 border border-white/[0.08] rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-white/25 transition-colors"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.18em] mb-2">
                                Client{" "}
                                <span className="text-white/20 normal-case tracking-normal text-[9px]">
                                    (optional)
                                </span>
                            </label>
                            <input
                                type="text"
                                name="client"
                                defaultValue={project.client || ""}
                                className="w-full bg-black/40 border border-white/[0.08] rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-white/25 transition-colors"
                                placeholder="Client name"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.18em] mb-2">
                                Category
                            </label>
                            <div className="w-full bg-white/[0.02] border border-white/[0.05] rounded-xl py-3 px-4 text-white/30 text-sm font-semibold uppercase tracking-wider cursor-not-allowed">
                                {project.category}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.18em] mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            defaultValue={project.description || ""}
                            rows={4}
                            className="w-full bg-black/40 border border-white/[0.08] rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-white/25 transition-colors resize-none"
                            placeholder="Project description…"
                        />
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer select-none group bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-3">
                        <input
                            type="checkbox"
                            name="is_featured"
                            id="is_featured"
                            defaultChecked={project.is_featured ?? false}
                            className="w-4 h-4 rounded bg-black/50 border-white/20 accent-white cursor-pointer"
                        />
                        <span className="text-[12px] text-white/50 group-hover:text-white/80 transition-colors cursor-pointer">
                            Feature on homepage bento grid
                        </span>
                    </label>
                </div>

                <div className="flex items-center justify-end pt-1">
                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-xl font-bold text-[12px] uppercase tracking-wider hover:bg-white/90 transition-colors"
                    >
                        <Save className="w-3.5 h-3.5" />
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
