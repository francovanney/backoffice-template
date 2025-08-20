import { Dialog, DialogContent } from "@/components/ui/dialog";
import NewSpotModal from "./NewSpotModal";

interface NewSpotDialogProps {
  seccionId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NewSpotDialog({
  seccionId,
  open,
  onOpenChange,
}: NewSpotDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} closeOnOverlayClick={false}>
      <DialogContent contentClassName="p-0 max-w-md w-full">
        <NewSpotModal seccionId={seccionId} />
      </DialogContent>
    </Dialog>
  );
}
