"use client";

import { useEffect } from "react";
import { trackProfileView, trackLinkClick } from "@/lib/firebase";

interface ProfileTrackerProps {
  userId: string;
  children: React.ReactNode;
}

export function ProfileTracker({ userId, children }: ProfileTrackerProps) {
  useEffect(() => {
    // Track profile view on mount
    trackProfileView(userId);
  }, [userId]);

  return <>{children}</>;
}

interface TrackableLinkProps {
  userId: string;
  linkId: string;
  href: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export function TrackableLink({ userId, linkId, href, className, style, children }: TrackableLinkProps) {
  const handleClick = () => {
    trackLinkClick(userId, linkId);
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={style}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
