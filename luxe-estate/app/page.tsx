'use client';

import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedCollection from './components/FeaturedCollection';
import NewInMarket from './components/NewInMarket';
import { mockProperties, Property } from './data/mockProperties';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [favorites, setFavorites] = useState<string[]>([]);

  // Toggle favorite property ID
  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card navigation trigger
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Common filter logic
  const matchesSearch = (property: Property) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      property.title.toLowerCase().includes(query) ||
      property.location.toLowerCase().includes(query) ||
      property.type.toLowerCase().includes(query)
    );
  };

  const matchesType = (property: Property) => {
    if (selectedType === 'All') return true;
    return property.type === selectedType;
  };

  // Filter Featured Properties
  const featuredProperties = mockProperties.filter(
    (p) => p.isFeatured && matchesSearch(p) && matchesType(p)
  );

  // Filter base properties for New in Market (non-featured properties matching search and type)
  const baseNewInMarketProperties = mockProperties.filter(
    (p) => !p.isFeatured && matchesSearch(p) && matchesType(p)
  );

  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 flex-grow">
        <Hero
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
        />

        <FeaturedCollection
          featuredProperties={featuredProperties}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />

        <NewInMarket
          properties={baseNewInMarketProperties}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />
      </main>
    </>
  );
}

