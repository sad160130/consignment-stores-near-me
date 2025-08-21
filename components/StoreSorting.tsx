'use client';

interface StoreSortingProps {
  currentSort: string;
  onSortChange: (sort: string) => void;
}

const sortOptions = [
  { value: 'reviews-desc', label: 'Most Reviewed' },
  { value: 'reviews-asc', label: 'Least Reviewed' },
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'city-asc', label: 'City (A-Z)' },
];

export default function StoreSorting({ currentSort, onSortChange }: StoreSortingProps) {
  return (
    <div className="flex items-center space-x-3">
      <label htmlFor="sort-select" className="text-sm font-medium text-gray-700">
        Sort by:
      </label>
      <select
        id="sort-select"
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value)}
        className="block w-full max-w-xs px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}