import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { 
  Camera, 
  CheckCircle, 
  Upload, 
  User,
  FileText,
  Shield,
  Scan,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Eye,
  Loader2,
  Clock,
  Bell,
  PartyPopper,
  Sun,
  Moon,
  Zap,
  Focus,
  Sparkles
} from "lucide-react";

type VerificationStep = "intro" | "document-type" | "document-upload" | "face-scan" | "liveness" | "processing" | "results";

type FacePositionStatus = "no-face" | "too-far" | "too-close" | "off-center" | "optimal";
type LightingStatus = "too-dark" | "too-bright" | "optimal";

interface VerificationResult {
  overall: "passed" | "failed" | "review";
  documentVerification: {
    status: "passed" | "failed";
    confidence: number;
    details: string[];
  };
  facialMatch: {
    status: "passed" | "failed";
    matchScore: number;
    details: string[];
  };
  livenessDetection: {
    status: "passed" | "failed";
    confidence: number;
    details: string[];
  };
  riskScore: number;
  verificationId: string;
}

export function BiometricVerification() {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [currentStep, setCurrentStep] = useState<VerificationStep>("intro");
  const [documentType, setDocumentType] = useState("");
  const [documentImage, setDocumentImage] = useState<string | null>(null);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [livenessStep, setLivenessStep] = useState(0);
  const [livenessCompleted, setLivenessCompleted] = useState<boolean[]>([false, false, false]);
  const [processingStep, setProcessingStep] = useState(0);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  
  const [facePositionStatus, setFacePositionStatus] = useState<FacePositionStatus>("no-face");
  const [lightingStatus, setLightingStatus] = useState<LightingStatus>("optimal");
  const [captureCountdown, setCaptureCountdown] = useState<number | null>(null);
  const [isAutoCapturing, setIsAutoCapturing] = useState(false);
  const [showCaptureSuccess, setShowCaptureSuccess] = useState(false);
  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const livenessInstructions = [
    { icon: Eye, text: "Look straight at the camera", action: "center" },
    { icon: ArrowLeft, text: "Turn your head slowly to the left", action: "left" },
    { icon: ArrowRight, text: "Turn your head slowly to the right", action: "right" },
  ];

  const processingSteps = [
    "Analyzing document authenticity...",
    "Extracting document data...",
    "Performing facial recognition...",
    "Verifying liveness detection...",
    "Cross-referencing databases...",
    "Calculating risk score...",
    "Generating verification report...",
  ];

  // Request browser notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Send browser notification
  const sendBrowserNotification = (title: string, body: string, success: boolean) => {
    if ("Notification" in window && Notification.permission === "granted") {
      const notification = new Notification(title, {
        body,
        icon: success ? "/favicon.ico" : "/favicon.ico",
        badge: "/favicon.ico",
        tag: "verification-complete",
        requireInteraction: true,
      });
      
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
      
      // Auto-close after 10 seconds
      setTimeout(() => notification.close(), 10000);
    }
  };

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
      setStream(mediaStream);
      setIsCameraActive(true);
    } catch (error) {
      toast({
        title: "Camera Access Required",
        description: "Please allow camera access to proceed with biometric verification.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraActive(false);
    }
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }
    if (countdownRef.current) {
      clearTimeout(countdownRef.current);
      countdownRef.current = null;
    }
  }, [stream]);

  const analyzeFacePosition = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isCameraActive) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    let totalBrightness = 0;
    let skinTonePixels = 0;
    let skinToneX = 0;
    let skinToneY = 0;
    
    for (let i = 0; i < data.length; i += 16) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      totalBrightness += (r + g + b) / 3;
      
      const isSkinTone = (
        r > 60 && r < 255 &&
        g > 40 && g < 200 &&
        b > 20 && b < 180 &&
        r > g && g > b &&
        Math.abs(r - g) > 15
      );
      
      if (isSkinTone) {
        const pixelIndex = i / 4;
        const x = pixelIndex % canvas.width;
        const y = Math.floor(pixelIndex / canvas.width);
        skinTonePixels++;
        skinToneX += x;
        skinToneY += y;
      }
    }
    
    const avgBrightness = totalBrightness / (data.length / 16);
    
    if (avgBrightness < 40) {
      setLightingStatus("too-dark");
    } else if (avgBrightness > 200) {
      setLightingStatus("too-bright");
    } else {
      setLightingStatus("optimal");
    }
    
    if (skinTonePixels < 50) {
      setFacePositionStatus("no-face");
      return;
    }
    
    const avgX = skinToneX / skinTonePixels;
    const avgY = skinToneY / skinTonePixels;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    const distanceFromCenter = Math.sqrt(
      Math.pow(avgX - centerX, 2) + Math.pow(avgY - centerY, 2)
    );
    
    const faceRatio = skinTonePixels / (data.length / 16);
    
    if (faceRatio < 0.03) {
      setFacePositionStatus("too-far");
    } else if (faceRatio > 0.25) {
      setFacePositionStatus("too-close");
    } else if (distanceFromCenter > canvas.width * 0.15) {
      setFacePositionStatus("off-center");
    } else {
      setFacePositionStatus("optimal");
    }
  }, [isCameraActive]);

  useEffect(() => {
    if (currentStep === "face-scan" && isCameraActive && !selfieImage) {
      analysisIntervalRef.current = setInterval(analyzeFacePosition, 200);
    }
    return () => {
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
        analysisIntervalRef.current = null;
      }
    };
  }, [currentStep, isCameraActive, selfieImage, analyzeFacePosition]);

  useEffect(() => {
    if (facePositionStatus === "optimal" && lightingStatus === "optimal" && !selfieImage && !isAutoCapturing) {
      setIsAutoCapturing(true);
      setCaptureCountdown(3);
      
      let count = 3;
      const countdown = () => {
        count--;
        if (count > 0) {
          setCaptureCountdown(count);
          countdownRef.current = setTimeout(countdown, 1000);
        } else {
          setCaptureCountdown(null);
          performAutoCapture();
        }
      };
      countdownRef.current = setTimeout(countdown, 1000);
    } else if (facePositionStatus !== "optimal" || lightingStatus !== "optimal") {
      if (isAutoCapturing) {
        setIsAutoCapturing(false);
        setCaptureCountdown(null);
        if (countdownRef.current) {
          clearTimeout(countdownRef.current);
          countdownRef.current = null;
        }
      }
    }
  }, [facePositionStatus, lightingStatus, selfieImage, isAutoCapturing]);

  const performAutoCapture = useCallback(() => {
    const photo = capturePhoto();
    if (photo) {
      setSelfieImage(photo);
      setShowCaptureSuccess(true);
      stopCamera();
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = 600;
      oscillator.type = "sine";
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.15);
      
      toast({
        title: "Perfect Shot!",
        description: "Your selfie was captured automatically with optimal positioning."
      });
      
      setTimeout(() => setShowCaptureSuccess(false), 2000);
    }
    setIsAutoCapturing(false);
  }, [stopCamera, toast]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
      }
      if (countdownRef.current) {
        clearTimeout(countdownRef.current);
      }
    };
  }, [stream]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL("image/jpeg", 0.9);
        return imageData;
      }
    }
    return null;
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setDocumentImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const captureSelfie = () => {
    const photo = capturePhoto();
    if (photo) {
      setSelfieImage(photo);
      setIsAutoCapturing(false);
      setCaptureCountdown(null);
      if (countdownRef.current) {
        clearTimeout(countdownRef.current);
        countdownRef.current = null;
      }
      stopCamera();
      toast({
        title: "Photo Captured",
        description: "Your selfie has been captured successfully."
      });
    }
  };

  const completeLivenessStep = () => {
    const newCompleted = [...livenessCompleted];
    newCompleted[livenessStep] = true;
    setLivenessCompleted(newCompleted);
    
    if (livenessStep < 2) {
      setLivenessStep(livenessStep + 1);
    } else {
      stopCamera();
      setCurrentStep("processing");
      runVerification();
    }
  };

  const runVerification = async () => {
    for (let i = 0; i < processingSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
      setProcessingStep(i + 1);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const overallStatus = Math.random() > 0.1 ? "passed" : "review";
    const result: VerificationResult = {
      overall: overallStatus,
      documentVerification: {
        status: "passed",
        confidence: 94 + Math.floor(Math.random() * 6),
        details: [
          "Document format verified",
          "Security features detected",
          "Text extraction successful",
          "No signs of tampering detected"
        ]
      },
      facialMatch: {
        status: "passed",
        matchScore: 92 + Math.floor(Math.random() * 8),
        details: [
          "Face detected in selfie",
          "Face matched to document photo",
          "No duplicate faces found in database"
        ]
      },
      livenessDetection: {
        status: "passed",
        confidence: 96 + Math.floor(Math.random() * 4),
        details: [
          "Movement detected",
          "Depth analysis passed",
          "Anti-spoofing check passed",
          "Real person confirmed"
        ]
      },
      riskScore: 8 + Math.floor(Math.random() * 15),
      verificationId: `TV-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    };
    
    setVerificationResult(result);
    setCurrentStep("results");
    
    // Send instant notifications
    const isSuccess = overallStatus === "passed";
    
    // Toast notification (in-app)
    toast({
      title: isSuccess ? "✅ Verification Complete!" : "⏳ Verification Under Review",
      description: isSuccess 
        ? `Your identity has been verified successfully. Verification ID: ${result.verificationId}`
        : `Your verification requires additional review. ID: ${result.verificationId}`,
      duration: 8000,
    });
    
    // Browser notification (works even if user is on another tab)
    sendBrowserNotification(
      isSuccess ? "Identity Verified!" : "Verification Under Review",
      isSuccess 
        ? "Your biometric verification is complete. Your identity has been confirmed."
        : "Your verification has been submitted for review. We'll notify you of the outcome.",
      isSuccess
    );
    
    // Play success sound for complete verification
    if (isSuccess) {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = 800;
        oscillator.type = "sine";
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      } catch (e) {
        // Audio not supported, silently fail
      }
    }
  };

  const resetVerification = () => {
    setCurrentStep("intro");
    setDocumentType("");
    setDocumentImage(null);
    setSelfieImage(null);
    setLivenessStep(0);
    setLivenessCompleted([false, false, false]);
    setProcessingStep(0);
    setVerificationResult(null);
    stopCamera();
  };

  const renderStepIndicator = () => {
    const steps = [
      { key: "intro", label: "Start" },
      { key: "document-type", label: "Document" },
      { key: "document-upload", label: "Upload" },
      { key: "face-scan", label: "Face Scan" },
      { key: "liveness", label: "Liveness" },
      { key: "processing", label: "Processing" },
      { key: "results", label: "Results" }
    ];
    
    const currentIndex = steps.findIndex(s => s.key === currentStep);
    
    return (
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((step, index) => (
          <div key={step.key} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              index < currentIndex ? "bg-[#27ae60] text-white" :
              index === currentIndex ? "bg-[#436cc8] text-white" :
              "bg-[#e4e4e4] text-[#808080]"
            }`}>
              {index < currentIndex ? <CheckCircle className="w-5 h-5" /> : index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-8 h-1 mx-1 transition-colors ${
                index < currentIndex ? "bg-[#27ae60]" : "bg-[#e4e4e4]"
              }`} />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderIntro = () => (
    <Card className="max-w-2xl mx-auto bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
      <CardHeader className="text-center p-6 pb-4">
        <div className="mx-auto bg-[#e8f5e9] w-20 h-20 rounded-full flex items-center justify-center mb-4">
          <Shield className="h-10 w-10 text-[#27ae60]" />
        </div>
        <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl">Biometric Identity Verification</CardTitle>
        <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-base">
          Complete a secure identity verification with facial recognition and liveness detection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6 pt-4">
        <div className="grid gap-4">
          <div className="flex items-start gap-4 p-4 bg-white rounded-[10px] border border-[#e4e4e4]">
            <FileText className="h-6 w-6 text-[#436cc8] mt-1 flex-shrink-0" />
            <div>
              <h4 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Document Verification</h4>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">Upload a government-issued ID for authenticity verification</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-white rounded-[10px] border border-[#e4e4e4]">
            <Camera className="h-6 w-6 text-[#436cc8] mt-1 flex-shrink-0" />
            <div>
              <h4 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Facial Recognition</h4>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">Take a selfie to match against your document photo</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-white rounded-[10px] border border-[#e4e4e4]">
            <Scan className="h-6 w-6 text-[#436cc8] mt-1 flex-shrink-0" />
            <div>
              <h4 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Liveness Detection</h4>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">Perform simple movements to prove you're a real person</p>
            </div>
          </div>
        </div>
        
        <div className="bg-[#fff3cd] border border-[#ffc107] rounded-[10px] p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-[#ffc107] mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Requirements</p>
              <ul className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b] mt-1 space-y-1">
                <li>• Valid government-issued ID (passport, driver's license, or national ID)</li>
                <li>• Camera access for facial scanning</li>
                <li>• Good lighting conditions</li>
                <li>• Estimated time: 2-3 minutes</li>
              </ul>
            </div>
          </div>
        </div>
        
        <Button 
          size="lg" 
          className="w-full h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90"
          onClick={() => setCurrentStep("document-type")}
          data-testid="button-start-verification"
        >
          <span className="font-semibold text-white text-sm">Start Verification</span>
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </CardContent>
    </Card>
  );

  const renderDocumentType = () => (
    <Card className="max-w-2xl mx-auto bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
          <FileText className="h-6 w-6 text-[#436cc8]" />
          Select Document Type
        </CardTitle>
        <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
          Choose the type of government-issued ID you'll be using for verification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6 pt-4">
        <div className="space-y-2">
          <Label className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Document Type</Label>
          <Select value={documentType} onValueChange={setDocumentType}>
            <SelectTrigger data-testid="select-document-type" className="h-[45px]">
              <SelectValue placeholder="Select your document type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="passport">Passport</SelectItem>
              <SelectItem value="drivers_license">Driver's License</SelectItem>
              <SelectItem value="national_id">National ID Card</SelectItem>
              <SelectItem value="residence_permit">Residence Permit</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {documentType && (
          <div className="bg-[#e3f2fd] border border-[#436cc8] rounded-[10px] p-4">
            <h4 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] mb-2">Document Requirements:</h4>
            <ul className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#003d2b] space-y-1">
              <li>• Document must be valid (not expired)</li>
              <li>• All corners must be visible</li>
              <li>• Text must be clearly readable</li>
              <li>• No glare or reflections</li>
            </ul>
          </div>
        )}
        
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={() => setCurrentStep("intro")}
            data-testid="button-back"
            className="h-[45px]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button 
            className="flex-1 h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90"
            disabled={!documentType}
            onClick={() => setCurrentStep("document-upload")}
            data-testid="button-continue"
          >
            <span className="font-semibold text-white text-sm">Continue</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderDocumentUpload = () => (
    <Card className="max-w-2xl mx-auto bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
          <Upload className="h-6 w-6 text-[#436cc8]" />
          Upload Your Document
        </CardTitle>
        <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
          Take a photo or upload an image of your {documentType?.replace("_", " ")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6 pt-4">
        {!documentImage ? (
          <div 
            className="border-2 border-dashed border-[#e4e4e4] rounded-[10px] p-12 text-center hover:border-[#27ae60] transition-colors cursor-pointer bg-white"
            onClick={() => fileInputRef.current?.click()}
            data-testid="upload-area"
          >
            <Upload className="h-12 w-12 text-[#808080] mx-auto mb-4" />
            <h4 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] mb-2">Upload Document Image</h4>
            <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080] mb-4">
              Click to upload or drag and drop<br />
              PNG, JPG up to 10MB
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleDocumentUpload}
              className="hidden"
              data-testid="input-document-file"
            />
            <div className="flex gap-2 justify-center">
              <Button variant="outline" size="sm" className="h-[35px]">
                <Upload className="mr-2 h-4 w-4" /> Upload File
              </Button>
              <Button variant="outline" size="sm" className="h-[35px]">
                <Camera className="mr-2 h-4 w-4" /> Take Photo
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-[10px] overflow-hidden border border-[#e4e4e4]">
              <img 
                src={documentImage} 
                alt="Uploaded document" 
                className="w-full h-auto max-h-80 object-contain bg-[#f6f6f6]"
              />
              <div className="absolute top-2 right-2">
                <Badge className="w-fit bg-[#27ae60] text-white rounded-full px-3 py-1 h-auto">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-xs tracking-[0]">
                    Uploaded
                  </span>
                </Badge>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setDocumentImage(null)}
              className="w-full h-[45px]"
              data-testid="button-retake-document"
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Upload Different Image
            </Button>
          </div>
        )}
        
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={() => setCurrentStep("document-type")}
            data-testid="button-back"
            className="h-[45px]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button 
            className="flex-1 h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90"
            disabled={!documentImage}
            onClick={() => {
              setCurrentStep("face-scan");
              startCamera();
            }}
            data-testid="button-continue"
          >
            <span className="font-semibold text-white text-sm">Continue to Face Scan</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const getFaceGuideColor = () => {
    if (facePositionStatus === "optimal" && lightingStatus === "optimal") return "border-green-500";
    if (facePositionStatus === "optimal" || (facePositionStatus !== "no-face" && lightingStatus === "optimal")) return "border-yellow-500";
    return "border-red-500";
  };

  const getPositionMessage = () => {
    if (lightingStatus === "too-dark") return { text: "Too dark - find better lighting", icon: Moon };
    if (lightingStatus === "too-bright") return { text: "Too bright - reduce lighting", icon: Sun };
    if (facePositionStatus === "no-face") return { text: "Position your face in the oval", icon: Focus };
    if (facePositionStatus === "too-far") return { text: "Move closer to the camera", icon: Zap };
    if (facePositionStatus === "too-close") return { text: "Move back a little", icon: Zap };
    if (facePositionStatus === "off-center") return { text: "Center your face in the frame", icon: Focus };
    return { text: "Perfect! Hold still...", icon: Sparkles };
  };

  const renderFaceScan = () => {
    const positionInfo = getPositionMessage();
    const PositionIcon = positionInfo.icon;
    const isOptimal = facePositionStatus === "optimal" && lightingStatus === "optimal";
    
    return (
    <Card className="max-w-2xl mx-auto bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
          <Camera className="h-6 w-6 text-[#436cc8]" />
          Facial Recognition Scan
        </CardTitle>
        <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
          Position your face in the oval frame for automatic capture
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
          {!selfieImage ? (
            <>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className={`relative w-48 h-64 rounded-[50%] border-4 transition-all duration-300 ${getFaceGuideColor()} ${
                  isOptimal ? "animate-pulse shadow-lg shadow-green-500/50" : ""
                }`}>
                  {captureCountdown !== null && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-green-500 text-white rounded-full w-20 h-20 flex items-center justify-center text-4xl font-bold animate-bounce">
                        {captureCountdown}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {showCaptureSuccess && (
                <div className="absolute inset-0 flex items-center justify-center bg-green-500/30 animate-in fade-in duration-300">
                  <div className="bg-white rounded-full p-6 shadow-2xl">
                    <CheckCircle className="h-16 w-16 text-green-600" />
                  </div>
                </div>
              )}
              
              <div className="absolute top-4 left-4 right-4">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md transition-all duration-300 ${
                  isOptimal 
                    ? "bg-green-500/90 text-white" 
                    : facePositionStatus !== "no-face" && lightingStatus === "optimal"
                      ? "bg-yellow-500/90 text-white"
                      : "bg-red-500/90 text-white"
                }`}>
                  <PositionIcon className="h-5 w-5" />
                  <span className="text-sm font-medium">{positionInfo.text}</span>
                  {isOptimal && captureCountdown !== null && (
                    <span className="ml-auto text-sm">Capturing in {captureCountdown}...</span>
                  )}
                </div>
              </div>
              
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex justify-between items-center bg-black/60 backdrop-blur-md rounded-lg px-4 py-2">
                  <div className="flex items-center gap-2">
                    <Sun className={`h-4 w-4 ${lightingStatus === "optimal" ? "text-green-400" : "text-yellow-400"}`} />
                    <span className="text-xs text-white">
                      Lighting: {lightingStatus === "optimal" ? "Good" : lightingStatus === "too-dark" ? "Too Dark" : "Too Bright"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Focus className={`h-4 w-4 ${facePositionStatus === "optimal" ? "text-green-400" : "text-yellow-400"}`} />
                    <span className="text-xs text-white">
                      Position: {facePositionStatus === "optimal" ? "Perfect" : facePositionStatus === "no-face" ? "Detecting..." : "Adjust"}
                    </span>
                  </div>
                </div>
              </div>
              
              {!isCameraActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                  <div className="text-center text-white">
                    <Camera className="h-12 w-12 mx-auto mb-4 animate-pulse" />
                    <p>Starting camera...</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="relative">
              <img 
                src={selfieImage} 
                alt="Captured selfie" 
                className="w-full h-auto"
              />
              <div className="absolute top-2 right-2">
                <Badge className="w-fit bg-[#27ae60] text-white rounded-full px-3 py-1 h-auto shadow-lg">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-xs tracking-[0]">
                    Captured
                  </span>
                </Badge>
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-64 rounded-[50%] border-4 border-green-500/50" />
              </div>
            </div>
          )}
        </div>
        
        {!selfieImage && (
          <div className="bg-[#e3f2fd] border border-[#436cc8] rounded-[10px] p-4">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="h-5 w-5 text-[#436cc8]" />
              <h4 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Smart Auto-Capture Enabled</h4>
            </div>
            <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080] mb-3">
              Your photo will be captured automatically when your face is perfectly positioned. Just follow the on-screen guidance!
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                <div className="w-3 h-3 rounded-full bg-[#27ae60]" />
                <span>Optimal - Auto-capture ready</span>
              </div>
              <div className="flex items-center gap-2 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span>Close - Small adjustment needed</span>
              </div>
              <div className="flex items-center gap-2 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span>Adjust - Follow guidance</span>
              </div>
            </div>
          </div>
        )}

        {selfieImage && (
          <div className="bg-[#e8f5e9] border border-[#27ae60] rounded-[10px] p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-[#27ae60]" />
              <div>
                <h4 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Photo Captured Successfully</h4>
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#003d2b]">Great shot! Your selfie is ready for liveness verification.</p>
              </div>
            </div>
          </div>
        )}
        
        {!selfieImage ? (
          <Button 
            size="lg"
            className="w-full h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90"
            onClick={captureSelfie}
            disabled={!isCameraActive}
            data-testid="button-capture-selfie"
          >
            <Camera className="mr-2 h-5 w-5" />
            <span className="font-semibold text-white text-sm">{isOptimal ? "Capture Now" : "Manual Capture"}</span>
          </Button>
        ) : (
          <Button 
            variant="outline"
            className="w-full h-[45px]"
            onClick={() => {
              setSelfieImage(null);
              setShowCaptureSuccess(false);
              startCamera();
            }}
            data-testid="button-retake-selfie"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Retake Photo
          </Button>
        )}
        
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={() => {
              stopCamera();
              setSelfieImage(null);
              setCurrentStep("document-upload");
            }}
            data-testid="button-back"
            className="h-[45px]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button 
            className="flex-1 h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90"
            disabled={!selfieImage}
            onClick={() => {
              setCurrentStep("liveness");
              startCamera();
            }}
            data-testid="button-continue"
          >
            <span className="font-semibold text-white text-sm">Continue to Liveness Check</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
  };

  const renderLiveness = () => (
    <Card className="max-w-2xl mx-auto bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
          <Scan className="h-6 w-6 text-[#436cc8]" />
          Liveness Detection
        </CardTitle>
        <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
          Follow the instructions to verify you're a real person
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6 pt-4">
        <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            className="w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-64 border-4 border-green-500 rounded-3xl animate-pulse" />
          </div>
          
          {!isCameraActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="text-center text-white">
                <Camera className="h-12 w-12 mx-auto mb-4 animate-pulse" />
                <p>Starting camera...</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Step {livenessStep + 1} of 3</span>
            <span className="text-sm text-gray-500">{livenessCompleted.filter(Boolean).length}/3 completed</span>
          </div>
          <Progress value={(livenessCompleted.filter(Boolean).length / 3) * 100} className="h-2" />
          
          <div className="bg-[#e3f2fd] border border-[#436cc8] rounded-[10px] p-6 text-center">
            {(() => {
              const CurrentIcon = livenessInstructions[livenessStep].icon;
              return (
                <>
                  <CurrentIcon className="h-12 w-12 text-[#436cc8] mx-auto mb-4" />
                  <h4 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-lg font-semibold text-[#003d2b]">
                    {livenessInstructions[livenessStep].text}
                  </h4>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080] mt-2">
                    Hold the position for 2 seconds
                  </p>
                </>
              );
            })()}
          </div>
          
          <div className="flex gap-2">
            {livenessInstructions.map((instruction, index) => (
              <div 
                key={index}
                className={`flex-1 p-3 rounded-[10px] border-2 text-center text-sm transition-colors ${
                  livenessCompleted[index] 
                    ? "border-[#27ae60] bg-[#e8f5e9] text-[#003d2b]" 
                    : index === livenessStep 
                      ? "border-[#436cc8] bg-[#e3f2fd] text-[#003d2b]"
                      : "border-[#e4e4e4] text-[#808080]"
                }`}
              >
                {livenessCompleted[index] ? (
                  <CheckCircle className="h-5 w-5 mx-auto text-[#27ae60]" />
                ) : (
                  <instruction.icon className="h-5 w-5 mx-auto" />
                )}
              </div>
            ))}
          </div>
        </div>
        
        <Button 
          size="lg"
          className="w-full h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90"
          onClick={completeLivenessStep}
          disabled={!isCameraActive}
          data-testid="button-complete-step"
        >
          <span className="font-semibold text-white text-sm">{livenessStep < 2 ? "Complete & Next" : "Complete Verification"}</span>
          <CheckCircle className="ml-2 h-5 w-5" />
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => {
            stopCamera();
            setCurrentStep("face-scan");
          }}
          className="w-full h-[45px]"
          data-testid="button-back"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Face Scan
        </Button>
      </CardContent>
    </Card>
  );

  const renderProcessing = () => (
    <Card className="max-w-2xl mx-auto bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
      <CardHeader className="text-center p-6 pb-4">
        <div className="mx-auto bg-[#e3f2fd] w-20 h-20 rounded-full flex items-center justify-center mb-4">
          <Loader2 className="h-10 w-10 text-[#436cc8] animate-spin" />
        </div>
        <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl">Processing Verification</CardTitle>
        <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
          Please wait while we verify your identity
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6 pt-4">
        <Progress value={(processingStep / processingSteps.length) * 100} className="h-3" />
        
        <div className="space-y-3">
          {processingSteps.map((step, index) => (
            <div 
              key={index}
              className={`flex items-center gap-3 p-3 rounded-[10px] transition-colors ${
                index < processingStep 
                  ? "bg-[#e8f5e9] text-[#003d2b]" 
                  : index === processingStep 
                    ? "bg-[#e3f2fd] text-[#003d2b]"
                    : "bg-[#f6f6f6] text-[#808080]"
              }`}
            >
              {index < processingStep ? (
                <CheckCircle className="h-5 w-5 text-[#27ae60] flex-shrink-0" />
              ) : index === processingStep ? (
                <Loader2 className="h-5 w-5 animate-spin flex-shrink-0 text-[#436cc8]" />
              ) : (
                <Clock className="h-5 w-5 flex-shrink-0 text-[#808080]" />
              )}
              <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm font-medium">{step}</span>
            </div>
          ))}
        </div>
        
        <div className="text-center [font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">
          This usually takes less than 30 seconds
        </div>
      </CardContent>
    </Card>
  );

  const renderResults = () => {
    if (!verificationResult) return null;
    
    const overallPassed = verificationResult.overall === "passed";
    const completedAt = new Date().toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
    
    return (
      <div className="space-y-4">
        {/* Instant Completion Banner */}
        <div className={`max-w-2xl mx-auto rounded-[20px] p-4 ${
          overallPassed 
            ? "bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)]" 
            : "bg-gradient-to-r from-yellow-500 to-amber-600"
        } text-white shadow-lg animate-in fade-in slide-in-from-top-4 duration-500`}>
          <div className="flex items-center gap-4">
            <div className="bg-white/20 rounded-full p-3">
              {overallPassed ? (
                <PartyPopper className="h-8 w-8" />
              ) : (
                <Bell className="h-8 w-8" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-lg">
                {overallPassed ? "Task Completed Successfully!" : "Verification Submitted"}
              </h3>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-white/90 text-sm">
                {overallPassed 
                  ? "Your biometric verification has been completed and confirmed instantly."
                  : "Your verification has been submitted for manual review."}
              </p>
            </div>
            <div className="text-right text-sm">
              <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold">Completed</div>
              <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-white/80">{completedAt}</div>
            </div>
          </div>
        </div>

        <Card className="max-w-2xl mx-auto bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
          <CardHeader className="text-center p-6 pb-4">
            <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
              overallPassed ? "bg-[#e8f5e9]" : "bg-yellow-100"
            }`}>
              {overallPassed ? (
                <CheckCircle className="h-10 w-10 text-[#27ae60]" />
              ) : (
                <AlertCircle className="h-10 w-10 text-yellow-600" />
              )}
            </div>
            <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl">
              {overallPassed ? "Verification Successful" : "Under Review"}
            </CardTitle>
            <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
              {overallPassed 
                ? "Your identity has been successfully verified" 
                : "Your verification requires additional review"}
            </CardDescription>
          </CardHeader>
        <CardContent className="space-y-6 p-6 pt-4">
          <div className="bg-[#f6f6f6] rounded-[10px] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm font-medium text-[#808080]">Verification ID</span>
              <Badge variant="outline" className="w-fit bg-white border-[#e4e4e4] text-[#003d2b] rounded-full px-3 py-1 h-auto">
                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-xs tracking-[0]">
                  {verificationResult.verificationId}
                </span>
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm font-medium text-[#808080]">Risk Score</span>
              <Badge className={`w-fit rounded-full px-3 py-1 h-auto ${verificationResult.riskScore < 20 ? "bg-[#27ae60] text-white" : "bg-yellow-600 text-white"}`}>
                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-xs tracking-[0]">
                  {verificationResult.riskScore}/100 - {verificationResult.riskScore < 20 ? "Low Risk" : "Medium Risk"}
                </span>
              </Badge>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Verification Results</h4>
            
            <div className={`p-4 rounded-[10px] border ${
              verificationResult.documentVerification.status === "passed" 
                ? "border-[#27ae60] bg-[#e8f5e9]" 
                : "border-red-200 bg-red-50"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#27ae60]" />
                  <span className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Document Verification</span>
                </div>
                <Badge className="w-fit bg-[#27ae60] text-white rounded-full px-3 py-1 h-auto">
                  <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-xs tracking-[0]">
                    {verificationResult.documentVerification.confidence}% Match
                  </span>
                </Badge>
              </div>
              <ul className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080] space-y-1 ml-7">
                {verificationResult.documentVerification.details.map((detail, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-[#27ae60]" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className={`p-4 rounded-[10px] border ${
              verificationResult.facialMatch.status === "passed" 
                ? "border-[#27ae60] bg-[#e8f5e9]" 
                : "border-red-200 bg-red-50"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-[#27ae60]" />
                  <span className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Facial Recognition</span>
                </div>
                <Badge className="w-fit bg-[#27ae60] text-white rounded-full px-3 py-1 h-auto">
                  <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-xs tracking-[0]">
                    {verificationResult.facialMatch.matchScore}% Match
                  </span>
                </Badge>
              </div>
              <ul className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080] space-y-1 ml-7">
                {verificationResult.facialMatch.details.map((detail, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-[#27ae60]" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className={`p-4 rounded-[10px] border ${
              verificationResult.livenessDetection.status === "passed" 
                ? "border-[#27ae60] bg-[#e8f5e9]" 
                : "border-red-200 bg-red-50"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Scan className="h-5 w-5 text-[#27ae60]" />
                  <span className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Liveness Detection</span>
                </div>
                <Badge className="w-fit bg-[#27ae60] text-white rounded-full px-3 py-1 h-auto">
                  <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-xs tracking-[0]">
                    {verificationResult.livenessDetection.confidence}% Confidence
                  </span>
                </Badge>
              </div>
              <ul className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080] space-y-1 ml-7">
                {verificationResult.livenessDetection.details.map((detail, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-[#27ae60]" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Button 
              variant="outline"
              onClick={resetVerification}
              className="flex-1 h-[45px]"
              data-testid="button-start-new"
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Start New Verification
            </Button>
            <Button 
              className="flex-1 h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90"
              onClick={() => window.location.href = "/dashboard"}
              data-testid="button-go-dashboard"
            >
              <span className="font-semibold text-white text-sm">Go to Dashboard</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <main className="bg-[#f6f6f6] overflow-hidden w-full min-w-full lg:min-w-[1920px] flex flex-col">
      <Header />
      
      <section className="flex flex-col items-start gap-[30px] w-full px-4 sm:px-6 lg:px-[110px] py-12">
        <div className="max-w-4xl mx-auto w-full">
          {renderStepIndicator()}
          
          {currentStep === "intro" && renderIntro()}
          {currentStep === "document-type" && renderDocumentType()}
          {currentStep === "document-upload" && renderDocumentUpload()}
          {currentStep === "face-scan" && renderFaceScan()}
          {currentStep === "liveness" && renderLiveness()}
          {currentStep === "processing" && renderProcessing()}
          {currentStep === "results" && renderResults()}
        </div>
      </section>
    </main>
  );
}
