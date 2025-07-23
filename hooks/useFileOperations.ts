import { useCallback, useRef } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { ProcessedImage } from "./useImageManager";

interface UseFileOperationsProps {
  images: ProcessedImage[];
  isSequential: boolean;
  globalPrefix: string;
  getDisplayName: (image: ProcessedImage, index: number) => string;
  onFilesProcessed: (files: FileList | File[]) => Promise<ProcessedImage[]>;
  setProcessing: (value: boolean) => void;
}

export function useFileOperations({
  images,
  isSequential,
  globalPrefix,
  getDisplayName,
  onFilesProcessed,
  setProcessing,
}: UseFileOperationsProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setProcessing(true);
        await onFilesProcessed(e.target.files);
        setProcessing(false);
      }
    },
    [onFilesProcessed, setProcessing]
  );

  const downloadImages = useCallback(async () => {
    if (images.length === 0) return;

    const zip = new JSZip();

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const extension = image.originalName.split(".").pop() || "jpg";
      const fileName = `${getDisplayName(image, i)}.${extension}`;
      zip.file(fileName, image.file);
    }

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "processed_images.zip");
  }, [images, getDisplayName]);

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return {
    fileInputRef,
    handleFileSelect,
    downloadImages,
    openFileDialog,
  };
}
