import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { updateProject } from "../actions";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default async function EditProjectPage({
    params
}: {
    params: Promise<{ category: string, id: string }>
}) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: project } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

    if (!project) {
        redirect("/admin/media");
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Link href={`/admin/${(await params).category}`} className="p-2 bg-neutral-900 rounded-full hover:bg-neutral-800 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-400 hover:text-white" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold uppercase tracking-widest mb-2">Edit Project</h1>
                    <p className="text-gray-400">Update project metadata and featured status.</p>
                </div>
            </div>

            <form action={updateProject} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 space-y-6">
                <input type="hidden" name="id" value={project.id} />
                <input type="hidden" name="category" value={project.category} />

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                        <input
                            type="text"
                            name="title"
                            defaultValue={project.title}
                            required
                            className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gray-500 transition-colors"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Client</label>
                        <input
                            type="text"
                            name="client"
                            defaultValue={project.client || ''}
                            className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gray-500 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Category (Locked)</label>
                        <input
                            type="text"
                            disabled
                            value={project.category.toUpperCase()}
                            className="w-full bg-black/50 text-gray-500 border border-neutral-800 rounded-lg px-4 py-3 cursor-not-allowed focus:outline-none transition-colors"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                    <textarea
                        name="description"
                        defaultValue={project.description || ''}
                        rows={4}
                        className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gray-500 transition-colors resize-none"
                    />
                </div>

                <div className="flex items-center gap-3 bg-black/50 p-4 rounded-lg border border-neutral-800">
                    <input
                        type="checkbox"
                        name="is_featured"
                        id="is_featured"
                        defaultChecked={project.is_featured ?? false}
                        className="w-5 h-5 rounded border-gray-800 bg-black text-white focus:ring-0 focus:ring-offset-0 cursor-pointer accent-white"
                    />
                    <label htmlFor="is_featured" className="text-sm font-medium text-gray-300 cursor-pointer">
                        Feature on Homepage Bento Grid
                    </label>
                </div>

                <div className="pt-4 border-t border-neutral-800 flex justify-end">
                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors uppercase tracking-widest text-sm"
                    >
                        <Save className="w-4 h-4" />
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
