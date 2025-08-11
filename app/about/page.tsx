import { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import { processExcelData } from '@/lib/data-processor';

export const metadata: Metadata = {
  title: 'About Consignment Stores Near Me - Your Guide to Second-Hand Shopping',
  description: 'Learn about our comprehensive directory of consignment stores across the United States. Find the best thrift shops, second-hand stores, and resale shops in your area.',
  keywords: 'about consignment stores, second hand shopping, thrift store directory, resale shop guide, vintage shopping, sustainable shopping',
  alternates: {
    canonical: 'https://www.consignmentstores.site/about/'
  },
  openGraph: {
    title: 'About Consignment Stores Near Me',
    description: 'Your comprehensive guide to finding the best consignment stores nationwide',
    type: 'website',
    url: 'https://www.consignmentstores.site/about/'
  }
};

export default function AboutPage() {
  const data = processExcelData();
  const totalStores = data.stores.length;
  const totalStates = data.statesList.length;
  const totalCities = Object.keys(data.storesByCity).length;

  const breadcrumbItems = [
    { name: 'About Us' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            About Consignment Stores Near Me
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Welcome to the most comprehensive directory of consignment stores, thrift shops, and 
              second-hand retailers across the United States. Our mission is to help you discover 
              amazing deals on quality pre-owned items while supporting sustainable shopping practices.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Our Story</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Consignment Stores Near Me was founded with a simple vision: to make it easier for 
              people to find and support local consignment stores in their communities. We recognized 
              that while consignment shopping has grown tremendously in popularity, there wasn&apos;t a 
              centralized resource where people could easily discover stores in their area.
            </p>

            <p className="text-gray-700 mb-6 leading-relaxed">
              Starting with extensive research and partnerships with consignment store owners across 
              the country, we&apos;ve built a comprehensive database that now includes over {totalStores.toLocaleString()} 
              stores across {totalStates} states and {totalCities} cities nationwide.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">What We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-900 mb-3">Comprehensive Directory</h3>
                <p className="text-gray-700">
                  Browse our extensive database of consignment stores, complete with contact 
                  information, location details, and what types of items each store specializes in.
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-900 mb-3">Location-Based Search</h3>
                <p className="text-gray-700">
                  Find stores by state, city, or use our search function to locate consignment 
                  stores near your specific location.
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-900 mb-3">Store Details</h3>
                <p className="text-gray-700">
                  Get detailed information about each store including their specialties, 
                  pricing approach, and what types of items you can expect to find.
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-900 mb-3">Reviews & Ratings</h3>
                <p className="text-gray-700">
                  Our listings include review counts and ratings to help you choose the 
                  best-reviewed stores in your area.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Why Consignment Shopping?</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Consignment shopping offers numerous benefits that extend far beyond just saving money:
            </p>
            
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Environmental Impact:</strong> Extend the life of quality items and reduce waste</li>
              <li><strong>Unique Finds:</strong> Discover vintage, designer, and one-of-a-kind pieces</li>
              <li><strong>Quality Items:</strong> Consignment stores typically curate high-quality merchandise</li>
              <li><strong>Affordable Prices:</strong> Get name-brand and designer items at fraction of retail cost</li>
              <li><strong>Support Local Business:</strong> Most consignment stores are locally-owned small businesses</li>
              <li><strong>Community Connection:</strong> Consignment stores often serve as community hubs</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Our Commitment</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              We&apos;re committed to maintaining the most accurate and up-to-date directory of consignment 
              stores nationwide. Our team regularly updates store information, and we welcome feedback 
              from both store owners and customers to ensure our listings remain current and helpful.
            </p>

            <p className="text-gray-700 mb-6 leading-relaxed">
              Whether you&apos;re a seasoned consignment shopper or new to the world of second-hand finds, 
              our directory is designed to help you discover amazing stores and deals in your area. 
              From furniture and home decor to clothing and accessories, consignment stores offer 
              something for everyone.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Get Started</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Ready to start exploring? Use our search function on the homepage to find consignment 
              stores by name, city, state, or zip code. You can also browse by state or city using 
              our navigation menu to discover stores in specific areas.
            </p>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg mt-8">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Join Our Community</h3>
              <p className="text-gray-700 mb-4">
                Consignment Stores Near Me is more than just a directory – we&apos;re building a community 
                of sustainable shoppers who appreciate quality, value, and unique finds.
              </p>
              <p className="text-gray-700">
                Start your consignment shopping journey today and discover the treasures waiting 
                in stores near you!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}