"use client";

import { Button } from "@/components/ui/button";
import { CloudDownload } from "lucide-react";
import { useEffect, useState } from "react";

export const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
    });

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = () => {
    if (!deferredPrompt) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const promptEvent = deferredPrompt as any;
    promptEvent.prompt();

    promptEvent.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
      setDeferredPrompt(null);
    });
  };

  if (isInstalled) return null;

  return (
    <Button
      onClick={handleInstallClick}
      disabled={!deferredPrompt}
      size="sm"
      className="w-full flex items-center  gap-2 mb-1"
    >
      <CloudDownload className="size-4" />
      <span className="block"> Install App</span>
    </Button>
  );
};
