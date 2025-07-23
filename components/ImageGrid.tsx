import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Maximize } from "lucide-react";
import { ProcessedImage } from "@/hooks/useImageManager";

interface SortableImageProps {
  image: ProcessedImage;
  index: number;
  onRemove: (id: string) => void;
  onNameChange: (id: string, newName: string) => void;
  onFullscreen: (image: ProcessedImage) => void;
  getDisplayName: (image: ProcessedImage, index: number) => string;
  isSequential: boolean;
}

function SortableImage({
  image,
  index,
  onRemove,
  onNameChange,
  onFullscreen,
  getDisplayName,
  isSequential,
}: SortableImageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative bg-card border rounded-lg overflow-hidden transition-all duration-200 cursor-grab active:cursor-grabbing select-none ${
        isDragging
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
          → {getDisplayName(image, index)}
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

interface ImageGridProps {
  images: ProcessedImage[];
  sensors: any;
  onDragStart: (event: any) => void;
  onDragEnd: (event: any) => void;
  activeImage: ProcessedImage | null;
  onRemove: (id: string) => void;
  onNameChange: (id: string, newName: string) => void;
  onFullscreen: (image: ProcessedImage) => void;
  getDisplayName: (image: ProcessedImage, index: number) => string;
  isSequential: boolean;
  onAddMoreFileSelect: () => void;
  onAddMoreDrop: (e: React.DragEvent) => void;
  addCardDragOver: boolean;
  onAddMoreDragOver: (e: React.DragEvent) => void;
  onAddMoreDragLeave: (e: React.DragEvent) => void;
}

export function ImageGrid({
  images,
  sensors,
  onDragStart,
  onDragEnd,
  activeImage,
  onRemove,
  onNameChange,
  onFullscreen,
  getDisplayName,
  isSequential,
  onAddMoreFileSelect,
  onAddMoreDrop,
  addCardDragOver,
  onAddMoreDragOver,
  onAddMoreDragLeave,
}: ImageGridProps) {
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
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
              onRemove={onRemove}
              onNameChange={onNameChange}
              onFullscreen={onFullscreen}
              getDisplayName={getDisplayName}
              isSequential={isSequential}
            />
          ))}
          <AddMoreCard
            onFileSelect={onAddMoreFileSelect}
            onDrop={onAddMoreDrop}
            isDragOver={addCardDragOver}
            onDragOver={onAddMoreDragOver}
            onDragLeave={onAddMoreDragLeave}
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
  );
}
