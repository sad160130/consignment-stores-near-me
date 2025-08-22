'use client';

import { useEffect, useState } from 'react';
import { ConsignmentStore } from '@/lib/data-processor';
import 'leaflet/dist/leaflet.css';

interface SimpleLeafletMapProps {
  stores: ConsignmentStore[];
  selectedStore?: ConsignmentStore | null;
  onStoreSelect?: (store: ConsignmentStore) => void;
  stateName?: string;
  cityName?: string;
}

// State coordinates for centering the map
const stateCoordinates: { [key: string]: { lat: number; lng: number } } = {
  'Alabama': { lat: 32.806671, lng: -86.791130 },
  'Alaska': { lat: 61.370716, lng: -152.404419 },
  'Arizona': { lat: 33.729759, lng: -111.431221 },
  'Arkansas': { lat: 34.969704, lng: -92.373123 },
  'California': { lat: 36.116203, lng: -119.681564 },
  'Colorado': { lat: 39.059811, lng: -105.311104 },
  'Connecticut': { lat: 41.597782, lng: -72.755371 },
  'Delaware': { lat: 39.318523, lng: -75.507141 },
  'Florida': { lat: 27.766279, lng: -81.686783 },
  'Georgia': { lat: 33.040619, lng: -83.643074 },
  'Hawaii': { lat: 21.094318, lng: -157.498337 },
  'Idaho': { lat: 44.240459, lng: -114.478828 },
  'Illinois': { lat: 40.349457, lng: -88.986137 },
  'Indiana': { lat: 39.849426, lng: -86.258278 },
  'Iowa': { lat: 42.011539, lng: -93.210526 },
  'Kansas': { lat: 38.526600, lng: -96.726486 },
  'Kentucky': { lat: 37.668140, lng: -84.670067 },
  'Louisiana': { lat: 31.169546, lng: -91.867805 },
  'Maine': { lat: 44.693947, lng: -69.381927 },
  'Maryland': { lat: 39.063946, lng: -76.802101 },
  'Massachusetts': { lat: 42.230171, lng: -71.530106 },
  'Michigan': { lat: 43.326618, lng: -84.536095 },
  'Minnesota': { lat: 45.694454, lng: -93.900192 },
  'Mississippi': { lat: 32.741646, lng: -89.678696 },
  'Missouri': { lat: 38.456085, lng: -92.288368 },
  'Montana': { lat: 46.921925, lng: -110.454353 },
  'Nebraska': { lat: 41.492537, lng: -99.901813 },
  'Nevada': { lat: 38.313515, lng: -117.055374 },
  'New Hampshire': { lat: 43.452492, lng: -71.563896 },
  'New Jersey': { lat: 40.298904, lng: -74.521011 },
  'New Mexico': { lat: 34.840515, lng: -106.248482 },
  'New York': { lat: 42.165726, lng: -74.948051 },
  'North Carolina': { lat: 35.630066, lng: -79.806419 },
  'North Dakota': { lat: 47.528912, lng: -99.784012 },
  'Ohio': { lat: 40.388783, lng: -82.764915 },
  'Oklahoma': { lat: 35.565342, lng: -96.928917 },
  'Oregon': { lat: 43.804133, lng: -120.554201 },
  'Pennsylvania': { lat: 40.590752, lng: -77.209755 },
  'Rhode Island': { lat: 41.680893, lng: -71.511780 },
  'South Carolina': { lat: 33.856892, lng: -80.945007 },
  'South Dakota': { lat: 44.299782, lng: -99.438828 },
  'Tennessee': { lat: 35.747845, lng: -86.692345 },
  'Texas': { lat: 31.054487, lng: -97.563461 },
  'Utah': { lat: 40.150032, lng: -111.862434 },
  'Vermont': { lat: 44.045876, lng: -72.710686 },
  'Virginia': { lat: 37.769337, lng: -78.169968 },
  'Washington': { lat: 47.400902, lng: -121.490494 },
  'West Virginia': { lat: 38.491226, lng: -80.954453 },
  'Wisconsin': { lat: 43.784440, lng: -88.787868 },
  'Wyoming': { lat: 42.755966, lng: -107.302490 }
};

export default function SimpleLeafletMap({ stores, onStoreSelect, stateName, cityName }: SimpleLeafletMapProps) {
  const [isClient, setIsClient] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [TileLayer, setTileLayer] = useState<React.ComponentType<any> | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [Marker, setMarker] = useState<React.ComponentType<any> | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [Popup, setPopup] = useState<React.ComponentType<any> | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [MapContainer, setMapContainer] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    setIsClient(true);
    
    // Fix Leaflet default marker icons
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });
      });

      // Dynamically import react-leaflet components
      Promise.all([
        import('react-leaflet').then(mod => mod.MapContainer),
        import('react-leaflet').then(mod => mod.TileLayer),
        import('react-leaflet').then(mod => mod.Marker),
        import('react-leaflet').then(mod => mod.Popup)
      ]).then(([MapContainerMod, TileLayerMod, MarkerMod, PopupMod]) => {
        setMapContainer(() => MapContainerMod);
        setTileLayer(() => TileLayerMod);
        setMarker(() => MarkerMod);
        setPopup(() => PopupMod);
      });
    }
  }, []);

  if (!isClient || !MapContainer || !TileLayer || !Marker || !Popup) {
    return (
      <div className="w-full h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading interactive map...</p>
        </div>
      </div>
    );
  }

  // Determine map center based on state
  let centerLat = 39.8283; // Default US center
  let centerLng = -98.5795;
  let zoomLevel = 4;

  if (stateName && stateCoordinates[stateName]) {
    centerLat = stateCoordinates[stateName].lat;
    centerLng = stateCoordinates[stateName].lng;
    zoomLevel = cityName ? 11 : 7; // Zoom in more for city view
  }

  // Generate store positions with small random offsets to avoid overlapping
  const storesWithPositions = stores.map((store, index) => {
    let lat = centerLat;
    let lng = centerLng;
    
    // If we have state coordinates, add random offset around the state center
    if (stateName && stateCoordinates[stateName]) {
      const offsetRange = cityName ? 0.05 : 0.5; // Smaller offset for city view
      lat = stateCoordinates[stateName].lat + (Math.random() - 0.5) * offsetRange;
      lng = stateCoordinates[stateName].lng + (Math.random() - 0.5) * offsetRange;
    }
    
    return {
      ...store,
      latitude: lat,
      longitude: lng
    };
  });

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg border border-gray-200">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={zoomLevel}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {storesWithPositions.map((store, index) => (
          <Marker
            key={index}
            position={[store.latitude, store.longitude]}
            eventHandlers={{
              click: () => {
                if (onStoreSelect) {
                  onStoreSelect(store);
                }
              }
            }}
          >
            <Popup>
              <div className="p-2 max-w-[250px]">
                <h3 className="font-bold text-sm mb-1">{store.businessName}</h3>
                <p className="text-xs text-gray-600 mb-1">{store.address}</p>
                <p className="text-xs text-gray-600 mb-2">{store.city}, {store.state}</p>
                {store.phone && (
                  <p className="text-xs text-blue-600 mb-1">
                    <a href={`tel:${store.phone}`}>📞 {store.phone}</a>
                  </p>
                )}
                {store.numberOfReviews > 0 && (
                  <p className="text-xs text-gray-600 mb-1">⭐ {store.numberOfReviews} reviews</p>
                )}
                {store.site && (
                  <a 
                    href={store.site} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    🌐 Visit Website
                  </a>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}