"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { cloneElement, useState } from "react";

interface DialogWrapperProps {
  children: React.ReactElement<{ onClose?: () => void }>;
  title: string;
  description: string;
  dialogTrigger: React.ReactNode;
}

export const DialogWrapper = ({
  children,
  title,
  description,
  dialogTrigger,
}: DialogWrapperProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const isMobile = useIsMobile();
  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild className="cursor-pointer">
          {dialogTrigger}
        </DrawerTrigger>
        <DrawerContent className="p-6">
          <DrawerHeader className="mb-3">
            <DrawerTitle className="text-start text-primary">
              {title}
            </DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>

          {/* Pass the close function as a prop */}
          {cloneElement(children, {
            onClose: () => setIsOpen(false),
          })}
        </DrawerContent>
      </Drawer>
    );
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild className="cursor-pointer">
        {dialogTrigger}
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-md"
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
