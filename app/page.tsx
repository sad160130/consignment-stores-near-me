import { processExcelData } from '@/lib/data-processor';
import SearchBar from '@/components/SearchBar';
import Link from 'next/link';
import { MapPinIcon, BuildingStorefrontIcon, StarIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const data = processExcelData();
  const totalStores = data.stores.length;
  const totalStates = data.statesList.length;
  const totalCities = Object.keys(data.storesByCity).length;
  
  // Get featured states (top states by number of stores)
  const featuredStates = data.statesList
    .map(state => ({
      name: state,
      slug: state.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-'),
      storeCount: data.storesByState[state]?.length || 0
    }))
    .sort((a, b) => b.storeCount - a.storeCount)
    .slice(0, 12);

  // Get featured cities (top cities by number of stores)
  const featuredCities = Object.entries(data.storesByCity)
    .map(([cityKey, stores]) => {
      const [city, state] = cityKey.split(', ');
      return {
        city,
        state,
        citySlug: city.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-'),
        stateSlug: state.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-'),
        storeCount: stores.length
      };
    })
    .sort((a, b) => b.storeCount - a.storeCount)
    .slice(0, 16);

  return (
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

      {/* Browse by State Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Browse Consignment Stores by State
            </h2>
            <p className="text-lg text-gray-600">
              Find consignment stores in your state
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {featuredStates.map((state) => (
              <Link
                key={state.name}
                href={`/${state.slug}`}
                className="card text-center hover:shadow-lg transition-shadow duration-200 p-4"
              >
                <div className="font-semibold text-gray-900 mb-1">{state.name}</div>
                <div className="text-sm text-gray-600">
                  {state.storeCount} store{state.storeCount !== 1 ? 's' : ''}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by City Section */}
      <section className="py-16 bg-gray-50">
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
            {featuredCities.map((city) => (
              <Link
                key={`${city.city}-${city.state}`}
                href={`/${city.stateSlug}/${city.citySlug}`}
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
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
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
  );
}
