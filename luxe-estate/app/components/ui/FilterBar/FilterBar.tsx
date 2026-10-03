'use client';

interface FilterBarProps {
  selectedType: string;
  onSelectType: (type: string) => void;
}

const CATEGORIES = ['All', 'House', 'Apartment', 'Villa', 'Penthouse'];

export default function FilterBar({ selectedType, onSelectType }: FilterBarProps) {
  return (
    <div className="flex items-center justify-center gap-3 overflow-x-auto hide-scroll py-2 px-4 -mx-4">
      {CATEGORIES.map((category) => {
        const isActive = selectedType === category;
        return (
          <button
            key={category}
            onClick={() => onSelectType(category)}
            className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
              isActive
                ? 'bg-nordic-dark text-white shadow-lg shadow-nordic-dark/10 dark:bg-white dark:text-nordic-dark hover:-translate-y-0.5'
                : 'bg-white dark:bg-white/5 border border-nordic-dark/5 text-nordic-muted hover:text-nordic-dark hover:border-mosque/50 dark:text-white/60 dark:hover:text-white dark:border-white/5 transition-all hover:bg-mosque/5'
            }`}
          >
            {category}
          </button>
        );
      })}
      
      <div className="w-px h-6 bg-nordic-dark/10 dark:bg-white/10 mx-2 flex-shrink-0"></div>
      
      <button className="whitespace-nowrap flex items-center gap-1 px-4 py-2 rounded-full text-nordic-dark dark:text-white font-medium text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer">
        <span className="material-icons text-base">tune</span> Filters
      </button>
    </div>
  );
}
