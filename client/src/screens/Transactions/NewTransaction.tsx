import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, FileCheck, Shield, UploadCloud, RefreshCw } from "lucide-react";

import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

type TransactionForm = {
  title: string;
  description: string;
  amount: string;
  currency: string;
  category: string;
  buyerEmail: string;
  deliveryTimeframe: string;
  buyerType: "individual" | "business";
  complianceDoc?: File | null;
  pepCheck: boolean;
  enhancedDueDiligence: boolean;
  termsAccepted: boolean;
};

const defaultForm: TransactionForm = {
  title: "",
  description: "",
  amount: "",
  currency: "GBP",
  category: "",
  buyerEmail: "",
  deliveryTimeframe: "",
  buyerType: "individual",
  complianceDoc: null,
  pepCheck: false,
  enhancedDueDiligence: false,
  termsAccepted: false,
};

const transactionCategories = [
  "Digital Services",
  "E-commerce",
  "Software Licenses",
  "Consulting",
  "Marketplace",
  "Other",
];

const deliveryTimeframes = [
  "24 hours",
  "1-3 days",
  "3-7 days",
  "1-2 weeks",
  "Custom Agreement",
];

const securityFeatures = [
  { icon: "/fi-11010292.svg", text: "Secure Escrow Protection" },
  { icon: "/fi-2512902.svg", text: "End-to-end Encryption" },
  { icon: "/fi-1150587.svg", text: "Real-time Fraud Monitoring" },
];

const workflowSteps = [
  {
    number: "01",
    title: "Transaction Details",
    description: "Basic Information",
  },
  {
    number: "02",
    title: "KYC & Compliance",
    description: "Identity & Risk Checks",
  },
  {
    number: "03",
    title: "Review & Launch",
    description: "Final Confirmation",
  },
];

