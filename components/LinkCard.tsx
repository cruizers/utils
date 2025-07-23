import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ExternalLink, X } from "lucide-react";
import { ExtractedLink } from "@/hooks/useLinkManager";

interface LinkCardProps {
  link: ExtractedLink;
  onOpen: (url: string) => void;
  onRemove: (id: string) => void;
}

export function LinkCard({ link, onOpen, onRemove }: LinkCardProps) {
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return url;
    }
  };

  return (
    <Card className="p-4 group hover:bg-accent/50 transition-all duration-200 border-muted">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {getDomain(link.url)}
            </p>
          </div>
          <p className="text-sm font-medium text-foreground truncate mb-1">
            {link.url}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => onOpen(link.url)}
            className="shrink-0"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Open
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onRemove(link.id)}
            className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
