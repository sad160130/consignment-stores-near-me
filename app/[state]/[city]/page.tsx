import { processExcelData, getStateSlug, getCitySlug, getStoresByCity, getNearbyCities } from '@/lib/data-processor';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import SearchBar from '@/components/SearchBar';
import { Metadata } from 'next';

interface CityPageProps {
  params: Promise<{ state: string; city: string }>;
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const data = processExcelData();
  
  const stateName = data.statesList.find(state => 
    getStateSlug(state) === resolvedParams.state
  );

  if (!stateName) {
    return {
      title: 'Page Not Found',
      description: 'The requested page was not found.'
    };
  }

  const cities = data.citiesByState[stateName] || [];
  const cityName = cities.find(city => 
    getCitySlug(city) === resolvedParams.city
  );

  if (!cityName) {
    return {
      title: 'City Not Found',
      description: 'The requested city page was not found.'
    };
  }

  const stores = getStoresByCity(cityName, stateName, data);

  return {
    title: `Best Consignment Stores in ${cityName}, ${stateName} - Reviews & Directory`,
    description: `Find the best consignment stores in ${cityName}, ${stateName}. Browse ${stores.length} top-rated stores with reviews. Quality second-hand furniture, clothing, and vintage items.`,
    keywords: `consignment stores ${cityName} ${stateName}, thrift stores ${cityName}, second hand stores ${cityName}, resale shops ${cityName}`,
    openGraph: {
      title: `Best Consignment Stores in ${cityName}, ${stateName}`,
      description: `Discover ${stores.length} consignment stores in ${cityName}, ${stateName}`,
      type: 'website',
    }
  };
}

export async function generateStaticParams() {
  const data = processExcelData();
  const params: { state: string; city: string }[] = [];
  
  Object.entries(data.citiesByState).forEach(([stateName, cities]) => {
    const stateSlug = getStateSlug(stateName);
    cities.forEach((cityName) => {
      const citySlug = getCitySlug(cityName);
      params.push({
        state: stateSlug,
        city: citySlug
      });
    });
  });
  
  return params;
}

export default async function CityPage({ params }: CityPageProps) {
  const resolvedParams = await params;
  const data = processExcelData();
  
  const stateName = data.statesList.find(state => 
    getStateSlug(state) === resolvedParams.state
  );

  if (!stateName) {
    notFound();
  }

  const cities = data.citiesByState[stateName] || [];
  const cityName = cities.find(city => 
    getCitySlug(city) === resolvedParams.city
  );

  if (!cityName) {
    notFound();
  }

  const stores = getStoresByCity(cityName, stateName, data);
  const nearbyCities = getNearbyCities(cityName, stateName, data, 8);

  const breadcrumbItems = [
    { name: 'States', href: '/' },
    { name: stateName, href: `/${resolvedParams.state}` },
    { name: cityName }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbItems} />
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Best Consignment Stores in {cityName}, {stateName}
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Discover {stores.length} top-rated consignment stores in {cityName}. 
            Find quality second-hand items, furniture, clothing, and vintage treasures from local shops.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl">
            <SearchBar placeholder={`Search consignment stores in ${cityName}...`} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="card text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stores.length}</div>
                <div className="text-gray-600">Total Stores</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {stores.reduce((sum, store) => sum + store.numberOfReviews, 0).toLocaleString()}
                </div>
                <div className="text-gray-600">Total Reviews</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {stores.filter(store => store.numberOfReviews > 10).length}
                </div>
                <div className="text-gray-600">Highly Reviewed</div>
              </div>
            </div>

            {/* Store Listings */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Consignment Stores in {cityName} (Ranked by Reviews)
              </h2>
              
              {stores.length === 0 ? (
                <div className="card text-center py-12">
                  <p className="text-gray-600 mb-4">
                    No consignment stores found in {cityName}, {stateName}.
                  </p>
                  <Link href={`/${resolvedParams.state}`} className="text-blue-600 hover:text-blue-700">
                    Browse other cities in {stateName} →
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {stores.map((store, index) => (
                    <div key={index} className="store-card" id={store.businessName.toLowerCase().replace(/\s+/g, '-')}>
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
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
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
                        <h4 className="font-medium text-gray-900 mb-2">What they offer:</h4>
                        <div className="flex flex-wrap gap-1">
                          {store.pricing && <span className="feature-badge">💰 Affordable Prices</span>}
                          {store.wideSelection && <span className="feature-badge">📦 Wide Selection</span>}
                          {store.sellClothes && <span className="feature-badge">👔 Clothing</span>}
                          {store.sellFurniture && <span className="feature-badge">🪑 Furniture</span>}
                          {store.sellJewelry && <span className="feature-badge">💍 Jewelry</span>}
                          {store.sellAntiques && <span className="feature-badge">🏺 Antiques</span>}
                          {store.sellBooks && <span className="feature-badge">📚 Books</span>}
                          {store.sellGiftItems && <span className="feature-badge">🎁 Gift Items</span>}
                          {store.sellPremiumBrand && <span className="feature-badge">✨ Premium Brands</span>}
                          {store.sellMerchandise && <span className="feature-badge">🛍️ Merchandise</span>}
                          {store.cleanOrganized && <span className="feature-badge">✅ Clean & Organized</span>}
                          {store.friendlyEmployees && <span className="feature-badge">😊 Friendly Staff</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Nearby Cities */}
            {nearbyCities.length > 0 && (
              <section className="card mb-8">
                <h3 className="font-bold text-lg text-gray-900 mb-4">
                  Nearby Cities in {stateName}
                </h3>
                <div className="space-y-2">
                  {nearbyCities.map((city) => (
                    <Link
                      key={city}
                      href={`/${resolvedParams.state}/${getCitySlug(city)}`}
                      className="block text-blue-600 hover:text-blue-700 hover:underline text-sm"
                    >
                      Consignment Stores in {city}
                    </Link>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Link 
                    href={`/${resolvedParams.state}`}
                    className="text-sm text-gray-600 hover:text-blue-600"
                  >
                    View all cities in {stateName} →
                  </Link>
                </div>
              </section>
            )}

            {/* Quick Facts */}
            <section className="card">
              <h3 className="font-bold text-lg text-gray-900 mb-4">
                Quick Facts
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Total Stores:</span>
                  <span className="font-medium">{stores.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Reviews:</span>
                  <span className="font-medium">
                    {stores.reduce((sum, store) => sum + store.numberOfReviews, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Stores with Websites:</span>
                  <span className="font-medium">
                    {stores.filter(store => store.site).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Stores with Phones:</span>
                  <span className="font-medium">
                    {stores.filter(store => store.phone).length}
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}