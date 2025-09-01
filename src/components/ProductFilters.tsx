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
    <section className="space-y-6 mb-6" role="search" aria-labelledby="filters-heading">
      <h2 id="filters-heading" className="sr-only">Filter and sort products</h2>
      {/* Sort Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <label htmlFor="sort-select" className="text-sm font-medium text-foreground">
          Sort by:
        </label>
        <select 
          id="sort-select"
          value={currentSort} 
          onChange={(e) => onSortChange(e.target.value)}
          className="px-3 py-1 border border-border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-describedby="sort-help"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div id="sort-help" className="sr-only">
          Sort products by different criteria such as newest, price, or rating
        </div>
      </div>

      {/* Category Filters */}
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-foreground">
          Filter by category:
        </legend>
        <div className="flex flex-wrap gap-2" role="group" aria-labelledby="category-filter-legend">
          {/* All Categories */}
          <button
            onClick={() => onCategoryChange(undefined)}
            className={`px-3 py-1 rounded-full text-sm border transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
              !currentCategory
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-foreground border-border hover:bg-muted'
            }`}
            aria-pressed={!currentCategory}
            aria-describedby="all-categories-help"
          >
            All Categories
          </button>
          <div id="all-categories-help" className="sr-only">
            Show products from all categories
          </div>
          
          {/* Individual Categories */}
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => onCategoryChange(category.name.toLowerCase())}
              className={`px-3 py-1 rounded-full text-sm border transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                currentCategory === category.name.toLowerCase()
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-foreground border-border hover:bg-muted'
              }`}
              aria-pressed={currentCategory === category.name.toLowerCase()}
              aria-label={`Filter by ${category.name} category, ${category.count} products available`}
            >
              {category.name}
              <Badge 
                variant="secondary" 
                className="ml-1 text-xs"
                aria-hidden="true"
              >
                {category.count}
              </Badge>
            </button>
          ))}
        </div>
      </fieldset>
    </section>
  );
}