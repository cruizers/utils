"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import {
  Upload,
  Download,
  X,
  Maximize,
  FileImage,
  RotateCcw,
} from "lucide-react";

interface ProcessedImage {
  id: string;
  file: File;
  name: string;
  url: string;
  originalName: string;
}

interface SortableImageProps {
  image: ProcessedImage;
  index: number;
  onRemove: (id: string) => void;
  onNameChange: (id: string, newName: string) => void;
  onFullscreen: (image: ProcessedImage) => void;
  isSequential: boolean;
  globalPrefix: string;
  isDragging?: boolean;
}

function SortableImage({
  image,
  index,
  onRemove,
  onNameChange,
  onFullscreen,
  isSequential,
  globalPrefix,
  isDragging = false,
}: SortableImageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: image.id,
    transition: {
      duration: 200,
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getDisplayName = () => {
    if (isSequential) {
      const prefix = globalPrefix || image.name || "image";
      return `${prefix}_${String(index + 1).padStart(3, "0")}`;
    }
    return image.name || `image_${index + 1}`;
  };

  const isCurrentlyDragging = isDragging || isSortableDragging;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative bg-card border rounded-lg overflow-hidden transition-all duration-200 cursor-grab active:cursor-grabbing select-none ${
        isCurrentlyDragging
          ? "opacity-30 scale-95 shadow-2xl z-50 rotate-3"
          : "hover:shadow-lg hover:scale-[1.02]"
      }`}
      {...attributes}
      {...listeners}
    >
      <div className="aspect-square relative overflow-hidden">
        <img
          src={image.url}
          alt={image.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
        <Button
          size="sm"
          variant="secondary"
          className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-200 h-8 w-8 p-0 backdrop-blur-sm bg-background/80 hover:bg-background/90"
          onClick={(e) => {
            e.stopPropagation();
            onFullscreen(image);
          }}
        >
          <Maximize className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="destructive"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 h-8 w-8 p-0"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(image.id);
          }}
        >
          <X className="w-4 h-4" />
        </Button>
        {isSequential && (
          <Badge className="absolute bottom-2 left-2 text-xs bg-primary/90 backdrop-blur-sm">
            #{index + 1}
          </Badge>
        )}
      </div>
      <div className="p-3">
        <div className="text-xs text-muted-foreground mb-1">
          {isSequential ? "Prefix/Name" : "Custom name"}
        </div>
        <Input
          value={image.name}
          onChange={(e) => {
            e.stopPropagation();
            onNameChange(image.id, e.target.value);
          }}
          onClick={(e) => e.stopPropagation()}
          className="text-sm h-8"
          placeholder={isSequential ? "Enter prefix" : "Enter custom name"}
        />
        <div className="text-xs text-primary mt-1 truncate font-medium">
          → {getDisplayName()}
        </div>
        <div className="text-xs text-muted-foreground mt-1 truncate">
          {image.originalName}
        </div>
      </div>
    </div>
  );
}

function DragOverlayImage({ image }: { image: ProcessedImage }) {
  return (
    <div className="bg-card border rounded-lg overflow-hidden shadow-2xl rotate-6 scale-110 opacity-90">
      <div className="aspect-square relative overflow-hidden">
        <img
          src={image.url}
          alt={image.name}
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>
      <div className="p-3">
        <div className="text-sm font-medium truncate">{image.name}</div>
      </div>
    </div>
  );
}

interface AddMoreCardProps {
  onFileSelect: () => void;
  onDrop: (e: React.DragEvent) => void;
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
}

function AddMoreCard({
  onFileSelect,
  onDrop,
  isDragOver,
  onDragOver,
  onDragLeave,
}: AddMoreCardProps) {
  return (
    <div
      className={`group relative bg-card border-2 border-dashed rounded-lg overflow-hidden transition-all duration-200 cursor-pointer select-none hover:shadow-lg hover:scale-[1.02] min-h-[280px] flex flex-col ${
        isDragOver
          ? "border-primary bg-primary/5 scale-[1.02] shadow-lg"
          : "border-muted-foreground/30 hover:border-primary/50"
      }`}
      onClick={onFileSelect}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      <div className="aspect-square relative overflow-hidden flex items-center justify-center bg-muted/20">
        <div
          className={`transition-all duration-300 ${
            isDragOver ? "scale-110" : "group-hover:scale-110"
          }`}
        >
          <div className="w-16 h-16 rounded-full bg-muted-foreground/10 group-hover:bg-primary/10 flex items-center justify-center transition-colors duration-200">
            <Upload className="w-8 h-8 text-muted-foreground/60 group-hover:text-primary/70 transition-colors duration-200" />
          </div>
        </div>
      </div>
      <div className="p-3 flex-1 flex flex-col justify-center">
        <div className="text-sm font-medium text-center text-muted-foreground group-hover:text-foreground transition-colors duration-200">
          Add More Images
        </div>
        <div className="text-xs text-center text-muted-foreground/70 mt-1">
          Click or drag to upload
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSequential, setIsSequential] = useState(false);
  const [globalPrefix, setGlobalPrefix] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<ProcessedImage | null>(
    null
  );
  const [addCardDragOver, setAddCardDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  }, []);

  const processFiles = useCallback(async (files: FileList | File[]) => {
    setIsProcessing(true);
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
    setIsProcessing(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

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
        await processFiles(files);
      }
    },
    [processFiles]
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

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        processFiles(e.target.files);
      }
    },
    [processFiles]
  );

  const handleAddCardDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setAddCardDragOver(true);
  }, []);

  const handleAddCardDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setAddCardDragOver(false);
    }
  }, []);

  const handleAddCardDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setAddCardDragOver(false);
      await handleDrop(e);
    },
    [handleDrop]
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (active.id !== over?.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

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

  const openFullscreen = useCallback((image: ProcessedImage) => {
    setFullscreenImage(image);
  }, []);

  const closeFullscreen = useCallback(() => {
    setFullscreenImage(null);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && fullscreenImage) {
        closeFullscreen();
      }
    };

    if (fullscreenImage) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [fullscreenImage, closeFullscreen]);

  const downloadImages = useCallback(async () => {
    if (images.length === 0) return;

    const zip = new JSZip();

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const extension = image.originalName.split(".").pop() || "jpg";

      let fileName;
      if (isSequential) {
        const prefix = globalPrefix || image.name || "image";
        fileName = `${prefix}_${String(i + 1).padStart(3, "0")}.${extension}`;
      } else {
        fileName = `${image.name || `image_${i + 1}`}.${extension}`;
      }

      zip.file(fileName, image.file);
    }

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "processed_images.zip");
  }, [images, isSequential, globalPrefix]);

  const clearAll = useCallback(() => {
    images.forEach((img) => URL.revokeObjectURL(img.url));
    setImages([]);
  }, [images]);

  const activeImage = activeId
    ? images.find((img) => img.id === activeId)
    : null;

  if (images.length === 0) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center p-8 transition-all duration-300 ${
          isDragOver
            ? "bg-primary/5 border-2 border-dashed border-primary"
            : "border-2 border-dashed border-muted-foreground/20"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
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
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="mb-4"
            disabled={isProcessing}
          >
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
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Image Processor</h1>
            <p className="text-muted-foreground">
              {images.length} image{images.length !== 1 ? "s" : ""} ready for
              processing
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={clearAll}>
              Clear All
            </Button>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
            >
              <Upload className="w-4 h-4 mr-2" />
              Add More
            </Button>
            <Button onClick={downloadImages} disabled={images.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              Download All
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label
                    htmlFor="global-prefix"
                    className="text-sm font-medium"
                  >
                    Global Prefix/Name
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="global-prefix"
                      value={globalPrefix}
                      onChange={(e) => setGlobalPrefix(e.target.value)}
                      placeholder="e.g., vacation, project, photos"
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      onClick={applyGlobalPrefix}
                      disabled={!globalPrefix.trim()}
                    >
                      Apply to All
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Set the same name/prefix for all images. Works with or
                    without sequential numbering.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label
                    htmlFor="sequential-mode"
                    className="text-base font-medium"
                  >
                    Sequential Numbering
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Add sequential numbers to image names (name_001, name_002,
                    etc.)
                  </p>
                </div>
                <Switch
                  id="sequential-mode"
                  checked={isSequential}
                  onCheckedChange={setIsSequential}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetToOriginalNames}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset to Original Names
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                {isSequential ? (
                  <span>
                    <strong>Sequential Mode:</strong> Each image will be named
                    with its prefix/name followed by a number (e.g.,{" "}
                    {globalPrefix || "custom_name"}_001,{" "}
                    {globalPrefix || "custom_name"}_002)
                  </span>
                ) : (
                  <span>
                    <strong>Custom Mode:</strong> Each image will use its
                    individual custom name
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={images.map((img) => img.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {images.map((image, index) => (
                <SortableImage
                  key={image.id}
                  image={image}
                  index={index}
                  onRemove={removeImage}
                  onNameChange={updateImageName}
                  onFullscreen={openFullscreen}
                  isSequential={isSequential}
                  globalPrefix={globalPrefix}
                />
              ))}
              <AddMoreCard
                onFileSelect={() => fileInputRef.current?.click()}
                onDrop={handleAddCardDrop}
                isDragOver={addCardDragOver}
                onDragOver={handleAddCardDragOver}
                onDragLeave={handleAddCardDragLeave}
              />
            </div>
          </SortableContext>
          <DragOverlay
            dropAnimation={{
              duration: 200,
              easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
            }}
          >
            {activeImage ? <DragOverlayImage image={activeImage} /> : null}
          </DragOverlay>
        </DndContext>

        <Dialog open={!!fullscreenImage} onOpenChange={() => closeFullscreen()}>
          <DialogContent
            className="max-w-none max-h-none w-screen h-screen p-0 bg-transparent border-none"
            showCloseButton={false}
          >
            {fullscreenImage && (
              <div className="relative w-full h-full flex items-center justify-center">
                <div
                  className="absolute inset-0 cursor-pointer"
                  onClick={closeFullscreen}
                />
                <img
                  src={fullscreenImage.url}
                  alt={fullscreenImage.name}
                  className="max-w-full max-h-full object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
                {/* <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white"
                  onClick={closeFullscreen}
                >
                  <X className="w-4 h-4" />
                </Button> */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-center pointer-events-none">
                  <div className="bg-black/80 rounded-lg px-4 py-2">
                    <div className="text-white text-sm text-center">
                      {fullscreenImage.name}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
}
