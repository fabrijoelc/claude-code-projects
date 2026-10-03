'use client';

import { useState } from 'react';
import PropertyCard from '../ui/PropertyCard';
import { Property } from '../../data/mockProperties';

interface NewInMarketProps {
  properties: Property[];
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

export default function NewInMarket({
  properties,
  favorites,
  onToggleFavorite,
}: NewInMarketProps) {
  const [marketFilter, setMarketFilter] = useState<'All' | 'Buy' | 'Rent'>('All');
  const [visibleCount, setVisibleCount] = useState(4);

  // Filter properties based on Buy/Rent tab select
  const filteredProperties = properties.filter((p) => {
    if (marketFilter === 'Buy') return !p.isForRent;
    if (marketFilter === 'Rent') return p.isForRent;
    return true;
  });

  const visibleProperties = filteredProperties.slice(0, visibleCount);

  return (
    <section>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-light text-nordic-dark dark:text-white">New in Market</h2>
          <p className="text-nordic-muted dark:text-white/60 mt-1 text-sm">Fresh opportunities added this week.</p>
        </div>

        {/* Buy / Rent Filter Selector */}
        <div className="hidden md:flex bg-white dark:bg-white/5 p-1 rounded-lg border border-nordic-dark/5 dark:border-white/5">
          {(['All', 'Buy', 'Rent'] as const).map((filter) => {
            const isActive = marketFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => {
                  setMarketFilter(filter);
                  setVisibleCount(4); // Reset pagination on filter change
                }}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${isActive
                    ? 'bg-nordic-dark text-white shadow-sm dark:bg-white dark:text-nordic-dark'
                    : 'text-nordic-muted hover:text-nordic-dark dark:text-white/60 dark:hover:text-white'
                  }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {visibleProperties.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isFavorite={favorites.includes(property.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>

          {/* Load More Button */}
          {filteredProperties.length > visibleCount && (
            <div className="mt-12 text-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + 4)}
                className="px-8 py-3 bg-white dark:bg-white/5 border border-nordic-dark/10 dark:border-white/10 hover:border-mosque hover:text-mosque dark:hover:border-primary dark:hover:text-primary text-nordic-dark dark:text-white font-medium rounded-lg transition-all hover:shadow-md cursor-pointer"
              >
                Load more properties
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-white/5 rounded-xl shadow-soft">
          <span className="material-icons text-4xl text-nordic-muted/40 mb-2">sentiment_dissatisfied</span>
          <p className="text-nordic-muted dark:text-white/60">No properties in this category match your criteria.</p>
        </div>
      )}
    </section>
  );
}
