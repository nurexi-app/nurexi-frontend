"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

type InstallPlatform = "android" | "ios" | null;

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [platform, setPlatform] = useState<InstallPlatform>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the app is already installed/running as a PWA
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS Safari standalone mode
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true;

    if (isStandalone) {
      return;
    }

    // Detect iPhone/iPad/iPod
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    if (isIOS) {
      setPlatform("ios");
      setIsVisible(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();

      const installEvent = e as BeforeInstallPromptEvent;

      setDeferredPrompt(installEvent);
      setPlatform("android");
      setIsVisible(true);
    };

    const handleAppInstalled = () => {
      console.log("Nurexi was installed");

      setDeferredPrompt(null);
      setIsVisible(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );

      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    console.log(`User response: ${outcome}`);

    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 rounded-xl bg-blue-600 p-4 text-white shadow-lg md:left-auto md:max-w-md">
      {platform === "android" && (
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold">Install Nurexi</p>

            <p className="text-sm opacity-90">
              Get quick access to Nurexi right from your home screen.
            </p>
          </div>

          <div className="flex shrink-0 gap-2">
            <button
              onClick={() => setIsVisible(false)}
              className="px-3 py-1.5 text-sm hover:underline"
            >
              Dismiss
            </button>

            <button
              onClick={handleInstallClick}
              className="rounded bg-white px-4 py-1.5 text-sm font-medium text-blue-600 shadow transition hover:bg-gray-100"
            >
              Install
            </button>
          </div>
        </div>
      )}

      {platform === "ios" && (
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold">Install Nurexi</p>

              <p className="mt-1 text-sm opacity-90">
                Add Nurexi to your iPhone or iPad for quick access.
              </p>
            </div>

            <button
              onClick={() => setIsVisible(false)}
              className="text-xl leading-none opacity-80 hover:opacity-100"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>

          <div className="mt-3 rounded-lg bg-white/10 p-3 text-sm">
            <p>
              Tap the <strong>Share</strong> button in Safari, then select{" "}
              <strong>Add to Home Screen</strong>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
