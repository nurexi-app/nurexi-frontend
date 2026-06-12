import { useRef, useState } from "react";
import { toast } from "sonner"; // or your specific toast library

interface UseDeleteWithUndoProps<T> {
  deleteFn: (id: string) => Promise<{ success: boolean }>;
  onSuccess: (id: string) => void;
  onError: (message: string) => void;
}

export function useDeleteWithUndo<T>({
  deleteFn,
  onSuccess,
  onError,
}: UseDeleteWithUndoProps<T>) {
  const [isLoading, setIsLoading] = useState(false);
  const deleteTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const cancelDelete = (toastId: string | number) => {
    if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
    if (countdownIntervalRef.current)
      clearInterval(countdownIntervalRef.current);

    toast.dismiss(toastId);
    toast.success("Deletion cancelled");
  };

  const executeDelete = (id: string) => {
    // Clear any existing timers for safety
    if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
    if (countdownIntervalRef.current)
      clearInterval(countdownIntervalRef.current);

    let timeLeft = 5;

    const toastId = toast.loading(`Deleting item in ${timeLeft}s...`, {
      description: "This action will be permanent.",
      action: {
        label: "Undo",
        onClick: () => cancelDelete(toastId),
      },
    });

    countdownIntervalRef.current = setInterval(() => {
      timeLeft -= 1;
      if (timeLeft > 0) {
        toast.loading(`Deleting item in ${timeLeft}s...`, { id: toastId });
      } else {
        if (countdownIntervalRef.current)
          clearInterval(countdownIntervalRef.current);
      }
    }, 1000);

    deleteTimerRef.current = setTimeout(async () => {
      if (countdownIntervalRef.current)
        clearInterval(countdownIntervalRef.current);
      setIsLoading(true);
      toast.loading("Processing deletion...", { id: toastId });

      try {
        const response = await deleteFn(id);
        if (response.success) {
          onSuccess(id);
          toast.success("Item deleted successfully", { id: toastId });
        }
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Error deleting";
        onError(msg);
        toast.error(msg, { id: toastId });
      } finally {
        setIsLoading(false);
        deleteTimerRef.current = null;
      }
    }, 5000);
  };

  return { executeDelete, isLoading };
}
