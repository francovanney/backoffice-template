import { ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "./ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  children?: ReactNode;
}

export default function ConfirmationModal({
  open,
  onOpenChange,
  title = "Confirmar acción",
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
  children,
}: ConfirmationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="flex flex-col items-center text-center gap-4 py-2">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </span>
          <DialogHeader>
            <div className="text-xl font-semibold text-gray-900 mb-1">
              {title}
            </div>
          </DialogHeader>
          {children && (
            <div className="text-lg font-semibold text-red-600 mt-2">
              {children}
            </div>
          )}
        </div>
        <DialogFooter className="flex gap-2 justify-end pt-4">
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              onCancel?.();
              onOpenChange(false);
            }}
          >
            {cancelLabel}
          </Button>
          <Button
            variant="destructive"
            type="button"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
