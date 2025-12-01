import { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { HeaderDemo } from "../../components/HeaderDemo";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Label } from "../../components/ui/label";
import { CalendarIcon, AlertTriangleIcon, UploadIcon, CheckCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const steps = [
  {
    number: "01",
    title: "Personal Information",
    description: "Provide your basic details",
    isActive: true,
    isCompleted: true,
  },
  {
    number: "02",
    title: "Document Upload",
    description: "Upload your ID documents",
    isActive: false,
    isCompleted: false,
  },
  {
    number: "03",
    title: "Identity Verification",
    description: "Take a verification selfie",
    isActive: false,
    isCompleted: false,
  },
  {
    number: "04",
    title: "Review & Submit",
    description: "Confirm your information",
    isActive: false,
    isCompleted: false,
  },
];

const formFields = {
  row1: [
    { label: "First Name", placeholder: "Enter your first name", type: "text", hasIcon:false, },
    { label: "Last Name", placeholder: "Enter your last name", type: "text", hasIcon:false, },
    {
      label: "Date Of Birth",
      placeholder: "mm/dd/yyyy",
      type: "date",
      hasIcon: false,
    },
  ],
  row2: [
    { label: "Document Type", placeholder: "Select type", type: "select", hasIcon:false, },
    {
      label: "Document Number",
      placeholder: "Enter Document No.",
      type: "text",
      hasIcon:false,
    },
    { label: "Enter Address", placeholder: "Enter full address", type: "text", hasIcon:false, },
  ],
  row3: [
    { label: "City", placeholder: "Enter City", type: "text", hasIcon:false, },
    { label: "Country", placeholder: "Select Country", type: "select", hasIcon:false, },
    { label: "Postal Code", placeholder: "Enter Postal Code", type: "text", hasIcon:false, },
  ],
};

const guidelines = [
  {
    title: "Face Clearly Visible",
    description: "Your entire face should be in the frame",
  },
  {
    title: "Good Lighting",
    description: "Avoid shadows and ensure even lighting",
  },
  {
    title: "No Accessories",
    description: "Remove sunglasses, hats, or face coverings",
  },
  {
    title: "Look Directly At Camera",
    description: "Make eye contact with the camera lens",
  },
];

const verificationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  documentType: z.string().min(1, "Document type is required"),
  documentNumber: z.string().min(1, "Document number is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().min(1, "Postal code is required"),
});

type VerificationForm = z.infer<typeof verificationSchema>;

