'use client';

import { Property } from '../../../data/mockProperties';

interface PropertyCardProps {
  property: Property;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

export default function PropertyCard({
  property,
  isFavorite,
  onToggleFavorite,
}: PropertyCardProps) {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(property.price);

  return (
    <article className="bg-white dark:bg-white/5 rounded-xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 group cursor-pointer h-full flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          src={property.image}
        />

        <button
          onClick={(e) => onToggleFavorite(property.id, e)}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${isFavorite
              ? 'bg-mosque text-white'
              : 'bg-white/90 dark:bg-black/50 text-nordic-dark dark:text-white hover:bg-mosque hover:text-white'
            }`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <span className="material-icons text-lg">
            {isFavorite ? 'favorite' : 'favorite_border'}
          </span>
        </button>

        <div
          className={`absolute bottom-3 left-3 text-white text-xs font-bold px-2 py-1 rounded ${property.isForRent ? 'bg-mosque/90' : 'bg-nordic-dark/90 dark:bg-white/90 dark:text-nordic-dark'
            }`}
        >
          {property.isForRent ? 'FOR RENT' : 'FOR SALE'}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-baseline mb-2">
          <h3 className="font-bold text-lg text-nordic-dark dark:text-white">
            {formattedPrice}
            {property.isForRent && (
              <span className="text-sm font-normal text-nordic-muted dark:text-white/60">/mo</span>
            )}
          </h3>
        </div>
        <h4 className="text-nordic-dark dark:text-gray-200 font-medium truncate mb-1">
          {property.title}
        </h4>
        <p className="text-nordic-muted dark:text-white/60 text-xs mb-4">
          {property.location}
        </p>

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/10">
          <div className="flex items-center gap-1 text-nordic-muted dark:text-white/60 text-xs">
            <span className="material-icons text-sm text-mosque/80 dark:text-primary">king_bed</span> {property.beds}
          </div>
          <div className="flex items-center gap-1 text-nordic-muted dark:text-white/60 text-xs">
            <span className="material-icons text-sm text-mosque/80 dark:text-primary">bathtub</span> {property.baths}
          </div>
          <div className="flex items-center gap-1 text-nordic-muted dark:text-white/60 text-xs">
            <span className="material-icons text-sm text-mosque/80 dark:text-primary">square_foot</span> {property.size}m²
          </div>
        </div>
      </div>
    </article>
  );
}
