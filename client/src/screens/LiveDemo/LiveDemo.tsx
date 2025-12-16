import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowLeftIcon,
  CheckCircle,
  CheckCircle2Icon,
  Clock,
  PlayIcon,
  PoundSterling,
  RotateCcwIcon,
  ShoppingCart as ShoppingCartGlyph,
  User,
  Shield,
  Brain,
  Activity,
  ShoppingCart,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Header";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";

const transactionScenario = {
  buyer: { name: "Alice Chen", trustScore: 78 },
  seller: { name: "Bob's Electronics", trustScore: 42, accountAge: 4 },
  item: 'MacBook Pro 16" M3 Max',
  amount: 2499,
  currency: "£",
};

const transactionSteps = [
  {
    id: 0,
    stage: "INITIATE",
    title: "Transaction Initiated",
    description:
      "Alice wants to buy a high-value laptop from Bob on a C2C marketplace",
    icon: ShoppingCart,
    color: "bg-blue-500",
    details: [
      `Buyer: ${transactionScenario.buyer.name}`,
      `Seller: ${transactionScenario.seller.name}`,
      `Item: ${transactionScenario.item}`,
      `Amount: ${transactionScenario.currency}${transactionScenario.amount.toLocaleString()}`,
    ],
  },
  {
    id: 1,
    stage: "DETECT",
    title: "Intelligence Modules Scanning",
    description:
      "6 intelligence modules analyze the transaction for fraud patterns and risk signals",
    icon: Brain,
    color: "bg-blue-600",
    modules: [
      {
        name: "CyberTrust Index",
        score: 42,
        status: "critical",
        reason: "Seller account score below threshold",
      },
      {
        name: "Transaction Integrity",
        score: 55,
        status: "medium",
        reason: "High-value item, new marketplace listing",
      },
      {
        name: "Vendor Diligence",
        score: 38,
        status: "critical",
        reason: "Seller account only 4 days old",
      },
      {
        name: "TrustGraph",
        score: 68,
        status: "low",
        reason: "Buyer has established network",
      },
      {
        name: "Regulatory Pulse",
        score: 85,
        status: "safe",
        reason: "All compliance checks passed",
      },
      {
        name: "Global Risk Intelligence",
        score: 45,
        status: "high",
        reason: "Composite risk factors detected",
      },
    ],
  },
  {
    id: 2,
    stage: "DECIDE",
    title: "Risk Score Calculated",
    description:
      "System calculates composite risk score and determines escrow is necessary",
    icon: Activity,
    color: "bg-orange-600",
    riskScore: 45,
    triggers: [
      { condition: "Risk Score < 50", met: true, icon: AlertTriangle },
      { condition: "Transaction > £1,000", met: true, icon: PoundSterling },
      { condition: "Seller Account < 7 days", met: true, icon: Clock },
      { condition: "High-value Electronics", met: true, icon: Shield },
    ],
    decision: "ESCROW RECOMMENDED",
  },
  {
    id: 3,
    stage: "SECURE",
    title: "Escrow Activated",
    description:
      "Alice deposits funds into secure escrow account. Seller cannot access funds yet.",
    icon: Shield,
    color: "bg-[#1DBF73]",
    escrowDetails: [
      {
        label: "Escrow Amount",
        value: `${transactionScenario.currency}${transactionScenario.amount.toLocaleString()}`,
      },
      {
        label: "Escrow Fee (2%)",
        value: `${transactionScenario.currency}${(
          transactionScenario.amount * 0.02
        ).toFixed(2)}`,
      },
      {
        label: "Total Deposit",
        value: `${transactionScenario.currency}${(
          transactionScenario.amount * 1.02
        ).toLocaleString()}`,
      },
      { label: "Security", value: "256-bit SSL + Multi-sig" },
      { label: "Account Type", value: "FDIC-Insured Segregated" },
    ],
    timeline: [
      { event: "Funds deposited", status: "completed", time: "Just now" },
      { event: "Seller notified", status: "completed", time: "Just now" },
      { event: "Shipment pending", status: "active", time: "Waiting..." },
      {
        event: "Delivery confirmation",
        status: "pending",
        time: "Est. 2-3 days",
      },
      { event: "Funds release", status: "pending", time: "Est. 3-4 days" },
    ],
  },
  {
    id: 4,
    stage: "DELIVERY",
    title: "Item Shipped & Tracked",
    description:
      "Bob ships the MacBook. Tracking shows delivery in progress.",
    icon: Zap,
    color: "bg-blue-500",
    shipmentDetails: [
      { label: "Carrier", value: "Royal Mail Special Delivery" },
      { label: "Tracking #", value: "RM123456789GB" },
      { label: "Status", value: "Out for Delivery" },
      { label: "Est. Delivery", value: "Today by 1:00 PM" },
    ],
    timeline: [
      { event: "Funds deposited", status: "completed", time: "2 days ago" },
      { event: "Seller notified", status: "completed", time: "2 days ago" },
      { event: "Shipment in transit", status: "completed", time: "1 day ago" },
      { event: "Out for delivery", status: "active", time: "3 hours ago" },
      { event: "Delivery confirmation", status: "pending", time: "Today" },
      { event: "Funds release", status: "pending", time: "Tomorrow" },
    ],
  },
  {
    id: 5,
    stage: "VERIFY",
    title: "Alice Confirms Receipt",
    description:
      "Alice receives the laptop, verifies it matches description, and confirms satisfaction",
    icon: CheckCircle,
    color: "bg-green-600",
    verification: [
      { check: "Item matches description", status: "confirmed" },
      { check: "No visible damage", status: "confirmed" },
      { check: "Serial number verified", status: "confirmed" },
      { check: "Device powers on", status: "confirmed" },
      { check: "All accessories included", status: "confirmed" },
    ],
    timeline: [
      { event: "Funds deposited", status: "completed", time: "3 days ago" },
      { event: "Seller notified", status: "completed", time: "3 days ago" },
      { event: "Shipment in transit", status: "completed", time: "2 days ago" },
      { event: "Delivery confirmed", status: "completed", time: "30 min ago" },
      { event: "Buyer verification", status: "active", time: "Just now" },
      { event: "Funds release", status: "pending", time: "Processing..." },
    ],
  },
  {
    id: 6,
    stage: "SETTLE",
    title: "Funds Released to Seller",
    description:
      "Escrow automatically releases funds to Bob within 72 hours of confirmation",
    icon: PoundSterling,
    color: "bg-[#1DBF73]",
    settlement: [
      {
        label: "Release Amount",
        value: `${transactionScenario.currency}${transactionScenario.amount.toLocaleString()}`,
      },
      { label: "Release Time", value: "Within 72 hours" },
      { label: "Method", value: "Bank Transfer (Same-day)" },
      { label: "Status", value: "Processing" },
      {
        label: "Escrow Fee Collected",
        value: `${transactionScenario.currency}${(
          transactionScenario.amount * 0.02
        ).toFixed(2)}`,
      },
    ],
    outcome: {
      buyer: "✅ Received authentic MacBook Pro",
      seller: "✅ Payment guaranteed and released",
      platform: "✅ £49.98 escrow fee collected",
    },
  },
];

