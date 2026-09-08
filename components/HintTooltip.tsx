"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { useHintTooltip } from "../hooks/useHintTooltip";

type HintAlign = "center" | "left" | "right";

interface HintTooltipProps {
  label: string;
  glyph?: string;
  align?: HintAlign;
  panelClassName?: string;
  /** Position the panel against the nearest relative ancestor instead of the button. */
  hoistPanel?: boolean;
  children: ReactNode;
}

function alignClass(align: HintAlign): string {
  switch (align) {
    case "center":
      return "left-1/2 -translate-x-1/2";
    case "left":
      return "left-0";
    case "right":
      return "right-0";
    default: {
      const _never: never = align;
      return _never;
    }
  }
}

export default function HintTooltip({
  label,
  glyph = "?",
  align = "center",
  panelClassName = "w-56",
  hoistPanel = false,
  children,
}: HintTooltipProps) {
  const { labelId, open, show, hide, toggle } = useHintTooltip();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const touchRef = useRef(false);

  const containsTarget = (node: Node | null) => {
    if (!node) return false;
    return Boolean(
      buttonRef.current?.contains(node) || panelRef.current?.contains(node),
    );
  };

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!containsTarget(event.target as Node)) hide();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, hide]);

  const button = (
    <button
      ref={buttonRef}
      type="button"
      aria-label={label}
      aria-expanded={open}
      aria-describedby={open ? labelId : undefined}
      onTouchStart={() => {
        touchRef.current = true;
      }}
      onClick={toggle}
      onMouseEnter={() => {
        if (!touchRef.current) show();
      }}
      onMouseLeave={() => {
        if (!touchRef.current) hide();
      }}
      onFocus={() => {
        if (!touchRef.current) show();
      }}
      onBlur={(event) => {
        if (containsTarget(event.relatedTarget)) return;
        hide();
      }}
      className="relative z-10 flex h-5 w-5 items-center justify-center rounded-full border border-white/25 font-mono text-[11px] text-mist transition hover:border-gold hover:text-gold"
    >
      {glyph}
    </button>
  );

  const panel = open ? (
    <div
      ref={panelRef}
      id={labelId}
      role="tooltip"
      className={`absolute top-full z-30 mt-2 max-w-[calc(100vw-2rem)] rounded-xl border border-white/10 bg-ink px-3 py-3 text-left shadow-xl ${alignClass(align)} ${panelClassName}`}
    >
      {children}
    </div>
  ) : null;

  if (hoistPanel) {
    return (
      <>
        {button}
        {panel}
      </>
    );
  }

  return (
    <span className="relative inline-flex">
      {button}
      {panel}
    </span>
  );
}
