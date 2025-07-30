import { Card } from "@/components/ui/card";
import { Sun, Cloud, CloudRain, Zap } from "lucide-react";

interface ForecastDay {
  date: string;
  tempHigh: number;
  tempLow: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

interface ForecastCardProps {
  forecast: ForecastDay[];
}

const ForecastCard = ({ forecast }: ForecastCardProps) => {
  const getWeatherIcon = (iconCode: string) => {
    if (iconCode.includes('01')) return <Sun className="w-6 h-6 text-accent" />;
    if (iconCode.includes('02') || iconCode.includes('03') || iconCode.includes('04')) 
      return <Cloud className="w-6 h-6 text-muted-foreground" />;
    if (iconCode.includes('09') || iconCode.includes('10')) 
      return <CloudRain className="w-6 h-6 text-primary" />;
    if (iconCode.includes('11')) return <Zap className="w-6 h-6 text-destructive" />;
    return <Sun className="w-6 h-6 text-accent" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <Card className="border-0 shadow-glass backdrop-blur-glass bg-gradient-glass">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">5-Day Forecast</h3>
        
        <div className="space-y-3">
          {forecast.map((day, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-card-glass/50 hover:bg-card-glass/80 transition-all duration-300 animate-slide-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-3">
                {getWeatherIcon(day.icon)}
                <div>
                  <p className="font-medium text-foreground">
                    {formatDate(day.date)}
                  </p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {day.condition}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">
                    {Math.round(day.tempHigh)}°
                  </span>
                  <span className="text-muted-foreground">
                    {Math.round(day.tempLow)}°
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                  <span>{day.humidity}%</span>
                  <span>{day.windSpeed} mph</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ForecastCard;