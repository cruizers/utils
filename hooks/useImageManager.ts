import { useState, useCallback } from "react";

export interface ProcessedImage {
  id: string;
  file: File;
  name: string;
  url: string;
  originalName: string;
}

export function useImageManager() {
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [isSequential, setIsSequential] = useState(false);
  const [globalPrefix, setGlobalPrefix] = useState("");

  const addImages = useCallback(async (files: FileList | File[]) => {
    const newImages: ProcessedImage[] = [];
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    for (const file of imageFiles) {
      const id = Math.random().toString(36).substr(2, 9);
      const url = URL.createObjectURL(file);
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");

      newImages.push({
        id,
        file,
        name: nameWithoutExt,
        url,
        originalName: file.name,
      });
    }

    setImages((prev) => [...prev, ...newImages]);
    return newImages;
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const updated = prev.filter((img) => img.id !== id);
      const removedImage = prev.find((img) => img.id === id);
      if (removedImage) {
        URL.revokeObjectURL(removedImage.url);
      }
      return updated;
    });
  }, []);

  const updateImageName = useCallback((id: string, newName: string) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, name: newName } : img))
    );
  }, []);

  const reorderImages = useCallback((oldIndex: number, newIndex: number) => {
    setImages((prev) => {
      const result = [...prev];
      const [removed] = result.splice(oldIndex, 1);
      result.splice(newIndex, 0, removed);
      return result;
    });
  }, []);

  const applyGlobalPrefix = useCallback(() => {
    if (globalPrefix.trim()) {
      setImages((prev) =>
        prev.map((img) => ({
          ...img,
          name: globalPrefix.trim(),
        }))
      );
    }
  }, [globalPrefix]);

  const resetToOriginalNames = useCallback(() => {
    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        name: img.originalName.replace(/\.[^/.]+$/, ""),
      }))
    );
  }, []);

  const clearAll = useCallback(() => {
    images.forEach((img) => URL.revokeObjectURL(img.url));
    setImages([]);
  }, [images]);

  const getDisplayName = useCallback(
    (image: ProcessedImage, index: number) => {
      if (isSequential) {
        const prefix = globalPrefix || image.name || "image";
        return `${prefix}_${String(index + 1).padStart(3, "0")}`;
      }
      return image.name || `image_${index + 1}`;
    },
    [isSequential, globalPrefix]
  );

  return {
    images,
    isSequential,
    globalPrefix,
    setIsSequential,
    setGlobalPrefix,
    addImages,
    removeImage,
    updateImageName,
    reorderImages,
    applyGlobalPrefix,
    resetToOriginalNames,
    clearAll,
    getDisplayName,
  };
}
