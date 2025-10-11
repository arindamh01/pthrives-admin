"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ReactNode, useRef, useState, useCallback } from "react";
import { Upload, X, Crop, Check } from "lucide-react";
import toast from "react-hot-toast";

interface ImageUploadProps {
  label?: ReactNode;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  aspectRatio?: number; // e.g., 16/9, 1, 4/3
  maxSizeMB?: number;
  enableCropper?: boolean;
  placeholder?: string;
  height?: string;
  recommendedRatio?: string; // e.g., "16:9 aspect ratio recommended"
}

export default function ImageUpload({
  label,
  value,
  onChange,
  error,
  aspectRatio,
  maxSizeMB = 5,
  enableCropper = false,
  placeholder = "Drag and drop an image here or click to upload",
  height = "200px",
  recommendedRatio,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [tempImage, setTempImage] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [isDraggingCrop, setIsDraggingCrop] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [currentRatio, setCurrentRatio] = useState<number>(0);

  const processImage = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`Image size should be less than ${maxSizeMB}MB`);
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      
      // Always set the image first, cropping is optional
      onChange(imageUrl);
      setIsProcessing(false);
    };

    reader.onerror = () => {
      toast.error("Failed to read image");
      setIsProcessing(false);
    };

    reader.readAsDataURL(file);
  }, [maxSizeMB, onChange]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processImage(files[0]);
    }
  }, [processImage]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      processImage(files[0]);
    }
  };

  const handleRemove = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCropConfirm = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cropCanvas = document.createElement("canvas");
    cropCanvas.width = cropArea.width;
    cropCanvas.height = cropArea.height;
    const ctx = cropCanvas.getContext("2d");

    if (ctx) {
      ctx.drawImage(
        canvas,
        cropArea.x,
        cropArea.y,
        cropArea.width,
        cropArea.height,
        0,
        0,
        cropArea.width,
        cropArea.height
      );

      const croppedImage = cropCanvas.toDataURL("image/jpeg", 0.9);
      onChange(croppedImage);
      setShowCropper(false);
      setTempImage("");
    }
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setTempImage("");
  };

  const startCropping = () => {
    if (value) {
      setTempImage(value);
      setShowCropper(true);
      
      // Initialize crop area
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = Math.min(img.width, 800);
          canvas.height = Math.min(img.height, 600);
          const ctx = canvas.getContext("2d");
          if (ctx) {
            const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
            const scaledWidth = img.width * scale;
            const scaledHeight = img.height * scale;
            const x = (canvas.width - scaledWidth) / 2;
            const y = (canvas.height - scaledHeight) / 2;
            ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
            
            // Set initial crop area based on aspect ratio
            let cropWidth, cropHeight;
            if (aspectRatio) {
              if (scaledWidth / scaledHeight > aspectRatio) {
                cropHeight = scaledHeight * 0.8;
                cropWidth = cropHeight * aspectRatio;
              } else {
                cropWidth = scaledWidth * 0.8;
                cropHeight = cropWidth / aspectRatio;
              }
            } else {
              cropWidth = scaledWidth * 0.8;
              cropHeight = scaledHeight * 0.8;
            }
            
            const newCropArea = {
              x: (canvas.width - cropWidth) / 2,
              y: (canvas.height - cropHeight) / 2,
              width: cropWidth,
              height: cropHeight,
            };
            setCropArea(newCropArea);
            setCurrentRatio(newCropArea.width / newCropArea.height);
          }
        }
      };
      img.src = value;
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check for resize handles first
    const handleSize = 10;
    const handles = {
      'nw': { x: cropArea.x, y: cropArea.y },
      'ne': { x: cropArea.x + cropArea.width, y: cropArea.y },
      'sw': { x: cropArea.x, y: cropArea.y + cropArea.height },
      'se': { x: cropArea.x + cropArea.width, y: cropArea.y + cropArea.height },
      'n': { x: cropArea.x + cropArea.width / 2, y: cropArea.y },
      's': { x: cropArea.x + cropArea.width / 2, y: cropArea.y + cropArea.height },
      'w': { x: cropArea.x, y: cropArea.y + cropArea.height / 2 },
      'e': { x: cropArea.x + cropArea.width, y: cropArea.y + cropArea.height / 2 },
    };

    // Check if clicking on a resize handle
    for (const [handle, pos] of Object.entries(handles)) {
      if (
        x >= pos.x - handleSize / 2 &&
        x <= pos.x + handleSize / 2 &&
        y >= pos.y - handleSize / 2 &&
        y <= pos.y + handleSize / 2
      ) {
        setIsResizing(true);
        setResizeHandle(handle);
        setDragStart({ x, y });
        return;
      }
    }

    // Check if click is inside crop area for dragging
    if (
      x >= cropArea.x &&
      x <= cropArea.x + cropArea.width &&
      y >= cropArea.y &&
      y <= cropArea.y + cropArea.height
    ) {
      setIsDraggingCrop(true);
      setDragStart({ x: x - cropArea.x, y: y - cropArea.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isResizing && resizeHandle) {
      // Handle resizing
      let newX = cropArea.x;
      let newY = cropArea.y;
      let newWidth = cropArea.width;
      let newHeight = cropArea.height;

      switch (resizeHandle) {
        case 'nw':
          newX = Math.min(x, cropArea.x + cropArea.width - 20);
          newY = Math.min(y, cropArea.y + cropArea.height - 20);
          newWidth = cropArea.width + (cropArea.x - newX);
          newHeight = cropArea.height + (cropArea.y - newY);
          break;
        case 'ne':
          newY = Math.min(y, cropArea.y + cropArea.height - 20);
          newWidth = Math.max(20, x - cropArea.x);
          newHeight = cropArea.height + (cropArea.y - newY);
          break;
        case 'sw':
          newX = Math.min(x, cropArea.x + cropArea.width - 20);
          newWidth = cropArea.width + (cropArea.x - newX);
          newHeight = Math.max(20, y - cropArea.y);
          break;
        case 'se':
          newWidth = Math.max(20, x - cropArea.x);
          newHeight = Math.max(20, y - cropArea.y);
          break;
        case 'n':
          newY = Math.min(y, cropArea.y + cropArea.height - 20);
          newHeight = cropArea.height + (cropArea.y - newY);
          break;
        case 's':
          newHeight = Math.max(20, y - cropArea.y);
          break;
        case 'w':
          newX = Math.min(x, cropArea.x + cropArea.width - 20);
          newWidth = cropArea.width + (cropArea.x - newX);
          break;
        case 'e':
          newWidth = Math.max(20, x - cropArea.x);
          break;
      }

      // Keep within canvas bounds
      newX = Math.max(0, Math.min(newX, canvas.width - newWidth));
      newY = Math.max(0, Math.min(newY, canvas.height - newHeight));
      newWidth = Math.min(newWidth, canvas.width - newX);
      newHeight = Math.min(newHeight, canvas.height - newY);

      const newCropArea = { x: newX, y: newY, width: newWidth, height: newHeight };
      setCropArea(newCropArea);
      setCurrentRatio(newCropArea.width / newCropArea.height);
    } else if (isDraggingCrop) {
      // Handle dragging
      const newX = Math.max(0, Math.min(x - dragStart.x, canvas.width - cropArea.width));
      const newY = Math.max(0, Math.min(y - dragStart.y, canvas.height - cropArea.height));

      const newCropArea = { ...cropArea, x: newX, y: newY };
      setCropArea(newCropArea);
    }
  };

  const handleMouseUp = () => {
    setIsDraggingCrop(false);
    setIsResizing(false);
    setResizeHandle(null);
  };

  // Handle crop area resizing
  const handleCropResize = (newWidth: number, newHeight: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Keep within canvas bounds
    const maxWidth = canvas.width - cropArea.x;
    const maxHeight = canvas.height - cropArea.y;
    const constrainedWidth = Math.min(newWidth, maxWidth);
    const constrainedHeight = Math.min(newHeight, maxHeight);

    const newCropArea = {
      ...cropArea,
      width: constrainedWidth,
      height: constrainedHeight,
    };
    setCropArea(newCropArea);
    setCurrentRatio(newCropArea.width / newCropArea.height);
  };

  // Format ratio display
  const formatRatio = (ratio: number) => {
    if (ratio === 0) return '0:0';
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
    const divisor = gcd(Math.round(ratio * 100), 100);
    const w = Math.round(ratio * 100) / divisor;
    const h = 100 / divisor;
    return `${w}:${h}`;
  };

  // Check if current ratio matches recommended ratio
  const isRatioMatched = () => {
    if (!aspectRatio || !currentRatio) return false;
    const tolerance = 0.01; // Allow small difference
    return Math.abs(currentRatio - aspectRatio) < tolerance;
  };

  // Draw crop overlay
  if (showCropper && canvasRef.current) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (ctx && tempImage) {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const x = (canvas.width - scaledWidth) / 2;
        const y = (canvas.height - scaledHeight) / 2;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

        // Draw overlay
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Clear crop area
        ctx.clearRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);
        ctx.drawImage(
          img,
          ((cropArea.x - x) / scale),
          ((cropArea.y - y) / scale),
          (cropArea.width / scale),
          (cropArea.height / scale),
          cropArea.x,
          cropArea.y,
          cropArea.width,
          cropArea.height
        );

        // Draw crop border
        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 2;
        ctx.strokeRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);

        // Draw resize handles
        const handleSize = 10;
        const handles = [
          { x: cropArea.x, y: cropArea.y }, // nw
          { x: cropArea.x + cropArea.width / 2, y: cropArea.y }, // n
          { x: cropArea.x + cropArea.width, y: cropArea.y }, // ne
          { x: cropArea.x + cropArea.width, y: cropArea.y + cropArea.height / 2 }, // e
          { x: cropArea.x + cropArea.width, y: cropArea.y + cropArea.height }, // se
          { x: cropArea.x + cropArea.width / 2, y: cropArea.y + cropArea.height }, // s
          { x: cropArea.x, y: cropArea.y + cropArea.height }, // sw
          { x: cropArea.x, y: cropArea.y + cropArea.height / 2 }, // w
        ];

        ctx.fillStyle = "#3b82f6";
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;

        handles.forEach(handle => {
          ctx.beginPath();
          ctx.arc(handle.x, handle.y, handleSize / 2, 0, 2 * Math.PI);
          ctx.fill();
          ctx.stroke();
        });
      };
      img.src = tempImage;
    }
  }

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}

      {showCropper ? (
        <div className="space-y-3">
          {/* Ratio Information */}
          <div className="bg-gray-50 p-3 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
              <div className="text-center">
                <span className="text-gray-600">Current Ratio:</span>
                <div className={`font-semibold ${isRatioMatched() ? 'text-green-600' : 'text-gray-900'}`}>
                  {formatRatio(currentRatio)}
                </div>
              </div>
              {aspectRatio && (
                <div className="text-center">
                  <span className="text-gray-600">Recommended:</span>
                  <div className="font-semibold text-blue-600">
                    {formatRatio(aspectRatio)}
                  </div>
                </div>
              )}
              <div className="text-center">
                <span className="text-gray-600">Status:</span>
                <div className={`font-semibold ${isRatioMatched() ? 'text-green-600' : 'text-orange-600'}`}>
                  {isRatioMatched() ? '✓ Match' : 'Adjust'}
                </div>
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
            <canvas
              ref={canvasRef}
              className="w-full"
              style={{ cursor: isResizing ? 'nw-resize' : isDraggingCrop ? 'move' : 'default' }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          </div>

          {/* Resize Controls */}
          {aspectRatio && (
            <div className="bg-gray-50 p-3 rounded-lg border">
              <div className="text-sm text-gray-600 mb-2 text-center">Quick Resize to Recommended Ratio</div>
              <div className="flex gap-2 justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const canvas = canvasRef.current;
                    if (!canvas) return;
                    const newHeight = Math.min(cropArea.height, canvas.height - cropArea.y);
                    const newWidth = newHeight * aspectRatio;
                    handleCropResize(newWidth, newHeight);
                  }}
                >
                  Fit to Height
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const canvas = canvasRef.current;
                    if (!canvas) return;
                    const newWidth = Math.min(cropArea.width, canvas.width - cropArea.x);
                    const newHeight = newWidth / aspectRatio;
                    handleCropResize(newWidth, newHeight);
                  }}
                >
                  Fit to Width
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button type="button" onClick={handleCropConfirm} className="flex-1">
              <Check className="w-4 h-4 mr-2" />
              Confirm Crop
            </Button>
            <Button type="button" variant="outline" onClick={handleCropCancel} className="flex-1">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 text-center">
            Drag the highlighted area to move, drag the blue circles to resize manually
          </p>
        </div>
      ) : (
        <>
          {!value ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`
                border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}
                ${error ? "border-red-500" : ""}
              `}
              style={{ minHeight: height }}
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <Upload className="w-8 h-8 text-gray-400" />
                <p className="text-sm text-gray-600">{placeholder}</p>
                <p className="text-xs text-gray-400">Max size: {maxSizeMB}MB</p>
                {recommendedRatio && (
                  <p className="text-xs text-blue-500 font-medium">{recommendedRatio}</p>
                )}
                {isProcessing && <p className="text-xs text-blue-500">Processing...</p>}
              </div>
            </div>
          ) : (
            <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden" style={{ minHeight: height }}>
              <img src={value} alt="Preview" className="w-full h-full object-contain" />
              <div className="absolute top-2 right-2 flex gap-2">
                {enableCropper && (
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={startCropping}
                  >
                    <Crop className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={handleRemove}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

