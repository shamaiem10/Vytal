import { useEffect, useState } from 'react';
import { 
  Heart, Thermometer, Activity, Droplet,
  TrendingUp, TrendingDown, Calendar, Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

// Define types for entries
interface DiaryEntry {
  id: number;
  date: string;
  mood: string;
  symptoms: string;
  sugar: number;
  bp: string;
  hr: number;
  temp: number;
}

export default function Dashboard() {
  const [latest, setLatest] = useState<DiaryEntry | null>(null);
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    // Fetch latest entry
    fetch('http://127.0.0.1:5000/api/diary/latest')
      .then(res => res.json())
      .then(data => {
        if (!data.message) setLatest(data);
      });

    // Fetch all entries
    fetch('http://127.0.0.1:5000/api/diary')
      .then(res => res.json())
      .then(data => setEntries(data));
  }, []);

  // Map vitals from latest entry
  const recentVitals = latest ? [
    { label: 'Blood Pressure', value: latest.bp, unit: 'mmHg', icon: Heart, color: 'text-success' },
    { label: 'Heart Rate', value: latest.hr, unit: 'bpm', icon: Activity, color: 'text-success' },
    { label: 'Temperature', value: latest.temp, unit: '°F', icon: Thermometer, color: 'text-success' },
    { label: 'Blood Sugar', value: latest.sugar, unit: 'mg/dL', icon: Droplet, color: 'text-success' },
  ] : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Health Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your health overview for today.</p>
        </div>
        <Link to="/diary">
          <Button variant="medical" size="lg">
            <Calendar className="mr-2 h-4 w-4" />
            Log Today's Entry
          </Button>
        </Link>
      </div>

      {/* Vitals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recentVitals.length > 0 ? recentVitals.map((vital) => (
          <Card key={vital.label} className="health-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {vital.label}
              </CardTitle>
              <vital.icon className={`h-5 w-5 ${vital.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {vital.value}
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  {vital.unit}
                </span>
              </div>
              <Badge variant="default" className="mt-2">Latest</Badge>
            </CardContent>
          </Card>
        )) : (
          <p className="text-muted-foreground col-span-4">No vitals logged yet.</p>
        )}
      </div>

      {/* Recent Entries */}
      <Card className="health-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Recent Entries
          </CardTitle>
          <CardDescription>
            Your latest health diary entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {entries.length > 0 ? entries.slice(0, 3).map((entry) => (
              <div key={entry.id} className="health-metric">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">Daily Entry</p>
                    <Badge variant="outline" className="text-xs">completed</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {entry.date} – Mood: {entry.mood}
                  </p>
                </div>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </div>
            )) : (
              <p className="text-muted-foreground">No entries yet.</p>
            )}
          </div>
          <Link to="/diary">
            <Button variant="outline" className="w-full mt-4">
              View All Entries
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
