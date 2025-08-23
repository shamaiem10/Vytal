import { useState } from 'react';
import { Upload, FileText, Clock, Pill, Calendar, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

// Mock data for simplified prescriptions
const simplifiedPrescriptions = [
  {
    id: 1,
    originalText: "Lisinopril 10mg PO QD AC breakfast x30 days, then f/u with PCP for BP management",
    simplified: {
      medication: "Lisinopril",
      dosage: "10mg",
      instructions: "Take 1 pill by mouth every morning before breakfast",
      duration: "30 days",
      purpose: "To help control blood pressure",
      sideEffects: "May cause dizziness, dry cough",
      followUp: "Schedule appointment with your primary doctor after 30 days"
    },
    uploadDate: "2024-01-20",
    status: "active"
  },
  {
    id: 2,
    originalText: "Metformin 500mg BID with meals PRN glucose control, monitor A1C q3mo",
    simplified: {
      medication: "Metformin",
      dosage: "500mg",
      instructions: "Take 1 pill twice daily with breakfast and dinner",
      duration: "Ongoing",
      purpose: "To help control blood sugar levels",
      sideEffects: "May cause stomach upset, nausea",
      followUp: "Blood sugar test every 3 months"
    },
    uploadDate: "2024-01-15",
    status: "active"
  }
];

export default function Prescriptions() {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleProcessPrescription = async () => {
    if (!uploadedFile) {
      toast({
        title: "No file selected",
        description: "Please upload a prescription file first.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Prescription processed successfully!",
        description: "Your prescription has been simplified and added to your list.",
      });
      setUploadedFile(null);
      // Reset file input
      const fileInput = document.getElementById('prescription-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      setActiveTab('simplified');
    }, 3000);
  };

  const renderMedicationCard = (prescription: typeof simplifiedPrescriptions[0]) => (
    <Card key={prescription.id} className="health-card">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-primary" />
              {prescription.simplified.medication}
            </CardTitle>
            <CardDescription>
              Uploaded on {prescription.uploadDate}
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
              <p className="text-xs text-muted-foreground">{prescription.simplified.dosage}</p>
            </div>
          </div>
          <div className="health-metric">
            <Calendar className="h-4 w-4 text-primary" />
            <div>
              <p className="font-medium text-sm">Duration</p>
              <p className="text-xs text-muted-foreground">{prescription.simplified.duration}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-sm mb-1">How to take:</h4>
            <p className="text-sm text-muted-foreground">{prescription.simplified.instructions}</p>
          </div>

          <div>
            <h4 className="font-medium text-sm mb-1">What it's for:</h4>
            <p className="text-sm text-muted-foreground">{prescription.simplified.purpose}</p>
          </div>

          <div>
            <h4 className="font-medium text-sm mb-1 flex items-center gap-1">
              <AlertCircle className="h-4 w-4 text-warning" />
              Possible side effects:
            </h4>
            <p className="text-sm text-muted-foreground">{prescription.simplified.sideEffects}</p>
          </div>

          <div>
            <h4 className="font-medium text-sm mb-1 flex items-center gap-1">
              <Clock className="h-4 w-4 text-primary" />
              Follow-up:
            </h4>
            <p className="text-sm text-muted-foreground">{prescription.simplified.followUp}</p>
          </div>
        </div>

        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
            View original prescription text
          </summary>
          <div className="mt-2 p-3 bg-muted rounded-md">
            <p className="text-sm text-muted-foreground font-mono">{prescription.originalText}</p>
          </div>
        </details>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
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
                Upload a photo or scan of your prescription for AI-powered simplification.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="prescription-file">Choose prescription file</Label>
                <Input
                  id="prescription-file"
                  type="file"
                  accept="image/*,.pdf,.txt"
                  onChange={handleFileUpload}
                  className="cursor-pointer"
                />
                <p className="text-sm text-muted-foreground">
                  Supported formats: Images (JPG, PNG), PDF, or text files
                </p>
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

              {isProcessing && (
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    AI is analyzing your prescription and creating simplified instructions...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* How it works */}
          <Card className="health-card">
            <CardHeader>
              <CardTitle>How it works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Upload your prescription</h4>
                    <p className="text-sm text-muted-foreground">Take a photo or upload a digital copy</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">AI processes the text</h4>
                    <p className="text-sm text-muted-foreground">Our system extracts and analyzes the medical information</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Get simplified instructions</h4>
                    <p className="text-sm text-muted-foreground">Receive clear, easy-to-understand medication instructions</p>
                  </div>
                </div>
              </div>
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