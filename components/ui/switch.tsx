"use client";

import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default";
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        // track colours
        "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        "dark:data-[state=unchecked]:bg-input/80",
        // focus / invalid
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        "aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 aria-invalid:ring-[3px]",
        // sizing — default
        "data-[size=default]:h-[18.4px] data-[size=default]:w-9",
        // sizing — sm
        "data-[size=sm]:h-4 data-[size=sm]:w-6",
        // layout
        "peer group/switch relative inline-flex shrink-0 cursor-pointer items-center",
        "rounded-full border transition-all outline-none",
        "after:absolute after:-inset-x-3 after:-inset-y-2",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          // colour
          "bg-white dark:bg-foreground",
          "data-[state=checked]:dark:bg-primary-foreground",
          // size — each handled independently, not chained with state
          "group-data-[size=default]/switch:size-4",
          "group-data-[size=sm]/switch:size-3",
          // ← THE FIX: translate uses data-[state=...] only, no compound chaining
          // default size travel: track width (36px) - thumb (16px) - 2px border = ~18px
          "data-[state=checked]:translate-x-[18px]",
          "data-[state=unchecked]:translate-x-px",
          // misc
          "pointer-events-none block rounded-full ring-0 shadow-sm transition-transform duration-200",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
