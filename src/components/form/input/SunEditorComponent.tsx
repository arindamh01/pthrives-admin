"use client";

import dynamic from "next/dynamic";
import { Label } from "@/components/ui/label";
import "suneditor/dist/css/suneditor.min.css";
import { ReactNode } from "react";

// Dynamically import SunEditor to avoid SSR issues
const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

interface SunEditorComponentProps {
  label?: ReactNode;
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: string;
  minHeight?: string;
  error?: string;
  disabled?: boolean;
  enableImageUpload?: boolean;
  onImageUploadBefore?: (files: File[], info: any, uploadHandler: any) => any;
}

export default function SunEditorComponent({
  label,
  value,
  onChange,
  placeholder = "Start typing...",
  height = "auto",
  minHeight = "200px",
  error,
  disabled = false,
  enableImageUpload = true,
  onImageUploadBefore,
}: SunEditorComponentProps) {
  const defaultImageUploadHandler = (files: File[], info: any, uploadHandler: any): any => {
    // Default: Convert images to base64 for inline embedding
    try {
      const uploadPromises = Array.from(files).map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          
          reader.onload = (e) => {
            resolve({
              url: e.target?.result as string,
              name: file.name,
              size: file.size,
            });
          };
          
          reader.onerror = (e) => {
            reject(e);
          };
          
          reader.readAsDataURL(file);
        });
      });

      Promise.all(uploadPromises).then((results) => {
        // Call uploadHandler with response object
        const response = {
          result: results,
        };
        uploadHandler(response);
      }).catch((error) => {
        console.error('Error uploading images:', error);
      });
    } catch (error) {
      console.error('Error in image upload handler:', error);
    }
    
    return undefined;
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className={`${error ? "border-red-500 border rounded-md" : ""}`}>
        <SunEditor
          setContents={value}
          onChange={onChange}
          placeholder={placeholder}
          disable={disabled}
          onImageUploadBefore={onImageUploadBefore || defaultImageUploadHandler}
          setOptions={{
            height,
            minHeight,
            imageMultipleFile: enableImageUpload,
            imageAccept: ".jpg, .jpeg, .png, .gif, .bmp, .webp",
            imageWidth: "100%",
            imageHeight: "auto",
            buttonList: [
              ["undo", "redo"],
              ["font", "fontSize", "formatBlock"],
              ["paragraphStyle", "blockquote"],
              ["bold", "underline", "italic", "strike", "subscript", "superscript"],
              ["fontColor", "hiliteColor", "textStyle"],
              ["removeFormat"],
              ["outdent", "indent"],
              ["align", "horizontalRule", "list", "lineHeight"],
              ["table", "link", enableImageUpload ? "image" : null, "video"].filter(Boolean),
              ["fullScreen", "showBlocks", "codeView"],
              ["preview"],
            ],
            formats: ["p", "div", "h1", "h2", "h3", "h4", "h5", "h6"],
            font: [
              "Arial",
              "Comic Sans MS",
              "Courier New",
              "Impact",
              "Georgia",
              "Tahoma",
              "Trebuchet MS",
              "Verdana",
            ],
          }}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

