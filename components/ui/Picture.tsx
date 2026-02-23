import { JSX } from "preact";

/**
 * Props for the intelligent Picture component which automatically
 * requests optimized formatting (like WebP) from the PocketBase API.
 */
export interface PictureProps extends JSX.HTMLAttributes<HTMLImageElement> {
  /** The ID of the PocketBase collection the file belongs to */
  collectionId?: string;
  /** The ID of the PocketBase record the file belongs to */
  recordId?: string;
  /** The raw filename stored in PocketBase */
  filename?: string;
  /** Static source for local assets without PocketBase */
  src?: string;
  /** Loading attribute */
  loading?: "lazy" | "eager";
  /** Optional thumb processing format e.g. "800x600" or "800x0" */
  thumb?: string;
  /** Fallback description */
  alt: string;
  /** Additional CSS classes for the img tag */
  class?: string;
}

/**
 * Intelligent Image Component
 * 
 * Automatically requests WebP formatted thumbnails from PocketBase
 * to drastically reduce payload sizes and improve performance.
 */
export function Picture({
  collectionId,
  recordId,
  filename,
  src,
  thumb,
  alt,
  class: className = "",
  ...props
}: PictureProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        class={className}
        loading="lazy"
        decoding="async"
        {...props}
      />
    );
  }

  if (!filename || !collectionId || !recordId) return null;

  // Base URL for API requests using the built-in route
  const baseUrl = `/api/files/${collectionId}/${recordId}/${filename}`;
  
  // Construct parameters for PocketBase thumbnail processing
  const params = new URLSearchParams();
  if (thumb) {
    params.set("thumb", thumb);
  }

  // Add format parameter requesting optimized WebP delivery
  const webpParams = new URLSearchParams(params);
  webpParams.set("format", "webp");
  
  const originalUrl = `${baseUrl}${params.toString() ? `?${params.toString()}` : ""}`;
  const webpUrl = `${baseUrl}?${webpParams.toString()}`;

  return (
    <picture>
      {/* Primary optimized source (WebP) */}
      <source srcSet={webpUrl} type="image/webp" />
      {/* Fallback source for older browsers */}
      <img
        src={originalUrl}
        alt={alt}
        class={className}
        loading="lazy"
        decoding="async"
        {...props}
      />
    </picture>
  );
}
