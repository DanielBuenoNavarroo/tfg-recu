import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertDialogProps } from "@radix-ui/react-alert-dialog";

type Props = AlertDialogProps & {
  message: string;
  title: string;
  onConfrim: (() => void) | (() => Promise<boolean>);
};

const ConfirmAlert = ({
  onOpenChange,
  onConfrim,
  message,
  title,
  ...props
}: Props) => {
  return (
    <AlertDialog onOpenChange={onOpenChange} {...props}>
      <AlertDialogContent className="top-[40%]">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive hover:bg-destructive/80 text-white"
            onClick={() => onConfrim?.()}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmAlert;
