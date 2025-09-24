import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Upload, FileText, Download, Plus, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface AnalysisResult {
  rating: 'good' | 'bad' | 'great';
  summary: string;
  details?: string;
}

export function HardwareUploadPanel() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const mockAnalyzeHardware = (file: File): Promise<AnalysisResult> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock analysis based on file name or random
        const ratings = [
          {
            rating: 'great' as const,
            summary: 'Excellent for Edge AI Inference! Dual CPUs and 4x T4 GPUs support high-throughput jobs with optimal power efficiency.',
            details: 'This configuration is ideal for production-level AI workloads with redundancy and scalability.'
          },
          {
            rating: 'good' as const,
            summary: 'Suitable for AI Memory Node. Good CPU performance but limited GPU capacity for inference workloads.',
            details: 'Recommended for memory-intensive tasks and data preprocessing rather than real-time inference.'
          },
          {
            rating: 'bad' as const,
            summary: 'Not optimal for AI workloads. Insufficient GPU compute and memory for modern AI inference requirements.',
            details: 'Consider upgrading GPU configuration for AI applications.'
          }
        ];
        
        const randomResult = ratings[Math.floor(Math.random() * ratings.length)];
        resolve(randomResult);
      }, 2000);
    });
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const validFile = files.find(file => 
      file.type === 'application/pdf' || 
      file.type.includes('document') ||
      file.type.includes('sheet') ||
      file.name.endsWith('.txt')
    );
    
    if (validFile) {
      handleFileUpload(validFile);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOC, XLS, or TXT file.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const result = await mockAnalyzeHardware(file);
      setAnalysisResult(result);
      toast({
        title: "Analysis complete",
        description: `Hardware rated as ${result.rating}`,
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Failed to analyze hardware specs. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRatingIcon = (rating: string) => {
    switch (rating) {
      case 'great':
        return <CheckCircle className="h-4 w-4" />;
      case 'good':
        return <AlertCircle className="h-4 w-4" />;
      case 'bad':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'great':
        return 'bg-green-500 hover:bg-green-600';
      case 'good':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'bad':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-headline font-semibold text-foreground">
          Upload Hardware Specs for AI Node Evaluation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragOver 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-primary/50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="flex flex-col items-center space-y-3">
            <div className="flex space-x-2">
              <FileText className="h-8 w-8 text-red-500" />
              <FileText className="h-8 w-8 text-red-600" />
              <div className="h-8 w-8 bg-green-500 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">X</span>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Drop a PDF or specs file here
              </p>
              <p className="text-xs text-muted-foreground">
                We'll instantly rate its suitability as an inference or memory node
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Upload className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                or
              </span>
              <input
                type="file"
                id="hardware-upload"
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                onChange={handleFileInput}
              />
              <label
                htmlFor="hardware-upload"
                className="text-xs text-primary hover:text-primary/80 cursor-pointer underline"
              >
                browse files
              </label>
            </div>
          </div>
        </div>

        {/* Analysis Results */}
        {(isAnalyzing || analysisResult) && (
          <div className="bg-muted/30 border border-border rounded-lg p-4 space-y-3">
            {isAnalyzing && (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm text-foreground">Analyzing hardware specifications...</span>
              </div>
            )}

            {analysisResult && (
              <>
                <div className="flex items-center space-x-2">
                  <Badge className={`${getRatingColor(analysisResult.rating)} text-white`}>
                    {getRatingIcon(analysisResult.rating)}
                    <span className="ml-1 capitalize">{analysisResult.rating} for Edge AI {analysisResult.rating === 'good' ? 'Memory' : 'Inference'}!</span>
                  </Badge>
                </div>
                
                <p className="text-sm text-foreground leading-relaxed">
                  {analysisResult.summary}
                </p>

                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    <Download className="h-3 w-3 mr-1" />
                    Download full analysis
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    <Plus className="h-3 w-3 mr-1" />
                    Add to inventory
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {uploadedFile && !isAnalyzing && (
          <div className="text-xs text-muted-foreground">
            Uploaded: {uploadedFile.name}
          </div>
        )}
      </CardContent>
    </Card>
  );
}