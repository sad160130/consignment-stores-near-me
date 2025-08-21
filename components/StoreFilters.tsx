'use client';

import { useState } from 'react';

export interface FilterOptions {
  categories: string[];
  cities: string[];
  hasWebsite: boolean | null;
  hasPhone: boolean | null;
  minReviews: number;
}

interface StoreFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  availableCities: string[];
}

const categoryOptions = [
  { value: 'clothing', label: '👔 Clothing', field: 'sellClothes' },
  { value: 'furniture', label: '🪑 Furniture', field: 'sellFurniture' },
  { value: 'jewelry', label: '💍 Jewelry', field: 'sellJewelry' },
  { value: 'antiques', label: '🏺 Antiques', field: 'sellAntiques' },
  { value: 'books', label: '📚 Books', field: 'sellBooks' },
  { value: 'giftItems', label: '🎁 Gift Items', field: 'sellGiftItems' },
  { value: 'premiumBrand', label: '✨ Premium Brands', field: 'sellPremiumBrand' },
  { value: 'merchandise', label: '🛍️ Merchandise', field: 'sellMerchandise' },
];

export default function StoreFilters({ filters, onFilterChange, availableCities }: StoreFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    
    onFilterChange({
      ...filters,
      categories: newCategories,
    });
  };

  const handleCityChange = (city: string) => {
    const newCities = filters.cities.includes(city)
      ? filters.cities.filter(c => c !== city)
      : [...filters.cities, city];
    
    onFilterChange({
      ...filters,
      cities: newCities,
    });
  };

  const handleReviewsChange = (minReviews: number) => {
    onFilterChange({
      ...filters,
      minReviews,
    });
  };

  const clearFilters = () => {
    onFilterChange({
      categories: [],
      cities: [],
      hasWebsite: null,
      hasPhone: null,
      minReviews: 0,
    });
  };

  const activeFilterCount = 
    filters.categories.length + 
    filters.cities.length + 
    (filters.hasWebsite !== null ? 1 : 0) + 
    (filters.hasPhone !== null ? 1 : 0) + 
    (filters.minReviews > 0 ? 1 : 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
              {activeFilterCount} active
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Clear all
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-600 hover:text-gray-900"
          >
            <svg
              className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-6">
          {/* Categories */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Categories</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {categoryOptions.map((category) => (
                <label
                  key={category.value}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category.value)}
                    onChange={() => handleCategoryToggle(category.value)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{category.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Cities (if multiple available) */}
          {availableCities.length > 1 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Cities</h4>
              <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md p-2">
                <div className="space-y-2">
                  {availableCities.map((city) => (
                    <label
                      key={city}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={filters.cities.includes(city)}
                        onChange={() => handleCityChange(city)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{city}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Other Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Minimum Reviews */}
            <div>
              <label htmlFor="min-reviews" className="text-sm font-medium text-gray-700">
                Minimum Reviews
              </label>
              <select
                id="min-reviews"
                value={filters.minReviews}
                onChange={(e) => handleReviewsChange(Number(e.target.value))}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value={0}>Any</option>
                <option value={5}>5+ reviews</option>
                <option value={10}>10+ reviews</option>
                <option value={25}>25+ reviews</option>
                <option value={50}>50+ reviews</option>
              </select>
            </div>

            {/* Has Website */}
            <div>
              <label htmlFor="has-website" className="text-sm font-medium text-gray-700">
                Website
              </label>
              <select
                id="has-website"
                value={filters.hasWebsite === null ? 'any' : filters.hasWebsite.toString()}
                onChange={(e) => onFilterChange({
                  ...filters,
                  hasWebsite: e.target.value === 'any' ? null : e.target.value === 'true'
                })}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="any">Any</option>
                <option value="true">Has Website</option>
                <option value="false">No Website</option>
              </select>
            </div>

            {/* Has Phone */}
            <div>
              <label htmlFor="has-phone" className="text-sm font-medium text-gray-700">
                Phone
              </label>
              <select
                id="has-phone"
                value={filters.hasPhone === null ? 'any' : filters.hasPhone.toString()}
                onChange={(e) => onFilterChange({
                  ...filters,
                  hasPhone: e.target.value === 'any' ? null : e.target.value === 'true'
                })}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="any">Any</option>
                <option value="true">Has Phone</option>
                <option value="false">No Phone</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Quick Filter Pills (always visible) */}
      <div className="flex flex-wrap gap-2 mt-4">
        {filters.categories.map((category) => {
          const cat = categoryOptions.find(c => c.value === category);
          return cat ? (
            <span
              key={category}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
            >
              {cat.label}
              <button
                onClick={() => handleCategoryToggle(category)}
                className="ml-1 hover:text-blue-900"
              >
                ×
              </button>
            </span>
          ) : null;
        })}
        {filters.minReviews > 0 && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            {filters.minReviews}+ reviews
            <button
              onClick={() => handleReviewsChange(0)}
              className="ml-1 hover:text-green-900"
            >
              ×
            </button>
          </span>
        )}
        {filters.hasWebsite === true && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
            Has Website
            <button
              onClick={() => onFilterChange({ ...filters, hasWebsite: null })}
              className="ml-1 hover:text-purple-900"
            >
              ×
            </button>
          </span>
        )}
      </div>
    </div>
  );
}