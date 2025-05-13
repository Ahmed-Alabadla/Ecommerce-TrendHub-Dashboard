"use client";

import { formatFileSize } from "@/lib/utils";
import { UploadCloudIcon, X } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { useDropzone, type DropzoneOptions } from "react-dropzone";
import { twMerge } from "tailwind-merge";

const variants = {
  base: "relative rounded-md flex justify-center items-center flex-col cursor-pointer min-h-[150px] min-w-[200px] border border-dashed border-gray-400 dark:border-gray-300 transition-colors duration-200 ease-in-out",
  image:
    "border-0 p-0 min-h-0 min-w-0 relative shadow-md bg-slate-200 dark:bg-slate-900 rounded-md",
  active: "border-2",
  disabled:
    "bg-gray-200 border-gray-300 cursor-default pointer-events-none bg-opacity-30 dark:bg-gray-700",
  accept: "border border-blue-500 bg-blue-500 bg-opacity-10",
  reject: "border border-red-700 bg-red-700 bg-opacity-10",
};

type InputProps = {
  width: number;
  height: number;
  className?: string;
  value?: Array<string | File>;
  onChange?: (value: Array<string | File>) => void | Promise<void>;
  disabled?: boolean;
  dropzoneOptions?: Omit<DropzoneOptions, "disabled">;
  maxFiles?: number;
};

const ERROR_MESSAGES = {
  fileTooLarge(maxSize: number) {
    return `The file is too large. Max size is ${formatFileSize(
      maxSize || 2 * 1024 * 1024
    )}.`;
  },
  fileInvalidType() {
    return "Invalid file type.";
  },
  tooManyFiles(maxFiles: number) {
    return `You can only add ${maxFiles} file(s).`;
  },
  fileNotSupported() {
    return "The file is not supported.";
  },
};

const MultipleImageDropzone = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      dropzoneOptions,
      width,
      height,
      value = [],
      className,
      disabled,
      onChange,
      maxFiles = 5,
    },
    ref
  ) => {
    // Create image URLs for previews
    const imageUrls = React.useMemo(() => {
      return value.map((file) => {
        if (typeof file === "string") {
          // If it's already a URL string
          return file;
        } else if (file instanceof File) {
          // If it's a File, create an object URL
          return URL.createObjectURL(file);
        }
        return null;
      });
    }, [value]);

    // Cleanup object URLs when component unmounts or values change
    React.useEffect(() => {
      return () => {
        // Revoke the object URLs to avoid memory leaks
        value.forEach((file) => {
          if (file instanceof File) {
            const url = URL.createObjectURL(file);
            URL.revokeObjectURL(url);
          }
        });
      };
    }, [value]);

    // dropzone configuration
    const {
      getRootProps,
      getInputProps,
      fileRejections,
      isFocused,
      isDragAccept,
      isDragReject,
    } = useDropzone({
      accept: { "image/*": [".jpeg", ".png", ".gif", ".webp", ".jpg"] },
      multiple: true,
      disabled: disabled || value.length >= maxFiles,
      maxSize: 2 * 1024 * 1024, // Restrict file size to 2MB
      maxFiles: maxFiles,
      onDrop: (acceptedFiles) => {
        if (!onChange) return;

        // Add new files to the existing array, but don't exceed maxFiles
        const newFiles = [...value];

        for (const file of acceptedFiles) {
          if (newFiles.length < maxFiles) {
            newFiles.push(file);
          } else {
            break;
          }
        }

        void onChange(newFiles);
      },
      ...dropzoneOptions,
    });

    // styling
    const dropZoneClassName = React.useMemo(
      () =>
        twMerge(
          variants.base,
          isFocused && variants.active,
          disabled && variants.disabled,
          (isDragReject ?? fileRejections[0]) && variants.reject,
          isDragAccept && variants.accept,
          className
        ).trim(),
      [
        isFocused,
        fileRejections,
        isDragAccept,
        isDragReject,
        disabled,
        className,
      ]
    );

    // error validation messages
    const errorMessage = React.useMemo(() => {
      if (fileRejections[0]) {
        const { errors } = fileRejections[0];
        if (errors[0]?.code === "file-too-large") {
          return ERROR_MESSAGES.fileTooLarge(dropzoneOptions?.maxSize ?? 0);
        } else if (errors[0]?.code === "file-invalid-type") {
          return ERROR_MESSAGES.fileInvalidType();
        } else if (errors[0]?.code === "too-many-files") {
          return ERROR_MESSAGES.tooManyFiles(maxFiles);
        } else {
          return ERROR_MESSAGES.fileNotSupported();
        }
      }
      return undefined;
    }, [fileRejections, dropzoneOptions, maxFiles]);

    // Remove a specific image
    const removeImage = (index: number) => {
      if (!onChange) return;
      const newFiles = [...value];
      newFiles.splice(index, 1);
      void onChange(newFiles);
    };

    return (
      <div className="space-y-4">
        {/* Upload Area */}
        <div
          {...getRootProps({
            className: dropZoneClassName,
            style: {
              width,
              height,
            },
          })}
        >
          {/* Main File Input */}
          <input ref={ref} {...getInputProps()} />

          {/* Upload Icon and Text */}
          <div className="flex flex-col items-center justify-center text-xs text-gray-400">
            <UploadCloudIcon className="mb-2 h-7 w-7" />
            <div className="text-gray-400">drag & drop to upload</div>
            <div className="text-gray-400 text-xs mt-1">
              {value.length}/{maxFiles} images
            </div>
            <div className="mt-3">
              <Button
                type="button"
                disabled={disabled || value.length >= maxFiles}
              >
                select
              </Button>
            </div>
          </div>
        </div>

        {/* Error Text */}
        <div className="mt-1 text-xs text-red-500">{errorMessage}</div>

        {/* Image Previews Grid */}
        {value.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {imageUrls.map((url, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-md overflow-hidden border border-gray-200 dark:border-gray-700"
              >
                {url && (
                  <div className="relative h-full w-full">
                    <Image
                      className="h-full w-full rounded-md object-contain"
                      src={url}
                      alt={`Image ${index + 1}`}
                      fill
                    />

                    {/* Remove Image Button */}
                    {!disabled && (
                      <div
                        className="absolute right-1 top-1 cursor-pointer group"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                      >
                        <div className="flex h-5 w-5 items-center justify-center rounded-md border border-solid border-gray-500 bg-white transition-all duration-300 hover:h-6 hover:w-6 dark:border-gray-400 dark:bg-black">
                          <X
                            className="text-gray-500 dark:text-gray-400"
                            width={16}
                            height={16}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);
MultipleImageDropzone.displayName = "MultipleImageDropzone";

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  return (
    <button
      className={twMerge(
        // base
        "focus-visible:ring-ring inline-flex cursor-pointer items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50",
        // color
        "border border-gray-400 text-gray-400 shadow hover:bg-gray-100 hover:text-gray-500 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700",
        // size
        "h-6 rounded-md px-2 text-xs",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { MultipleImageDropzone };
