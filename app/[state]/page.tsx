import { processExcelData, getStateSlug } from '@/lib/data-processor';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import SearchBar from '@/components/SearchBar';
import { Metadata } from 'next';

interface StatePageProps {
  params: Promise<{ state: string }>;
}

export async function generateMetadata({ params }: StatePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const data = processExcelData();
  
  const stateName = data.statesList.find(state => 
    getStateSlug(state) === resolvedParams.state
  );

  if (!stateName) {
    return {
      title: 'State Not Found',
      description: 'The requested state page was not found.'
    };
  }

  const storeCount = data.storesByState[stateName]?.length || 0;
  const cities = data.citiesByState[stateName] || [];

  const stateSlug = getStateSlug(stateName);
  const canonicalUrl = `https://www.consignmentstores.site/${stateSlug}/`;
  
  return {
    title: `Best Consignment Stores in ${stateName} - Directory & Reviews`,
    description: `Find the best consignment stores in ${stateName}. Browse ${storeCount} stores across ${cities.length} cities. Quality second-hand furniture, clothing, and vintage items.`,
    keywords: `consignment stores ${stateName}, thrift stores ${stateName}, second hand stores ${stateName}, resale shops ${stateName}`,
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      title: `Best Consignment Stores in ${stateName}`,
      description: `Discover ${storeCount} consignment stores across ${stateName}`,
      type: 'website',
      url: canonicalUrl
    }
  };
}

export async function generateStaticParams() {
  const data = processExcelData();
  
  return data.statesList.map(state => ({
    state: getStateSlug(state)
  }));
}

export default async function StatePage({ params }: StatePageProps) {
  const resolvedParams = await params;
  const data = processExcelData();
  
  const stateName = data.statesList.find(state => 
    getStateSlug(state) === resolvedParams.state
  );

  if (!stateName) {
    notFound();
  }

  const stores = data.storesByState[stateName] || [];
  const cities = data.citiesByState[stateName] || [];
  
  // Sort cities by number of stores
  const citiesWithStores = cities
    .map(city => ({
      name: city,
      slug: city.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-'),
      storeCount: data.storesByCity[`${city}, ${stateName}`]?.length || 0
    }))
    .sort((a, b) => b.storeCount - a.storeCount);

  const breadcrumbItems = [
    { name: 'States', href: '/' },
    { name: stateName }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbItems} />
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Best Consignment Stores in {stateName}
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Discover {stores.length} consignment stores across {cities.length} cities in {stateName}. 
            Find quality second-hand items, furniture, clothing, and vintage treasures.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl">
            <SearchBar placeholder={`Search consignment stores in ${stateName}...`} />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
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
              {stores.reduce((sum, store) => sum + store.numberOfReviews, 0).toLocaleString()}
            </div>
            <div className="text-gray-600">Total Reviews</div>
          </div>
        </div>

        {/* All Cities in State */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            All Cities with Consignment Stores in {stateName}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {citiesWithStores.map((city) => (
              <Link
                key={city.name}
                href={`/${resolvedParams.state}/${city.slug}/`}
                className="card hover:shadow-lg transition-shadow duration-200"
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

        {/* Featured Stores */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Top-Rated Consignment Stores in {stateName}
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {stores.slice(0, 10).map((store, index) => (
              <div key={index} className="store-card">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                      {store.businessName}
                    </h3>
                    <p className="text-gray-600 mb-2">{store.address}</p>
                    <p className="text-sm text-gray-500 mb-2">
                      {store.city}, {store.state}
                    </p>
                    {store.seoDescription && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {store.seoDescription}
                      </p>
                    )}
                    {store.phone && (
                      <p className="text-sm text-blue-600">
                        <a href={`tel:${store.phone}`}>{store.phone}</a>
                      </p>
                    )}
                  </div>
                  {store.photo && (
                    <img 
                      src={store.photo} 
                      alt={store.businessName}
                      className="w-20 h-20 object-cover rounded-lg ml-4"
                    />
                  )}
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm text-gray-600">
                    {store.numberOfReviews} review{store.numberOfReviews !== 1 ? 's' : ''}
                  </div>
                  {store.site && (
                    <a 
                      href={store.site} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Visit Website →
                    </a>
                  )}
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  <span className={store.pricing ? "feature-badge-active" : "feature-badge-inactive"}>
                    {store.pricing ? "✓" : "✗"} 💰 Affordable
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
                    {store.sellPremiumBrand ? "✓" : "✗"} ✨ Premium
                  </span>
                  <span className={store.sellMerchandise ? "feature-badge-active" : "feature-badge-inactive"}>
                    {store.sellMerchandise ? "✓" : "✗"} 🛍️ Merchandise
                  </span>
                  <span className={store.cleanOrganized ? "feature-badge-active" : "feature-badge-inactive"}>
                    {store.cleanOrganized ? "✓" : "✗"} ✅ Clean
                  </span>
                  <span className={store.friendlyEmployees ? "feature-badge-active" : "feature-badge-inactive"}>
                    {store.friendlyEmployees ? "✓" : "✗"} 😊 Friendly
                  </span>
                </div>
              </div>
            ))}
          </div>

          {stores.length > 10 && (
            <div className="text-center mt-8">
              <p className="text-gray-600">
                Showing top 10 stores. Browse by city to see all stores in {stateName}.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}