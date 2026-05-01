"use client";

import React, { useState } from "react";
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
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { DeleteAccountAction } from "@/lib/actions/auth";

export default function DeleteAccount() {
  const [confirmation, setConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    if (confirmation !== "i want to delete my account") {
      toast.error("Please type the confirmation text exactly.");
      return;
    }

    setIsDeleting(true);
    try {
      await DeleteAccountAction();
      toast.success("Account deleted successfully.");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete account.");
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
          if (!open) setConfirmation(""); // Reset on close
        }}
      >
        <DialogTrigger asChild>
          <Button variant={"destructive"} className="text-sm font-medium  mt-1">
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
              <p className="text-sm font-medium">
                To confirm, type{" "}
                <span className="font-bold select-none text-foreground italic">
                  "i want to delete my account"
                </span>{" "}
                in the box below
              </p>
              <Input
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                placeholder="i want to delete my account"
                className="mt-1"
                autoFocus
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={
                confirmation !== "i want to delete my account" || isDeleting
              }
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
