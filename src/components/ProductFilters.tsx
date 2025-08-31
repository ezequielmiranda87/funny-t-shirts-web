import { Badge } from '@/components/ui/badge';
import { CategoryInfo } from '@/types/api';

interface ProductFiltersProps {
  categories: CategoryInfo[];
  currentCategory?: string;
  currentSort?: string;
  onSortChange: (sort: string) => void;
  onCategoryChange: (category: string | undefined) => void;
}

export default function ProductFilters({ 
  categories, 
  currentCategory, 
  currentSort = 'newest',
  onSortChange,
  onCategoryChange
}: ProductFiltersProps) {
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'name', label: 'Name A-Z' }
  ];

  return (
    <div className="space-y-6 mb-6">
      {/* Sort Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <label className="text-sm font-medium text-foreground">
          Sort by:
        </label>
        <select 
          value={currentSort} 
          onChange={(e) => onSortChange(e.target.value)}
          className="px-3 py-1 border border-border rounded-md text-sm bg-background"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category Filters */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">
          Filter by category:
        </label>
        <div className="flex flex-wrap gap-2">
          {/* All Categories */}
          <button
            onClick={() => onCategoryChange(undefined)}
            className={`px-3 py-1 rounded-full text-sm border transition-colors ${
              !currentCategory
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-foreground border-border hover:bg-muted'
            }`}
          >
            All Categories
          </button>
          
          {/* Individual Categories */}
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => onCategoryChange(category.name.toLowerCase())}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                currentCategory === category.name.toLowerCase()
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-foreground border-border hover:bg-muted'
              }`}
            >
              {category.name}
              <Badge 
                variant="secondary" 
                className="ml-1 text-xs"
              >
                {category.count}
              </Badge>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}