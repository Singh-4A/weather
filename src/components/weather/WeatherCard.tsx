import { Card } from "@/components/ui/card";
import { Cloud, Sun, CloudRain, Zap } from "lucide-react";

interface WeatherCardProps {
  title: string;
  temperature: number;
  condition: string;
  location: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  className?: string;
}

const WeatherCard = ({
  title,
  temperature,
  condition,
  location,
  icon,
  humidity,
  windSpeed,
  className
}: WeatherCardProps) => {
  const getWeatherIcon = (iconCode: string) => {
    if (iconCode.includes('01')) return <Sun className="w-12 h-12 text-accent" />;
    if (iconCode.includes('02') || iconCode.includes('03') || iconCode.includes('04')) 
      return <Cloud className="w-12 h-12 text-muted-foreground" />;
    if (iconCode.includes('09') || iconCode.includes('10')) 
      return <CloudRain className="w-12 h-12 text-primary" />;
    if (iconCode.includes('11')) return <Zap className="w-12 h-12 text-destructive" />;
    return <Sun className="w-12 h-12 text-accent" />;
  };

  const getGradientClass = (iconCode: string) => {
    if (iconCode.includes('01')) return 'bg-gradient-sunny';
    if (iconCode.includes('02') || iconCode.includes('03') || iconCode.includes('04')) 
      return 'bg-gradient-cloudy';
    if (iconCode.includes('09') || iconCode.includes('10')) 
      return 'bg-gradient-rainy';
    if (iconCode.includes('11')) return 'bg-gradient-stormy';
    return 'bg-gradient-primary';
  };

  return (
    <Card className={`relative overflow-hidden border-0 shadow-glass backdrop-blur-glass ${className}`}>
      <div className={`absolute inset-0 ${getGradientClass(icon)} opacity-10`} />
      <div className="relative p-6 bg-gradient-glass">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{location}</p>
          </div>
          <div className="animate-float">
            {getWeatherIcon(icon)}
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-foreground">
              {Math.round(temperature)}°
            </span>
            <span className="text-lg text-muted-foreground capitalize">
              {condition}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <div className="text-center">
              <p className="text-muted-foreground">Humidity</p>
              <p className="font-semibold text-foreground">{humidity}%</p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground">Wind</p>
              <p className="font-semibold text-foreground">{windSpeed} mph</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WeatherCard;