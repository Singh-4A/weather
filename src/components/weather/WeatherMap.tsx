import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Search } from "lucide-react";

interface WeatherMapProps {
  onLocationSelect: (lat: number, lng: number, locationName: string) => void;
  mapboxToken: string;
}

const WeatherMap = ({ onLocationSelect, mapboxToken }: WeatherMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      zoom: 4,
      center: [-98.5795, 39.8283], // Center of US
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    map.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      
      // Add marker
      new mapboxgl.Marker({
        color: 'hsl(var(--primary))'
      })
        .setLngLat([lng, lat])
        .addTo(map.current!);

      // Get location name (reverse geocoding)
      fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxToken}&types=place,locality`
      )
        .then(response => response.json())
        .then(data => {
          const locationName = data.features[0]?.place_name || `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
          onLocationSelect(lat, lng, locationName);
        });
    });

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, onLocationSelect]);

  const handleSearch = async () => {
    if (!searchQuery.trim() || !mapboxToken) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${mapboxToken}&types=place,locality`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        const locationName = data.features[0].place_name;
        
        map.current?.flyTo({
          center: [lng, lat],
          zoom: 10,
          duration: 2000
        });

        // Clear existing markers
        const markers = document.querySelectorAll('.mapboxgl-marker');
        markers.forEach(marker => marker.remove());

        // Add new marker
        new mapboxgl.Marker({
          color: 'hsl(var(--primary))'
        })
          .setLngLat([lng, lat])
          .addTo(map.current!);

        onLocationSelect(lat, lng, locationName);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          map.current?.flyTo({
            center: [longitude, latitude],
            zoom: 12,
            duration: 2000
          });

          // Clear existing markers
          const markers = document.querySelectorAll('.mapboxgl-marker');
          markers.forEach(marker => marker.remove());

          // Add marker
          new mapboxgl.Marker({
            color: 'hsl(var(--primary))'
          })
            .setLngLat([longitude, latitude])
            .addTo(map.current!);

          onLocationSelect(latitude, longitude, 'Current Location');
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  };

  if (!mapboxToken) {
    return (
      <Card className="border-0 shadow-glass backdrop-blur-glass bg-gradient-glass">
        <div className="p-6 text-center">
          <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Mapbox Token Required
          </h3>
          <p className="text-muted-foreground">
            Please add your Mapbox public token to enable interactive maps.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-glass backdrop-blur-glass overflow-hidden">
      <div className="p-4 bg-gradient-glass">
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Search for a location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1"
          />
          <Button onClick={handleSearch} size="icon" variant="secondary">
            <Search className="w-4 h-4" />
          </Button>
          <Button onClick={getCurrentLocation} size="icon" variant="secondary">
            <MapPin className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="relative">
        <div ref={mapContainer} className="h-96 w-full" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/5" />
      </div>
    </Card>
  );
};

export default WeatherMap;