import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Link, Trash2 } from "lucide-react";

interface LinkInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  linkCount: number;
}

export function LinkInput({
  value,
  onChange,
  onClear,
  linkCount,
}: LinkInputProps) {
  return (
    <div className="relative">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your text containing URLs here and watch the magic happen..."
        className="min-h-24 resize-none text-base leading-relaxed pr-20"
        rows={4}
      />
      <div className="absolute bottom-3 right-3 flex items-center gap-2">
        {linkCount > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground bg-background/90 backdrop-blur-sm px-2 py-1 rounded border">
            <Link className="w-3 h-3" />
            {linkCount}
          </div>
        )}
        {value && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onClear}
            className="h-7 px-2 bg-background/90 backdrop-blur-sm border"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        )}
      </div>
    </div>
  );
}
