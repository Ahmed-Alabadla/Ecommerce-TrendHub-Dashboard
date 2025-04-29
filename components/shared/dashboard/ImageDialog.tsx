"use client";
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image, { StaticImageData } from "next/image";

import avatar from "@/public/icons/avatar.jpg"; // Placeholder image
import logo from "@/public/apple-icon.png"; // Placeholder image
import { usePathname } from "next/navigation";

interface ImageDialogProps {
  imageUrl: StaticImageData;
  altText?: string;
  title?: string;
}

export default function ImageDialog({
  imageUrl,
  altText,
  title,
}: ImageDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Small Image Trigger */}
      <Image
        src={imageUrl ? imageUrl : pathname === "/users" ? avatar : logo}
        alt={altText ? altText : "Avatar"}
        className="w-12 h-12 object-cover rounded-full cursor-pointer border"
        onClick={() => setIsOpen(true)}
        width={48}
        height={48}
      />

      {/* Dialog for Full-Size Image */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button className="hidden" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-md p-4">
          <DialogHeader className="mb-3">
            <DialogTitle>
              <span className="w-full flex items-center justify-start text-primary">
                {title}
              </span>
            </DialogTitle>
          </DialogHeader>
          <Image
            src={imageUrl ? imageUrl : pathname === "/users" ? avatar : logo}
            alt={altText ? altText : "Avatar"}
            className="size-full object-cover rounded-md"
            width={415}
            height={312}
            layout="responsive"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
