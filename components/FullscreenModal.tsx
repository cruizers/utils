import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Download } from "lucide-react";
import { ProcessedImage } from "@/hooks/useImageManager";

interface FullscreenModalProps {
  image: ProcessedImage | null;
  onClose: () => void;
}

export function FullscreenModal({ image, onClose }: FullscreenModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && image) {
        onClose();
      }
    };

    if (image) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [image, onClose]);

  const handleDownload = () => {
    if (!image) return;

    const link = document.createElement("a");
    link.href = image.url;
    link.download = image.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 p-4 flex items-center justify-center cursor-pointer"
      onClick={handleBackgroundClick}
    >
      <img
        src={image.url}
        alt={image.name}
        className="max-w-full max-h-full object-contain cursor-default"
        onClick={(e) => e.stopPropagation()}
      />

      <Button
        variant="secondary"
        size="icon"
        className="absolute top-6 right-6 bg-neutral-800/90 hover:bg-neutral-700 text-white border border-neutral-600 shadow-lg backdrop-blur-sm rounded-lg w-12 h-12"
        onClick={onClose}
      >
        <X className="w-6 h-6" />
      </Button>

      <Button
        variant="secondary"
        size="icon"
        className="absolute top-6 right-20 bg-neutral-800/90 hover:bg-neutral-700 text-white border border-neutral-600 shadow-lg backdrop-blur-sm rounded-lg w-12 h-12"
        onClick={handleDownload}
      >
        <Download className="w-5 h-5" />
      </Button>
    </div>
  );
}
