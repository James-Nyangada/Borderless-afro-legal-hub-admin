'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { API_URL } from '@/lib/api';
import { toast } from 'react-hot-toast';

// Dynamically import react-quill-new to avoid SSR issues with 'document'
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false, loading: () => <p>Loading Editor...</p> });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const quillRef = useRef<any>(null);
  
  // Custom image handler
  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);

      try {
        const token = localStorage.getItem('token');
        // We use native fetch here because fetchAPI forces Content-Type: application/json
        const response = await fetch(`${API_URL}/media`, {
          method: 'POST',
          body: formData,
          headers: token ? {
            'Authorization': `Bearer ${token}`
          } : {},
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();
        const url = data.data.media.url;

        // Insert image into editor
        if (quillRef.current) {
          // ReactQuill wraps the actual Quill editor, we need getEditor()
          const quill = typeof quillRef.current.getEditor === 'function' 
            ? quillRef.current.getEditor() 
            : quillRef.current;
            
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, 'image', url);
          quill.setSelection(range.index + 1);
        }
      } catch (error) {
        console.error('Image upload failed:', error);
        toast.error('Image upload failed');
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }), []);

  return (
    <div className="bg-white rounded-md overflow-hidden ring-1 ring-gray-300 focus-within:ring-2 focus-within:ring-navy">
      <ReactQuill 
        // @ts-ignore
        ref={quillRef}
        theme="snow"
        defaultValue={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder || 'Write your post content here...'}
        className="[&_.ql-toolbar]:border-none [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-gray-300 [&_.ql-toolbar]:bg-gray-50 [&_.ql-container]:border-none [&_.ql-editor]:min-h-[400px] [&_.ql-editor_img]:max-w-full [&_.ql-editor_img]:h-auto [&_.ql-editor_img]:rounded-md"
      />
    </div>
  );
}
