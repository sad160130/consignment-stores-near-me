'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { processExcelData, ProcessedData, ConsignmentStore } from '@/lib/data-processor';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchResult {
  type: 'store' | 'city' | 'state';
  name: string;
  location?: string;
  href: string;
}

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  size?: 'small' | 'large';
}

export default function SearchBar({ 
  placeholder = "Search by store name, city, state, or zip code...", 
  className = "",
  size = 'large'
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<ProcessedData | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setData(processExcelData());
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
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

  const searchStores = (searchQuery: string) => {
    if (!data || searchQuery.length < 2) {
      setResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Search stores by name
    data.stores.forEach((store: ConsignmentStore) => {
      if (store.businessName.toLowerCase().includes(query) && searchResults.length < 5) {
        const stateSlug = getStateSlug(store.state);
        const citySlug = getCitySlug(store.city);
        searchResults.push({
          type: 'store',
          name: store.businessName,
          location: `${store.city}, ${store.state}`,
          href: `/${stateSlug}/${citySlug}#${store.businessName.toLowerCase().replace(/\s+/g, '-')}`
        });
      }
    });

    // Search cities
    Object.entries(data.citiesByState).forEach(([state, cities]: [string, string[]]) => {
      cities.forEach((city: string) => {
        if (city.toLowerCase().includes(query) && searchResults.length < 8) {
          const stateSlug = getStateSlug(state);
          const citySlug = getCitySlug(city);
          searchResults.push({
            type: 'city',
            name: city,
            location: state,
            href: `/${stateSlug}/${citySlug}`
          });
        }
      });
    });

    // Search states
    data.statesList.forEach((state: string) => {
      if (state.toLowerCase().includes(query) && searchResults.length < 10) {
        const stateSlug = getStateSlug(state);
        searchResults.push({
          type: 'state',
          name: state,
          href: `/${stateSlug}`
        });
      }
    });

    setResults(searchResults.slice(0, 10));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length > 0);
    searchStores(value);
  };

  const handleResultClick = (href: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(href);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (results.length > 0) {
      handleResultClick(results[0].href);
    }
  };

  const inputClasses = size === 'large' 
    ? 'search-input text-lg py-4 px-6' 
    : 'search-input';

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={placeholder}
            className={inputClasses}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </form>

      {isOpen && results.length > 0 && (
        <div className="dropdown-menu w-full p-2">
          {results.map((result, index) => (
            <button
              key={index}
              onClick={() => handleResultClick(result.href)}
              className="w-full text-left px-3 py-2 hover:bg-blue-50 hover:text-blue-600 rounded flex items-start"
            >
              <div className="flex-1">
                <div className="font-medium text-gray-900">{result.name}</div>
                {result.location && (
                  <div className="text-sm text-gray-600">{result.location}</div>
                )}
              </div>
              <div className="ml-2">
                <span className={`inline-block px-2 py-1 rounded text-xs ${
                  result.type === 'store' ? 'bg-green-100 text-green-800' :
                  result.type === 'city' ? 'bg-blue-100 text-blue-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {result.type}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}