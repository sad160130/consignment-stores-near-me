import { processExcelData, getCitySlug } from '@/lib/data-processor';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import SearchBar from '@/components/SearchBar';
import StoreListWithFilters from '@/components/StoreListWithFilters';
import SchemaMarkup from '@/components/SchemaMarkup';
import { generateStatePageSchema } from '@/lib/schema-markup';
import { generateCompleteStatePageStructuredData } from '@/lib/structured-data-enhanced';

interface StatePageContentProps {
  stateName: string;
  stateSlug: string;
}

export default function StatePageContent({ stateName, stateSlug }: StatePageContentProps) {
  const data = processExcelData();
  const stores = data.storesByState[stateName] || [];
  const cities = data.citiesByState[stateName] || [];
  
  // Sort cities by number of stores
  const citiesWithStores = cities
    .map(city => ({
      name: city,
      slug: getCitySlug(city),
      storeCount: data.storesByCity[`${city}, ${stateName}`]?.length || 0
    }))
    .sort((a, b) => b.storeCount - a.storeCount);

  // Get featured stores for this state (top stores by reviews with photos)
  const featuredStores = stores
    .filter(store => store.photo && store.numberOfReviews > 10)
    .sort((a, b) => b.numberOfReviews - a.numberOfReviews)
    .slice(0, 8);

  // Get top cities in this state
  const topCities = citiesWithStores.slice(0, 12);

  // Calculate total reviews for this state
  const totalReviews = stores.reduce((sum, store) => sum + store.numberOfReviews, 0);

  // Get store categories available in this state
  const storeCategories = {
    clothes: stores.filter(s => s.sellClothes).length,
    furniture: stores.filter(s => s.sellFurniture).length,
    jewelry: stores.filter(s => s.sellJewelry).length,
    antiques: stores.filter(s => s.sellAntiques).length,
    books: stores.filter(s => s.sellBooks).length,
    giftItems: stores.filter(s => s.sellGiftItems).length
  };

  const breadcrumbItems = [
    { name: 'States', href: '/' },
    { name: stateName }
  ];

  // Generate enhanced structured data with entities and relationships
  const enhancedStructuredData = generateCompleteStatePageStructuredData(
    stores,
    cities,
    stateName,
    stateSlug
  );
  
  // Also keep the original schema for backward compatibility
  const schemas = generateStatePageSchema(
    stateName,
    stateSlug,
    stores,
    cities,
    `https://${stateSlug}.consignmentstores.site`
  );

  return (
    <>
      <SchemaMarkup schemas={schemas} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(enhancedStructuredData, null, 2)
        }}
      />
      <div className="min-h-screen bg-gray-50">
      {/* Hero Section for State */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} />
          <div className="text-center mt-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {stateName} Consignment Stores Directory
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Your complete guide to {stores.length} consignment stores across {cities.length} cities in {stateName}. 
              Find the best second-hand furniture, vintage clothing, antiques, and unique treasures.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <SearchBar 
                placeholder={`Search ${stateName} consignment stores by city or name...`} 
                size="large"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* State-Specific Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="card text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{stores.length}</div>
            <div className="text-gray-600">Total Stores</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{cities.length}</div>
            <div className="text-gray-600">Cities</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {totalReviews.toLocaleString()}
            </div>
            <div className="text-gray-600">Customer Reviews</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {Math.round(totalReviews / stores.length) || 0}
            </div>
            <div className="text-gray-600">Avg Reviews/Store</div>
          </div>
        </div>

        {/* Featured Stores in State */}
        {featuredStores.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Top Rated Consignment Stores in {stateName}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredStores.map((store, index) => (
                <div key={index} className="store-card group">
                  {store.photo && (
                    <div className="relative mb-4 overflow-hidden rounded-lg">
                      <img 
                        src={store.photo} 
                        alt={store.businessName}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                        #{index + 1} in {stateName}
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-2">
                      {store.businessName}
                    </h3>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="text-yellow-500 mr-1">⭐</span>
                      <span className="font-medium">{store.numberOfReviews} reviews</span>
                    </div>
                    
                    <p className="text-sm text-gray-600">
                      📍 {store.city}, {store.state}
                    </p>
                    
                    {store.phone && (
                      <p className="text-sm text-blue-600">
                        📞 {store.phone}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap gap-1 pt-2">
                      <span className={store.sellClothes ? "feature-badge-active" : "feature-badge-inactive"}>
                        {store.sellClothes ? "✓" : "✗"} Clothes
                      </span>
                      <span className={store.sellFurniture ? "feature-badge-active" : "feature-badge-inactive"}>
                        {store.sellFurniture ? "✓" : "✗"} Furniture
                      </span>
                      <span className={store.sellJewelry ? "feature-badge-active" : "feature-badge-inactive"}>
                        {store.sellJewelry ? "✓" : "✗"} Jewelry
                      </span>
                    </div>
                    
                    {store.site && (
                      <div className="pt-3">
                        <a 
                          href={store.site} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Visit Website →
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Store Categories in State */}
        <section className="mb-12 bg-white rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            What You Can Find at {stateName} Consignment Stores
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">👔</div>
              <div className="font-semibold text-gray-900">{storeCategories.clothes}</div>
              <div className="text-sm text-gray-600">Clothing Stores</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">🪑</div>
              <div className="font-semibold text-gray-900">{storeCategories.furniture}</div>
              <div className="text-sm text-gray-600">Furniture Stores</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">💍</div>
              <div className="font-semibold text-gray-900">{storeCategories.jewelry}</div>
              <div className="text-sm text-gray-600">Jewelry Stores</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">🏺</div>
              <div className="font-semibold text-gray-900">{storeCategories.antiques}</div>
              <div className="text-sm text-gray-600">Antique Stores</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">📚</div>
              <div className="font-semibold text-gray-900">{storeCategories.books}</div>
              <div className="text-sm text-gray-600">Book Stores</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">🎁</div>
              <div className="font-semibold text-gray-900">{storeCategories.giftItems}</div>
              <div className="text-sm text-gray-600">Gift Stores</div>
            </div>
          </div>
        </section>

        {/* Interactive Store List with Map and Filters */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            All {stores.length} Consignment Stores in {stateName}
          </h2>
          <p className="text-gray-600 mb-6">
            Browse our complete directory of consignment stores in {stateName}. Use filters to find exactly what you&apos;re looking for.
          </p>
          
          <StoreListWithFilters 
            stores={stores} 
            showMap={true}
            stateName={stateName}
          />
        </section>

        {/* Top Cities in State */}
        {topCities.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Popular Cities for Consignment Shopping in {stateName}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {topCities.map((city) => (
                <Link
                  key={city.name}
                  href={`/${city.slug}/`}
                  className="card hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-white to-blue-50"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">{city.name}</div>
                      <div className="text-sm text-gray-600">
                        {city.storeCount} store{city.storeCount !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <div className="text-blue-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All Cities in State */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Complete List of Cities with Consignment Stores in {stateName}
          </h2>
          <p className="text-gray-600 mb-6">
            Explore all {cities.length} cities in {stateName} with consignment stores. Click any city to view local stores.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {citiesWithStores.map((city) => (
              <Link
                key={city.name}
                href={`/${city.slug}/`}
                className="card hover:shadow-lg transition-shadow duration-200 p-3"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{city.name}</div>
                    <div className="text-xs text-gray-600">
                      {city.storeCount} store{city.storeCount !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="text-blue-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Why Shop Consignment in State */}
        <section className="bg-blue-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Why Shop at {stateName} Consignment Stores?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">🏪</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Local Treasures</h3>
              <p className="text-sm text-gray-600">
                Discover unique items from {stores.length} local consignment stores across {stateName}
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">💚</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Support Local Business</h3>
              <p className="text-sm text-gray-600">
                Help {stateName} small businesses thrive while finding great deals
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">🔍</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Curated Selection</h3>
              <p className="text-sm text-gray-600">
                Each store offers hand-picked, quality items you won&apos;t find anywhere else
              </p>
            </div>
          </div>
        </section>

        {/* Related States */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Explore Neighboring States
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.statesList
              .filter(state => state !== stateName)
              .slice(0, 8)
              .map(state => {
                const stateUrl = `https://${state.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-')}.consignmentstores.site/`;
                return (
                  <Link
                    key={state}
                    href={stateUrl}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200 text-sm"
                  >
                    {state}
                  </Link>
                );
              })}
          </div>
        </section>
      </div>
    </div>
    </>
  );
}