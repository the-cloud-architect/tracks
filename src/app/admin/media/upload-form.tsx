"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const MAX_FILE_SIZE_BYTES = 512 * 1024 * 1024;

function uploadToSignedUrl(input: {
  uploadUrl: string;
  file: File;
  onProgress: (progressPercent: number) => void;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", input.uploadUrl);
    xhr.setRequestHeader("Content-Type", input.file.type || "application/octet-stream");

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || event.total <= 0) {
        return;
      }
      const progressPercent = Math.min(99, Math.round((event.loaded / event.total) * 100));
      input.onProgress(progressPercent);
    };

    xhr.onerror = () => {
      reject(new Error("Upload failed while sending data to cloud storage."));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        input.onProgress(100);
        resolve();
        return;
      }
      reject(new Error("Upload failed with an unexpected storage response."));
    };

    xhr.send(input.file);
  });
}

export function AdminMediaUploadForm() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isUploading) {
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setProgressPercent(0);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const maybeFile = formData.get("file");
    if (!(maybeFile instanceof File)) {
      setErrorMessage("A file is required.");
      return;
    }

    const file = maybeFile;
    if (!title) {
      setErrorMessage("Title is required.");
      return;
    }
    if (file.size <= 0 || file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage("File must be between 1 byte and 512MB.");
      return;
    }
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      setErrorMessage("Only image and video files are supported.");
      return;
    }

    setIsUploading(true);
    try {
      const signedResponse = await fetch("/api/admin/media/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        }),
      });
      const signedPayload = await signedResponse.json().catch(() => null);
      if (!signedResponse.ok || !signedPayload?.uploadUrl || !signedPayload?.objectKey) {
        throw new Error(signedPayload?.error || "Could not initialize upload.");
      }

      await uploadToSignedUrl({
        uploadUrl: signedPayload.uploadUrl,
        file,
        onProgress: setProgressPercent,
      });

      const completeResponse = await fetch("/api/admin/media/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          objectKey: String(signedPayload.objectKey),
          mimeType: file.type || "application/octet-stream",
          sizeBytes: file.size,
        }),
      });
      const completePayload = await completeResponse.json().catch(() => null);
      if (!completeResponse.ok) {
        throw new Error(completePayload?.error || "Upload finished but saving failed.");
      }

      setSuccessMessage("Upload complete.");
      form.reset();
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 grid gap-3">
      <input
        name="title"
        required
        placeholder="Title"
        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        disabled={isUploading}
      />
      <textarea
        name="description"
        rows={2}
        placeholder="Short description (optional)"
        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        disabled={isUploading}
      />
      <input
        name="file"
        required
        type="file"
        accept="image/*,video/*"
        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        disabled={isUploading}
      />
      {isUploading ? (
        <div className="space-y-1">
          <div className="h-2 w-full overflow-hidden rounded bg-zinc-200">
            <div
              className="h-full bg-zinc-900 transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-zinc-600">Uploading… {progressPercent}%</p>
        </div>
      ) : null}
      {errorMessage ? <p className="text-sm text-red-700">{errorMessage}</p> : null}
      {successMessage ? <p className="text-sm text-emerald-700">{successMessage}</p> : null}
      <button
        type="submit"
        className="w-fit rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        disabled={isUploading}
      >
        {isUploading ? "Uploading..." : "Upload asset"}
      </button>
    </form>
  );
}
