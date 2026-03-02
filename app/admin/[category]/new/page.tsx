"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2, UploadCloud, X, File as FileIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { createProjectRecord, addMediaRecord } from "../actions";
import { createClient } from "@/lib/supabase/client";

type ProjectCategory = 'videography' | 'drone pilot' | 'photography' | 'video editor' | 'motion graphics';

function getDbCategory(slug: string): ProjectCategory {
    const map: Record<string, ProjectCategory> = {
        'videography': 'videography',
        'drone-pilot': 'drone pilot',
        'photography': 'photography',
        'video-editor': 'video editor',
        'motion-graphics': 'motion graphics'
    };
    return map[slug] || 'videography';
}

type FileUpload = {
    id: string;
    file: File;
    progress: number;
    status: 'idle' | 'uploading' | 'success' | 'error';
    errorMessage?: string;
};

export default function NewProjectPage() {
    const router = useRouter();
    const params = useParams();
    const categorySlug = params.category as string;
    const category = getDbCategory(categorySlug);

    // Format display title
    const displayTitle = category.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const isPhotography = category === 'photography';
    const acceptTypes = isPhotography ? 'image/*' : 'video/*';

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [files, setFiles] = useState<FileUpload[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        if (selectedFiles.length === 0) return;

        // If category is photography and total files > 10, reject addition
        if (isPhotography && (files.length + selectedFiles.length > 10)) {
            setError("Photography projects are limited to a maximum of 10 images.");
            return;
        }

        setError(null);
        const newUploads = selectedFiles.map(file => ({
            id: Math.random().toString(36).substring(7),
            file,
            progress: 0,
            status: 'idle' as const
        }));

        setFiles(prev => [...prev, ...newUploads]);
    };

    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    const uploadFileWithProgress = (
        fileId: string,
        file: File,
        fileName: string,
        token: string
    ): Promise<void> => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/media/${fileName}`;

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const progress = Math.round((event.loaded / event.total) * 100);
                    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, progress, status: 'uploading' } : f));
                }
            };

            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, progress: 100, status: 'success' } : f));
                    resolve();
                } else {
                    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, status: 'error', errorMessage: 'Upload failed' } : f));
                    reject(new Error("Upload failed"));
                }
            };

            xhr.onerror = () => {
                setFiles(prev => prev.map(f => f.id === fileId ? { ...f, status: 'error', errorMessage: 'Network error' } : f));
                reject(new Error("Network Error"));
            };

            xhr.open("POST", url, true);
            xhr.setRequestHeader("Authorization", `Bearer ${token}`);
            xhr.setRequestHeader("apikey", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
            xhr.setRequestHeader("Content-Type", file.type);
            xhr.send(file);
        });
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (files.length === 0) {
            setError("Please attach at least one media file.");
            setLoading(false);
            return;
        }

        if (isPhotography && files.length > 10) {
            setError("Max 10 images allowed for Photography.");
            setLoading(false);
            return;
        }

        const formData = new FormData(e.currentTarget);
        const projectData = {
            title: formData.get("title") as string,
            slug: formData.get("slug") as string,
            client: formData.get("client") as string,
            category: category,
            description: formData.get("description") as string,
            is_featured: formData.get("is_featured") === "true",
        };

        try {
            // 1. Create DB Project
            const projectRes = await createProjectRecord(projectData);
            if (projectRes.error || !projectRes.project) {
                throw new Error(projectRes.error || "Failed to create project record.");
            }
            const projectId = projectRes.project.id;

            // 2. Fetch Session Token
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.access_token) {
                throw new Error("Authentication failure. Please log in again.");
            }

            // 3. Upload Files Sequentially or in Parallel
            let sortOrder = 0;
            for (const upload of files) {
                const fileExt = upload.file.name.split('.').pop();
                const fileName = `${projectId}-${Date.now()}-${sortOrder}.${fileExt}`;

                // Track visual upload
                await uploadFileWithProgress(upload.id, upload.file, fileName, session.access_token);

                // Add DB Media Row
                const mediaType = upload.file.type.startsWith('image/') ? 'image' : 'video';
                const mediaRes = await addMediaRecord(projectId, fileName, mediaType, sortOrder);
                if (mediaRes.error) {
                    throw new Error(`Failed to link media record: ${mediaRes.error}`);
                }

                sortOrder++;
            }

            router.push(`/admin/${categorySlug}`);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "An unexpected error occurred during upload.");
            setLoading(false);
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold uppercase tracking-widest">Create New {displayTitle} Project</h1>

            <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 space-y-6">
                <div className="space-y-4 shadow-xl shadow-black/20 p-6 bg-black/20 rounded-xl border border-white/5">
                    {/* Category is determined by route. Only display as readonly info. */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Category (Locked)</label>
                        <input
                            type="text" disabled value={displayTitle}
                            className="w-full bg-black/20 border border-neutral-800 rounded-lg py-3 px-4 text-gray-500 cursor-not-allowed uppercase tracking-widest text-sm font-semibold"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Project Title</label>
                            <input
                                name="title" type="text" required
                                className="w-full bg-black/50 border border-neutral-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-white transition-colors"
                            />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Slug (URL string)</label>
                            <input
                                name="slug" type="text" required pattern="^[a-z0-9-]+$"
                                className="w-full bg-black/50 border border-neutral-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-white transition-colors"
                            />
                        </div>
                    </div>

                    <div className={`${isPhotography ? 'opacity-50' : ''} transition-opacity duration-300`}>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                            Description / Logline {isPhotography && "(Optional for Photography)"}
                        </label>
                        <textarea
                            name="description" rows={3} required={!isPhotography}
                            className="w-full bg-black/50 border border-neutral-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-white transition-colors resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Client (Optional)</label>
                        <input
                            name="client" type="text"
                            className="w-full bg-black/50 border border-neutral-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-white transition-colors"
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-neutral-800">
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest">
                            Media Upload {isPhotography && "(Max 10 Images)"} {!isPhotography && "(Video Files Only)"}
                        </label>
                        <span className="text-xs text-gray-500 font-mono">{files.length} selected</span>
                    </div>

                    <div className={`border-2 border-dashed ${files.length > 0 ? 'border-neutral-800 bg-black/20' : 'border-neutral-700 hover:border-gray-500'} rounded-xl p-8 text-center transition-colors relative mb-4`}>
                        <input
                            type="file" multiple accept={acceptTypes} onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={loading}
                        />
                        <UploadCloud className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-300">Click or drag files to upload</p>
                        <p className="text-xs text-gray-500 mt-1">Multi-file support enabled</p>
                    </div>

                    {/* Progress File List */}
                    {files.length > 0 && (
                        <div className="space-y-3">
                            {files.map(f => (
                                <div key={f.id} className="bg-black/40 border border-neutral-800 rounded-lg p-4 flex items-center gap-4">
                                    <div className="bg-neutral-800 p-2 rounded-md">
                                        <FileIcon className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-sm font-medium text-gray-300 truncate pr-4">{f.file.name}</p>
                                            {f.status === 'success' && <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />}
                                            {f.status === 'error' && <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
                                            {f.status === 'idle' && !loading && (
                                                <button type="button" onClick={() => removeFile(f.id)} className="text-gray-500 hover:text-white transition-colors">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                        {/* Progress Bar Container */}
                                        <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden relative mt-2">
                                            <div
                                                className={`absolute inset-y-0 left-0 transition-all duration-300 ease-out ${f.status === 'error' ? 'bg-red-500' : f.status === 'success' ? 'bg-green-500' : 'bg-white'}`}
                                                style={{ width: `${Math.max(2, f.progress)}%` }} // Show tiny sliver even at 0%
                                            />
                                        </div>
                                        {(f.status === 'uploading' || f.status === 'success') && (
                                            <p className="text-xs font-mono text-gray-500 mt-1 uppercase tracking-widest">{f.progress}%</p>
                                        )}
                                        {f.status === 'error' && (
                                            <p className="text-xs text-red-400 mt-1">{f.errorMessage}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 pt-2 pb-4">
                    <input type="checkbox" name="is_featured" id="is_featured" value="true" className="w-4 h-4 rounded bg-black/50 border-neutral-800" />
                    <label htmlFor="is_featured" className="text-sm text-gray-300">Feature this project on the homepage bento grid</label>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                <div className="pt-4 flex justify-end gap-4 border-t border-neutral-800 mt-4">
                    <button type="button" onClick={() => router.back()} disabled={loading} className="px-6 py-3 font-semibold text-gray-400 hover:text-white transition-colors text-sm uppercase tracking-widest disabled:opacity-50">
                        Cancel
                    </button>
                    <button type="submit" disabled={loading || files.length === 0 || (isPhotography && files.length > 10)} className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors uppercase tracking-widest text-sm disabled:opacity-50">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        {loading ? 'Uploading...' : 'Create & Upload'}
                    </button>
                </div>

            </form>
        </div>
    );
}
