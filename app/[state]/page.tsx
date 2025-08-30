import { processExcelData, getStateSlug } from '@/lib/data-processor';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import SearchBar from '@/components/SearchBar';
import StoreListWithFilters from '@/components/StoreListWithFilters';
import SchemaMarkup from '@/components/SchemaMarkup';
import { generateStatePageSchema } from '@/lib/schema-markup';
import { generateCompleteStatePageStructuredData } from '@/lib/structured-data-enhanced';
import { generateUrl } from '@/lib/url-utils';
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
  const canonicalUrl = generateUrl(stateSlug);
  
  return {
    title: `Consignment Stores in ${stateName}`,
    description: `Discover ${storeCount} consignment stores in ${stateName} across ${cities.length} cities. Find quality second-hand furniture, clothing, vintage items and more at the best resale shops near you.`,
    keywords: `consignment stores ${stateName}, thrift stores ${stateName}, second hand stores ${stateName}, resale shops ${stateName}`,
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      title: `Consignment Stores in ${stateName}`,
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

  // Generate enhanced structured data with entities and relationships
  const enhancedStructuredData = generateCompleteStatePageStructuredData(
    stores,
    cities,
    stateName,
    resolvedParams.state
  );
  
  // Also keep the original schema for backward compatibility
  const schemas = generateStatePageSchema(
    stateName,
    resolvedParams.state,
    stores,
    cities,
    `https://${resolvedParams.state}.consignmentstores.site`
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

        {/* Interactive Store List with Map and Filters */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Explore Consignment Stores in {stateName}
          </h2>
          
          <StoreListWithFilters 
            stores={stores} 
            showMap={true}
            stateName={stateName}
          />
        </section>

        {/* All Cities in State */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            All Cities with Consignment Stores in {stateName}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {citiesWithStores.map((city) => (
              <Link
                key={city.name}
                href={`/${city.slug}/`}
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
      </div>
    </div>
    </>
  );
}