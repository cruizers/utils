"use client";

import { Button } from "@/components/ui/button";
import { Upload, Download } from "lucide-react";
import { useImageManager, ProcessedImage } from "@/hooks/useImageManager";
import { useUIState } from "@/hooks/useUIState";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { useFileOperations } from "@/hooks/useFileOperations";
import { ControlPanel } from "@/components/ControlPanel";
import { EmptyState } from "@/components/EmptyState";
import { ImageGrid } from "@/components/ImageGrid";
import { FullscreenModal } from "@/components/FullscreenModal";
import Link from "next/link";

export default function Home() {
  const imageManager = useImageManager();
  const uiState = useUIState();
  const fileOps = useFileOperations({
    images: imageManager.images,
    isSequential: imageManager.isSequential,
    globalPrefix: imageManager.globalPrefix,
    getDisplayName: imageManager.getDisplayName,
    onFilesProcessed: imageManager.addImages,
    setProcessing: uiState.setProcessing,
  });

  const dragAndDrop = useDragAndDrop({
    images: imageManager.images,
    onReorder: imageManager.reorderImages,
    onFilesProcessed: imageManager.addImages,
    setDragOver: uiState.setDragOver,
    setAddCardDragOver: uiState.setAddCardDragOver,
    setProcessing: uiState.setProcessing,
  });

  if (imageManager.images.length === 0) {
    return (
      <EmptyState
        isDragOver={uiState.isDragOver}
        isProcessing={uiState.isProcessing}
        onDragOver={dragAndDrop.handleDragOver}
        onDragLeave={dragAndDrop.handleDragLeave}
        onDrop={dragAndDrop.handleDrop}
        onFileSelect={fileOps.openFileDialog}
        fileInputRef={fileOps.fileInputRef}
        onFileInputChange={fileOps.handleFileSelect}
      />
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Image Processor</h1>
            <p className="text-muted-foreground">
              {imageManager.images.length} image
              {imageManager.images.length !== 1 ? "s" : ""} ready for processing
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={imageManager.clearAll}>
              Clear All
            </Button>
            <Button onClick={fileOps.openFileDialog} variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Add More
            </Button>
            <Button
              onClick={fileOps.downloadImages}
              disabled={imageManager.images.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Download All
            </Button>
          </div>
        </div>

        <ControlPanel
          globalPrefix={imageManager.globalPrefix}
          setGlobalPrefix={imageManager.setGlobalPrefix}
          isSequential={imageManager.isSequential}
          setIsSequential={imageManager.setIsSequential}
          onApplyGlobalPrefix={imageManager.applyGlobalPrefix}
          onResetToOriginalNames={imageManager.resetToOriginalNames}
        />

        <ImageGrid
          images={imageManager.images}
          sensors={dragAndDrop.sensors}
          onDragStart={dragAndDrop.handleDragStart}
          onDragEnd={dragAndDrop.handleDragEnd}
          activeImage={dragAndDrop.activeImage || null}
          onRemove={imageManager.removeImage}
          onNameChange={imageManager.updateImageName}
          onFullscreen={(image: ProcessedImage) =>
            uiState.setFullscreenImage(image)
          }
          getDisplayName={imageManager.getDisplayName}
          isSequential={imageManager.isSequential}
          onAddMoreFileSelect={fileOps.openFileDialog}
          onAddMoreDrop={dragAndDrop.handleAddCardDrop}
          addCardDragOver={uiState.addCardDragOver}
          onAddMoreDragOver={dragAndDrop.handleAddCardDragOver}
          onAddMoreDragLeave={dragAndDrop.handleAddCardDragLeave}
        />

        <FullscreenModal
          image={uiState.fullscreenImage}
          onClose={() => uiState.setFullscreenImage(null)}
        />

        <input
          ref={fileOps.fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={fileOps.handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
}
