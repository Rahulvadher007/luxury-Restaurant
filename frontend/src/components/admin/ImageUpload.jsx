import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ImageUpload({ value, onChange, label = 'Upload Image' }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('aurum_admin_token');
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const data = await res.json();
      
      if (res.ok) {
        onChange(data.imageUrl);
      } else {
        setError(data.message || 'Failed to upload image.');
      }
    } catch (err) {
      setError('A network error occurred during upload.');
    } finally {
      setIsUploading(false);
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1
  });

  return (
    <div className="w-full">
      <label className="block text-[10px] text-luxury-gold tracking-widest uppercase mb-2">
        {label}
      </label>
      
      <div 
        {...getRootProps()} 
        className={`relative border-2 border-dashed rounded-sm p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-luxury-gold bg-luxury-gold/5' 
            : 'border-luxury-gold/20 hover:border-luxury-gold/50 bg-[#050505]'
        } ${value ? 'h-64' : 'h-32'}`}
      >
        <input {...getInputProps()} />

        <AnimatePresence mode="wait">
          {isUploading ? (
            <motion.div 
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-luxury-gold"
            >
              <Loader2 className="animate-spin mb-2" size={24} />
              <p className="text-[10px] tracking-widest uppercase">Uploading to Cloudinary...</p>
            </motion.div>
          ) : value ? (
            <motion.div 
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full h-full flex items-center justify-center group"
            >
              <img 
                src={value} 
                alt="Uploaded preview" 
                className="max-h-full max-w-full object-contain rounded-sm"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-sm">
                <p className="text-luxury-ivory text-[10px] tracking-widest uppercase flex items-center gap-2">
                  <UploadCloud size={14} /> Click or Drag to Replace
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-luxury-gold/50"
            >
              <UploadCloud size={28} className="mb-3" />
              <p className="text-xs text-luxury-ivory/70 text-center">
                Drag & Drop high-resolution media here
              </p>
              <p className="text-[10px] tracking-widest uppercase mt-2">
                JPEG, PNG, WEBP • Max 5MB
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <p className="text-red-500 text-[10px] uppercase tracking-wider mt-2">{error}</p>
      )}

      {value && !isUploading && (
        <button 
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onChange('');
          }}
          className="text-red-400 text-[10px] uppercase tracking-widest hover:text-red-300 mt-2 flex items-center gap-1 transition-colors"
        >
          <X size={12} /> Remove Image
        </button>
      )}
    </div>
  );
}
