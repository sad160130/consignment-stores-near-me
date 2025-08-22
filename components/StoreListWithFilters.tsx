'use client';

import { useState, useMemo } from 'react';
import { ConsignmentStore } from '@/lib/data-processor';
import dynamic from 'next/dynamic';
import StoreSorting from './StoreSorting';
import StoreFilters, { FilterOptions } from './StoreFilters';

// Dynamically import the map to avoid SSR issues
const SimpleLeafletMap = dynamic(() => import('./SimpleLeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
      <p className="text-gray-600">Loading map...</p>
    </div>
  )
});

interface StoreListWithFiltersProps {
  stores: ConsignmentStore[];
  showMap?: boolean;
  stateName?: string;
  cityName?: string;
}

export default function StoreListWithFilters({ 
  stores, 
  showMap = true,
  stateName,
  cityName
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

      {/* Sorting */}
      <div className="mb-6">
        <StoreSorting currentSort={sortBy} onSortChange={setSortBy} />
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {sortedStores.length} of {stores.length} stores
          {filters.categories.length > 0 || filters.cities.length > 0 || filters.minReviews > 0 
            ? ' (filtered)' : ''}
        </p>
      </div>

      {/* Interactive Map */}
      {showMap && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Interactive Map</h3>
          <SimpleLeafletMap 
            stores={sortedStores} 
            selectedStore={selectedStore}
            onStoreSelect={handleStoreClick}
            stateName={stateName}
            cityName={cityName}
          />
        </div>
      )}

      {/* Store List */}
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
    </div>
  );
}