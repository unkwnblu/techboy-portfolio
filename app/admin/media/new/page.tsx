"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, UploadCloud } from "lucide-react";
import { uploadProjectAndMedia } from "../actions";

export default function NewProjectPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const mediaFile = formData.get("mediaFile") as File;

        if (!mediaFile || mediaFile.size === 0) {
            setError("Please attach at least one media file.");
            setLoading(false);
            return;
        }

        try {
            const res = await uploadProjectAndMedia(formData);
            if (res?.error) {
                setError(res.error);
                setLoading(false);
            } else {
                router.push("/admin/media");
            }
        } catch (err) {
            console.error(err);
            setError("An unexpected error occurred.");
            setLoading(false);
        }
    }

    return (
        <div className="max-w-2xl">
            <h1 className="text-3xl font-bold uppercase tracking-widest mb-6">Create New Project</h1>

            <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 space-y-6">

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Project Title</label>
                        <input
                            name="title" type="text" required
                            className="w-full bg-black/50 border border-neutral-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-white transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Slug (URL string)</label>
                        <input
                            name="slug" type="text" required pattern="^[a-z0-9-]+$"
                            className="w-full bg-black/50 border border-neutral-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-white transition-colors"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Client (Optional)</label>
                            <input
                                name="client" type="text"
                                className="w-full bg-black/50 border border-neutral-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-white transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Category</label>
                            <select
                                name="category" required
                                className="w-full bg-black/50 border border-neutral-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-white transition-colors appearance-none"
                            >
                                <option value="photo">Photography</option>
                                <option value="video">Videography</option>
                                <option value="drone">Drone</option>
                                <option value="edit">Editing</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Description / Logline</label>
                        <textarea
                            name="description" rows={3}
                            className="w-full bg-black/50 border border-neutral-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-white transition-colors resize-none"
                        />
                    </div>

                    <div className="pt-4 border-t border-neutral-800">
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Media Upload</label>
                        <div className="border-2 border-dashed border-neutral-700 rounded-xl p-8 text-center hover:border-gray-500 transition-colors cursor-pointer relative">
                            <input
                                name="mediaFile" type="file" required accept="image/*,video/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <UploadCloud className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                            <p className="text-sm font-medium text-gray-300">Click or drag file to upload</p>
                            <p className="text-xs text-gray-500 mt-1">Video or Image file</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <input type="checkbox" name="is_featured" id="is_featured" value="true" className="w-4 h-4 rounded bg-black/50 border-neutral-800" />
                        <label htmlFor="is_featured" className="text-sm text-gray-300">Feature this project on the homepage</label>
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="pt-4 flex justify-end gap-4">
                    <button type="button" onClick={() => router.back()} className="px-6 py-3 font-semibold text-gray-400 hover:text-white transition-colors text-sm uppercase tracking-widest">
                        Cancel
                    </button>
                    <button type="submit" disabled={loading} className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors uppercase tracking-widest text-sm disabled:opacity-50">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        Create Project
                    </button>
                </div>

            </form>
        </div>
    );
}