export const NewTransaction = (): JSX.Element => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<TransactionForm>(defaultForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const costSummary = useMemo(() => {
    const amount = Number(formData.amount) || 0;
    const escrowFee = amount * 0.025;
    const processing = amount ? 0.3 : 0;

    return [
      { label: "Subtotal", value: amount },
      { label: "TrustVerify Fee (2.5%)", value: escrowFee },
      { label: "Payment Processing", value: processing },
    ];
  }, [formData.amount]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: formData.currency || "GBP",
    }).format(value);

  const totalCost = costSummary.reduce((sum, item) => sum + item.value, 0);

  const handleInputChange = (field: keyof TransactionForm, value: string | boolean | File | null) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateStep = (currentStep: number) => {
    if (currentStep === 0) {
      return (
        formData.title.trim() &&
        formData.description.trim() &&
        formData.amount.trim() &&
        formData.category &&
        formData.buyerEmail &&
        formData.deliveryTimeframe
      );
    }

    if (currentStep === 1) {
      return formData.termsAccepted;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateStep(step)) {
      toast({
        title: "Missing Information",
        description: "Please complete the required fields before continuing.",
        variant: "destructive",
      });
      return;
    }
    setStep((prev) => Math.min(prev + 1, workflowSteps.length - 1));
  };

  const handlePrevious = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) {
      toast({
        title: "Review Required",
        description: "Please verify the information before launching.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        amount: Number(formData.amount) || 0,
        currency: formData.currency,
        buyerEmail: formData.buyerEmail,
        category: formData.category,
        deliveryTimeframe: formData.deliveryTimeframe,
        buyerType: formData.buyerType,
        pepCheck: formData.pepCheck,
        enhancedDueDiligence: formData.enhancedDueDiligence,
      };

      await apiRequest("POST", "/api/transactions", payload);
      toast({
        title: "Transaction Created",
        description: "We've saved the transaction and notified the buyer.",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Unable to create transaction",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadComplianceDoc = (files: FileList | null) => {
    if (!files?.length) return;
    setIsUploading(true);
    setTimeout(() => {
      handleInputChange("complianceDoc", files[0]);
      setIsUploading(false);
      toast({
        title: "Document attached",
        description: `${files[0].name} ready for review.`,
      });
    }, 900);
  };

  const stepComplete = (index: number) => index < step;
  const isCurrentStep = (index: number) => index === step;

  return (
    <div className="bg-[#f6f6f6] overflow-hidden w-full flex flex-col">
      <Header />
      <section className="flex flex-col items-start gap-6 w-full max-w-[1703px] mx-auto px-6 py-[72px]">
        <header className="flex flex-col items-start gap-6 w-full">
          <button
            className="inline-flex items-center gap-2.5"
            onClick={() => navigate("/dashboard")}
          >
            <img
              className="w-5 h-5 md:w-6 md:h-6"
              alt="Back arrow"
              src="/flat-color-icons-next.svg"
            />
            <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base md:text-[22px] tracking-[0] leading-[normal]">
              Return to Dashboard
            </span>
          </button>

          <div className="flex flex-col items-start gap-2.5 w-full">
            <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl md:text-5xl tracking-[0] leading-[normal]">
              Create New Transaction
            </h1>
            <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base md:text-xl tracking-[0] leading-8">
              Set up a secure escrow transaction with built-in fraud protection
            </p>
          </div>
        </header>

        <div className="flex flex-col items-start gap-[30px] w-full">
          <nav className="flex items-start rounded-md border border-solid border-[#cdcdcd] overflow-hidden w-full">
            {workflowSteps.map((stepItem, index) => (
              <div
                key={index}
                className={`flex-1 px-6 py-4 flex flex-col gap-2.5 relative ${
                  isCurrentStep(index) ? "" : ""
                }`}
              >
                <div className="inline-flex items-center gap-4">
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-[20px] ${
                      isCurrentStep(index)
                        ? "border-[none] relative before:content-[''] before:absolute before:inset-0 before:p-0.5 before:rounded-[20px] before:[background:linear-gradient(118deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none"
                        : stepComplete(index)
                        ? "border-2 border-solid border-[#27ae60] bg-[#27ae6033]"
                        : "border-2 border-solid border-[#cdcdcd]"
                    }`}
                  >
                    {stepComplete(index) ? (
                      <CheckCircle2 className="w-5 h-5 text-[#27ae60]" />
                    ) : (
                      <span
                        className={`${
                          isCurrentStep(index)
                            ? "bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-base text-center tracking-[0] leading-[normal]"
                            : "[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#cdcdcd] text-base text-center tracking-[0] leading-[normal]"
                        }`}
                      >
                        {stepItem.number}
                      </span>
                    )}
                  </div>
                  <div className="inline-flex flex-col items-start">
                    <span
                      className={`${
                        isCurrentStep(index)
                          ? "[font-family:'Suisse_Intl-Medium',Helvetica] font-medium text-[#003d2b] text-sm text-center tracking-[0] leading-5 whitespace-nowrap"
                          : stepComplete(index)
                          ? "[font-family:'Suisse_Intl-Medium',Helvetica] font-medium text-[#003d2b] text-sm text-center tracking-[0] leading-5 whitespace-nowrap"
                          : "[font-family:'Roboto',Helvetica] font-medium text-[#cdcdcd] text-sm text-center tracking-[0] leading-5 whitespace-nowrap"
                      }`}
                    >
                      {stepItem.title}
                    </span>
                    <span
                      className={`${
                        isCurrentStep(index)
                          ? "[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm text-center tracking-[0] leading-5 whitespace-nowrap"
                          : stepComplete(index)
                          ? "[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm text-center tracking-[0] leading-5 whitespace-nowrap"
                          : "[font-family:'Roboto',Helvetica] font-normal text-[#cdcdcd] text-sm text-center tracking-[0] leading-5 whitespace-nowrap"
                      }`}
                    >
                      {stepItem.description}
                    </span>
                  </div>
                </div>
                {isCurrentStep(index) && (
                  <div className="absolute left-px bottom-0.5 w-full md:w-[266px] h-[5px] rounded-[3px] bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)]" />
                )}
              </div>
            ))}
          </nav>

          <div className="flex flex-col lg:flex-row items-start gap-4 md:gap-6 w-full">
            <Card className="flex-1 bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
              <CardContent className="p-4 md:p-6 flex flex-col gap-6">
                {step === 0 && (
                  <>
                    <div className="flex items-center gap-2.5">
                      <img
                        className="w-10 h-10 md:w-[46px] md:h-[46px]"
                        alt="Transaction icon"
                        src="/p-2-rounded-lg-bg-accent-18-3.svg"
                      />
                      <div className="flex flex-col gap-[5px]">
                        <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-xl text-[#003d2b] tracking-[0] leading-6">
                          Transaction Information
                        </h2>
                        <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base tracking-[0] leading-6">
                          Provide details about what you're selling or the service you're offering
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      <label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-base text-[#003d2b] tracking-[0] leading-6">
                        Transaction Title
                      </label>
                      <Input
                        placeholder="Enter title"
                        value={formData.title}
                        onChange={(event) => handleInputChange("title", event.target.value)}
                        className="h-[50px] px-5 py-[15px] bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base"
                      />
                    </div>

                    <div className="flex flex-col gap-2.5">
                      <label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-base text-[#003d2b] tracking-[0] leading-6">
                        Description
                      </label>
                      <Textarea
                        placeholder="Provide detailed description of your Transaction....."
                        value={formData.description}
                        onChange={(event) => handleInputChange("description", event.target.value)}
                        className="h-[120px] px-5 py-[15px] bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base resize-none"
                      />
                    </div>

                    <div className="flex flex-col md:flex-row items-start gap-[17px]">
                      <div className="flex flex-col gap-2.5 flex-1">
                        <label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-base text-[#003d2b] tracking-[0] leading-6">
                          <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-base tracking-[0] leading-6">
                            Amount {formData.currency}
                          </span>
                        </label>
                        <Input
                          type="number"
                          min="0"
                          placeholder="0.00"
                          value={formData.amount}
                          onChange={(event) => handleInputChange("amount", event.target.value)}
                          className="h-[50px] px-5 py-[15px] bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base"
                        />
                      </div>

                      <div className="flex flex-col gap-2.5 flex-1">
                        <label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-base text-[#003d2b] tracking-[0] leading-6">
                          Category
                        </label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => handleInputChange("category", value)}
                        >
                          <SelectTrigger className="h-[50px] px-5 py-[15px] bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {transactionCategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      <label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-base text-[#003d2b] tracking-[0] leading-6">
                        Buyer Email
                      </label>
                      <Input
                        placeholder="Enter buyer email"
                        type="email"
                        value={formData.buyerEmail}
                        onChange={(event) => handleInputChange("buyerEmail", event.target.value)}
                        className="h-[50px] px-5 py-[15px] bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base"
                      />
                    </div>

                    <div className="flex flex-col gap-2.5">
                      <label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-base text-[#003d2b] tracking-[0] leading-6">
                        Delivery Timeframe
                      </label>
                      <Select
                        value={formData.deliveryTimeframe}
                        onValueChange={(value) => handleInputChange("deliveryTimeframe", value)}
                      >
                        <SelectTrigger className="h-[50px] px-5 py-[15px] bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base">
                          <SelectValue placeholder="Select Timeframe" />
                        </SelectTrigger>
                        <SelectContent>
                          {deliveryTimeframes.map((timeframe) => (
                            <SelectItem key={timeframe} value={timeframe}>
                              {timeframe}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      className="h-[50px] w-full sm:w-auto bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] rounded-lg [font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-white text-sm text-center tracking-[-0.20px] leading-[18px]"
                      onClick={handleNext}
                    >
                      Continue To Review
                    </Button>
                  </>
                )}

                {step === 1 && (
                  <>
                    <div className="flex items-center gap-2.5">
                      <img
                        className="w-10 h-10 md:w-[46px] md:h-[46px]"
                        alt="KYC icon"
                        src="/p-2-rounded-lg-bg-accent-18-3.svg"
                      />
                      <div className="flex flex-col gap-[5px]">
                        <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-xl text-[#003d2b] tracking-[0] leading-6">
                          KYC & AML Compliance
                        </h2>
                        <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base tracking-[0] leading-6">
                          Upload documentation or request buyer information automatically
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-start gap-[17px]">
                      <div className="flex flex-col gap-2.5 flex-1">
                        <label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-base text-[#003d2b] tracking-[0] leading-6">
                          Buyer Type
                        </label>
                        <Select
                          value={formData.buyerType}
                          onValueChange={(value: TransactionForm["buyerType"]) => handleInputChange("buyerType", value)}
                        >
                          <SelectTrigger className="h-[50px] px-5 py-[15px] bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="individual">Individual</SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex flex-col gap-2.5 flex-1">
                        <label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-base text-[#003d2b] tracking-[0] leading-6">
                          Screening Mode
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            type="button"
                            variant={formData.pepCheck ? "default" : "outline"}
                            className="rounded-lg h-[50px]"
                            onClick={() => handleInputChange("pepCheck", !formData.pepCheck)}
                          >
                            PEP Check
                          </Button>
                          <Button
                            type="button"
                            variant={formData.enhancedDueDiligence ? "default" : "outline"}
                            className="rounded-lg h-[50px]"
                            onClick={() => handleInputChange("enhancedDueDiligence", !formData.enhancedDueDiligence)}
                          >
                            Enhanced DD
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      <label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-base text-[#003d2b] tracking-[0] leading-6">
                        Attach compliance file
                      </label>
                      <label
                        htmlFor="kyc-upload"
                        className="border border-dashed border-[#c4c4c4] rounded-2xl p-6 flex flex-col items-center gap-3 cursor-pointer hover:bg-white"
                      >
                        <UploadCloud className="w-10 h-10 text-app-secondary" />
                        <span className="text-sm text-[#003d2b] font-medium text-center">
                          {formData.complianceDoc ? formData.complianceDoc.name : "Upload share purchase agreement, invoice, or buyer docs"}
                        </span>
                        <span className="text-xs text-[#808080]">PDF, PNG, JPG — 25MB max</span>
                        <input
                          id="kyc-upload"
                          type="file"
                          className="hidden"
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={(event) => uploadComplianceDoc(event.target.files)}
                        />
                      </label>
                      {isUploading && (
                        <div className="flex items-center gap-2 text-sm text-[#808080]">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Encrypting document…
                        </div>
                      )}
                    </div>

                    <div className="flex items-start gap-3">
                      <input
                        id="terms"
                        type="checkbox"
                        className="mt-1 w-4 h-4"
                        checked={formData.termsAccepted}
                        onChange={(event) => handleInputChange("termsAccepted", event.target.checked)}
                      />
                      <label htmlFor="terms" className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-sm text-[#003d2b]">
                        I confirm that I have reviewed TrustVerify's compliance policy and certify that the buyer information provided is accurate.
                      </label>
                    </div>

                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <Button
                        variant="outline"
                        className="rounded-lg px-6 h-[50px]"
                        onClick={handlePrevious}
                      >
                        Back
                      </Button>
                      <Button
                        className="h-[50px] w-full sm:w-auto bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] rounded-lg [font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-white text-sm text-center tracking-[-0.20px] leading-[18px]"
                        onClick={handleNext}
                      >
                        Continue To Review
                      </Button>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="flex items-center gap-2.5">
                      <img
                        className="w-10 h-10 md:w-[46px] md:h-[46px]"
                        alt="Review icon"
                        src="/p-2-rounded-lg-bg-accent-18-3.svg"
                      />
                      <div className="flex flex-col gap-[5px]">
                        <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-xl text-[#003d2b] tracking-[0] leading-6">
                          Review & Launch
                        </h2>
                        <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base tracking-[0] leading-6">
                          Confirm details, automated fees, and compliance checks before sending the secure invite
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="bg-white rounded-2xl border border-[#ececec] p-5 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                          <FileCheck className="w-5 h-5 text-app-secondary" />
                          <span className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                            Transaction summary
                          </span>
                        </div>
                        <ul className="text-sm text-[#003d2b] space-y-2 [font-family:'DM_Sans_18pt-Regular',Helvetica]">
                          <li>
                            <span className="font-medium text-[#808080]">Title:</span> {formData.title || "—"}
                          </li>
                          <li>
                            <span className="font-medium text-[#808080]">Buyer:</span> {formData.buyerEmail || "—"}
                          </li>
                          <li>
                            <span className="font-medium text-[#808080]">Category:</span> {formData.category || "—"}
                          </li>
                          <li>
                            <span className="font-medium text-[#808080]">Delivery:</span> {formData.deliveryTimeframe || "—"}
                          </li>
                        </ul>
                      </div>

                      <div className="bg-white rounded-2xl border border-[#ececec] p-5 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-[#27AE60]" />
                          <span className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                            Compliance summary
                          </span>
                        </div>
                        <ul className="text-sm text-[#003d2b] space-y-2 [font-family:'DM_Sans_18pt-Regular',Helvetica]">
                          <li>
                            <span className="font-medium text-[#808080]">Buyer type:</span> {formData.buyerType}
                          </li>
                          <li>
                            <span className="font-medium text-[#808080]">PEP check:</span> {formData.pepCheck ? "Enabled" : "Not required"}
                          </li>
                          <li>
                            <span className="font-medium text-[#808080]">Enhanced DD:</span>{" "}
                            {formData.enhancedDueDiligence ? "Enabled" : "Not required"}
                          </li>
                          <li>
                            <span className="font-medium text-[#808080]">Document:</span>{" "}
                            {formData.complianceDoc ? formData.complianceDoc.name : "No document uploaded"}
                          </li>
                        </ul>
                      </div>
                    </div>

                    <Separator className="bg-[#e4e4e4]" />

                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex flex-col">
                        <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-sm text-[#808080]">
                          Total (incl. escrow & processing)
                        </span>
                        <span className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-3xl text-[#003d2b]">
                          {formatCurrency(totalCost)}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Button
                          variant="outline"
                          className="rounded-lg px-6 h-[50px]"
                          onClick={handlePrevious}
                        >
                          Back
                        </Button>
                        <Button
                          className="h-[50px] bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] rounded-lg [font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-white text-sm text-center tracking-[-0.20px] leading-[18px] px-8"
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Launching..." : "Launch Transaction"}
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <div className="flex flex-col w-full lg:w-[542px] gap-6">
              <Card className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
                <CardContent className="p-4 md:p-6 flex flex-col gap-[30px]">
                  <div className="flex items-center gap-2.5">
                    <img
                      className="w-10 h-10 md:w-[46px] md:h-[46px]"
                      alt="Cost icon"
                      src="/p-2-rounded-lg-bg-accent-18-1.svg"
                    />
                    <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl tracking-[0] leading-6 whitespace-nowrap">
                      Cost Breakdown
                    </h2>
                  </div>

                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col gap-[11px]">
                        {costSummary.map((item) => (
                          <div key={item.label} className="flex h-7 items-center justify-between">
                            <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base tracking-[0] leading-5 whitespace-nowrap">
                              {item.label}
                            </span>
                            <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-base text-right tracking-[0] leading-7 whitespace-nowrap">
                              {formatCurrency(item.value)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <Separator className="bg-[#e4e4e4]" />
                    </div>

                    <div className="flex h-7 items-center justify-between">
                      <span className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl md:text-[22px] tracking-[0] leading-5 whitespace-nowrap">
                        Total
                      </span>
                      <span className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-app-secondary text-lg md:text-xl text-right leading-7 whitespace-nowrap tracking-[0]">
                        {formatCurrency(totalCost)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
                <CardContent className="p-4 md:p-6 flex flex-col gap-[38px]">
                  <div className="inline-flex items-center gap-2.5">
                    <img
                      className="w-10 h-10 md:w-[46px] md:h-[46px]"
                      alt="Security icon"
                      src="/p-2-rounded-lg-bg-accent-18.svg"
                    />
                    <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl tracking-[0] leading-6 whitespace-nowrap">
                      Security Features
                    </h2>
                  </div>

                  <div className="flex flex-col gap-6">
                    {securityFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2.5">
                        <img
                          className="w-5 h-5 md:w-6 md:h-6"
                          alt="Security feature icon"
                          src={feature.icon}
                        />
                        <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-base tracking-[0] leading-6 whitespace-nowrap">
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
                <CardContent className="p-4 md:p-6 flex flex-col items-center gap-6">
                  <div className="flex flex-col items-center gap-4">
                    <img
                      className="w-[56px] h-[56px] md:w-[68px] md:h-[68px]"
                      alt="Help icon"
                      src="/p-2-rounded-lg-bg-accent-18-2.svg"
                    />
                    <div className="flex flex-col items-center gap-2.5">
                      <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl text-center tracking-[0] leading-6">
                        Need Help?
                      </h2>
                      <p className="text-center [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base tracking-[0] leading-6">
                        Our support team is available 24/7 to help you create secure transactions.
                      </p>
                    </div>
                  </div>

                  <Button
                    className="h-[46px] w-full md:w-[174px] bg-app-secondary rounded-lg [font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-white text-sm text-center tracking-[-0.20px] leading-[18px]"
                    onClick={() => navigate("/support-center")}
                  >
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewTransaction;
