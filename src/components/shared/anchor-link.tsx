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
        e.preventDefault();
        scrollToHash(hrefString);
      }
    };

    return (
      <Link ref={ref} href={href} onClick={handleClick} {...props} />
    );
  }
);

AnchorLink.displayName = "AnchorLink";