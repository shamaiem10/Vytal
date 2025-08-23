import { useState, useEffect } from 'react';
import { Calendar, Plus, Search, Heart, Thermometer, Activity, Droplet } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

export default function HealthDiary() {
  const [activeTab, setActiveTab] = useState('new-entry');
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    bp_systolic: '',
    bp_diastolic: '',
    heart_rate: '',
    temperature: '',
    blood_sugar: '',
    mood: 3,
    symptoms: '',
    notes: ''
  });

  const { toast } = useToast();

  // ✅ Fetch entries from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/diary")
      .then((res) => res.json())
      .then((data) => {
        setEntries(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching entries:", err);
        setLoading(false);
      });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newEntry = {
      date: formData.date,
      time: formData.time,
      bp: `${formData.bp_systolic}/${formData.bp_diastolic}`,
      hr: parseInt(formData.heart_rate, 10),
      temp: parseFloat(formData.temperature),
      sugar: parseInt(formData.blood_sugar, 10),
      mood: formData.mood,
      symptoms: formData.symptoms ? formData.symptoms.split(",").map(s => s.trim()) : [],
      notes: formData.notes
    };

    // ✅ Save to backend
    fetch("http://localhost:5000/api/diary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEntry),
    })
      .then((res) => res.json())
      .then((savedEntry) => {
        setEntries((prev) => [savedEntry, ...prev]); // add new entry on top
        toast({
          title: "Entry saved successfully!",
          description: "Your health data has been recorded.",
        });
        // Reset form
        setFormData({
          date: new Date().toISOString().split('T')[0],
          time: new Date().toTimeString().slice(0, 5),
          bp_systolic: '',
          bp_diastolic: '',
          heart_rate: '',
          temperature: '',
          blood_sugar: '',
          mood: 3,
          symptoms: '',
          notes: ''
        });
        setActiveTab("history");
      });
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Health Diary</h1>
        <p className="text-muted-foreground">Track your daily health metrics and symptoms.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="new-entry">New Entry</TabsTrigger>
          <TabsTrigger value="history">Entry History</TabsTrigger>
        </TabsList>

        {/* New Entry Form */}
        <TabsContent value="new-entry" className="space-y-6">
          <Card className="health-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                New Health Entry
              </CardTitle>
              <CardDescription>
                Record your daily vitals, mood, and symptoms.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date + Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Vitals */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Vital Signs
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Blood Pressure (mmHg)</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="120"
                          value={formData.bp_systolic}
                          onChange={(e) => handleInputChange('bp_systolic', e.target.value)}
                        />
                        <span className="flex items-center text-muted-foreground">/</span>
                        <Input
                          placeholder="80"
                          value={formData.bp_diastolic}
                          onChange={(e) => handleInputChange('bp_diastolic', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="heart_rate">Heart Rate (bpm)</Label>
                      <Input
                        id="heart_rate"
                        placeholder="72"
                        value={formData.heart_rate}
                        onChange={(e) => handleInputChange('heart_rate', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="temperature">Temperature (°F)</Label>
                      <Input
                        id="temperature"
                        placeholder="98.6"
                        value={formData.temperature}
                        onChange={(e) => handleInputChange('temperature', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="blood_sugar">Blood Sugar (mg/dL)</Label>
                      <Input
                        id="blood_sugar"
                        placeholder="95"
                        value={formData.blood_sugar}
                        onChange={(e) => handleInputChange('blood_sugar', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Mood */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Mood Rating
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">Poor</span>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <Button
                            key={rating}
                            type="button"
                            variant={formData.mood === rating ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleInputChange('mood', rating)}
                            className="w-10 h-10 p-0"
                          >
                            {rating}
                          </Button>
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">Excellent</span>
                    </div>
                  </div>
                </div>

                {/* Symptoms */}
                <div className="space-y-2">
                  <Label htmlFor="symptoms">Symptoms</Label>
                  <Input
                    id="symptoms"
                    placeholder="e.g., headache, fatigue, nausea"
                    value={formData.symptoms}
                    onChange={(e) => handleInputChange('symptoms', e.target.value)}
                  />
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional observations..."
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={4}
                  />
                </div>

                <Button type="submit" variant="medical" size="lg" className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  Save Entry
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Entry History */}
        <TabsContent value="history" className="space-y-6">
          <Card className="health-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Entry History
              </CardTitle>
              <CardDescription>
                View and search your past health entries.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading entries...</p>
              ) : entries.length === 0 ? (
                <p className="text-sm text-muted-foreground">No entries found.</p>
              ) : (
                <div className="space-y-4">
                  {entries.map((entry) => (
                    <Card key={entry.id} className="border border-border/50">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-semibold">{entry.date}</h4>
                            {entry.time && (
                              <p className="text-sm text-muted-foreground">{entry.time}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Mood:</span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Heart
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= entry.mood ? 'text-primary fill-current' : 'text-muted-foreground'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Vitals */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="health-metric">
                            <Heart className="h-4 w-4 text-success" />
                            <div>
                              <p className="text-sm font-medium">BP</p>
                              <p className="text-xs text-muted-foreground">{entry.bloodPressure || entry.bp} mmHg</p>
                            </div>
                          </div>
                          <div className="health-metric">
                            <Activity className="h-4 w-4 text-success" />
                            <div>
                              <p className="text-sm font-medium">HR</p>
                              <p className="text-xs text-muted-foreground">{entry.heartRate || entry.hr} bpm</p>
                            </div>
                          </div>
                          <div className="health-metric">
                            <Thermometer className="h-4 w-4 text-success" />
                            <div>
                              <p className="text-sm font-medium">Temp</p>
                              <p className="text-xs text-muted-foreground">{entry.temperature || entry.temp}°F</p>
                            </div>
                          </div>
                          <div className="health-metric">
                            <Droplet className="h-4 w-4 text-success" />
                            <div>
                              <p className="text-sm font-medium">Sugar</p>
                              <p className="text-xs text-muted-foreground">{entry.sugar} mg/dL</p>
                            </div>
                          </div>
                        </div>

                        {/* Symptoms */}
                        {entry.symptoms && entry.symptoms.length > 0 && (
                          <div className="mb-3">
                            <p className="text-sm font-medium mb-2">Symptoms:</p>
                            <div className="flex gap-2 flex-wrap">
                              {Array.isArray(entry.symptoms)
                                ? entry.symptoms.map((s: string, idx: number) => (
                                    <Badge key={idx} variant="outline">{s}</Badge>
                                  ))
                                : entry.symptoms.split(",").map((s: string, idx: number) => (
                                    <Badge key={idx} variant="outline">{s.trim()}</Badge>
                                  ))}
                            </div>
                          </div>
                        )}

                        {/* Notes */}
                        {entry.notes && (
                          <div>
                            <p className="text-sm font-medium mb-1">Notes:</p>
                            <p className="text-sm text-muted-foreground">{entry.notes}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
