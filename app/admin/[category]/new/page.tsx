"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
    Loader2,
    UploadCloud,
    X,
    File as FileIcon,
    CheckCircle2,
    AlertCircle,
    ArrowLeft,
} from "lucide-react";
import { createProjectRecord, addMediaRecord } from "../actions";
import { createClient } from "@/lib/supabase/client";

type ProjectCategory =
    | "videography"
    | "drone pilot"
    | "photography"
    | "video editor"
    | "motion graphics";

function getDbCategory(slug: string): ProjectCategory {
    const map: Record<string, ProjectCategory> = {
        videography: "videography",
        "drone-pilot": "drone pilot",
        photography: "photography",
        "video-editor": "video editor",
        "motion-graphics": "motion graphics",
    };
    return map[slug] || "videography";
}

type FileUpload = {
    id: string;
    file: File;
    progress: number;
    status: "idle" | "uploading" | "success" | "error";
    errorMessage?: string;
};

export default function NewProjectPage() {
    const router = useRouter();
    const params = useParams();
    const categorySlug = params.category as string;
    const category = getDbCategory(categorySlug);

    const displayTitle = category
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    const isPhotography = category === "photography";
    const acceptTypes = isPhotography ? "image/*" : "video/*";

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [files, setFiles] = useState<FileUpload[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        if (selectedFiles.length === 0) return;

        if (isPhotography && files.length + selectedFiles.length > 10) {
            setError("Photography projects are limited to a maximum of 10 images.");
            return;
        }

        setError(null);
        const newUploads = selectedFiles.map((file) => ({
            id: Math.random().toString(36).substring(7),
            file,
            progress: 0,
            status: "idle" as const,
        }));

        setFiles((prev) => [...prev, ...newUploads]);
    };

    const removeFile = (id: string) => {
        setFiles((prev) => prev.filter((f) => f.id !== id));
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
                    setFiles((prev) =>
                        prev.map((f) =>
                            f.id === fileId ? { ...f, progress, status: "uploading" } : f
                        )
                    );
                }
            };

            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    setFiles((prev) =>
                        prev.map((f) =>
                            f.id === fileId ? { ...f, progress: 100, status: "success" } : f
                        )
                    );
                    resolve();
                } else {
                    setFiles((prev) =>
                        prev.map((f) =>
                            f.id === fileId
                                ? { ...f, status: "error", errorMessage: "Upload failed" }
                                : f
                        )
                    );
                    reject(new Error("Upload failed"));
                }
            };

            xhr.onerror = () => {
                setFiles((prev) =>
                    prev.map((f) =>
                        f.id === fileId
                            ? { ...f, status: "error", errorMessage: "Network error" }
                            : f
                    )
                );
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
            category,
            description: formData.get("description") as string,
            is_featured: formData.get("is_featured") === "true",
        };

        try {
            const projectRes = await createProjectRecord(projectData);
            if (projectRes.error || !projectRes.project) {
                throw new Error(projectRes.error || "Failed to create project record.");
            }
            const projectId = projectRes.project.id;

            const supabase = createClient();
            const {
                data: { session },
            } = await supabase.auth.getSession();
            if (!session?.access_token) {
                throw new Error("Authentication failure. Please log in again.");
            }

            let sortOrder = 0;
            for (const upload of files) {
                const fileExt = upload.file.name.split(".").pop();
                const fileName = `${projectId}-${Date.now()}-${sortOrder}.${fileExt}`;

                await uploadFileWithProgress(
                    upload.id,
                    upload.file,
                    fileName,
                    session.access_token
                );

                const mediaType = upload.file.type.startsWith("image/") ? "image" : "video";
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
        <div className="max-w-2xl space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] transition-colors text-white/50 hover:text-white"
                >
                    <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/25 mb-0.5">
                        {displayTitle}
                    </p>
                    <h1 className="text-xl font-bold tracking-tight">New Project</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Project Info */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 space-y-5">
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                        Project Details
                    </h2>

                    <div>
                        <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.18em] mb-2">
                            Category
                        </label>
                        <div className="w-full bg-white/[0.02] border border-white/[0.05] rounded-xl py-3 px-4 text-white/30 text-sm font-semibold uppercase tracking-wider cursor-not-allowed">
                            {displayTitle}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.18em] mb-2">
                                Project Title <span className="text-red-400/80">*</span>
                            </label>
                            <input
                                name="title"
                                type="text"
                                required
                                className="w-full bg-black/40 border border-white/[0.08] rounded-xl py-3 px-4 text-white text-sm placeholder-white/15 focus:outline-none focus:border-white/25 transition-colors"
                                placeholder="e.g. City Lights Campaign"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.18em] mb-2">
                                URL Slug <span className="text-red-400/80">*</span>
                            </label>
                            <input
                                name="slug"
                                type="text"
                                required
                                pattern="^[a-z0-9-]+$"
                                className="w-full bg-black/40 border border-white/[0.08] rounded-xl py-3 px-4 text-white text-sm placeholder-white/15 focus:outline-none focus:border-white/25 transition-colors font-mono"
                                placeholder="city-lights-campaign"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.18em] mb-2">
                            Client{" "}
                            <span className="text-white/20 normal-case tracking-normal text-[9px]">
                                (optional)
                            </span>
                        </label>
                        <input
                            name="client"
                            type="text"
                            className="w-full bg-black/40 border border-white/[0.08] rounded-xl py-3 px-4 text-white text-sm placeholder-white/15 focus:outline-none focus:border-white/25 transition-colors"
                            placeholder="e.g. Nike Nigeria"
                        />
                    </div>

                    <div className={isPhotography ? "opacity-50" : ""}>
                        <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.18em] mb-2">
                            Description{" "}
                            {isPhotography ? (
                                <span className="text-white/20 normal-case tracking-normal text-[9px]">
                                    (optional for photography)
                                </span>
                            ) : (
                                <span className="text-red-400/80">*</span>
                            )}
                        </label>
                        <textarea
                            name="description"
                            rows={3}
                            required={!isPhotography}
                            className="w-full bg-black/40 border border-white/[0.08] rounded-xl py-3 px-4 text-white text-sm placeholder-white/15 focus:outline-none focus:border-white/25 transition-colors resize-none"
                            placeholder="Describe the project, the brief, the story…"
                        />
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer select-none group">
                        <input
                            type="checkbox"
                            name="is_featured"
                            value="true"
                            className="w-4 h-4 rounded bg-black/50 border-white/20 accent-white"
                        />
                        <span className="text-[12px] text-white/40 group-hover:text-white/70 transition-colors">
                            Feature this project on the homepage
                        </span>
                    </label>
                </div>

                {/* Media Upload */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                            Media Upload
                        </h2>
                        <span className="text-[10px] text-white/25 font-mono">
                            {files.length}{isPhotography ? "/10" : ""} files
                        </span>
                    </div>
                    <p className="text-[11px] text-white/25 -mt-2">
                        {isPhotography ? "Images only · Maximum 10 files" : "Video files only"}
                    </p>

                    <div
                        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                            files.length > 0
                                ? "border-white/[0.07]"
                                : "border-white/[0.10] hover:border-white/20 hover:bg-white/[0.01]"
                        }`}
                    >
                        <input
                            type="file"
                            multiple
                            accept={acceptTypes}
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={loading}
                        />
                        <UploadCloud className="w-7 h-7 text-white/20 mx-auto mb-2" />
                        <p className="text-sm font-medium text-white/40">Click or drag to upload</p>
                        <p className="text-[10px] text-white/20 mt-1 uppercase tracking-widest">
                            Multi-file supported
                        </p>
                    </div>

                    {files.length > 0 && (
                        <div className="space-y-2">
                            {files.map((f) => (
                                <div
                                    key={f.id}
                                    className="bg-black/30 border border-white/[0.05] rounded-xl p-3.5 flex items-center gap-3"
                                >
                                    <div className="bg-white/[0.04] p-1.5 rounded-lg flex-shrink-0">
                                        <FileIcon className="w-4 h-4 text-white/35" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <p className="text-[12px] font-medium text-white/60 truncate pr-4">
                                                {f.file.name}
                                            </p>
                                            {f.status === "success" && (
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                            )}
                                            {f.status === "error" && (
                                                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                                            )}
                                            {f.status === "idle" && !loading && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile(f.id)}
                                                    className="text-white/20 hover:text-white/50 transition-colors"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                        <div className="w-full h-1 bg-white/[0.05] rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-300 ${
                                                    f.status === "error"
                                                        ? "bg-red-500"
                                                        : f.status === "success"
                                                        ? "bg-emerald-500"
                                                        : "bg-white/50"
                                                }`}
                                                style={{ width: `${Math.max(2, f.progress)}%` }}
                                            />
                                        </div>
                                        {(f.status === "uploading" || f.status === "success") && (
                                            <p className="text-[9px] font-mono text-white/25 mt-1">
                                                {f.progress}%
                                            </p>
                                        )}
                                        {f.status === "error" && (
                                            <p className="text-[10px] text-red-400 mt-1">{f.errorMessage}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {error && (
                    <div className="bg-red-500/[0.07] border border-red-500/20 rounded-xl px-4 py-3">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-1">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        disabled={loading}
                        className="px-5 py-2.5 text-[12px] font-semibold text-white/30 hover:text-white/60 transition-colors uppercase tracking-wider disabled:opacity-40"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={
                            loading || files.length === 0 || (isPhotography && files.length > 10)
                        }
                        className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-xl font-bold text-[12px] uppercase tracking-wider hover:bg-white/90 transition-colors disabled:opacity-40"
                    >
                        {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        {loading ? "Uploading…" : "Create & Upload"}
                    </button>
                </div>
            </form>
        </div>
    );
}
