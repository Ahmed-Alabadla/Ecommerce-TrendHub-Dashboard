"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { cloneElement, useState } from "react";

interface DialogWrapperProps {
  children: React.ReactElement<{ onClose?: () => void }>;
  title: string;
  description: string;
  dialogTrigger: React.ReactNode;
  size?: string;
}

export const DialogWrapper = ({
  children,
  title,
  description,
  dialogTrigger,
  size = "lg",
}: DialogWrapperProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild className="cursor-pointer">
        {dialogTrigger}
      </DialogTrigger>
      <DialogContent
        className={`sm:max-w-${size}`}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="mb-3">
          <DialogTitle className="text-start text-primary">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {/* Pass the close function as a prop */}
        {cloneElement(children, {
          onClose: () => setIsOpen(false),
        })}
      </DialogContent>
    </Dialog>
  );
};
