import { Dialog, DialogContent } from "@/components/ui/dialog";
import EditSpotModal from "./EditSpotModal";
import { Spot } from "@/services/types/spot";

interface EditSpotDialogProps {
  spot: Spot;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditSpotDialog({
  spot,
  open,
  onOpenChange,
}: EditSpotDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} closeOnOverlayClick={false}>
      <DialogContent contentClassName="p-0 max-w-md w-full">
        <EditSpotModal spot={spot} />
      </DialogContent>
    </Dialog>
  );
}
