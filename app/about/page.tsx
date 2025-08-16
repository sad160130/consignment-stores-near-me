import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { processExcelData } from '@/lib/data-processor';

export const metadata: Metadata = {
  title: 'About Us - Connecting Communities Through Consignment',
  description: 'Learn about our mission to make second-hand shopping accessible, trustworthy, and exciting.',
  keywords: 'about consignment stores, sustainable shopping, second hand stores',
  alternates: {
    canonical: 'https://www.consignmentstores.site/about/'
  }
};

export default function AboutPage() {
  const data = processExcelData();
  const totalStores = data.stores.length;
  const totalStates = data.statesList.length;
  const totalCities = Object.keys(data.storesByCity).length;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Connecting Communities, One Treasure at a Time.
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            We&apos;re building the most trusted and comprehensive guide to consignment stores, 
            helping you discover local gems and embrace sustainable style.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Our Story: More Than a Directory
            </h2>
            <p className="text-gray-500 mt-2">Why we started, and what drives us every day.</p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <div className="relative h-[400px] w-full rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1628103134375-4c07c7324c4e?q=80&w=2940&auto=format&fit=crop"
                  alt="Inside view of a stylish consignment store with clothing racks"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            
            <div className="md:w-1/2 text-gray-700 space-y-4 text-lg">
              <p>
                Our journey began from a simple, personal frustration: we loved the thrill of 
                consignment shopping but found it incredibly difficult to find reliable, up-to-date 
                information about local stores.
              </p>
              <p>
                Today, our directory includes over {totalStores.toLocaleString()} stores across {totalStates} states 
                and {totalCities} cities. Our mission is to make second-hand the first choice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Our Team
            </h2>
            <p className="text-gray-500 mt-2">Meet the founder who started it all.</p>
          </div>
          
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg flex flex-col sm:flex-row items-center gap-8">
            <div className="w-32 h-32 sm:w-48 sm:h-48 flex-shrink-0">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-4xl sm:text-6xl font-bold">
                RK
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Rohan Kadam</h3>
              <p className="text-blue-600 font-semibold mb-3">Founder & Chief Thrifter</p>
              <p className="text-gray-600 leading-relaxed">
                &quot;As a lifelong consignment shopper, I wanted to share the joy of discovering 
                unique, pre-loved items with a wider audience. This site is the result of that 
                passion.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Core Values</h2>
            <p className="text-gray-500 mt-2">The principles that guide every decision we make.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-4xl mb-4 text-center">🤝</div>
              <h3 className="text-xl font-bold mb-3 text-center text-gray-900">Community First</h3>
              <p className="text-gray-600 text-center">
                Supporting local consignment stores and the community of shoppers.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-4xl mb-4 text-center">✅</div>
              <h3 className="text-xl font-bold mb-3 text-center text-gray-900">Unwavering Trust</h3>
              <p className="text-gray-600 text-center">
                Accuracy and reliability are the cornerstones of our platform.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-4xl mb-4 text-center">♻️</div>
              <h3 className="text-xl font-bold mb-3 text-center text-gray-900">Sustainable Impact</h3>
              <p className="text-gray-600 text-center">
                Championing the circular economy and conscious consumption.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}