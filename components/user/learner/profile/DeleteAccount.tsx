"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/animate-ui/components/radix/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { DeleteAccountAction } from "@/lib/actions/auth";

export default function DeleteAccount() {
  const [password, setPassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    if (!password.trim()) {
      toast.error("Please enter your password to confirm");
      return;
    }

    setIsDeleting(true);
    try {
      await DeleteAccountAction(password);
      toast.success("Account deleted successfully.");
    } catch (error: any) {
      toast.error(
        error.message || "Failed to delete account. Incorrect password?",
      );
      setIsDeleting(false);
    }
  };

  return (
    <div className="mt-4 p-4 space-y-3 md:space-y-4 border border-destructive/20 rounded-[10px]">
      <div className="space-y-px">
        <h4 className="text-destructive font-semibold flex items-center gap-2">
          <AlertTriangle className="size-4" />
          Danger Zone
        </h4>
        <p className="bodyText text-muted-foreground">
          Deleting your account will permanently remove all your data. This
          action cannot be undone.
        </p>
      </div>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) setPassword("");
        }}
      >
        <DialogTrigger asChild>
          <Button variant={"destructive"} className="text-sm font-medium mt-1">
            Delete my account
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-xs">
              Warning: You will lose access to all your progress and records
              immediately.
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Enter your password to confirm</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                className="mt-1"
                autoFocus
                autoComplete="off"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={!password.trim() || isDeleting}
              className="w-full"
            >
              {isDeleting ? "Deleting..." : "Permanently Delete My Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
