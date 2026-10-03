'use client';

import FeaturedCard from '../ui/FeaturedCard';
import { Property } from '../../data/mockProperties';

interface FeaturedCollectionProps {
  featuredProperties: Property[];
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

export default function FeaturedCollection({
  featuredProperties,
  favorites,
  onToggleFavorite,
}: FeaturedCollectionProps) {
  return (
    <section className="mb-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-light text-nordic-dark dark:text-white">Featured Collections</h2>
          <p className="text-nordic-muted dark:text-white/60 mt-1 text-sm">Curated properties for the discerning eye.</p>
        </div>
        <a className="hidden sm:flex items-center gap-1 text-sm font-medium text-mosque dark:text-primary hover:opacity-70 transition-opacity" href="#">
          View all <span className="material-icons text-sm">arrow_forward</span>
        </a>
      </div>

      {featuredProperties.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {featuredProperties.map((property) => (
            <FeaturedCard
              key={property.id}
              property={property}
              isFavorite={favorites.includes(property.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-white/5 rounded-xl shadow-soft">
          <span className="material-icons text-4xl text-nordic-muted/40 mb-2">sentiment_dissatisfied</span>
          <p className="text-nordic-muted dark:text-white/60">No featured properties match your criteria.</p>
        </div>
      )}
    </section>
  );
}