const stepSummaries = transactionSteps.map((step, index) => ({
  id: index + 1,
  label: step.title,
}));

export const LiveDemo = (): JSX.Element => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const steps = transactionSteps;
  const transaction = transactionScenario;
  const currentStepData = steps[currentStep];
  const progress = ((currentStep) / steps.length) * 100;

  const stopAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
    setIsPlaying(false);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      stopAutoplay();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
    stopAutoplay();
  };

  const handleReset = () => {
    stopAutoplay();
    setCurrentStep(0);
  };

  const handleAutoPlay = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    autoplayRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          stopAutoplay();
          return prev;
        }
        return prev + 1;
      });
    }, 3000);
  };

  useEffect(
    () => () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    },
    []
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <User className="text-blue-600 h-6 w-6" />
                    <h3 className="text-blue-900 font-semibold text-lg">
                      Buyer
                    </h3>
                  </div>
                  <p className="text-xl font-bold text-blue-900 mb-2">
                    {transaction.buyer.name}
                  </p>
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    Trust Score: {transaction.buyer.trustScore}
                  </Badge>
                </CardContent>
              </Card>

              <Card className="bg-orange-50 border-orange-200">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <ShoppingCartGlyph className="text-orange-600 h-6 w-6" />
                    <h3 className="text-orange-900 font-semibold text-lg">
                      Seller
                    </h3>
                  </div>
                  <p className="text-xl font-bold text-orange-900 mb-2">
                    {transaction.seller.name}
                  </p>
                  <div className="space-y-1 text-sm text-orange-700">
                    <Badge className="bg-red-100 text-red-700 border-red-200">
                      Trust Score: {transaction.seller.trustScore}
                    </Badge>
                    <p>Account Age: {transaction.seller.accountAge} days ⚠️</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-[#003d2b] mb-4">
                  Transaction Details
                </h3>
                <div className="space-y-2">
                  {currentStepData.details?.map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle className="text-blue-600 h-5 w-5" />
                      <span className="text-[#4b4b4b] text-base">{detail}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            {currentStepData.modules?.map((module, idx) => (
              <Card
                key={idx}
                className={`border-2 ${
                  module.status === "critical"
                    ? "border-red-200 bg-red-50"
                    : module.status === "high"
                    ? "border-orange-200 bg-orange-50"
                    : module.status === "medium"
                    ? "border-yellow-200 bg-yellow-50"
                    : "border-green-200 bg-green-50"
                }`}
              >
                <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5">
                  <div>
                    <h4 className="text-lg font-semibold text-[#003d2b]">
                      {module.name}
                    </h4>
                    <p className="text-sm text-[#4b4b4b]">{module.reason}</p>
                  </div>
                  <Badge className={`px-4 py-2 text-lg ${
                  module.status === "critical"
                    ? "bg-red-300"
                    : module.status === "high"
                    ? "bg-orange-300"
                    : module.status === "medium"
                    ? "bg-yellow-300"
                    : "bg-green-300"
                } border`}>
                    Score: {module.score}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center p-6 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl">
              <div className="flex items-center justify-center gap-4 mb-4">
                <AlertTriangle className="text-orange-600 h-14 w-14" />
                <div className="text-5xl font-bold text-orange-600">
                  {currentStepData.riskScore}
                </div>
              </div>
              <p className="text-gray-700 mb-3">
                Composite risk score triggered escalation
              </p>
              <Badge className="bg-orange-600 text-white px-6 py-2 text-lg">
                {currentStepData.decision}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentStepData.triggers?.map((trigger, idx) => (
                <Card
                  key={idx}
                  className={`border-2 ${
                    trigger.met ? "border-orange-200 bg-orange-50" : ""
                  }`}
                >
                  <CardContent className="flex items-center gap-3 p-4">
                    <trigger.icon
                      className={`h-6 w-6 ${
                        trigger.met ? "text-orange-600" : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`font-semibold ${
                        trigger.met ? "text-orange-900" : "text-gray-500"
                      }`}
                    >
                      {trigger.condition}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <Card className="bg-gradient-to-r from-green-50 to-[#1dbf73]/10 border-green-200">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-[#003d2b] mb-4">
                  Escrow Account Details
                </h3>
                <div className="space-y-3">
                  {currentStepData.escrowDetails?.map((detail, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between text-sm border-b pb-2 last:border-b-0"
                    >
                      <span className="text-[#4b4b4b] font-medium">
                        {detail.label}
                      </span>
                      <span className="text-[#003d2b] font-semibold">
                        {detail.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <h4 className="font-semibold text-lg text-[#003d2b]">
                Timeline
              </h4>
              {currentStepData.timeline?.map((event, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      event.status === "completed"
                        ? "bg-green-600"
                        : event.status === "active"
                        ? "bg-blue-600"
                        : "bg-gray-300"
                    }`}
                  >
                    {event.status === "completed" ? (
                      <CheckCircle className="h-4 w-4 text-white" />
                    ) : event.status === "active" ? (
                      <Clock className="h-4 w-4 text-white" />
                    ) : (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <div>
                    <p
                      className={`font-semibold ${
                        event.status === "active"
                          ? "text-blue-600"
                          : "text-[#4b4b4b]"
                      }`}
                    >
                      {event.event}
                    </p>
                    <p className="text-sm text-gray-500">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 4:
      case 5:
        const detailKey =
          currentStep === 4 ? "shipmentDetails" : "verification";
        const timelineKey = "timeline";
        const isDelivery = currentStep === 4;
        return (
          <div className="space-y-6">
            <Card
              className={
                isDelivery
                  ? "bg-blue-50 border-blue-200"
                  : "bg-green-50 border-green-200"
              }
            >
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-[#003d2b] mb-4">
                  {isDelivery ? "Shipment Tracking" : "Buyer Verification"}
                </h3>
                <div className="space-y-3">
                  {currentStepData[detailKey]?.map((detail: any, idx: number) =>
                    isDelivery ? (
                      <div
                        key={idx}
                        className="flex justify-between text-sm border-b pb-2 last:border-b-0"
                      >
                        <span className="text-[#4b4b4b] font-medium">
                          {detail.label}
                        </span>
                        <span className="text-[#003d2b] font-semibold">
                          {detail.value}
                        </span>
                      </div>
                    ) : (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 bg-white rounded-lg border"
                      >
                        <CheckCircle className="text-green-600 h-5 w-5" />
                        <span className="font-semibold text-[#003d2b]">
                          {detail.check}
                        </span>
                        <Badge className="ml-auto bg-green-600 text-white">
                          {detail.status}
                        </Badge>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <h4 className="font-semibold text-lg text-[#003d2b]">
                Updated Timeline
              </h4>
              {currentStepData[timelineKey]?.map((event, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      event.status === "completed"
                        ? "bg-green-600"
                        : event.status === "active"
                        ? "bg-blue-600 animate-pulse"
                        : "bg-gray-300"
                    }`}
                  >
                    {event.status === "completed" ? (
                      <CheckCircle className="h-4 w-4 text-white" />
                    ) : event.status === "active" ? (
                      <Clock className="h-4 w-4 text-white" />
                    ) : (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <div>
                    <p
                      className={`font-semibold ${
                        event.status === "active"
                          ? "text-blue-600"
                          : "text-[#4b4b4b]"
                      }`}
                    >
                      {event.event}
                    </p>
                    <p className="text-sm text-gray-500">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <Card className="bg-gradient-to-r from-[#1dbf73]/10 to-green-50 border-green-200">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-[#003d2b] mb-4">
                  Settlement Details
                </h3>
                <div className="space-y-3">
                  {currentStepData.settlement?.map((detail, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between text-sm border-b pb-2 last:border-b-0"
                    >
                      <span className="text-[#4b4b4b] font-medium">
                        {detail.label}
                      </span>
                      <span className="text-[#003d2b] font-semibold">
                        {detail.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-green-50 border-green-200 text-center">
                <CardContent className="p-6 space-y-3">
                  <User className="text-green-600 h-10 w-10 mx-auto" />
                  <h4 className="font-semibold text-[#003d2b]">
                    Buyer Outcome
                  </h4>
                  <p className="text-sm text-[#4b4b4b]">
                    {currentStepData.outcome?.buyer}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border-blue-200 text-center">
                <CardContent className="p-6 space-y-3">
                  <ShoppingCartGlyph className="text-blue-600 h-10 w-10 mx-auto" />
                  <h4 className="font-semibold text-[#003d2b]">
                    Seller Outcome
                  </h4>
                  <p className="text-sm text-[#4b4b4b]">
                    {currentStepData.outcome?.seller}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-[#1dbf73]/20 to-[#0A3778]/20 border-[#1dbf73]/30 text-center">
                <CardContent className="p-6 space-y-3">
                  <PoundSterling className="text-[#1dbf73] h-10 w-10 mx-auto" />
                  <h4 className="font-semibold text-[#003d2b]">
                    Platform Revenue
                  </h4>
                  <p className="text-sm text-[#4b4b4b]">
                    {currentStepData.outcome?.platform}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#f6f6f6] min-h-screen w-full flex flex-col">
      <Header />
      <section className="flex flex-col gap-6 sm:gap-8 md:gap-10 w-full p-4 sm:p-6 lg:p-12 max-w-full">
        <header className="flex flex-col gap-4">
          <button
            className="inline-flex items-center gap-2 text-[#808080] hover:text-[#003d2b]"
            onClick={() => navigate(-1)}
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="text-base sm:text-lg">
              Back
            </span>
          </button>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#003d2b]">
                TrustVerify Live Demo
              </h1>
              <Badge className="bg-[#27ae6033] text-[#27ae60] h-fit px-4 py-2 rounded-full">
                Live System
              </Badge>
            </div>
            <p className="text-[#4b4b4b] text-base sm:text-lg">
              Experience how TrustVerify orchestrates escrow protection, fraud
              intelligence, and settlement automation in real time.
            </p>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-6 w-full">
          {/* Demo Controls */}
          <Card className="w-full lg:w-[360px] bg-white border border-neutral-200 shadow-sm flex-shrink-0">
            <CardContent className="p-5 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <img
                    src="/fi-90731877.svg"
                    alt="Demo Controls Icon"
                    className="w-5 h-5"
                  />
                  <h2 className="text-lg font-semibold text-[#003d2b]">
                    Demo Controls
                  </h2>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm text-[#003d2b] mb-2">
                    <span>Progress</span>
                    <span>
                      Step {currentStep } / {steps.length}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2 bg-[#d8d8d8]" />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  className="flex-1 bg-[#003d2b] hover:bg-[#003d2b]/90"
                  onClick={handleAutoPlay}
                  disabled={isPlaying || currentStep === steps.length - 1}
                >
                  <PlayIcon className="mr-2 h-4 w-4" />
                  {isPlaying ? "Playing..." : "Auto Play"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full sm:w-[120px]"
                  onClick={handleReset}
                >
                  <RotateCcwIcon className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>

              <div>
                <h3 className="text-base font-semibold text-[#003d2b] mb-3">
                  Demo Steps
                </h3>
                <div className="flex flex-col gap-2">
                  {stepSummaries.map((step, idx) => {
                    const isActive = idx === currentStep;
                    const isCompleted = idx < currentStep;
                    return (
                      <div
                        key={step.id}
                        className={`flex items-center rounded-lg border px-3 py-2 text-sm ${
                          isActive
                            ? "bg-[#eef5fe] border-[#0b3a78]"
                            : "bg-[#f8f8f8] border-neutral-200"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2Icon className="text-app-primary h-5 w-5 mr-3" />
                        ) : (
                          <div className="w-6 h-6 mr-3 rounded-full bg-[#ececec] flex items-center justify-center text-xs text-[#808080]">
                            {step.id}
                          </div>
                        )}
                        <span
                          className={`font-${
                            isActive ? "semibold" : "normal"
                          } text-${
                            isActive ? "app-primary" : "neutral-600"
                          } leading-5`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="flex-1 flex flex-col gap-6">
            <Card className="bg-white border border-neutral-200 shadow-sm">
              <CardContent className="p-6 space-y-6">
                <div className="flex flex-col gap-2">
                  <div className="inline-flex items-center gap-2 text-sm text-[#808080]">
                    Stage {currentStep + 1} · {currentStepData.stage}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-semibold text-[#003d2b]">
                    {currentStepData.title}
                  </h2>
                  <p className="text-[#4b4b4b] text-base">
                    {currentStepData.description}
                  </p>
                </div>

                {renderStepContent()}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    className="w-full sm:w-auto"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={currentStep === steps.length}
                    className="w-full sm:w-auto bg-gradient-to-r from-[#1DBF73] to-[#0A3778]"
                  >
                    {currentStep === steps.length  ? "Completed" : "Next Step"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-app-primary text-white border-0 overflow-hidden">
              <CardContent className="p-6 sm:p-8 flex flex-col lg:flex-row gap-6 lg:gap-10">
                <div className="space-y-4 flex-1">
                  <h2 className="text-3xl font-semibold">
                    Ready To Protect Your Business?
                  </h2>
                  <p className="text-white/80 text-base">
                    Join thousands of companies that trust TrustVerify to secure
                    their transactions and prevent fraud across every channel.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      onClick={() => navigate("/dashboard")}
                      className="bg-white text-app-primary hover:bg-white/90"
                    >
                      Start Free Trial
                    </Button>
                    <Button 
                      onClick={() => navigate("/contact")}
                      variant="outline" 
                      className="border-white text-white bg-transparent"
                    >
                      Contact Sales
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <img
                    src="/frame-1.svg"
                    alt="Security Shield"
                    className="w-48 h-auto"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#d3203024] border-0">
              <CardContent className="p-6">
                <h3 className="text-[#d32030] font-bold text-lg mb-2">
                  Legal Notice:
                </h3>
                <p className="text-[#d32030] text-sm">
                  TrustVerify provides technology services only. We do not
                  guarantee results or assume liability for user decisions. All
                  users must conduct independent due diligence. Use of our
                  platform constitutes acceptance of our Terms of Service and
                  Privacy Policy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};
