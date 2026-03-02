import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Edit2, Trash2, FolderGit2 } from "lucide-react";
import { deleteProject } from "./actions";
import { notFound } from "next/navigation";

// Utility to convert slug (e.g. drone-pilot) to DB enum (e.g. drone pilot)
type ProjectCategory = 'videography' | 'drone pilot' | 'photography' | 'video editor' | 'motion graphics';

function getDbCategory(slug: string): ProjectCategory | null {
    const map: Record<string, ProjectCategory> = {
        'videography': 'videography',
        'drone-pilot': 'drone pilot',
        'photography': 'photography',
        'video-editor': 'video editor',
        'motion-graphics': 'motion graphics'
    };
    return map[slug] || null;
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
    const dbCategory = getDbCategory(params.category);

    if (!dbCategory) {
        notFound();
    }

    const supabase = await createClient();

    const { data: projects } = await supabase
        .from("projects")
        .select("*, media(*)")
        .eq("category", dbCategory)
        .order("created_at", { ascending: false });

    // Format display title (e.g. Drone Pilot)
    const displayTitle = dbCategory.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold uppercase tracking-widest mb-2">{displayTitle} Projects</h1>
                    <p className="text-gray-400">Manage your {displayTitle.toLowerCase()} portfolio projects.</p>
                </div>
                <Link
                    href={`/admin/${params.category}/new`}
                    className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors uppercase tracking-widest text-sm"
                >
                    <Plus className="w-4 h-4" />
                    New {displayTitle}
                </Link>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
                {projects && projects.length > 0 ? (
                    <table className="w-full text-left">
                        <thead className="bg-black/50 text-gray-400 text-xs uppercase tracking-widest border-b border-neutral-800">
                            <tr>
                                <th className="px-6 py-4 font-medium">Project Title</th>
                                <th className="px-6 py-4 font-medium hidden md:table-cell">Category</th>
                                <th className="px-6 py-4 font-medium hidden lg:table-cell">Media Count</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {projects.map((project) => (
                                <tr key={project.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded overflow-hidden bg-black flex-shrink-0 flex items-center justify-center">
                                                {project.media && project.media.length > 0 ? (
                                                    project.media[0].media_type === 'image' ? (
                                                        <img src={project.media[0].file_url} className="w-full h-full object-cover" alt="" />
                                                    ) : (
                                                        <video src={project.media[0].file_url} className="w-full h-full object-cover" />
                                                    )
                                                ) : (
                                                    <FolderGit2 className="w-5 h-5 text-gray-600" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-lg">{project.title}</p>
                                                <p className="text-xs text-gray-400">{project.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 hidden md:table-cell uppercase tracking-wider text-sm font-medium text-gray-300">
                                        {project.category}
                                    </td>
                                    <td className="px-6 py-4 hidden lg:table-cell text-gray-400">
                                        {project.media?.length || 0} Files
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/admin/${params.category}/${project.id}`} title="Edit Project" className="p-2 text-gray-400 hover:text-white transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </Link>
                                            <form action={deleteProject}>
                                                <input type="hidden" name="id" value={project.id} />
                                                <button type="submit" title="Delete Project" className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                        <FolderGit2 className="w-12 h-12 mb-4 opacity-20" />
                        <p>No projects found. Create your first {displayTitle} project.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
