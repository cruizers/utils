import { Button } from "@/components/ui/button";
import { Upload, FileImage } from "lucide-react";

interface EmptyStateProps {
  isDragOver: boolean;
  isProcessing: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function EmptyState({
  isDragOver,
  isProcessing,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  fileInputRef,
  onFileInputChange,
}: EmptyStateProps) {
  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-8 transition-all duration-300 ${
        isDragOver
          ? "bg-primary/5 border-2 border-dashed border-primary"
          : "border-2 border-dashed border-muted-foreground/20"
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="text-center max-w-md mx-auto">
        <div
          className={`transition-all duration-300 ${
            isDragOver ? "scale-110" : ""
          }`}
        >
          <FileImage className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-semibold mb-2">Drop Images Here</h1>
        <p className="text-muted-foreground mb-6">
          Drop folders or images to rename and bulk export them. Supports drag
          and drop reordering.
        </p>
        <Button onClick={onFileSelect} className="mb-4" disabled={isProcessing}>
          <Upload className="w-4 h-4 mr-2" />
          {isProcessing ? "Processing..." : "Choose Files"}
        </Button>
        <div className="text-sm text-muted-foreground">
          Supports JPG, PNG, GIF, WebP and other image formats
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={onFileInputChange}
        className="hidden"
      />
    </div>
  );
}
