"use client";

import { Button } from "@/components/ui/button";
import { ExternalLink, Download, Link2 } from "lucide-react";
import { useLinkManager } from "@/hooks/useLinkManager";
import { LinkInput } from "@/components/LinkInput";
import { LinkCard } from "@/components/LinkCard";

export default function LinksPage() {
  const {
    inputText,
    extractedLinks,
    handleTextChange,
    openLink,
    openAllLinks,
    removeLink,
    clearAll,
  } = useLinkManager();

  const exportLinks = () => {
    const linksText = extractedLinks.map((link) => link.url).join("\n");
    const blob = new Blob([linksText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "extracted-links.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (extractedLinks.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <div className="text-center max-w-2xl mx-auto">
          <Link2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-semibold mb-2">Link Extractor</h1>
          <p className="text-muted-foreground mb-8">
            Paste any text containing URLs and automatically extract all links
            for easy management
          </p>
          <div className="w-full max-w-2xl">
            <LinkInput
              value={inputText}
              onChange={handleTextChange}
              onClear={clearAll}
              linkCount={extractedLinks.length}
            />
          </div>
          <div className="text-sm text-muted-foreground mt-4">
            Supports HTTP and HTTPS URLs • Real-time extraction • Bulk
            operations
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Link Extractor</h1>
            <p className="text-muted-foreground">
              {extractedLinks.length} link
              {extractedLinks.length !== 1 ? "s" : ""} ready for action
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={clearAll}>
              Clear All
            </Button>
            <Button variant="outline" onClick={exportLinks}>
              <Download className="w-4 h-4 mr-2" />
              Export Links
            </Button>
            <Button onClick={openAllLinks}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Open All
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <LinkInput
            value={inputText}
            onChange={handleTextChange}
            onClear={clearAll}
            linkCount={extractedLinks.length}
          />
        </div>

        <div className="grid gap-3">
          {extractedLinks.map((link) => (
            <LinkCard
              key={link.id}
              link={link}
              onOpen={openLink}
              onRemove={removeLink}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
