'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { processExcelData } from '@/lib/data-processor';

export default function AboutClient() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  
  const data = processExcelData();
  const totalStores = data.stores.length;
  const totalStates = data.statesList.length;
  const totalCities = Object.keys(data.storesByCity).length;

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      let current = '';
      
      sections.forEach(section => {
        const htmlSection = section as HTMLElement;
        const sectionTop = htmlSection.offsetTop - 100;
        if (window.pageYOffset >= sectionTop) {
          current = section.getAttribute('id') || '';
        }
      });
      
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const smoothScroll = (targetId: string) => {
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const headerOffset = 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900">ConsignmentStores.site</Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <button 
              onClick={() => smoothScroll('#story')}
              className={`pb-1 border-b-2 transition-all duration-300 ${
                activeSection === 'story' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-700 border-transparent hover:text-blue-600 hover:border-blue-300'
              }`}
            >
              Our Story
            </button>
            <button 
              onClick={() => smoothScroll('#process')}
              className={`pb-1 border-b-2 transition-all duration-300 ${
                activeSection === 'process' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-700 border-transparent hover:text-blue-600 hover:border-blue-300'
              }`}
            >
              Our Process
            </button>
            <button 
              onClick={() => smoothScroll('#team')}
              className={`pb-1 border-b-2 transition-all duration-300 ${
                activeSection === 'team' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-700 border-transparent hover:text-blue-600 hover:border-blue-300'
              }`}
            >
              Our Team
            </button>
            <button 
              onClick={() => smoothScroll('#values')}
              className={`pb-1 border-b-2 transition-all duration-300 ${
                activeSection === 'values' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-700 border-transparent hover:text-blue-600 hover:border-blue-300'
              }`}
            >
              Our Values
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden focus:outline-none text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-6 pb-4 bg-white border-t border-gray-200">
            <button 
              onClick={() => smoothScroll('#story')}
              className="block w-full py-2 text-center text-gray-700 hover:text-blue-600"
            >
              Our Story
            </button>
            <button 
              onClick={() => smoothScroll('#process')}
              className="block w-full py-2 text-center text-gray-700 hover:text-blue-600"
            >
              Our Process
            </button>
            <button 
              onClick={() => smoothScroll('#team')}
              className="block w-full py-2 text-center text-gray-700 hover:text-blue-600"
            >
              Our Team
            </button>
            <button 
              onClick={() => smoothScroll('#values')}
              className="block w-full py-2 text-center text-gray-700 hover:text-blue-600"
            >
              Our Values
            </button>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section id="hero" className="bg-gradient-to-b from-blue-50 to-white py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Connecting Communities, One Treasure at a Time.
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              We&apos;re building the most trusted and comprehensive guide to consignment stores, 
              helping you discover local gems and embrace sustainable style.
            </p>
            <button 
              onClick={() => smoothScroll('#story')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-300 inline-block"
            >
              Learn Our &quot;Why&quot;
            </button>
          </div>
        </section>

        {/* Our Story Section */}
        <section id="story" className="py-20 md:py-28">
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
                  information about local stores. We knew there were countless hidden gems out there, 
                  full of unique treasures and passionate owners.
                </p>
                <p>
                  Driven by a passion for sustainable fashion and supporting small businesses, we 
                  decided to build the solution ourselves. We launched ConsignmentStores.site not 
                  just as a list of stores, but as a community hub—a place for shoppers to discover 
                  and for store owners to be seen.
                </p>
                <p>
                  Today, our directory includes over {totalStores.toLocaleString()} stores across {totalStates} states 
                  and {totalCities} cities. Our mission is to make second-hand the first choice by 
                  making it accessible, trustworthy, and exciting for everyone.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Process Section */}
        <section id="process" className="py-20 md:py-28 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Our Process: How We Ensure Quality
              </h2>
              <p className="text-gray-500 mt-2">
                A look behind the curtain at our commitment to trust and accuracy.
              </p>
            </div>
            
            <div className="relative max-w-3xl mx-auto">
              {/* Timeline connector */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-blue-200"></div>
              
              {/* Step 1 */}
              <div className="relative flex items-center mb-12">
                <div className="w-1/2 text-right pr-8">
                  <h3 className="font-bold text-xl text-gray-900">Discovery & Research</h3>
                  <p className="text-gray-600 mt-2">
                    We actively seek out new stores and rely on community suggestions to keep 
                    our database growing and comprehensive.
                  </p>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold z-10">
                  1
                </div>
                <div className="w-1/2"></div>
              </div>
              
              {/* Step 2 */}
              <div className="relative flex items-center mb-12">
                <div className="w-1/2"></div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold z-10">
                  2
                </div>
                <div className="w-1/2 text-left pl-8">
                  <h3 className="font-bold text-xl text-gray-900">Verification & Vetting</h3>
                  <p className="text-gray-600 mt-2">
                    Our team personally verifies key information for each store, ensuring details 
                    like hours, location, and specialties are accurate.
                  </p>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="relative flex items-center">
                <div className="w-1/2 text-right pr-8">
                  <h3 className="font-bold text-xl text-gray-900">Continuous Updates</h3>
                  <p className="text-gray-600 mt-2">
                    The retail world changes fast. We regularly review and update our listings 
                    to reflect closures, moves, and new openings.
                  </p>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold z-10">
                  3
                </div>
                <div className="w-1/2"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Team Section */}
        <section id="team" className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Our Team: The People Behind the Passion
              </h2>
              <p className="text-gray-500 mt-2">Meet the founder who started it all.</p>
            </div>
            
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg flex flex-col sm:flex-row items-center gap-8">
              <div className="relative w-32 h-32 sm:w-48 sm:h-48 flex-shrink-0">
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
                  passion. With over 10 years of experience in marketing and finding amazing deals, 
                  my goal is to build a platform that genuinely helps both shoppers and small 
                  business owners thrive.&quot;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section id="values" className="py-20 md:py-28 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Core Values</h2>
              <p className="text-gray-500 mt-2">The principles that guide every decision we make.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="text-4xl mb-4 text-center">🤝</div>
                <h3 className="text-xl font-bold mb-3 text-center text-gray-900">Community First</h3>
                <p className="text-gray-600 text-center">
                  We are dedicated to supporting the ecosystem of local consignment stores and 
                  the vibrant community of shoppers who cherish them.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="text-4xl mb-4 text-center">✅</div>
                <h3 className="text-xl font-bold mb-3 text-center text-gray-900">Unwavering Trust</h3>
                <p className="text-gray-600 text-center">
                  Accuracy and reliability are the cornerstones of our platform. You can count 
                  on our information to be vetted and up-to-date.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="text-4xl mb-4 text-center">♻️</div>
                <h3 className="text-xl font-bold mb-3 text-center text-gray-900">Sustainable Impact</h3>
                <p className="text-gray-600 text-center">
                  We champion the circular economy by making it easier for people to choose 
                  second-hand, reducing waste and promoting conscious consumption.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="mb-2">&copy; 2025 ConsignmentStores.site. All Rights Reserved.</p>
          <p className="text-gray-400 text-sm">Helping you find the best in pre-loved goods.</p>
        </div>
      </footer>
    </div>
  );
}