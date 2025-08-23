import { useState } from 'react';
import { Upload, FileText, Clock, Pill, Calendar, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

export default function Prescriptions() {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [simplifiedPrescriptions, setSimplifiedPrescriptions] = useState<any[]>([]);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  const handleProcessPrescription = async () => {
    if (!uploadedFile) {
      toast({
        title: "No file selected",
        description: "Please upload a prescription image first.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);

      const res = await fetch('http://localhost:5000/api/prescriptions/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to process prescription');

      const data = await res.json();

      // Backend returns multiple medicines in data.prescriptions (array)
      setSimplifiedPrescriptions(prev => [...data.prescriptions, ...prev]);

      toast({
        title: "Prescription processed!",
        description: "Your prescription has been simplified successfully.",
      });

      setActiveTab('simplified');
      setUploadedFile(null);
      const fileInput = document.getElementById('prescription-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Something went wrong while processing.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderMedicationCard = (prescription: any, idx: number) => (
    <Card key={idx} className="health-card">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-primary" />
              {prescription.medication || "N/A"}
            </CardTitle>
            <CardDescription>
              Uploaded on {prescription.upload_date || new Date().toISOString().split('T')[0]}
            </CardDescription>
          </div>
          <Badge variant={prescription.status === 'active' ? 'default' : 'secondary'}>
            {prescription.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="health-metric">
            <Pill className="h-4 w-4 text-primary" />
            <div>
              <p className="font-medium text-sm">Dosage</p>
              <p className="text-xs text-muted-foreground">{prescription.dosage || "N/A"}</p>
            </div>
          </div>
          <div className="health-metric">
            <Calendar className="h-4 w-4 text-primary" />
            <div>
              <p className="font-medium text-sm">Duration</p>
              <p className="text-xs text-muted-foreground">{prescription.duration || "N/A"}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-sm mb-1">How to take:</h4>
            <p className="text-sm text-muted-foreground">{prescription.instructions || "N/A"}</p>
          </div>

          <div>
            <h4 className="font-medium text-sm mb-1">What it's for:</h4>
            <p className="text-sm text-muted-foreground">{prescription.purpose || "N/A"}</p>
          </div>

          <div>
            <h4 className="font-medium text-sm mb-1 flex items-center gap-1">
              <AlertCircle className="h-4 w-4 text-warning" />
              Possible side effects:
            </h4>
            <p className="text-sm text-muted-foreground">{prescription.side_effects || "N/A"}</p>
          </div>

          <div>
            <h4 className="font-medium text-sm mb-1 flex items-center gap-1">
              <Clock className="h-4 w-4 text-primary" />
              Follow-up:
            </h4>
            <p className="text-sm text-muted-foreground">{prescription.follow_up || "N/A"}</p>
          </div>
        </div>

        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
            View original prescription text
          </summary>
          <div className="mt-2 p-3 bg-muted rounded-md">
            <p className="text-sm text-muted-foreground font-mono">{prescription.original_text || "N/A"}</p>
          </div>
        </details>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Prescription Simplifier</h1>
        <p className="text-muted-foreground">Upload prescriptions and get easy-to-understand instructions.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Prescription</TabsTrigger>
          <TabsTrigger value="simplified">Simplified Prescriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <Card className="health-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Upload Prescription
              </CardTitle>
              <CardDescription>
                Upload a photo of your prescription for AI-powered simplification.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="prescription-file">Choose prescription image</Label>
                <Input
                  id="prescription-file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="cursor-pointer"
                />
              </div>

              {uploadedFile && (
                <div className="health-metric">
                  <FileText className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{uploadedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              )}

              <Button
                onClick={handleProcessPrescription}
                disabled={!uploadedFile || isProcessing}
                variant="medical"
                size="lg"
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Process Prescription
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simplified" className="space-y-6">
          {simplifiedPrescriptions.length > 0 ? (
            <div className="space-y-6">
              {simplifiedPrescriptions.map(renderMedicationCard)}
            </div>
          ) : (
            <Card className="health-card">
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="font-semibold mb-2">No prescriptions yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Upload your first prescription to get started with simplified instructions.
                  </p>
                  <Button onClick={() => setActiveTab('upload')}>
                    Upload Prescription
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
