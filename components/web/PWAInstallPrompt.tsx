"use client";

import Image from "next/image";
import { Download, Share2, SquarePlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

type InstallPlatform = "android" | "ios" | null;

const DISMISS_KEY = "nurexi-pwa-prompt-dismissed-at";
const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000;

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [platform, setPlatform] = useState<InstallPlatform>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    const dismissedAt = Number(window.localStorage.getItem(DISMISS_KEY) || 0);
    const wasRecentlyDismissed = Date.now() - dismissedAt < DISMISS_DURATION;

    if (isStandalone || wasRecentlyDismissed) return;

    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const iosPromptTimer = isIOS
      ? window.setTimeout(() => {
          setPlatform("ios");
          setIsVisible(true);
        }, 0)
      : undefined;

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setPlatform("android");
      setIsVisible(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsVisible(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      if (iosPromptTimer !== undefined) window.clearTimeout(iosPromptTimer);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  function dismiss() {
    window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setIsVisible(false);
  }

  async function install() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "dismissed") {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    }

    setDeferredPrompt(null);
    setIsVisible(false);
  }

  if (!isVisible) return null;

  return (
    <aside
      className="fixed bottom-4 left-4 right-4 z-[100] overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-[0_24px_70px_rgba(15,41,40,0.2)] sm:bottom-6 sm:left-auto sm:right-6 sm:w-[410px]"
      aria-label="Install Nurexi"
      aria-live="polite"
    >
      <div className="h-1.5 bg-accent" />
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-secondary">
            <Image src="/Logo.svg" alt="" width={28} height={28} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Nurexi on your device</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight">Keep learning within reach.</h2>
          </div>
          <Button type="button" variant="ghost" size="icon-sm" onClick={dismiss} className="-mr-2 -mt-2 rounded-full" aria-label="Dismiss install prompt">
            <X aria-hidden="true" className="size-4" />
          </Button>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Add Nurexi to your home screen for quicker access to your learning and practice.
        </p>

        {platform === "android" && (
          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" onClick={dismiss} className="rounded-full">Maybe later</Button>
            <Button type="button" onClick={install} className="rounded-full px-6">
              <Download aria-hidden="true" className="size-4" />
              Install Nurexi
            </Button>
          </div>
        )}

        {platform === "ios" && (
          <div className="mt-5 rounded-2xl bg-secondary p-4 text-sm text-secondary-foreground">
            <p className="font-semibold">Install from Safari</p>
            <ol className="mt-3 space-y-3 text-muted-foreground">
              <li className="flex items-center gap-3">
                <Share2 aria-hidden="true" className="size-4 shrink-0 text-accent" />
                Tap the Share button.
              </li>
              <li className="flex items-center gap-3">
                <SquarePlus aria-hidden="true" className="size-4 shrink-0 text-accent" />
                Choose Add to Home Screen.
              </li>
            </ol>
          </div>
        )}
      </div>
    </aside>
  );
}
