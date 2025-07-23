import { useState, useCallback } from "react";
import {
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove } from "@dnd-kit/sortable";
import { ProcessedImage } from "./useImageManager";

interface UseDragAndDropProps {
  images: ProcessedImage[];
  onReorder: (oldIndex: number, newIndex: number) => void;
  onFilesProcessed: (files: FileList | File[]) => Promise<ProcessedImage[]>;
  setDragOver: (value: boolean) => void;
  setAddCardDragOver: (value: boolean) => void;
  setProcessing: (value: boolean) => void;
}

export function useDragAndDrop({
  images,
  onReorder,
  onFilesProcessed,
  setDragOver,
  setAddCardDragOver,
  setProcessing,
}: UseDragAndDropProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);

      if (active.id !== over?.id) {
        const oldIndex = images.findIndex((item) => item.id === active.id);
        const newIndex = images.findIndex((item) => item.id === over?.id);
        onReorder(oldIndex, newIndex);
      }
    },
    [images, onReorder]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(true);
    },
    [setDragOver]
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        setDragOver(false);
      }
    },
    [setDragOver]
  );

  const traverseFileTree = async (item: any, files: File[]): Promise<void> => {
    return new Promise((resolve) => {
      if (item.isFile) {
        item.file((file: File) => {
          if (file.type.startsWith("image/")) {
            files.push(file);
          }
          resolve();
        });
      } else if (item.isDirectory) {
        const dirReader = item.createReader();
        dirReader.readEntries(async (entries: any[]) => {
          for (const entry of entries) {
            await traverseFileTree(entry, files);
          }
          resolve();
        });
      } else {
        resolve();
      }
    });
  };

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      setProcessing(true);

      const items = Array.from(e.dataTransfer.items);
      const files: File[] = [];

      for (const item of items) {
        if (item.kind === "file") {
          const entry = item.webkitGetAsEntry();
          if (entry) {
            await traverseFileTree(entry, files);
          }
        }
      }

      if (files.length > 0) {
        await onFilesProcessed(files);
      }
      setProcessing(false);
    },
    [onFilesProcessed, setDragOver, setProcessing]
  );

  const handleAddCardDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setAddCardDragOver(true);
    },
    [setAddCardDragOver]
  );

  const handleAddCardDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        setAddCardDragOver(false);
      }
    },
    [setAddCardDragOver]
  );

  const handleAddCardDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setAddCardDragOver(false);
      await handleDrop(e);
    },
    [handleDrop, setAddCardDragOver]
  );

  const activeImage = activeId
    ? images.find((img) => img.id === activeId)
    : null;

  return {
    sensors,
    activeId,
    activeImage,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleAddCardDragOver,
    handleAddCardDragLeave,
    handleAddCardDrop,
  };
}
