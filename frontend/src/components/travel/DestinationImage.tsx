import { useState } from 'react';
import { cn } from '@/lib/utils';
import { FALLBACK_IMAGE, resolveDestinationImage } from '@/lib/destinationImages';

interface DestinationImageProps {
  /** City, airport code or country - resolved through the image registry. */
  destination?: string | null;
  /** Explicit image source (e.g. a booking-type scene); overrides `destination`. */
  src?: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
}

export function DestinationImage({ destination, src, alt, className, imgClassName, eager = false }: DestinationImageProps) {
  const resolved = src ?? resolveDestinationImage(destination);
  // Keyed on the resolved URL so a destination change resets load/fallback state.
  return <ImageWithFallback key={resolved} src={resolved} alt={alt ?? (destination ? `${destination}` : 'Travel destination')} className={className} imgClassName={imgClassName} eager={eager} />;
}

function ImageWithFallback({ src, alt, className, imgClassName, eager }: { src: string; alt: string; className?: string; imgClassName?: string; eager: boolean }) {
  const [current, setCurrent] = useState(src);
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={cn('relative overflow-hidden bg-[#E9EEF6]', className)}>
      {!loaded && <div className="skeleton absolute inset-0 rounded-none" aria-hidden="true" />}
      <img
        src={current}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (current !== FALLBACK_IMAGE) setCurrent(FALLBACK_IMAGE);
          else setLoaded(true);
        }}
        className={cn('h-full w-full object-cover transition-opacity duration-500', loaded ? 'opacity-100' : 'opacity-0', imgClassName)}
      />
    </div>
  );
}
