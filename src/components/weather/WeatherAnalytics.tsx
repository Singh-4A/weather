import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Thermometer, Droplets, Wind, Eye } from "lucide-react";

interface AnalyticsData {
  time: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
}

interface WeatherAnalyticsProps {
  data: AnalyticsData[];
  currentConditions: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    pressure: number;
    visibility: number;
  };
}

const WeatherAnalytics = ({ data, currentConditions }: WeatherAnalyticsProps) => {
  const MetricCard = ({ 
    title, 
    value, 
    unit, 
    icon: Icon, 
    trend 
  }: { 
    title: string; 
    value: number; 
    unit: string; 
    icon: any; 
    trend?: string;
  }) => (
    <Card className="border-0 shadow-card bg-gradient-glass backdrop-blur-glass">
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Icon className="w-5 h-5 text-primary" />
          {trend && (
            <span className="text-xs text-muted-foreground">{trend}</span>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold text-foreground">
            {value}{unit}
          </p>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Current Conditions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Temperature"
          value={Math.round(currentConditions.temperature)}
          unit="°F"
          icon={Thermometer}
          trend="Feels like"
        />
        <MetricCard
          title="Humidity"
          value={currentConditions.humidity}
          unit="%"
          icon={Droplets}
        />
        <MetricCard
          title="Wind Speed"
          value={Math.round(currentConditions.windSpeed)}
          unit=" mph"
          icon={Wind}
        />
        <MetricCard
          title="Visibility"
          value={Math.round(currentConditions.visibility)}
          unit=" mi"
          icon={Eye}
        />
      </div>

      {/* Temperature Trend Chart */}
      <Card className="border-0 shadow-glass backdrop-blur-glass bg-gradient-glass">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Temperature Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="temperature"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#temperatureGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* Humidity and Wind Chart */}
      <Card className="border-0 shadow-glass backdrop-blur-glass bg-gradient-glass">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Humidity & Wind Speed</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="humidity"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="windSpeed"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WeatherAnalytics;