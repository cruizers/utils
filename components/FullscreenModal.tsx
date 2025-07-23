import { useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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

  return (
    <Dialog open={!!image} onOpenChange={onClose}>
      <DialogContent
        className="max-w-none max-h-none w-screen h-screen p-0 bg-transparent border-none"
        showCloseButton={false}
      >
        {image && (
          <div className="relative w-full h-full flex items-center justify-center">
            <div
              className="absolute inset-0 cursor-pointer"
              onClick={onClose}
            />
            <img
              src={image.url}
              alt={image.name}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-4 left-4 right-4 flex justify-center pointer-events-none">
              <div className="bg-black/80 rounded-lg px-4 py-2">
                <div className="text-white text-sm text-center">
                  {image.name}
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