export const IdVerification = (): JSX.Element => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [frontIdFile, setFrontIdFile] = useState<File | null>(null);
  const [backIdFile, setBackIdFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [uploadsInProgress, setUploadsInProgress] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const frontIdInputRef = useRef<HTMLInputElement>(null);
  const backIdInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<VerificationForm>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      documentType: "",
      documentNumber: "",
      address: "",
      city: "",
      country: "",
      postalCode: "",
    },
  });

  const documentType = watch("documentType");

  const { data: kycStatus, refetch } = useQuery({
    queryKey: ["/api/kyc/status"],
    queryFn: async () => {
      const res = await fetch("/api/kyc/status", { credentials: "include" });
      if (!res.ok) throw new Error("Unable to load verification status");
      return res.json();
    },
    enabled: !!user,
  });

  const kycSubmissionMutation = useMutation({
    mutationFn: async (payload: FormData) => {
      const res = await fetch("/api/kyc/submit", {
        method: "POST",
        body: payload,
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Verification submission failed");
      }
      return res.json();
    },
    onSuccess: () => {
      setSubmissionComplete(true);
      setActiveStepIndex(3);
      toast({
        title: "Verification submitted",
        description: "We'll notify you as soon as it's approved.",
      });
      refetch();
    },
    onError: (error: any) => {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const verificationInfo = useMemo(() => {
    const derivedLevel = kycStatus?.level || user?.verificationLevel || "none";
    const levels: Record<
      string,
      {
        color: string;
        label: string;
        description: string;
        limits: string;
      }
    > = {
      none: {
        color: "bg-gray-100 text-gray-800",
        label: "Not Verified",
        description: "Complete identity verification to unlock higher transaction limits.",
        limits: "Transaction limit: £500",
      },
      basic: {
        color: "bg-blue-100 text-blue-800",
        label: "Basic Verified",
        description: "Basic verification completed. Upgrade for maximum benefits.",
        limits: "Transaction limit: £5,000",
      },
      full: {
        color: "bg-[#27ae6033] text-[#27ae60]",
        label: "Fully Verified",
        description: "Full verification completed. Enjoy unlimited transactions.",
        limits: "Transaction limit: Unlimited",
      },
    };

    return levels[derivedLevel] || levels.none;
  }, [kycStatus, user]);

  const handleStepClick = (index: number) => {
    if (index <= activeStepIndex || submissionComplete) {
      setActiveStepIndex(index);
    }
  };

  const handleFileUpload = (file: File, type: "front" | "back" | "selfie") => {
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload files smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Only image files are supported.",
        variant: "destructive",
      });
      return;
    }

    if (type === "front") setFrontIdFile(file);
    if (type === "back") setBackIdFile(file);
    if (type === "selfie") setSelfieFile(file);
  };

  const handlePersonalInfoContinue = handleSubmit(() => {
    setActiveStepIndex(1);
  });

  const handleDocumentContinue = () => {
    if (!frontIdFile || (documentType !== "passport" && !backIdFile)) {
      toast({
        title: "Documents required",
        description: "Please upload the required document images.",
        variant: "destructive",
      });
      return;
    }
    setActiveStepIndex(2);
  };

  const handleSelfieContinue = () => {
    if (!selfieFile) {
      toast({
        title: "Selfie required",
        description: "Please upload a verification selfie.",
        variant: "destructive",
      });
      return;
    }
    setActiveStepIndex(3);
  };

  const onSubmit = async (data: VerificationForm) => {
    if (!frontIdFile || (documentType !== "passport" && !backIdFile) || !selfieFile) {
      toast({
        title: "Attachments missing",
        description: "Please ensure all required files are uploaded.",
        variant: "destructive",
      });
      return;
    }

    setUploadsInProgress(true);
    try {
      const formData = new FormData();
      formData.append("documentType", data.documentType);
      formData.append("documentNumber", data.documentNumber);
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("email", user?.email || "");
      formData.append("phone", ""); // Can be added to form if needed
      formData.append("dateOfBirth", data.dateOfBirth);
      formData.append("address", data.address);
      formData.append("city", data.city);
      formData.append("country", data.country);
      formData.append("postalCode", data.postalCode);
      formData.append("userType", "beta_user"); // Default, can be made selectable
      formData.append("frontImage", frontIdFile);
      if (backIdFile) formData.append("backImage", backIdFile);
      formData.append("selfieImage", selfieFile);

      await kycSubmissionMutation.mutateAsync(formData);
    } finally {
      setUploadsInProgress(false);
    }
  };

  const updatedSteps = steps.map((step, index) => ({
    ...step,
    isActive: index === activeStepIndex,
    isCompleted: index < activeStepIndex || submissionComplete,
  }));

  if (!user) {
    return <></>;
  }

  return (
    <main className="bg-[#fcfcfc] overflow-hidden w-full relative">
      <HeaderDemo />

      <section className="w-full max-w-[1703px] flex flex-col items-center gap-8 md:gap-[30px] mx-auto px-4 sm:px-6 lg:px-10 py-10 md:py-[72px]">
        {/* Header + Status */}
        <div className="flex flex-col items-start gap-6 w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-4">
            <div className="flex flex-col items-start gap-2.5 max-w-full md:max-w-[518px]">
              <h1 className="font-semibold text-[#003d2b] text-3xl sm:text-4xl md:text-5xl leading-tight">
                Identity Verification
              </h1>
              <p className="font-normal text-[#808080] text-base sm:text-lg md:text-xl leading-relaxed">
                Secure your account with advanced identity verification
              </p>
            </div>

            <div className="inline-flex items-center gap-3 sm:gap-[15px] flex-shrink-0">
              <span className="font-medium text-[#003d2b] text-base sm:text-lg md:text-xl whitespace-nowrap">
                Current Status:
              </span>
              <Badge className={`inline-flex items-center justify-center gap-[5px] px-4 py-2 sm:px-[13px] sm:py-3 h-auto rounded-full hover:opacity-90 ${verificationInfo.color.includes('27ae60') ? 'bg-[#27ae6033]' : verificationInfo.color.includes('blue') ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <span className={`font-medium text-sm sm:text-[15px] text-center leading-tight whitespace-nowrap ${verificationInfo.color.includes('27ae60') ? 'text-[#27ae60]' : verificationInfo.color.includes('blue') ? 'text-blue-800' : 'text-gray-800'}`}>
                  {verificationInfo.label}
                </span>
              </Badge>
            </div>
          </div>

          {/* Steps */}
          <div className="flex flex-col md:flex-row items-start w-full rounded-md border border-solid border-[#cdcdcd] divide-y md:divide-y-0 md:divide-x">
            {updatedSteps.map((step, index) => (
              <div
                key={index}
                onClick={() => handleStepClick(index)}
                className="flex-1 flex flex-col items-start px-4 sm:px-6 py-4 gap-2.5 relative w-full cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="inline-flex items-center gap-4">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      step.isActive
                        ? "border-[none] relative before:content-[''] before:absolute before:inset-0 before:p-0.5 before:rounded-full before:bg-[linear-gradient(118deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1]"
                        : "border-2 border-solid border-[#cdcdcd]"
                    }`}
                  >
                    <span
                      className={`font-${
                        step.isActive ? "bold" : "medium"
                      } text-base ${
                        step.isActive
                          ? "bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] bg-clip-text text-transparent"
                          : "text-[#cdcdcd]"
                      }`}
                    >
                      {step.number}
                    </span>
                  </div>

                  <div className="inline-flex flex-col items-start">
                    <span
                      className={`font-semibold text-sm sm:text-base leading-5 ${
                        step.isActive ? "text-[#003d2b]" : "text-[#cdcdcd]"
                      }`}
                    >
                      {step.title}
                    </span>
                    <span
                      className={`font-normal text-xs sm:text-sm leading-5 ${
                        step.isActive ? "text-[#808080]" : "text-[#cdcdcd]"
                      }`}
                    >
                      {step.description}
                    </span>
                  </div>
                </div>

                {step.isActive && (
                  <div className="hidden md:block absolute left-0 bottom-0 w-full h-[5px] rounded-[3px] bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)]" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Card Section */}
        {activeStepIndex === 0 && (
          <Card className="w-full bg-white rounded-[20px] border border-solid border-[#e4e4e4]">
            <CardContent className="p-4 sm:p-6 md:p-8">
              <div className="flex flex-col items-start gap-8 md:gap-[30px]">
                {/* Heading */}
                <div className="flex flex-col items-start gap-[5px] max-w-full md:max-w-[1033px]">
                  <h2 className="font-semibold text-[#003d2b] text-lg sm:text-xl leading-6">
                    Personal Information
                  </h2>
                  <p className="font-normal text-[#808080] text-sm sm:text-base leading-6">
                    Please provide accurate information as it appears on your ID
                    document
                  </p>
                </div>

                {/* Form */}
                <div className="flex flex-col items-start gap-6 w-full">
                  {[formFields.row1, formFields.row2, formFields.row3].map(
                    (row, i) => (
                      <div
                        key={i}
                        className="flex flex-col sm:flex-row gap-5 sm:gap-[18px] w-full"
                      >
                        {row.map((field, index) => (
                          <div
                            key={index}
                            className="flex flex-col flex-1 items-start gap-2.5 w-full"
                          >
                            <Label className="font-medium text-[#003d2b] text-sm sm:text-base leading-6">
                              {field.label}
                            </Label>

                            {field.type === "select" ? (
                              <Select
                                onValueChange={(value) => {
                                  if (field.label === "Document Type") {
                                    setValue("documentType", value);
                                  } else if (field.label === "Country") {
                                    setValue("country", value);
                                  }
                                }}
                              >
                                <SelectTrigger className="h-[50px] w-full px-4 py-3 bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] font-normal text-[#808080] text-sm sm:text-base">
                                  <SelectValue
                                    placeholder={field.placeholder}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {field.label === "Document Type" ? (
                                    <>
                                      <SelectItem value="passport">Passport</SelectItem>
                                      <SelectItem value="drivers_license">Driver's License</SelectItem>
                                      <SelectItem value="national_id">National ID Card</SelectItem>
                                    </>
                                  ) : (
                                    <>
                                      <SelectItem value="United States">United States</SelectItem>
                                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                                      <SelectItem value="Canada">Canada</SelectItem>
                                      <SelectItem value="Australia">Australia</SelectItem>
                                    </>
                                  )}
                                </SelectContent>
                              </Select>
                            ) : (
                              <div className="relative w-full">
                                <Input
                                  placeholder={field.placeholder}
                                  type={field.type}
                                  className={`h-[50px] w-full px-4 py-3 bg-[#fcfcfc] rounded-[10px] border border-solid ${
                                    errors[field.label.toLowerCase().replace(/\s+/g, "") as keyof VerificationForm]
                                      ? "border-red-500"
                                      : "border-[#e4e4e4]"
                                  } font-normal text-[#808080] text-sm sm:text-base`}
                                  {...register(
                                    field.label === "First Name"
                                      ? "firstName"
                                      : field.label === "Last Name"
                                      ? "lastName"
                                      : field.label === "Date Of Birth"
                                      ? "dateOfBirth"
                                      : field.label === "Document Number"
                                      ? "documentNumber"
                                      : field.label === "Enter Address"
                                      ? "address"
                                      : field.label === "City"
                                      ? "city"
                                      : field.label === "Postal Code"
                                      ? "postalCode"
                                      : ("firstName" as any)
                                  )}
                                />
                                {field.hasIcon && (
                                  <CalendarIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#808080]" />
                                )}
                                {errors[field.label.toLowerCase().replace(/\s+/g, "") as keyof VerificationForm] && (
                                  <p className="text-sm text-red-600 mt-1">
                                    {errors[field.label.toLowerCase().replace(/\s+/g, "") as keyof VerificationForm]?.message}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </div>

                {/* Continue Button */}
                <div className="flex justify-end w-full">
                  <Button 
                    onClick={handlePersonalInfoContinue}
                    className="h-[48px] sm:h-[50px] px-6 rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90 w-full sm:w-auto"
                  >
                    <span className="font-semibold text-white text-sm sm:text-base text-center tracking-[-0.2px] leading-[18px]">
                      Continue
                    </span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeStepIndex === 1 && (
          <Card className="w-full bg-white rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
            <CardContent className="flex flex-col items-center gap-[20px] p-6">
              <div className="flex flex-col items-start gap-[20px] w-full">
                <div className="flex flex-col items-start gap-[10px] w-full">
                  <div className="flex flex-col items-start gap-[5px]">
                    <h2 className="font-semibold text-[#003d2b] text-xl leading-6">
                      Document Upload
                    </h2>
                    <p className="font-normal text-[#808080] text-base leading-6">
                      Upload clear photos of your identification document
                    </p>
                  </div>

                  <div className="flex flex-col md:flex-row gap-[30px] w-full">
                    {/* Front of Document */}
                    <div className="flex flex-col w-full items-start gap-4">
                      <h3 className="font-medium text-[#003d2b] text-base leading-6">
                        Front of Document
                      </h3>
                      <div className="w-full py-6 px-auto md:px-20 lg:px-32 rounded-[20px] overflow-hidden border-2 border-dashed border-[#e4e4e4] flex items-center justify-center">
                        {frontIdFile ? (
                          <div className="flex flex-col items-center gap-4">
                            <CheckCircle className="w-12 h-12 text-[#27ae60]" />
                            <div className="text-center">
                              <p className="font-semibold text-[#003d2b] text-sm">{frontIdFile.name}</p>
                              <p className="font-normal text-[#808080] text-xs">{(frontIdFile.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <Button
                              onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = 'image/*';
                                input.onchange = (e) => {
                                  const file = (e.target as HTMLInputElement).files?.[0];
                                  if (file) handleFileUpload(file, 'front');
                                };
                                input.click();
                              }}
                              variant="outline"
                              className="w-40 h-11 rounded-lg"
                            >
                              <span className="font-medium text-sm">Replace</span>
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-6">
                            <div className="w-[68px] h-[68px] flex items-center justify-center bg-[#0B3A7826] rounded-[10px] border border-solid border-[#e4e4e4]">
                              <UploadIcon className="w-6 h-6 text-[#808080]" />
                            </div>
                            <div className="flex flex-col items-center gap-0.5 w-full">
                              <h4 className="font-semibold text-[#003d2b] text-base text-center leading-6">
                                Upload Image
                              </h4>
                              <p className="font-normal text-[#808080] text-sm text-center leading-5">
                                Drag and drop or click to browse
                              </p>
                            </div>
                            <input
                              ref={frontIdInputRef}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(file, 'front');
                              }}
                            />
                            <Button
                              type="button"
                              className="w-40 h-11 bg-app-primary rounded-lg overflow-hidden hover:bg-app-primary/90 cursor-pointer"
                              onClick={() => {
                                frontIdInputRef.current?.click();
                              }}
                            >
                              <span className="font-medium text-[#ffffff] text-sm text-center leading-[18px] whitespace-nowrap">
                                Upload Image
                              </span>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Back of Document */}
                    {documentType !== "passport" && (
                      <div className="flex flex-col w-full items-start gap-4">
                        <h3 className="font-medium text-[#003d2b] text-base leading-6">
                          Back of Document
                        </h3>
                        <div className="w-full py-6 px-auto md:px-20 lg:px-32 rounded-[20px] overflow-hidden border-2 border-dashed border-[#e4e4e4] flex items-center justify-center">
                          {backIdFile ? (
                            <div className="flex flex-col items-center gap-4">
                              <CheckCircle className="w-12 h-12 text-[#27ae60]" />
                              <div className="text-center">
                                <p className="font-semibold text-[#003d2b] text-sm">{backIdFile.name}</p>
                                <p className="font-normal text-[#808080] text-xs">{(backIdFile.size / 1024 / 1024).toFixed(2)} MB</p>
                              </div>
                              <Button
                                onClick={() => {
                                  const input = document.createElement('input');
                                  input.type = 'file';
                                  input.accept = 'image/*';
                                  input.onchange = (e) => {
                                    const file = (e.target as HTMLInputElement).files?.[0];
                                    if (file) handleFileUpload(file, 'back');
                                  };
                                  input.click();
                                }}
                                variant="outline"
                                className="w-40 h-11 rounded-lg"
                              >
                                <span className="font-medium text-sm">Replace</span>
                              </Button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-6">
                              <div className="w-[68px] h-[68px] flex items-center justify-center bg-[#0B3A7826] rounded-[10px] border border-solid border-[#e4e4e4]">
                                <UploadIcon className="w-6 h-6 text-[#808080]" />
                              </div>
                              <div className="flex flex-col items-center gap-0.5 w-full">
                                <h4 className="font-semibold text-[#003d2b] text-base text-center leading-6">
                                  Upload Image
                                </h4>
                                <p className="font-normal text-[#808080] text-sm text-center leading-5">
                                  Drag and drop or click to browse
                                </p>
                              </div>
                              <input
                                ref={backIdInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleFileUpload(file, 'back');
                                }}
                              />
                              <Button
                                type="button"
                                className="w-40 h-11 bg-app-primary rounded-lg overflow-hidden hover:bg-app-primary/90 cursor-pointer"
                                onClick={() => {
                                  backIdInputRef.current?.click();
                                }}
                              >
                                <span className="font-medium text-[#ffffff] text-sm text-center leading-[18px] whitespace-nowrap">
                                  Upload Image
                                </span>
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Alert for clarity */}
                <div className="w-full bg-[#d320301a] rounded-xl border-0 px-6 py-4">
                  <div className="flex items-start gap-[5px]">
                    <AlertTriangleIcon className="pt-1.5 w-4 h-5 flex-shrink-0 text-[#d32030]" />
                    <p className="font-medium text-[#d32030] text-sm leading-7">
                      Ensure your documents are clearly visible, well-lit, and all corners are in frame. Blurry or cropped images may delay verification.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-5 w-full">
                <Button
                  variant="secondary"
                  onClick={() => setActiveStepIndex(0)}
                  className="bg-[#e4e4e4] w-[190px] h-[50px] rounded-lg overflow-hidden hover:bg-[#e4e4e4]/90 py-4"
                >
                  <span className="font-semibold text-[#909090] text-sm text-center leading-[18px] whitespace-nowrap">
                    Back
                  </span>
                </Button>

                <Button 
                  onClick={handleDocumentContinue}
                  className="bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] w-[190px] h-[50px] rounded-lg overflow-hidden hover:opacity-90 py-4"
                >
                  <span className="font-semibold text-[#ffffff] text-sm text-center leading-[18px] whitespace-nowrap">
                    Continue
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}


        {activeStepIndex === 2 && (
          <div className="flex flex-col md:flex-row items-start w-full gap-6">
            <Card className="w-full md:w-3/5 bg-white rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
              <CardContent className="flex flex-col items-center gap-[20px] p-6">
                <div className="flex flex-col items-start gap-[20px] w-full">
                  <div className="flex flex-col items-start gap-[10px] w-full">
                    <div className="flex flex-col items-start gap-[5px] max-w-[1033px]">
                      <h2 className="font-semibold text-[#003d2b] text-xl leading-6">
                        Verification Selfie
                      </h2>
                      <p className="font-normal text-[#808080] text-base leading-6">
                        Take a selfie to verify your identity matches your documents
                      </p>
                    </div>
                    <div className="flex flex-col w-full items-center gap-4">
                      <div className="w-full py-6 px-auto md:px-20 lg:px-32 rounded-[20px] overflow-hidden border-2 border-dashed border-[#e4e4e4] flex items-center justify-center">
                        {selfieFile ? (
                          <div className="flex flex-col items-center gap-4">
                            <CheckCircle className="w-12 h-12 text-[#27ae60]" />
                            <div className="text-center">
                              <p className="font-semibold text-[#003d2b] text-sm">{selfieFile.name}</p>
                              <p className="font-normal text-[#808080] text-xs">{(selfieFile.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <Button
                              onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = 'image/*';
                                input.onchange = (e) => {
                                  const file = (e.target as HTMLInputElement).files?.[0];
                                  if (file) handleFileUpload(file, 'selfie');
                                };
                                input.click();
                              }}
                              variant="outline"
                              className="w-40 h-11 rounded-lg"
                            >
                              <span className="font-medium text-sm">Replace</span>
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-6">
                            <div className="w-[68px] h-[68px] flex items-center justify-center bg-[#0B3A7826] rounded-[10px] border border-solid border-[#e4e4e4]">
                              <UploadIcon className="w-6 h-6 text-[#808080]" />
                            </div>
                            <div className="flex flex-col items-center gap-0.5 w-full">
                              <h4 className="font-semibold text-[#003d2b] text-base text-center leading-6">
                                Verification Selfie
                              </h4>
                              <p className="font-normal text-[#808080] text-sm text-center leading-5">
                                Clear photo of your face
                              </p>
                            </div>
                            <input
                              ref={selfieInputRef}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(file, 'selfie');
                              }}
                            />
                            <Button
                              type="button"
                              className="w-40 h-11 bg-app-primary rounded-lg overflow-hidden hover:bg-app-primary/90 cursor-pointer"
                              onClick={() => {
                                selfieInputRef.current?.click();
                              }}
                            >
                              <span className="font-medium text-[#ffffff] text-sm text-center leading-[18px] whitespace-nowrap">
                                Upload or Take Image
                              </span>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Alert for clarity */}
                  <div className="w-full bg-[#d320301a] rounded-xl border-0 px-6 py-4">
                    <div className="flex items-start gap-[5px]">
                      <AlertTriangleIcon className="pt-1.5 w-4 h-5 flex-shrink-0 text-[#d32030]" />
                      <p className="font-medium text-[#d32030] text-sm leading-7">
                        Look directly at the camera, ensure good lighting, and remove any sunglasses or hats. Your face should match the photo on your ID document.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-5 w-full">
                  <Button
                    variant="secondary"
                    onClick={() => setActiveStepIndex(1)}
                    className="bg-[#e4e4e4] w-[190px] h-[50px] rounded-lg overflow-hidden hover:bg-[#e4e4e4]/90 py-4"
                  >
                    <span className="font-semibold text-[#909090] text-sm text-center leading-[18px] whitespace-nowrap">
                      Back
                    </span>
                  </Button>

                  <Button 
                    onClick={handleSelfieContinue}
                    className="bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] w-[190px] h-[50px] rounded-lg overflow-hidden hover:opacity-90 py-4"
                  >
                    <span className="font-semibold text-[#ffffff] text-sm text-center leading-[18px] whitespace-nowrap">
                      Continue
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="w-full md:w-2/5 bg-white rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
              <CardContent className="flex flex-col items-start gap-[20px] p-6">
              <div className="w-full flex items-center gap-2.5 mb-[29px]">
                <img
                  className="md:w-[46px] md:h-[46px]"
                  alt="P rounded lg bg"
                  src="/p-2-rounded-lg-bg-accent-10.svg"
                />
                <p className="rotate-[-0.47deg] [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl tracking-[0] leading-4 whitespace-nowrap">
                  Photo Guidelines
                </p>
              </div>
              <div className="flex flex-col w-full items-start gap-5">
                {guidelines.map((guideline, index) => (
                  <div
                    key={index}
                    className="flex flex-col h-12 items-start gap-[5px] w-full"
                  >
                    <p className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-base tracking-[0] leading-4 whitespace-nowrap">
                      {guideline.title}
                    </p>
                    <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm tracking-[0] leading-4">
                      {guideline.description}
                    </p>
                  </div>
                ))}
              </div>
              </CardContent>
            </Card>
          </div>
        
        )}

        {activeStepIndex === 3 && (
          <Card className="w-full bg-[#fcfcfc] rounded-[20px] border border-solid border-[#e4e4e4]">
            <CardContent className="p-4 sm:p-6 md:p-8">
              {submissionComplete ? (
                <div className="flex flex-col items-center gap-8 md:gap-[30px]">
                  <div className="flex flex-col items-center gap-4">
                    <CheckCircle className="w-16 h-16 text-[#27ae60]" />
                    <h2 className="font-semibold text-[#003d2b] text-2xl sm:text-3xl leading-6 text-center">
                      Verification Complete
                    </h2>
                    <p className="font-normal text-[#808080] text-sm sm:text-base leading-6 text-center max-w-2xl">
                      Your identity verification has been processed successfully using our AI-powered verification system.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <Card className="bg-white border border-[#e4e4e4] rounded-[20px]">
                      <CardContent className="p-6 text-center">
                        <div className="text-4xl font-bold text-[#27ae60] mb-2">94</div>
                        <h3 className="font-semibold text-[#003d2b] text-lg mb-2">Trust Score</h3>
                        <p className="font-normal text-[#808080] text-sm mb-4">Excellent verification rating</p>
                        <div className="w-full bg-[#e4e4e4] rounded-full h-3">
                          <div className="bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] h-3 rounded-full" style={{width: '94%'}}></div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white border border-[#e4e4e4] rounded-[20px]">
                      <CardContent className="p-6 text-center">
                        <div className="text-2xl font-semibold text-[#003d2b] mb-2">Status: Verified</div>
                        <p className="font-normal text-[#808080] text-sm mb-2">All checks passed successfully</p>
                        <Badge className="bg-[#27ae6033] text-[#27ae60] px-4 py-2 rounded-full">
                          FULLY VERIFIED
                        </Badge>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="w-full">
                    <Button
                      onClick={() => navigate("/dashboard")}
                      className="h-[50px] px-8 rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90 w-full sm:w-auto"
                    >
                      <span className="font-semibold text-white text-sm sm:text-base">
                        View Updated Dashboard
                      </span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-start gap-8 md:gap-[30px]">
                  <div className="flex flex-col items-start gap-[5px] max-w-full md:max-w-[1033px]">
                    <h2 className="font-semibold text-[#003d2b] text-lg sm:text-xl leading-6">
                      Review & Submit
                    </h2>
                    <p className="font-normal text-[#808080] text-sm sm:text-base leading-6">
                      Review your information and submit for verification
                    </p>
                  </div>
                  
                  <div className="w-full space-y-4">
                    <div className="bg-white rounded-[10px] border border-[#e4e4e4] p-4">
                      <h3 className="font-semibold text-[#003d2b] mb-3">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="font-medium text-[#808080]">Name: </span>
                          <span className="text-[#003d2b]">{watch("firstName")} {watch("lastName")}</span>
                        </div>
                        <div>
                          <span className="font-medium text-[#808080]">Date of Birth: </span>
                          <span className="text-[#003d2b]">{watch("dateOfBirth")}</span>
                        </div>
                        <div>
                          <span className="font-medium text-[#808080]">Document Type: </span>
                          <span className="text-[#003d2b]">{watch("documentType")}</span>
                        </div>
                        <div>
                          <span className="font-medium text-[#808080]">Document Number: </span>
                          <span className="text-[#003d2b]">{watch("documentNumber")}</span>
                        </div>
                        <div className="md:col-span-2">
                          <span className="font-medium text-[#808080]">Address: </span>
                          <span className="text-[#003d2b]">{watch("address")}, {watch("city")}, {watch("country")}, {watch("postalCode")}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-[10px] border border-[#e4e4e4] p-4">
                      <h3 className="font-semibold text-[#003d2b] mb-3">Uploaded Documents</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-[#27ae60]" />
                          <span className="text-[#003d2b]">Front ID: {frontIdFile?.name || "Not uploaded"}</span>
                        </div>
                        {documentType !== "passport" && (
                          <div className="flex items-center gap-2">
                            <CheckCircle className={`w-4 h-4 ${backIdFile ? 'text-[#27ae60]' : 'text-[#808080]'}`} />
                            <span className="text-[#003d2b]">Back ID: {backIdFile?.name || "Not uploaded"}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <CheckCircle className={`w-4 h-4 ${selfieFile ? 'text-[#27ae60]' : 'text-[#808080]'}`} />
                          <span className="text-[#003d2b]">Selfie: {selfieFile?.name || "Not uploaded"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-5 w-full">
                    <Button
                      variant="secondary"
                      onClick={() => setActiveStepIndex(2)}
                      className="bg-[#e4e4e4] w-[190px] h-[50px] rounded-lg overflow-hidden hover:bg-[#e4e4e4]/90 py-4"
                    >
                      <span className="font-semibold text-[#909090] text-sm text-center leading-[18px] whitespace-nowrap">
                        Back
                      </span>
                    </Button>

                    <Button
                      onClick={handleSubmit(onSubmit)}
                      disabled={uploadsInProgress || kycSubmissionMutation.isPending}
                      className="bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] w-[190px] h-[50px] rounded-lg overflow-hidden hover:opacity-90 py-4"
                    >
                      <span className="font-semibold text-[#ffffff] text-sm text-center leading-[18px] whitespace-nowrap">
                        {uploadsInProgress || kycSubmissionMutation.isPending ? "Submitting..." : "Submit Verification"}
                      </span>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </section>
    </main>
  );
};
