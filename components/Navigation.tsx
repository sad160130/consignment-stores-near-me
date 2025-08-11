'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { processExcelData } from '@/lib/data-processor';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface NavigationProps {
  className?: string;
}

export default function Navigation({ className = '' }: NavigationProps) {
  const [isStatesOpen, setIsStatesOpen] = useState(false);
  const [isCitiesOpen, setIsCitiesOpen] = useState(false);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  
  const statesDropdownRef = useRef<HTMLDivElement>(null);
  const citiesDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const data = processExcelData();
    setStates(data.statesList);
    
    // Get all cities from all states
    const allCities: string[] = [];
    Object.values(data.citiesByState).forEach(stateCities => {
      allCities.push(...stateCities);
    });
    setCities([...new Set(allCities)].sort());
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (statesDropdownRef.current && !statesDropdownRef.current.contains(event.target as Node)) {
        setIsStatesOpen(false);
      }
      if (citiesDropdownRef.current && !citiesDropdownRef.current.contains(event.target as Node)) {
        setIsCitiesOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStateSlug = (state: string) => {
    return state.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
  };

  const getCitySlug = (city: string) => {
    return city.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
  };

  return (
    <nav className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="font-bold text-xl text-gray-900">Consignment Stores Near Me</span>
            </Link>
          </div>

          {/* Navigation Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {/* Stores by State Dropdown */}
              <div className="relative" ref={statesDropdownRef}>
                <button
                  onClick={() => setIsStatesOpen(!isStatesOpen)}
                  className="nav-link flex items-center space-x-1"
                >
                  <span>Stores by State</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </button>
                {isStatesOpen && (
                  <div className="dropdown-menu w-64 p-2">
                    <div className="grid grid-cols-2 gap-1">
                      {states.map((state) => (
                        <Link
                          key={state}
                          href={`/${getStateSlug(state)}/`}
                          className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded"
                          onClick={() => setIsStatesOpen(false)}
                        >
                          {state}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Stores by City Dropdown */}
              <div className="relative" ref={citiesDropdownRef}>
                <button
                  onClick={() => setIsCitiesOpen(!isCitiesOpen)}
                  className="nav-link flex items-center space-x-1"
                >
                  <span>Stores by City</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </button>
                {isCitiesOpen && (
                  <div className="dropdown-menu w-80 p-2">
                    <div className="grid grid-cols-3 gap-1 max-h-80 overflow-y-auto">
                      {cities.slice(0, 50).map((city) => (
                        <Link
                          key={city}
                          href={`/city/${getCitySlug(city)}/`}
                          className="block px-2 py-1 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded truncate"
                          onClick={() => setIsCitiesOpen(false)}
                          title={city}
                        >
                          {city}
                        </Link>
                      ))}
                    </div>
                    {cities.length > 50 && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500 text-center">
                          Showing first 50 cities. Use search to find more.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* About Us */}
              <Link href="/about/" className="nav-link">
                About Us
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-700 hover:text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}