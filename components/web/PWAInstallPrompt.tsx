// components/PWAInstallPrompt.tsx
"use client";

import { useEffect, useState } from "react";

// Define types for the experimental beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  console.log("install compoennt");
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log("PWA install listener mounted / event caught");
      // Prevent the default mini-infobar prompt from appearing on mobile
      e.preventDefault();
      // Store the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Reveal your custom install banner/button UI
      setIsVisible(true);
    };

    // Check if the event was already fired and captured in our <head> script
    if (typeof window !== "undefined" && (window as any).deferredPWAEvent) {
      handleBeforeInstallPrompt((window as any).deferredPWAEvent);
      // Clean it up so we don't fire it multiple times unexpectedly
      (window as any).deferredPWAEvent = null;
    }

    const handleAppInstalled = () => {
      // Hide the custom install UI if the user installs the app via the browser address bar
      setIsVisible(false);
      setDeferredPrompt(null);
      console.log("PWA was installed successfully");
    };

    console.log("PWA install listener mounted");
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

    // Show the native browser installation dialog prompt
    await deferredPrompt.prompt();

    // Wait for the user to accept or dismiss the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    // Clean up the deferred prompt; it can only be used once
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg flex justify-between items-center z-50 md:max-w-md md:left-auto">
      <div>
        <p className="font-semibold">Install our App</p>
        <p className="text-sm opacity-90">
          Access this app quickly right from your home screen.
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setIsVisible(false)}
          className="px-3 py-1.5 text-sm hover:underline"
        >
          Dismiss
        </button>
        <button
          onClick={handleInstallClick}
          className="bg-white text-blue-600 px-4 py-1.5 rounded text-sm font-medium shadow hover:bg-gray-100 transition"
        >
          Install
        </button>
      </div>
    </div>
  );
}
