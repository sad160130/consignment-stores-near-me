import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="font-bold text-lg text-gray-900">
                Consignment Stores Near Me
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Your comprehensive directory for finding the best consignment stores across the United States.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-600 hover:text-blue-600">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about/" className="text-gray-600 hover:text-blue-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/sitemap/" className="text-gray-600 hover:text-blue-600">
                  Sitemap
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="text-gray-600 hover:text-blue-600">
                  XML Sitemap
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular States */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Popular States</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/california/" className="text-gray-600 hover:text-blue-600">
                  California
                </Link>
              </li>
              <li>
                <Link href="/texas/" className="text-gray-600 hover:text-blue-600">
                  Texas
                </Link>
              </li>
              <li>
                <Link href="/florida/" className="text-gray-600 hover:text-blue-600">
                  Florida
                </Link>
              </li>
              <li>
                <Link href="/new-york/" className="text-gray-600 hover:text-blue-600">
                  New York
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Cities */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Popular Cities</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/california/los-angeles/" className="text-gray-600 hover:text-blue-600">
                  Los Angeles, CA
                </Link>
              </li>
              <li>
                <Link href="/new-york/new-york/" className="text-gray-600 hover:text-blue-600">
                  New York, NY
                </Link>
              </li>
              <li>
                <Link href="/illinois/chicago/" className="text-gray-600 hover:text-blue-600">
                  Chicago, IL
                </Link>
              </li>
              <li>
                <Link href="/texas/houston/" className="text-gray-600 hover:text-blue-600">
                  Houston, TX
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © {currentYear} Consignment Stores Near Me. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/sitemap/" className="text-gray-600 hover:text-blue-600 text-sm">
                HTML Sitemap
              </Link>
              <Link href="/sitemap.xml" className="text-gray-600 hover:text-blue-600 text-sm">
                XML Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}