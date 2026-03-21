"use client";

import { useState, useRef } from "react";
import { X, Loader2 } from "lucide-react";

export const MAX_SLIP_SIZE_MB = 5;
export const ACCEPT_IMAGES = "image/jpeg,image/png,image/gif,image/webp";

export function UploadSlipModal({
  open,
  onClose,
  onSubmit,
  loading,
  error,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (file: File) => void;
  loading: boolean;
  error: string | null;
}) {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > MAX_SLIP_SIZE_MB * 1024 * 1024) {
      setFile(null);
      return;
    }
    setFile(f);
  };

  const handleSubmit = () => {
    if (file) onSubmit(file);
  };

  const handleClose = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-sakura-900">
            อัพโหลดสลิปโอนเงิน
          </h3>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-sakura-100 text-muted-dark"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-muted-dark mb-4">
          เลือกรูปสลิปโอนเงิน (jpg, png, gif, webp สูงสุด 5MB)
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_IMAGES}
          capture="environment"
          onChange={handleFileChange}
          className="block w-full text-sm text-sakura-700 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-sakura-100 file:text-sakura-800 file:font-semibold file:cursor-pointer hover:file:bg-sakura-200"
        />
        {file && (
          <p className="mt-2 text-xs text-muted-dark truncate">{file.name}</p>
        )}
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-sakura-200 text-sakura-800 font-semibold hover:bg-sakura-50"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!file || loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-sakura-700 text-white font-semibold hover:bg-sakura-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                กำลังส่ง...
              </>
            ) : (
              "ส่งสลิป"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
