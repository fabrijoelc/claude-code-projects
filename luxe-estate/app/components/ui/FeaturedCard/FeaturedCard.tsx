'use client';

import { Property } from '../../../data/mockProperties';

interface FeaturedCardProps {
  property: Property;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

export default function FeaturedCard({
  property,
  isFavorite,
  onToggleFavorite,
}: FeaturedCardProps) {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(property.price);

  const formattedSize = new Intl.NumberFormat('en-US').format(property.size);

  const badgeText = property.isExclusive
    ? 'Exclusive'
    : property.isNewArrival
      ? 'New Arrival'
      : null;

  return (
    <div className="group relative rounded-xl overflow-hidden shadow-soft bg-white dark:bg-white/5 cursor-pointer transition-all duration-300">
      <div className="aspect-[4/3] w-full overflow-hidden relative">
        <img
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          src={property.image}
        />

        {badgeText && (
          <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-nordic-dark dark:text-white">
            {badgeText}
          </div>
        )}

        <button
          onClick={(e) => onToggleFavorite(property.id, e)}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center transition-all ${isFavorite
              ? 'bg-mosque text-white'
              : 'bg-white/90 dark:bg-black/60 text-nordic-dark dark:text-white hover:bg-mosque hover:text-white'
            }`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <span className="material-icons text-xl">
            {isFavorite ? 'favorite' : 'favorite_border'}
          </span>
        </button>

        <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
      </div>

      <div className="p-6 relative">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-medium text-nordic-dark dark:text-white group-hover:text-mosque transition-colors">
              {property.title}
            </h3>
            <p className="text-nordic-muted dark:text-white/60 text-sm flex items-center gap-1 mt-1">
              <span className="material-icons text-sm">place</span> {property.location}
            </p>
          </div>
          <span className="text-xl font-semibold text-mosque dark:text-primary">
            {formattedPrice}
            {property.isForRent && <span className="text-sm font-normal text-nordic-muted dark:text-white/60">/mo</span>}
          </span>
        </div>

        <div className="flex items-center gap-6 mt-6 pt-6 border-t border-nordic-dark/5 dark:border-white/10">
          <div className="flex items-center gap-2 text-nordic-muted dark:text-white/60 text-sm">
            <span className="material-icons text-lg">king_bed</span> {property.beds} Beds
          </div>
          <div className="flex items-center gap-2 text-nordic-muted dark:text-white/60 text-sm">
            <span className="material-icons text-lg">bathtub</span> {property.baths} Baths
          </div>
          <div className="flex items-center gap-2 text-nordic-muted dark:text-white/60 text-sm">
            <span className="material-icons text-lg">square_foot</span> {formattedSize} m²
          </div>
        </div>
      </div>
    </div>
  );
}
