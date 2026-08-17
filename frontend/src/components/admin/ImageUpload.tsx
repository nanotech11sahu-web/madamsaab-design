import { useRef, useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { mediaApi } from '@/services/cmsApi';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

export function ImageUpload({ value, onChange, folder = 'madamsaab', label = 'Image' }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file: File) => {
    setError('');
    setUploading(true);
    try {
      const { url } = await mediaApi.upload(file, folder);
      onChange(url);
    } catch {
      setError('Upload failed. Check that Cloudinary is configured in backend/.env.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="text-xs font-semibold text-brand-navy/70">{label}</label>
      <div className="mt-1.5 flex items-center gap-3">
        {value ? (
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-brand-border">
            <img src={value} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-0.5 top-0.5 rounded-full bg-black/60 p-0.5 text-white"
            >
              <X size={10} />
            </button>
          </div>
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-dashed border-brand-border text-brand-navy/30">
            <Upload size={18} />
          </div>
        )}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-pill border border-brand-border px-4 py-2 text-xs font-semibold text-brand-navy transition hover:border-brand-pink hover:text-brand-pink disabled:opacity-60"
        >
          {uploading ? (
            <span className="flex items-center gap-1.5">
              <Loader2 size={12} className="animate-spin" /> Uploading...
            </span>
          ) : value ? (
            'Replace Image'
          ) : (
            'Upload Image'
          )}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = '';
          }}
        />
      </div>
      {error && <p className="err">{error}</p>}
    </div>
  );
}
