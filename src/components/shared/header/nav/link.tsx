import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { scale, slide } from "@/components/shared/header/anim";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Register GSAP ScrollTo plugin
gsap.registerPlugin(ScrollToPlugin);


type LinkData = {
  label: string;
  href: string;
  index: number;
};

type Props = {
  data: LinkData;
  isActive: boolean;
  setSelectedIndicator: (href: string) => void;
};

export default function LinkItem({
  data,
  isActive,
  setSelectedIndicator,
}: Props) {
  const { label, href, index } = data;
  const pathname = usePathname();

  // Clear URL hash when pathname changes
  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [pathname]);

  // Handle smooth scrolling for anchor links with GSAP
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Only handle anchor links (e.g., #craft, #about)
    if (href.startsWith('#')) {
      e.preventDefault();

      // Use GSAP's scrollTo instead of native scrollIntoView
      // This works with ScrollSmoother/ScrollTrigger
      gsap.to(window, {
        duration: 1,
        scrollTo: {
          y: href,
          offsetY: 0, // Adjust if you have a fixed header
        },
        ease: "power3.inOut",
      });

      // Update the URL without page reload
      window.history.pushState(null, '', href);
    }
    // External links (http/https) will work normally
  };

  return (
    <motion.div
      className="relative flex items-center cursor-pointer"
      onMouseEnter={() => setSelectedIndicator(href)}
      custom={index}
      variants={slide as Variants}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      <motion.div
        variants={scale as Variants}
        animate={isActive ? "open" : "closed"}
        className="absolute -left-7 w-2.5 h-2.5 bg-background rounded-full"
      />
      <Link
        href={href}
        onClick={handleClick}
        className="relative group overflow-hidden"
      >
        {label}
      </Link>
    </motion.div>
  );
}