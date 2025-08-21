'use client';

import { useEffect, useRef, useState } from 'react';
import { ConsignmentStore } from '@/lib/data-processor';

interface StoreMapProps {
  stores: ConsignmentStore[];
  selectedStore?: ConsignmentStore | null;
  onStoreSelect?: (store: ConsignmentStore) => void;
}

declare global {
  interface Window {
    google?: typeof google;
    initMap?: () => void;
  }
}

export default function StoreMap({ stores, selectedStore, onStoreSelect }: StoreMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        initializeMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      script.onerror = () => setError('Failed to load Google Maps');
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current) return;

      try {
        const mapInstance = new google.maps.Map(mapRef.current, {
          zoom: 10,
          center: { lat: 39.8283, lng: -98.5795 }, // Center of USA
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        });

        const infoWindowInstance = new google.maps.InfoWindow();
        
        setMap(mapInstance);
        setInfoWindow(infoWindowInstance);
        setIsLoading(false);
      } catch {
        setError('Error initializing map');
        setIsLoading(false);
      }
    };

    loadGoogleMaps();
  }, []);

  // Create markers for stores
  useEffect(() => {
    if (!map || !window.google) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));

    const geocoder = new google.maps.Geocoder();
    const bounds = new google.maps.LatLngBounds();
    const newMarkers: google.maps.Marker[] = [];

    stores.forEach((store, index) => {
      // Use address for geocoding
      const fullAddress = `${store.address}, ${store.city}, ${store.state}`;
      
      // Delay geocoding requests to avoid rate limiting
      setTimeout(() => {
        geocoder.geocode({ address: fullAddress }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const position = results[0].geometry.location;
            
            const marker = new google.maps.Marker({
              position,
              map,
              title: store.businessName,
              animation: google.maps.Animation.DROP,
              icon: {
                url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                scaledSize: new google.maps.Size(40, 40),
              },
            });

            bounds.extend(position);

            // Add click listener to show info window
            marker.addListener('click', () => {
              if (infoWindow) {
                const content = `
                  <div style="max-width: 300px; padding: 8px;">
                    <h3 style="font-weight: bold; margin-bottom: 8px;">${store.businessName}</h3>
                    <p style="color: #666; margin-bottom: 4px;">${store.address}</p>
                    <p style="color: #666; margin-bottom: 8px;">${store.city}, ${store.state}</p>
                    ${store.phone ? `<p style="color: #2563eb; margin-bottom: 4px;">📞 ${store.phone}</p>` : ''}
                    ${store.numberOfReviews ? `<p style="color: #666; margin-bottom: 4px;">⭐ ${store.numberOfReviews} reviews</p>` : ''}
                    ${store.site ? `<a href="${store.site}" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: none;">🌐 Visit Website</a>` : ''}
                  </div>
                `;
                infoWindow.setContent(content);
                infoWindow.open(map, marker);
                
                if (onStoreSelect) {
                  onStoreSelect(store);
                }
              }
            });

            newMarkers.push(marker);

            // Fit map to show all markers
            if (newMarkers.length === stores.length) {
              map.fitBounds(bounds);
            }
          }
        });
      }, index * 200); // 200ms delay between requests
    });

    markersRef.current = newMarkers;

    return () => {
      newMarkers.forEach(marker => marker.setMap(null));
    };
  }, [map, stores, infoWindow, onStoreSelect]);

  // Handle selected store
  useEffect(() => {
    if (!selectedStore || !map || markersRef.current.length === 0) return;

    const fullAddress = `${selectedStore.address}, ${selectedStore.city}, ${selectedStore.state}`;
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: fullAddress }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const position = results[0].geometry.location;
        map.setCenter(position);
        map.setZoom(15);

        // Find and trigger click on the corresponding marker
        const marker = markersRef.current.find(m => m.getTitle() === selectedStore.businessName);
        if (marker) {
          google.maps.event.trigger(marker, 'click');
        }
      }
    });
  }, [selectedStore, map]);

  if (error) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <p className="text-gray-600">Unable to load map: {error}</p>
        <p className="text-sm text-gray-500 mt-2">
          Please check your internet connection or try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
      <div
        ref={mapRef}
        className="w-full h-[500px] rounded-lg shadow-lg"
        style={{ minHeight: '500px' }}
      />
      {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Google Maps API key is not configured. 
            Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables to enable the map.
          </p>
        </div>
      )}
    </div>
  );
}