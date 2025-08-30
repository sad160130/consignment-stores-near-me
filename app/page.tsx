import { processExcelData, getStateSlug, getCitySlug } from '@/lib/data-processor';
import SearchBar from '@/components/SearchBar';
import { MapPinIcon, BuildingStorefrontIcon, StarIcon } from '@heroicons/react/24/outline';
import { generateUrl } from '@/lib/url-utils';

export default function Home() {
  const data = processExcelData();
  const totalStores = data.stores.length;
  const totalStates = data.statesList.length;
  const totalCities = Object.keys(data.storesByCity).length;
  
  // Generate structured data for home page
  const homePageStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://www.consignmentstores.site/#website",
        "url": "https://www.consignmentstores.site/",
        "name": "Consignment Stores Near Me",
        "description": `Find the best consignment stores across ${totalStates} states and ${totalCities} cities. Browse ${totalStores}+ consignment shops, thrift stores, and second-hand stores.`,
        "publisher": {
          "@type": "Organization",
          "name": "Consignment Stores Directory",
          "url": "https://www.consignmentstores.site/"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://www.consignmentstores.site/search?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "CollectionPage",
        "@id": "https://www.consignmentstores.site/#webpage",
        "url": "https://www.consignmentstores.site/",
        "name": "Find Consignment Stores Near Me - Complete US Directory",
        "isPartOf": {
          "@id": "https://www.consignmentstores.site/#website"
        },
        "about": {
          "@type": "Thing",
          "name": "Consignment Stores",
          "description": "Directory of consignment stores across the United States"
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://www.consignmentstores.site/"
            }
          ]
        },
        "description": "Browse our comprehensive directory of consignment stores across all 50 states. Find quality second-hand furniture, clothing, vintage items, and more."
      },
      {
        "@type": "ItemList",
        "name": "US States with Consignment Stores",
        "numberOfItems": totalStates,
        "itemListElement": data.statesList.map((state, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": state,
          "url": `https://${state.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-')}.consignmentstores.site/`
        }))
      }
    ]
  };
  
  // Get all states sorted alphabetically for complete Browse by State section
  const allStates = data.statesList
    .map(state => ({
      name: state,
      slug: getStateSlug(state),
      storeCount: data.storesByState[state]?.length || 0,
      cities: data.citiesByState[state]?.length || 0
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
  
  // Get featured states (top states by number of stores)
  const featuredStates = [...allStates]
    .sort((a, b) => b.storeCount - a.storeCount)
    .slice(0, 12);

  // Get featured cities (top cities by number of stores)
  const featuredCities = Object.entries(data.storesByCity)
    .map(([cityKey, stores]) => {
      const [city, state] = cityKey.split(', ');
      return {
        city,
        state,
        citySlug: getCitySlug(city),
        stateSlug: getStateSlug(state),
        storeCount: stores.length
      };
    })
    .sort((a, b) => b.storeCount - a.storeCount)
    .slice(0, 16);

  // Get featured stores (top stores by reviews with photos)
  const featuredStores = data.stores
    .filter(store => store.photo && store.numberOfReviews > 20)
    .slice(0, 12);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homePageStructuredData, null, 2)
        }}
      />
      <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Find <span className="text-blue-600">Consignment Stores</span> Near Me
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover the best consignment stores, thrift shops, and second-hand stores in your area. 
            Browse our directory of {totalStores.toLocaleString()}+ stores across {totalStates} states and {totalCities} cities.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <SearchBar 
              placeholder="Search consignment stores by name, city, state, or zip code..." 
              size="large"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <BuildingStorefrontIcon className="w-8 h-8 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{totalStores.toLocaleString()}+</div>
              <div className="text-gray-600">Consignment Stores</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <MapPinIcon className="w-8 h-8 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{totalCities}</div>
              <div className="text-gray-600">Cities Covered</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <StarIcon className="w-8 h-8 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{totalStates}</div>
              <div className="text-gray-600">States</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stores Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Top Consignment Stores 🛍️
            </h2>
            <p className="text-lg text-gray-600">
              Discover the most popular consignment stores with the best reviews
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                      #{index + 1}
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
                  
                  {store.seoDescription && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {store.seoDescription}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-1 pt-2">
                    <span className={store.sellClothes ? "feature-badge-active" : "feature-badge-inactive"}>
                      {store.sellClothes ? "✓" : "✗"} 👔
                    </span>
                    <span className={store.sellFurniture ? "feature-badge-active" : "feature-badge-inactive"}>
                      {store.sellFurniture ? "✓" : "✗"} 🪑
                    </span>
                    <span className={store.sellJewelry ? "feature-badge-active" : "feature-badge-inactive"}>
                      {store.sellJewelry ? "✓" : "✗"} 💍
                    </span>
                    <span className={store.sellAntiques ? "feature-badge-active" : "feature-badge-inactive"}>
                      {store.sellAntiques ? "✓" : "✗"} 🏺
                    </span>
                    <span className={store.sellBooks ? "feature-badge-active" : "feature-badge-inactive"}>
                      {store.sellBooks ? "✓" : "✗"} 📚
                    </span>
                    <span className={store.sellGiftItems ? "feature-badge-active" : "feature-badge-inactive"}>
                      {store.sellGiftItems ? "✓" : "✗"} 🎁
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
          
          {featuredStores.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading featured stores...</p>
            </div>
          )}
        </div>
      </section>

      {/* Complete Browse by State Section - Semantic Content Network */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Browse All {allStates.length} States - Complete Directory
            </h2>
            <p className="text-lg text-gray-600 mb-2">
              Explore consignment stores across the United States
            </p>
            <p className="text-sm text-gray-500">
              Each state has its own dedicated subdomain for better local search results
            </p>
          </div>
          
          {/* All States Grid - Complete Semantic Network */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-12">
            {allStates.map((state) => {
              const stateUrl = generateUrl(state.slug);
              return (
                <a
                  key={state.name}
                  href={stateUrl}
                  className="card hover:shadow-lg transition-all duration-200 p-4 border-2 border-transparent hover:border-blue-500"
                >
                  <div className="font-bold text-gray-900 mb-2">{state.name}</div>
                  <div className="text-sm text-gray-600 mb-1">
                    {state.storeCount} store{state.storeCount !== 1 ? 's' : ''}
                  </div>
                  <div className="text-xs text-gray-500">
                    {state.cities} cit{state.cities !== 1 ? 'ies' : 'y'}
                  </div>
                  <div className="text-xs text-blue-600 font-medium mt-2">
                    Visit {state.slug}.consignmentstores.site →
                  </div>
                </a>
              );
            })}
          </div>
          
          {/* Featured States Highlight */}
          <div className="border-t pt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Top States by Store Count
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {featuredStates.map((state, index) => {
                const stateUrl = generateUrl(state.slug);
                return (
                  <a
                    key={state.name}
                    href={stateUrl}
                    className="relative card text-center hover:shadow-xl transition-shadow duration-200 p-4 bg-gradient-to-br from-white to-blue-50"
                  >
                    <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      #{index + 1}
                    </div>
                    <div className="font-bold text-gray-900 mb-1">{state.name}</div>
                    <div className="text-sm text-gray-600">
                      {state.storeCount} stores
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Browse by City Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popular Cities for Consignment Shopping
            </h2>
            <p className="text-lg text-gray-600">
              Discover consignment stores in major cities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCities.map((city) => {
              const cityUrl = generateUrl(city.stateSlug, city.citySlug);
              return (
                <a
                  key={`${city.city}-${city.state}`}
                  href={cityUrl}
                  className="card hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="font-semibold text-gray-900 mb-2">
                    {city.city}, {city.state}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {city.storeCount} consignment store{city.storeCount !== 1 ? 's' : ''}
                  </div>
                  <div className="text-xs text-blue-600 font-medium">
                    View Stores →
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Consignment Stores?
            </h2>
            <p className="text-lg text-gray-600">
              Discover quality items at great prices while supporting sustainable shopping
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Great Prices</h3>
              <p className="text-gray-600">
                Find quality items at fraction of retail prices. Perfect for budget-conscious shoppers.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Eco-Friendly</h3>
              <p className="text-gray-600">
                Support sustainable shopping by giving pre-owned items a second life.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Unique Finds</h3>
              <p className="text-gray-600">
                Discover one-of-a-kind vintage items, designer pieces, and rare collectibles.
              </p>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
