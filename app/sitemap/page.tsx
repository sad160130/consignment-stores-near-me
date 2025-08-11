import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { processExcelData, getStateSlug, getCitySlug } from '@/lib/data-processor';

export const metadata: Metadata = {
  title: 'Sitemap - Consignment Stores Near Me Directory',
  description: 'Complete sitemap of all consignment store listings organized by state and city across the United States.',
  keywords: 'sitemap, consignment stores directory, all states, all cities, store listings',
};

export default function SitemapPage() {
  const data = processExcelData();
  
  const breadcrumbItems = [
    { name: 'Sitemap' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Complete Directory Sitemap
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Browse all {data.stores.length.toLocaleString()} consignment stores across {data.statesList.length} states 
            and {Object.keys(data.storesByCity).length} cities in the United States.
          </p>

          {/* Main Pages */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Main Pages</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/" className="text-blue-600 hover:text-blue-700 hover:underline">
                🏠 Homepage
              </Link>
              <Link href="/about/" className="text-blue-600 hover:text-blue-700 hover:underline">
                ℹ️ About Us
              </Link>
              <Link href="/sitemap/" className="text-blue-600 hover:text-blue-700 hover:underline">
                🗺️ HTML Sitemap
              </Link>
            </div>
          </section>

          {/* States and Cities */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              All States and Cities ({data.statesList.length} States)
            </h2>
            
            <div className="space-y-8">
              {data.statesList.sort().map((stateName) => {
                const stateSlug = getStateSlug(stateName);
                const cities = data.citiesByState[stateName] || [];
                const storeCount = data.storesByState[stateName]?.length || 0;
                
                return (
                  <div key={stateName} className="border-b border-gray-200 pb-6">
                    <div className="flex items-center justify-between mb-4">
                      <Link 
                        href={`/${stateSlug}/`}
                        className="text-xl font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        📍 {stateName} ({storeCount} stores)
                      </Link>
                      <span className="text-sm text-gray-500">
                        {cities.length} cities
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 ml-6">
                      {cities.sort().map((cityName) => {
                        const citySlug = getCitySlug(cityName);
                        const cityStoreCount = data.storesByCity[`${cityName}, ${stateName}`]?.length || 0;
                        
                        return (
                          <Link
                            key={`${cityName}-${stateName}`}
                            href={`/${stateSlug}/${citySlug}/`}
                            className="text-blue-600 hover:text-blue-700 hover:underline text-sm flex justify-between"
                          >
                            <span>{cityName}</span>
                            <span className="text-gray-500">({cityStoreCount})</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Statistics */}
          <section className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Directory Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {data.stores.length.toLocaleString()}
                </div>
                <div className="text-gray-600">Total Stores</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {data.statesList.length}
                </div>
                <div className="text-gray-600">States</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {Object.keys(data.storesByCity).length}
                </div>
                <div className="text-gray-600">Cities</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {data.stores.reduce((sum, store) => sum + store.numberOfReviews, 0).toLocaleString()}
                </div>
                <div className="text-gray-600">Total Reviews</div>
              </div>
            </div>
          </section>

          {/* Footer Links */}
          <section className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-600 mb-4">
              Need the machine-readable version? Visit our <Link href="/sitemap.xml" className="text-blue-600 hover:text-blue-700 hover:underline">XML Sitemap</Link>
            </p>
            <p className="text-sm text-gray-500">
              This sitemap contains all publicly available pages in our consignment store directory.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}