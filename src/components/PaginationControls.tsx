import { Button } from '@/components/ui/button';
import { PaginationMeta } from '@/types/api';

interface PaginationControlsProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export default function PaginationControls({ 
  pagination, 
  onPageChange, 
  isLoading = false 
}: PaginationControlsProps) {
  const { page, totalPages, hasNext, hasPrev } = pagination;

  // Generate page numbers to show
  const getVisiblePages = () => {
    const delta = 2; // Show 2 pages on each side of current page
    const pages: (number | string)[] = [];
    const rangeStart = Math.max(1, page - delta);
    const rangeEnd = Math.min(totalPages, page + delta);

    // Always show first page
    if (rangeStart > 1) {
      pages.push(1);
      if (rangeStart > 2) {
        pages.push('...');
      }
    }

    // Show pages around current page
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    // Always show last page
    if (rangeEnd < totalPages) {
      if (rangeEnd < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPrev || isLoading}
      >
        Previous
      </Button>

      {/* Page Numbers */}
      <div className="flex space-x-1">
        {getVisiblePages().map((pageNum, index) => (
          <div key={index}>
            {pageNum === '...' ? (
              <span className="px-3 py-2 text-sm text-muted-foreground">
                ...
              </span>
            ) : (
              <Button
                variant={page === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(pageNum as number)}
                disabled={isLoading}
              >
                {pageNum}
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNext || isLoading}
      >
        Next
      </Button>

      {/* Page Info */}
      <div className="ml-4 text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </div>
    </div>
  );
}