import { useState } from 'react';

export interface DetectedAddress {
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
}

interface NominatimAddress {
  house_number?: string;
  road?: string;
  pedestrian?: string;
  neighbourhood?: string;
  quarter?: string;
  residential?: string;
  hamlet?: string;
  suburb?: string;
  village?: string;
  town?: string;
  city?: string;
  county?: string;
  state?: string;
  postcode?: string;
}

function parseAddress(data: { address?: NominatimAddress; display_name?: string }): DetectedAddress {
  const addr = data.address ?? {};

  const roadPart = addr.road || addr.pedestrian || addr.neighbourhood || addr.quarter || addr.residential || addr.hamlet;
  let line1 = [addr.house_number, roadPart].filter(Boolean).join(' ');
  if (!line1) {
    // Rural/small-town areas often lack road-level OSM tags — fall back to the
    // most specific place name available, or the first chunk of the full address.
    line1 = addr.suburb || addr.village || data.display_name?.split(',')[0]?.trim() || '';
  }

  const line2 = addr.suburb && addr.suburb !== line1 ? addr.suburb : '';
  const city = addr.city || addr.town || addr.village || addr.county || '';
  const state = addr.state || '';
  const pincode = addr.postcode || '';

  return { line1, line2, city, state, pincode };
}

export function useCurrentLocation() {
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  const detect = (onResult: (address: DetectedAddress) => void) => {
    if (!navigator.geolocation) {
      setLocationError('Location is not supported on this device/browser.');
      return;
    }
    setLocationError('');
    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
            { headers: { Accept: 'application/json' } },
          );
          if (!res.ok) throw new Error('reverse geocode failed');
          const data = await res.json();
          const address = parseAddress(data);

          onResult(address);

          if (!address.line1 && !address.city) {
            setLocationError('Could not detect a precise address — please fill it in manually.');
          }
        } catch {
          setLocationError('Could not detect your address. Please fill it in manually.');
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
        setLocationError('Location permission denied — please fill in your address manually.');
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return { locating, locationError, detect };
}
