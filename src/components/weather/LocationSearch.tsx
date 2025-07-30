import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface LocationSearchProps {
  onLocationSelect: (lat: number, lng: number, locationName: string) => void;
  isLoading?: boolean;
}

const LocationSearch = ({ onLocationSelect, isLoading }: LocationSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      // Using OpenStreetMap Nominatim API for location search (free)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        const locationName = result.display_name.split(',').slice(0, 2).join(',');
        
        onLocationSelect(lat, lng, locationName);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearching(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setSearching(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Reverse geocoding to get location name
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
            );
            const data = await response.json();
            const locationName = data.display_name?.split(',').slice(0, 2).join(',') || 'Current Location';
            
            onLocationSelect(latitude, longitude, locationName);
          } catch (error) {
            onLocationSelect(latitude, longitude, 'Current Location');
          } finally {
            setSearching(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setSearching(false);
        }
      );
    }
  };

  return (
    <Card className="border-0 shadow-glass backdrop-blur-glass bg-gradient-glass">
      <div className="p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Search for a city or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 bg-card-glass/50 border-border/50"
            disabled={isLoading || searching}
          />
          <Button 
            onClick={handleSearch} 
            size="icon" 
            variant="secondary"
            disabled={isLoading || searching || !searchQuery.trim()}
          >
            {searching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
          <Button 
            onClick={getCurrentLocation} 
            size="icon" 
            variant="secondary"
            disabled={isLoading || searching}
          >
            {searching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <MapPin className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default LocationSearch;