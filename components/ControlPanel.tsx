import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RotateCcw } from "lucide-react";

interface ControlPanelProps {
  globalPrefix: string;
  setGlobalPrefix: (value: string) => void;
  isSequential: boolean;
  setIsSequential: (value: boolean) => void;
  onApplyGlobalPrefix: () => void;
  onResetToOriginalNames: () => void;
}

export function ControlPanel({
  globalPrefix,
  setGlobalPrefix,
  isSequential,
  setIsSequential,
  onApplyGlobalPrefix,
  onResetToOriginalNames,
}: ControlPanelProps) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="global-prefix" className="text-sm font-medium">
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
                  onClick={onApplyGlobalPrefix}
                  disabled={!globalPrefix.trim()}
                >
                  Apply to All
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Set the same name/prefix for all images. Works with or without
                sequential numbering.
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
                Add sequential numbers to image names (name_001, name_002, etc.)
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
              onClick={onResetToOriginalNames}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Original Names
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            {isSequential ? (
              <span>
                <strong>Sequential Mode:</strong> Each image will be named with
                its prefix/name followed by a number (e.g.,{" "}
                {globalPrefix || "custom_name"}_001,{" "}
                {globalPrefix || "custom_name"}_002)
              </span>
            ) : (
              <span>
                <strong>Custom Mode:</strong> Each image will use its individual
                custom name
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
