'use client';

import { useState, useMemo } from 'react';
import { ConsignmentStore } from '@/lib/data-processor';
import StoreMap from './StoreMap';
import StoreSorting from './StoreSorting';
import StoreFilters, { FilterOptions } from './StoreFilters';

interface StoreListWithFiltersProps {
  stores: ConsignmentStore[];
  showMap?: boolean;
  stateName?: string;
  cityName?: string;
}

export default function StoreListWithFilters({ 
  stores, 
  showMap = true
}: StoreListWithFiltersProps) {
  const [sortBy, setSortBy] = useState('reviews-desc');
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    cities: [],
    hasWebsite: null,
    hasPhone: null,
    minReviews: 0,
  });
  const [selectedStore, setSelectedStore] = useState<ConsignmentStore | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Get unique cities from stores
  const availableCities = useMemo(() => {
    const cities = new Set<string>();
    stores.forEach(store => cities.add(store.city));
    return Array.from(cities).sort();
  }, [stores]);

  // Filter stores
  const filteredStores = useMemo(() => {
    return stores.filter(store => {
      // Category filters
      if (filters.categories.length > 0) {
        const hasCategory = filters.categories.some(cat => {
          switch(cat) {
            case 'clothing': return store.sellClothes;
            case 'furniture': return store.sellFurniture;
            case 'jewelry': return store.sellJewelry;
            case 'antiques': return store.sellAntiques;
            case 'books': return store.sellBooks;
            case 'giftItems': return store.sellGiftItems;
            case 'premiumBrand': return store.sellPremiumBrand;
            case 'merchandise': return store.sellMerchandise;
            default: return false;
          }
        });
        if (!hasCategory) return false;
      }

      // City filter
      if (filters.cities.length > 0 && !filters.cities.includes(store.city)) {
        return false;
      }

      // Website filter
      if (filters.hasWebsite !== null) {
        if (filters.hasWebsite && !store.site) return false;
        if (!filters.hasWebsite && store.site) return false;
      }

      // Phone filter
      if (filters.hasPhone !== null) {
        if (filters.hasPhone && !store.phone) return false;
        if (!filters.hasPhone && store.phone) return false;
      }

      // Minimum reviews filter
      if (store.numberOfReviews < filters.minReviews) {
        return false;
      }

      return true;
    });
  }, [stores, filters]);

  // Sort stores
  const sortedStores = useMemo(() => {
    const sorted = [...filteredStores];
    
    switch (sortBy) {
      case 'reviews-desc':
        sorted.sort((a, b) => b.numberOfReviews - a.numberOfReviews);
        break;
      case 'reviews-asc':
        sorted.sort((a, b) => a.numberOfReviews - b.numberOfReviews);
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.businessName.localeCompare(b.businessName));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.businessName.localeCompare(a.businessName));
        break;
      case 'city-asc':
        sorted.sort((a, b) => a.city.localeCompare(b.city));
        break;
      default:
        break;
    }
    
    return sorted;
  }, [filteredStores, sortBy]);

  const handleStoreClick = (store: ConsignmentStore) => {
    setSelectedStore(store);
    // Scroll to store in list
    const storeElement = document.getElementById(store.businessName.toLowerCase().replace(/\s+/g, '-'));
    if (storeElement) {
      storeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div>
      {/* Filters */}
      <StoreFilters
        filters={filters}
        onFilterChange={setFilters}
        availableCities={availableCities}
      />

      {/* Sorting and View Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <StoreSorting currentSort={sortBy} onSortChange={setSortBy} />
        
        {showMap && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <span className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span>List</span>
              </span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'map'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <span className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <span>Map</span>
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {sortedStores.length} of {stores.length} stores
          {filters.categories.length > 0 || filters.cities.length > 0 || filters.minReviews > 0 
            ? ' (filtered)' : ''}
        </p>
      </div>

      {/* Map View */}
      {showMap && viewMode === 'map' && (
        <div className="mb-8">
          <StoreMap 
            stores={sortedStores} 
            selectedStore={selectedStore}
            onStoreSelect={handleStoreClick}
          />
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-6">
          {sortedStores.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-600 mb-4">
                No stores match your current filters.
              </p>
              <button
                onClick={() => setFilters({
                  categories: [],
                  cities: [],
                  hasWebsite: null,
                  hasPhone: null,
                  minReviews: 0,
                })}
                className="text-blue-600 hover:text-blue-700"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            sortedStores.map((store, index) => (
              <div 
                key={index} 
                id={store.businessName.toLowerCase().replace(/\s+/g, '-')}
                className={`store-card transition-all ${
                  selectedStore?.businessName === store.businessName 
                    ? 'ring-2 ring-blue-500 shadow-lg' 
                    : ''
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-lg">#{index + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-gray-900 mb-2">
                        {store.businessName}
                      </h3>
                      <p className="text-gray-600 mb-2">{store.address}</p>
                      <p className="text-sm text-gray-500 mb-3">
                        {store.city}, {store.state}
                      </p>
                      
                      {store.seoDescription && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {store.seoDescription}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm">
                        {store.phone && (
                          <a href={`tel:${store.phone}`} className="text-blue-600 hover:text-blue-700">
                            📞 {store.phone}
                          </a>
                        )}
                        {store.site && (
                          <a 
                            href={store.site} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            🌐 Visit Website
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  {store.photo && (
                    <img 
                      src={store.photo} 
                      alt={store.businessName}
                      className="w-24 h-24 object-cover rounded-lg ml-4 flex-shrink-0"
                    />
                  )}
                </div>
                
                <div className="mb-4">
                  <div className="inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    ⭐ {store.numberOfReviews} review{store.numberOfReviews !== 1 ? 's' : ''}
                  </div>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Store Features:</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className={store.pricing ? "feature-badge-active" : "feature-badge-inactive"}>
                      {store.pricing ? "✓" : "✗"} 💰 Affordable Prices
                    </span>
                    <span className={store.wideSelection ? "feature-badge-active" : "feature-badge-inactive"}>
                      {store.wideSelection ? "✓" : "✗"} 📦 Wide Selection
                    </span>
                    <span className={store.sellClothes ? "feature-badge-active" : "feature-badge-inactive"}>
                      {store.sellClothes ? "✓" : "✗"} 👔 Clothing
                    </span>
                    <span className={store.sellFurniture ? "feature-badge-active" : "feature-badge-inactive"}>
                      {store.sellFurniture ? "✓" : "✗"} 🪑 Furniture
                    </span>
                    <span className={store.sellJewelry ? "feature-badge-active" : "feature-badge-inactive"}>
                      {store.sellJewelry ? "✓" : "✗"} 💍 Jewelry
                    </span>
                    <span className={store.sellAntiques ? "feature-badge-active" : "feature-badge-inactive"}>
                      {store.sellAntiques ? "✓" : "✗"} 🏺 Antiques
                    </span>
                    <span className={store.sellBooks ? "feature-badge-active" : "feature-badge-inactive"}>
                      {store.sellBooks ? "✓" : "✗"} 📚 Books
                    </span>
                    <span className={store.sellGiftItems ? "feature-badge-active" : "feature-badge-inactive"}>
                      {store.sellGiftItems ? "✓" : "✗"} 🎁 Gift Items
                    </span>
                    <span className={store.sellPremiumBrand ? "feature-badge-active" : "feature-badge-inactive"}>
                      {store.sellPremiumBrand ? "✓" : "✗"} ✨ Premium Brands
                    </span>
                    <span className={store.sellMerchandise ? "feature-badge-active" : "feature-badge-inactive"}>
                      {store.sellMerchandise ? "✓" : "✗"} 🛍️ Merchandise
                    </span>
                    <span className={store.cleanOrganized ? "feature-badge-active" : "feature-badge-inactive"}>
                      {store.cleanOrganized ? "✓" : "✗"} ✅ Clean & Organized
                    </span>
                    <span className={store.friendlyEmployees ? "feature-badge-active" : "feature-badge-inactive"}>
                      {store.friendlyEmployees ? "✓" : "✗"} 😊 Friendly Staff
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}