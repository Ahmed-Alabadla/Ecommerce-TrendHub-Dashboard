"use client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface DeleteAlertDialogProps {
  children: React.ReactElement<{ onClose?: () => void }>;
  title: string;
  name: string;
  dialogTrigger: React.ReactNode;
}

export default function DeleteAlertDialog({
  children,
  title,
  dialogTrigger,
  name,
}: DeleteAlertDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{dialogTrigger}</AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the{" "}
            <span className="text-primary">{title} </span>
            <span className="font-semibold text-base text-primary">
              {name}
            </span>{" "}
            and remove it from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {children}
      </AlertDialogContent>
    </AlertDialog>
  );
}
