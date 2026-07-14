"use client";

import Link, { LinkProps } from "next/link";
import { forwardRef, MouseEvent, ReactNode } from "react";
import { scrollToHash } from "@/lib/scroll-to-hash";

type AnchorLinkProps = LinkProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    children: ReactNode;
  };

export const AnchorLink = forwardRef<HTMLAnchorElement, AnchorLinkProps>(
  ({ href, onClick, ...props }, ref) => {
    const hrefString = href.toString();
    const isHash = hrefString.startsWith("#");

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e);
      if (e.defaultPrevented) return;

      if (isHash) {
        // Same pattern as Nav: prevent the native jump, smooth-scroll with
        // GSAP instead, and let scrollToHash handle pushing + reliably
        // clearing the hash once the scroll lands (or gets interrupted).
        e.preventDefault();
        scrollToHash(hrefString);
      }
      // Non-hash hrefs are left alone — normal Next.js navigation applies.
    };

    return (
      <Link ref={ref} href={href} onClick={handleClick} {...props} />
    );
  }
);

AnchorLink.displayName = "AnchorLink";