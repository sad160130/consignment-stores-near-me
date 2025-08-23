'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { processExcelData, getStateSlug, getCitySlug } from '@/lib/data-processor';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface NavigationProps {
  className?: string;
}

export default function Navigation({ className = '' }: NavigationProps) {
  const [isStatesOpen, setIsStatesOpen] = useState(false);
  const [isCitiesOpen, setIsCitiesOpen] = useState(false);
  const [states, setStates] = useState<string[]>([]);
  const [citiesWithStates, setCitiesWithStates] = useState<Array<{city: string, state: string, stateSlug: string, citySlug: string}>>([]);
  
  const statesDropdownRef = useRef<HTMLDivElement>(null);
  const citiesDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const data = processExcelData();
    setStates(data.statesList.sort());
    
    // Get all cities with their states for proper routing
    const citiesData: Array<{city: string, state: string, stateSlug: string, citySlug: string}> = [];
    Object.entries(data.citiesByState).forEach(([stateName, stateCities]) => {
      const stateSlug = getStateSlug(stateName);
      stateCities.forEach((cityName) => {
        citiesData.push({
          city: cityName,
          state: stateName,
          stateSlug,
          citySlug: getCitySlug(cityName)
        });
      });
    });
    setCitiesWithStates(citiesData.sort((a, b) => a.city.localeCompare(b.city)));
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
                  <div className="dropdown-menu w-72 p-3">
                    <div className="max-h-80 overflow-y-auto">
                      <div className="space-y-1">
                        {states.map((state) => (
                          <Link
                            key={state}
                            href={`/${getStateSlug(state)}/`}
                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors duration-150 border-l-2 border-transparent hover:border-blue-400"
                            onClick={() => setIsStatesOpen(false)}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{state}</span>
                              <ChevronDownIcon className="w-4 h-4 rotate-[-90deg] text-gray-400" />
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500 text-center">
                        Browse consignment stores by state
                      </p>
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
                  <div className="dropdown-menu w-80 p-3">
                    <div className="max-h-80 overflow-y-auto">
                      <div className="space-y-1">
                        {citiesWithStates.slice(0, 100).map((cityData, index) => (
                          <Link
                            key={`${cityData.city}-${cityData.state}-${index}`}
                            href={`/${cityData.stateSlug}/${cityData.citySlug}/`}
                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors duration-150 border-l-2 border-transparent hover:border-blue-400"
                            onClick={() => setIsCitiesOpen(false)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col">
                                <span className="font-medium">{cityData.city}</span>
                                <span className="text-xs text-gray-500">{cityData.state}</span>
                              </div>
                              <ChevronDownIcon className="w-4 h-4 rotate-[-90deg] text-gray-400" />
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500 text-center">
                        Showing top 100 cities • Browse consignment stores by city
                      </p>
                    </div>
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