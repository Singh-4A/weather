import { useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";
import WeatherCard from '@/components/weather/WeatherCard';
import ForecastCard from '@/components/weather/ForecastCard';
import WeatherAnalytics from '@/components/weather/WeatherAnalytics';
import WeatherMap from '@/components/weather/WeatherMap';
import LocationSearch from '@/components/weather/LocationSearch';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Settings } from "lucide-react";
import heroImage from '@/assets/weather-hero-bg.jpg';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
}

interface ForecastDay {
  date: string;
  tempHigh: number;
  tempLow: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

const WeatherApp = () => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [mapboxToken, setMapboxToken] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({ lat: 40.7128, lng: -74.0060, name: 'india' });

  // Mock data for demonstration
  const mockWeatherData: WeatherData = {
    location: selectedLocation.name,
    temperature: 72,
    condition: 'partly cloudy',
    icon: '02d',
    humidity: 65,
    windSpeed: 8,
    pressure: 1013,
    visibility: 10
  };

  const mockForecastData: ForecastDay[] = [
    {
      date: new Date().toISOString(),
      tempHigh: 75,
      tempLow: 62,
      condition: 'sunny',
      icon: '01d',
      humidity: 60,
      windSpeed: 5
    },
    {
      date: new Date(Date.now() + 86400000).toISOString(),
      tempHigh: 78,
      tempLow: 65,
      condition: 'partly cloudy',
      icon: '02d',
      humidity: 55,
      windSpeed: 7
    },
    {
      date: new Date(Date.now() + 172800000).toISOString(),
      tempHigh: 73,
      tempLow: 59,
      condition: 'cloudy',
      icon: '03d',
      humidity: 70,
      windSpeed: 12
    },
    {
      date: new Date(Date.now() + 259200000).toISOString(),
      tempHigh: 69,
      tempLow: 55,
      condition: 'rainy',
      icon: '10d',
      humidity: 85,
      windSpeed: 15
    },
    {
      date: new Date(Date.now() + 345600000).toISOString(),
      tempHigh: 71,
      tempLow: 58,
      condition: 'partly cloudy',
      icon: '02d',
      humidity: 68,
      windSpeed: 9
    }
  ];

  const mockAnalyticsData = [
    { time: '6AM', temperature: 65, humidity: 75, windSpeed: 5, pressure: 1012 },
    { time: '9AM', temperature: 68, humidity: 70, windSpeed: 6, pressure: 1013 },
    { time: '12PM', temperature: 72, humidity: 65, windSpeed: 8, pressure: 1013 },
    { time: '3PM', temperature: 75, humidity: 60, windSpeed: 10, pressure: 1014 },
    { time: '6PM', temperature: 73, humidity: 65, windSpeed: 7, pressure: 1013 },
    { time: '9PM', temperature: 70, humidity: 70, windSpeed: 5, pressure: 1012 }
  ];

  useEffect(() => {
    // Initialize with mock data
    setCurrentWeather(mockWeatherData);
    setForecast(mockForecastData);
    setAnalyticsData(mockAnalyticsData);
  }, [selectedLocation]);

  const fetchWeatherData = async (lat: number, lng: number) => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please add your OpenWeatherMap API key to fetch real weather data.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Current weather
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=imperial`
      );
      const currentData = await currentResponse.json();

      // 5-day forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${apiKey}&units=imperial`
      );
      const forecastData = await forecastResponse.json();

      if (currentResponse.ok && forecastResponse.ok) {
        setCurrentWeather({
          location: currentData.name,
          temperature: currentData.main.temp,
          condition: currentData.weather[0].description,
          icon: currentData.weather[0].icon,
          humidity: currentData.main.humidity,
          windSpeed: currentData.wind.speed,
          pressure: currentData.main.pressure,
          visibility: currentData.visibility / 1000 // Convert to km
        });

        // Process forecast data (take one reading per day)
        const dailyForecasts = [];
        const processedDates = new Set();
        
        for (const item of forecastData.list) {
          const date = new Date(item.dt * 1000).toDateString();
          if (!processedDates.has(date) && dailyForecasts.length < 5) {
            processedDates.add(date);
            dailyForecasts.push({
              date: new Date(item.dt * 1000).toISOString(),
              tempHigh: item.main.temp_max,
              tempLow: item.main.temp_min,
              condition: item.weather[0].description,
              icon: item.weather[0].icon,
              humidity: item.main.humidity,
              windSpeed: item.wind.speed
            });
          }
        }
        
        setForecast(dailyForecasts);

        toast({
          title: "Weather Updated",
          description: `Weather data loaded for ${currentData.name}`,
        });
      }
    } catch (error) {
      console.error('Weather fetch error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch weather data. Using mock data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = (lat: number, lng: number, locationName: string) => {
    setSelectedLocation({ lat, lng, name: locationName });
    if (apiKey) {
      fetchWeatherData(lat, lng);
    } else {
      // Update mock data with new location
      setCurrentWeather({ ...mockWeatherData, location: locationName });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <div 
        className="relative h-96 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${"https://images.unsplash.com/photo-1580193769210-b8d1c049a7d9?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
              Weather<span className="text-accent">Cast</span>
            </h1>
            <p className="text-xl text-white/90 drop-shadow-md">
              Get detailed weather forecasts, interactive maps, and analytics for any location worldwide.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10">
        {/* Settings */}
        {showSettings && (
          <Card className="mb-6 border-0 shadow-glass backdrop-blur-glass bg-gradient-glass">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">API Configuration</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    OpenWeatherMap API Key
                  </label>
                  <Input
                    type="password"
                    placeholder="Enter your API key..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="bg-card-glass/50"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Get your free API key from openweathermap.org
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Mapbox Token (Optional)
                  </label>
                  <Input
                    type="password"
                    placeholder="Enter your Mapbox token..."
                    value={mapboxToken}
                    onChange={(e) => setMapboxToken(e.target.value)}
                    className="bg-card-glass/50"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Get your token from mapbox.com for enhanced maps
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <LocationSearch 
              onLocationSelect={handleLocationSelect}
              isLoading={isLoading}
            />
          </div>
          <Button
            onClick={() => setShowSettings(!showSettings)}
            variant="secondary"
            size="icon"
            className="bg-card-glass/50 backdrop-blur-glass"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-card-glass/50 backdrop-blur-glass border-0">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="forecast">Forecast</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {currentWeather && (
                  <WeatherCard
                    title="Current Weather"
                    temperature={currentWeather.temperature}
                    condition={currentWeather.condition}
                    location={currentWeather.location}
                    icon={currentWeather.icon}
                    humidity={currentWeather.humidity}
                    windSpeed={currentWeather.windSpeed}
                    className="animate-slide-in"
                  />
                )}
              </div>
              <div>
                <ForecastCard forecast={forecast} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="forecast">
            <ForecastCard forecast={forecast} />
          </TabsContent>

          <TabsContent value="analytics">
            {currentWeather && (
              <WeatherAnalytics
                data={analyticsData}
                currentConditions={{
                  temperature: currentWeather.temperature,
                  humidity: currentWeather.humidity,
                  windSpeed: currentWeather.windSpeed,
                  pressure: currentWeather.pressure,
                  visibility: currentWeather.visibility
                }}
              />
            )}
          </TabsContent>

          <TabsContent value="map">
            <WeatherMap
              onLocationSelect={handleLocationSelect}
              mapboxToken={mapboxToken}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WeatherApp;