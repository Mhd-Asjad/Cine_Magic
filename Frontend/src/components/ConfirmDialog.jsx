import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui/alert-dialog"; // Adjust path based on your project

const ConfirmDialog = ({
  title = "Are you sure?",
  description = "This action cannot be undone.",
  onConfirm,
  triggerLabel = "Open",
  confirmLabel = "Continue",
  cancelLabel = "Cancel",
  children, // for custom trigger (optional)
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children ? children : <button>{triggerLabel}</button>}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>{confirmLabel}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDialog;
