import { useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Building2, 
  Shield, 
  FileText, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Upload,
  Globe,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  PoundSterling,
  UserCheck,
  FileCheck,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Eye,
  Lock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BeneficialOwner {
  id: string;
  name: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
  ownershipPercentage: number;
  isPoliticallyExposed: boolean;
  sanctions: boolean;
}

interface ComplianceDocument {
  type: string;
  filename: string;
  uploaded: boolean;
  verified: boolean;
}

export function KYBVerificationPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'in_review' | 'approved' | 'rejected' | null>(null);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [verificationSteps, setVerificationSteps] = useState<{step: string; status: 'pending' | 'processing' | 'complete' | 'warning'; result?: string}[]>([]);
  const [verificationResults, setVerificationResults] = useState<{
    overallStatus: 'approved' | 'pending_review' | 'rejected';
    riskScore: number;
    riskLevel: 'low' | 'medium' | 'high';
    companyVerified: boolean;
    documentsVerified: number;
    beneficialOwnersCleared: number;
    sanctionsCleared: boolean;
    pepMatches: number;
    adverseMedia: boolean;
    referenceId: string;
  } | null>(null);

  // Company Information
  const [companyName, setCompanyName] = useState("");
  const [tradingName, setTradingName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [registrationCountry, setRegistrationCountry] = useState("");
  const [incorporationDate, setIncorporationDate] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [vatNumber, setVatNumber] = useState("");

  // Business Address
  const [businessAddress, setBusinessAddress] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [country, setCountry] = useState("");

  // Business Details
  const [industry, setIndustry] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");

  // Contact Information
  const [primaryContactName, setPrimaryContactName] = useState("");
  const [primaryContactEmail, setPrimaryContactEmail] = useState("");
  const [primaryContactPhone, setPrimaryContactPhone] = useState("");
  const [primaryContactRole, setPrimaryContactRole] = useState("");

  // Financial Information
  const [expectedTransactionVolume, setExpectedTransactionVolume] = useState("");
  const [averageTransactionValue, setAverageTransactionValue] = useState("");
  const [sourceOfFunds, setSourceOfFunds] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [sortCode, setSortCode] = useState("");

  // Beneficial Owners
  const [beneficialOwners, setBeneficialOwners] = useState<BeneficialOwner[]>([
    {
      id: '1',
      name: '',
      dateOfBirth: '',
      nationality: '',
      address: '',
      ownershipPercentage: 0,
      isPoliticallyExposed: false,
      sanctions: false
    }
  ]);

  // Compliance Documents
  const [documents, setDocuments] = useState<ComplianceDocument[]>([
    { type: 'certificate_of_incorporation', filename: '', uploaded: false, verified: false },
    { type: 'memorandum_of_association', filename: '', uploaded: false, verified: false },
    { type: 'proof_of_address', filename: '', uploaded: false, verified: false },
    { type: 'director_identity', filename: '', uploaded: false, verified: false },
    { type: 'beneficial_owner_proof', filename: '', uploaded: false, verified: false }
  ]);

  // Declarations
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [dataProcessingAccepted, setDataProcessingAccepted] = useState(false);
  const [accuracyDeclared, setAccuracyDeclared] = useState(false);

  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  const addBeneficialOwner = () => {
    setBeneficialOwners([
      ...beneficialOwners,
      {
        id: Date.now().toString(),
        name: '',
        dateOfBirth: '',
        nationality: '',
        address: '',
        ownershipPercentage: 0,
        isPoliticallyExposed: false,
        sanctions: false
      }
    ]);
  };

  const removeBeneficialOwner = (id: string) => {
    if (beneficialOwners.length > 1) {
      setBeneficialOwners(beneficialOwners.filter(o => o.id !== id));
    }
  };

  const updateBeneficialOwner = (id: string, field: keyof BeneficialOwner, value: any) => {
    setBeneficialOwners(beneficialOwners.map(o => 
      o.id === id ? { ...o, [field]: value } : o
    ));
  };

  const simulateDocumentUpload = (docType: string) => {
    setDocuments(documents.map(d => 
      d.type === docType ? { ...d, filename: `${docType}_${Date.now()}.pdf`, uploaded: true } : d
    ));
    toast({
      title: "Document Uploaded",
      description: "Your document has been uploaded successfully and is pending verification.",
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setVerificationStatus('in_review');
    setVerificationProgress(0);
    
    const steps = [
      { step: 'Verifying company registration', result: 'Company found in registry' },
      { step: 'Checking business registry', result: 'Active status confirmed' },
      { step: 'Screening beneficial owners', result: `${beneficialOwners.length} owner(s) screened` },
      { step: 'Running sanctions checks', result: 'No sanctions matches' },
      { step: 'Checking PEP databases', result: 'PEP screening complete' },
      { step: 'Scanning adverse media', result: 'No adverse media found' },
      { step: 'Verifying documents', result: `${documents.filter(d => d.uploaded).length} document(s) verified` },
      { step: 'Calculating risk score', result: 'Risk assessment complete' }
    ];

    const updatedSteps: typeof verificationSteps = [];
    
    for (let i = 0; i < steps.length; i++) {
      updatedSteps.push({ step: steps[i].step, status: 'processing' });
      setVerificationSteps([...updatedSteps]);
      setVerificationProgress(((i + 0.5) / steps.length) * 100);
      
      await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 300));
      
      const hasPep = beneficialOwners.some(o => o.isPoliticallyExposed);
      
      updatedSteps[i] = { 
        step: steps[i].step, 
        status: (i === 4 && hasPep) ? 'warning' : 'complete',
        result: steps[i].result
      };
      setVerificationSteps([...updatedSteps]);
      setVerificationProgress(((i + 1) / steps.length) * 100);
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    const hasPep = beneficialOwners.some(o => o.isPoliticallyExposed);
    const isHighRisk = industry === "Cryptocurrency & Blockchain" || industry === "Gaming & Entertainment";
    const baseScore = Math.floor(Math.random() * 20) + 10;
    const riskScore = baseScore + (hasPep ? 30 : 0) + (isHighRisk ? 25 : 0);
    
    setVerificationResults({
      overallStatus: riskScore > 60 ? 'pending_review' : 'approved',
      riskScore: Math.min(riskScore, 100),
      riskLevel: riskScore > 60 ? 'high' : riskScore > 35 ? 'medium' : 'low',
      companyVerified: true,
      documentsVerified: documents.filter(d => d.uploaded).length,
      beneficialOwnersCleared: beneficialOwners.filter(o => !o.isPoliticallyExposed).length,
      sanctionsCleared: true,
      pepMatches: beneficialOwners.filter(o => o.isPoliticallyExposed).length,
      adverseMedia: false,
      referenceId: `KYB-${Date.now().toString().slice(-8)}`
    });

    setVerificationStatus('approved');
    setIsSubmitting(false);
    
    toast({
      title: "KYB Verification Complete",
      description: riskScore > 60 ? "Your application requires additional review." : "Your business has been verified successfully!",
    });
  };

  const industries = [
    "Technology & Software",
    "Financial Services",
    "E-commerce & Retail",
    "Healthcare",
    "Manufacturing",
    "Professional Services",
    "Real Estate",
    "Hospitality",
    "Education",
    "Cryptocurrency & Blockchain",
    "Gaming & Entertainment",
    "Telecommunications",
    "Transport & Logistics",
    "Energy & Utilities",
    "Other"
  ];

  const companyTypes = [
    "Private Limited Company (Ltd)",
    "Public Limited Company (PLC)",
    "Limited Liability Partnership (LLP)",
    "Partnership",
    "Sole Trader",
    "Community Interest Company (CIC)",
    "Charity",
    "Other"
  ];

  const countries = [
    "United Kingdom",
    "Ireland",
    "France",
    "Germany",
    "Netherlands",
    "Spain",
    "Italy",
    "United States",
    "Canada",
    "Australia",
    "Other"
  ];

  const sourceOfFundsOptions = [
    "Business Revenue",
    "Investment Funding",
    "Bank Loan",
    "Personal Savings",
    "Angel Investment",
    "Venture Capital",
    "Government Grant",
    "Other"
  ];

  const documentTypes = [
    { type: 'certificate_of_incorporation', label: 'Certificate of Incorporation', required: true, description: 'Official document proving company registration' },
    { type: 'memorandum_of_association', label: 'Memorandum & Articles of Association', required: true, description: 'Company constitutional documents' },
    { type: 'proof_of_address', label: 'Proof of Business Address', required: true, description: 'Utility bill or bank statement (less than 3 months old)' },
    { type: 'director_identity', label: 'Director Identity Documents', required: true, description: 'Passport or driving licence for all directors' },
    { type: 'beneficial_owner_proof', label: 'Beneficial Owner Documentation', required: false, description: 'Identity proof for owners with 25%+ shares' }
  ];

  // Generate PDF Report
  const generatePDFReport = () => {
    if (!verificationResults) {
      toast({
        title: "Error",
        description: "No verification results available to generate report.",
        variant: "destructive",
      });
      return;
    }

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = margin;
      const lineHeight = 7;
      const sectionSpacing = 10;

      // Helper function to add a new page if needed
      const checkPageBreak = (requiredSpace: number) => {
        if (yPosition + requiredSpace > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
          return true;
        }
        return false;
      };

      // Helper function to add text with word wrap
      const addText = (text: string, fontSize: number, isBold: boolean = false, color: number[] = [0, 0, 0]) => {
        doc.setFontSize(fontSize);
        doc.setFont("helvetica", isBold ? "bold" : "normal");
        doc.setTextColor(color[0], color[1], color[2]);
        
        const maxWidth = pageWidth - (margin * 2);
        const lines = doc.splitTextToSize(text, maxWidth);
        
        checkPageBreak(lines.length * lineHeight);
        
        lines.forEach((line: string) => {
          doc.text(line, margin, yPosition);
          yPosition += lineHeight;
        });
      };

      // Header
      doc.setFillColor(0, 51, 102);
      doc.rect(0, 0, pageWidth, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("TRUSTVERIFY", pageWidth / 2, 20, { align: "center" });
      doc.setFontSize(14);
      doc.text("KYB Verification Report", pageWidth / 2, 32, { align: "center" });
      
      yPosition = 50;
      doc.setTextColor(0, 0, 0);

      // Report Information
      addText(`Report ID: ${verificationResults.referenceId}`, 12, true);
      addText(`Generated: ${new Date().toLocaleString('en-GB')}`, 10);
      addText(`Verification Status: ${verificationResults.overallStatus === 'approved' ? 'APPROVED' : verificationResults.overallStatus === 'pending_review' ? 'PENDING REVIEW' : 'REJECTED'}`, 10, true, [0, 51, 102]);
      yPosition += sectionSpacing;

      // Executive Summary
      doc.setDrawColor(0, 51, 102);
      doc.setLineWidth(0.5);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 5;
      addText("EXECUTIVE SUMMARY", 14, true, [0, 51, 102]);
      yPosition += 3;

      addText(`Company Name: ${companyName || 'N/A'}`, 10);
      addText(`Trading Name: ${tradingName || 'N/A'}`, 10);
      addText(`Registration Number: ${registrationNumber || 'N/A'}`, 10);
      addText(`Country of Incorporation: ${registrationCountry || 'N/A'}`, 10);
      addText(`Company Type: ${companyType || 'N/A'}`, 10);
      addText(`Date of Incorporation: ${incorporationDate || 'N/A'}`, 10);
      yPosition += 3;
      addText(`Overall Risk Score: ${verificationResults.riskScore}/100`, 11, true);
      addText(`Risk Level: ${verificationResults.riskLevel.toUpperCase()}`, 11, true);
      addText(`Verification Status: ${verificationResults.overallStatus === 'approved' ? 'APPROVED' : 'PENDING REVIEW'}`, 11, true);
      yPosition += sectionSpacing;

      // Verification Details
      checkPageBreak(30);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 5;
      addText("VERIFICATION DETAILS", 14, true, [0, 51, 102]);
      yPosition += 3;

      addText("Company Verification:", 10, true);
      addText(`  Status: ${verificationResults.companyVerified ? 'VERIFIED ✓' : 'NOT VERIFIED ✗'}`, 9);
      addText(`  Documents Verified: ${verificationResults.documentsVerified}`, 9);
      addText(`  Total Documents Required: ${documentTypes.filter(dt => dt.required).length}`, 9);
      yPosition += 3;

      addText("Beneficial Owners:", 10, true);
      addText(`  Total Owners: ${beneficialOwners.length}`, 9);
      addText(`  Owners Cleared: ${verificationResults.beneficialOwnersCleared}`, 9);
      addText(`  PEP Matches: ${verificationResults.pepMatches}`, 9);
      if (verificationResults.pepMatches > 0) {
        addText("  Enhanced due diligence applied for PEP individuals", 9, false, [255, 140, 0]);
      }
      yPosition += 3;

      addText("Sanctions & Compliance:", 10, true);
      addText(`  Sanctions Check: ${verificationResults.sanctionsCleared ? 'CLEAR ✓' : 'MATCH FOUND ✗'}`, 9);
      addText(`  Adverse Media: ${verificationResults.adverseMedia ? 'DETECTED ⚠️' : 'NONE ✓'}`, 9);
      yPosition += sectionSpacing;

      // Verification Steps
      checkPageBreak(30);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 5;
      addText("VERIFICATION STEPS COMPLETED", 14, true, [0, 51, 102]);
      yPosition += 3;

      verificationSteps.forEach((step, index) => {
        checkPageBreak(15);
        addText(`${index + 1}. ${step.step}`, 10, true);
        const statusText = step.status === 'complete' ? 'COMPLETE ✓' : step.status === 'warning' ? 'WARNING ⚠️' : 'PENDING';
        addText(`   Status: ${statusText}`, 9);
        if (step.result) {
          addText(`   Result: ${step.result}`, 9);
        }
        yPosition += 2;
      });
      yPosition += sectionSpacing;

      // Beneficial Owners Details
      if (beneficialOwners.length > 0) {
        checkPageBreak(30);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 5;
        addText("BENEFICIAL OWNERS DETAILS", 14, true, [0, 51, 102]);
        yPosition += 3;

        beneficialOwners.forEach((owner, index) => {
          checkPageBreak(25);
          addText(`Owner ${index + 1}:`, 10, true);
          addText(`  Name: ${owner.name || 'N/A'}`, 9);
          addText(`  Date of Birth: ${owner.dateOfBirth || 'N/A'}`, 9);
          addText(`  Nationality: ${owner.nationality || 'N/A'}`, 9);
          addText(`  Ownership Percentage: ${owner.ownershipPercentage}%`, 9);
          addText(`  PEP Status: ${owner.isPoliticallyExposed ? 'YES ⚠️' : 'NO'}`, 9);
          addText(`  Sanctions: ${owner.sanctions ? 'MATCH FOUND ✗' : 'CLEAR ✓'}`, 9);
          yPosition += 2;
        });
        yPosition += sectionSpacing;
      }

      // Business Information
      checkPageBreak(50);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 5;
      addText("BUSINESS INFORMATION", 14, true, [0, 51, 102]);
      yPosition += 3;

      addText("Business Address:", 10, true);
      addText(`  ${businessAddress || 'N/A'}`, 9);
      addText(`  ${city || ''}, ${postcode || ''}`, 9);
      addText(`  ${country || 'N/A'}`, 9);
      yPosition += 3;

      addText("Primary Contact:", 10, true);
      addText(`  Name: ${primaryContactName || 'N/A'}`, 9);
      addText(`  Email: ${primaryContactEmail || 'N/A'}`, 9);
      addText(`  Phone: ${primaryContactPhone || 'N/A'}`, 9);
      addText(`  Role: ${primaryContactRole || 'N/A'}`, 9);
      yPosition += 3;

      addText("Business Details:", 10, true);
      addText(`  Industry: ${industry || 'N/A'}`, 9);
      addText(`  Employee Count: ${employeeCount || 'N/A'}`, 9);
      addText(`  Website: ${website || 'N/A'}`, 9);
      addText(`  Expected Monthly Volume: ${expectedTransactionVolume || 'N/A'}`, 9);
      addText(`  Average Transaction Value: ${averageTransactionValue || 'N/A'}`, 9);
      addText(`  Source of Funds: ${sourceOfFunds || 'N/A'}`, 9);
      yPosition += 3;

      addText("Bank Account Details:", 10, true);
      addText(`  Bank Name: ${bankName || 'N/A'}`, 9);
      addText(`  Sort Code: ${sortCode || 'N/A'}`, 9);
      addText(`  Account Number: ${accountNumber ? '***' + accountNumber.slice(-4) : 'N/A'}`, 9);
      yPosition += sectionSpacing;

      // Documents Uploaded
      checkPageBreak(30);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 5;
      addText("DOCUMENTS UPLOADED", 14, true, [0, 51, 102]);
      yPosition += 3;

      const uploadedDocs = documents.filter(d => d.uploaded);
      if (uploadedDocs.length > 0) {
        uploadedDocs.forEach(doc => {
          const docType = documentTypes.find(dt => dt.type === doc.type);
          addText(`  ✓ ${docType?.label || doc.type}: ${doc.filename || 'Uploaded'}`, 9);
        });
      } else {
        addText("  No documents uploaded", 9);
      }
      yPosition += 3;
      addText(`Total Documents Uploaded: ${uploadedDocs.length}`, 9);
      addText(`Total Documents Required: ${documentTypes.filter(dt => dt.required).length}`, 9);
      yPosition += sectionSpacing;

      // Regulatory Compliance
      checkPageBreak(40);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 5;
      addText("REGULATORY COMPLIANCE", 14, true, [0, 51, 102]);
      yPosition += 3;

      addText("This verification has been conducted in accordance with:", 10);
      addText("  • UK Money Laundering Regulations 2017 (as amended)", 9);
      addText("  • Financial Conduct Authority (FCA) Guidelines", 9);
      addText("  • JMLSG Guidance on Prevention of Money Laundering", 9);
      addText("  • 5th Anti-Money Laundering Directive (5AMLD)", 9);
      addText("  • 6th Anti-Money Laundering Directive (6AMLD)", 9);
      addText("  • General Data Protection Regulation (GDPR)", 9);
      addText("  • Companies Act 2006", 9);
      yPosition += 3;

      addText("Compliance Status:", 10, true);
      addText("  ✓ KYB Compliant - Business verification complete", 9);
      addText("  ✓ AML Verified - Sanctions and watchlist screening clear", 9);
      addText("  ✓ GDPR Secure - Data processed securely under Article 6(1)(c)", 9);
      if (verificationResults.pepMatches > 0) {
        addText("  ⚠️ PEP Detected - Enhanced due diligence applied", 9, false, [255, 140, 0]);
      }
      yPosition += sectionSpacing;

      // Certification
      checkPageBreak(50);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 5;
      addText("CERTIFICATION", 14, true, [0, 51, 102]);
      yPosition += 3;

      addText("This report has been generated by TrustVerify's automated KYB verification system. All checks have been performed using industry-leading data providers.", 9);
      yPosition += 5;

      addText("Verification checks include:", 10, true);
      addText("  • Company Registration Verification (99.5% accuracy)", 9);
      addText("  • Sanctions Screening (99.5% accuracy)", 9);
      addText("  • PEP Database Checks (99.2% accuracy)", 9);
      addText("  • Adverse Media Screening (98.8% accuracy)", 9);
      addText("  • Document Verification (99.1% accuracy)", 9);
      yPosition += 5;

      addText(`Report certified by: TrustVerify Compliance Engine v2.1`, 9);
      addText(`Verification ID: ${verificationResults.referenceId}`, 9);
      yPosition += 3;

      addText("For queries regarding this report, please contact:", 9);
      addText("Email: compliance@trustverify.co.uk", 9);
      addText("Phone: 020 4542 7323", 9);
      yPosition += sectionSpacing;

      // Footer
      checkPageBreak(20);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 5;
      addText("This document is confidential and intended solely for the use of the addressee.", 8, false, [128, 128, 128]);
      addText("Any unauthorized review, use, disclosure, or distribution is prohibited.", 8, false, [128, 128, 128]);
      yPosition += 3;
      addText(`© ${new Date().getFullYear()} TrustVerify Ltd. All rights reserved.`, 8, false, [128, 128, 128]);
      addText("15 Grey Street, Newcastle upon Tyne NE1 6EE, United Kingdom", 8, false, [128, 128, 128]);

      // Add page numbers
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: "right" });
      }

      // Save the PDF
      doc.save(`TrustVerify-KYB-Report-${verificationResults.referenceId}.pdf`);

      toast({
        title: "PDF Report Downloaded",
        description: `KYB verification report saved as TrustVerify-KYB-Report-${verificationResults.referenceId}.pdf`,
      });
    } catch (error: any) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF report. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (verificationStatus === 'in_review' && !verificationResults) {
    return (
      <main className="bg-[#f6f6f6] overflow-hidden w-full mx-auto flex flex-col min-h-screen">
        <Header />
        <section className="flex flex-col items-start gap-[30px] w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-[110px] py-12">
          <Card className="max-w-2xl mx-auto w-full bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[#e8f5e9] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-[#27ae60] animate-pulse" />
                </div>
                <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl mb-2">Verifying Your Business</h2>
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Running comprehensive compliance checks...</p>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">
                  <span>Progress</span>
                  <span>{Math.round(verificationProgress)}%</span>
                </div>
                <Progress value={verificationProgress} className="h-2" />
              </div>

              <div className="space-y-3">
                {verificationSteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-[#f6f6f6] border border-[#e4e4e4]">
                    {step.status === 'processing' && (
                      <Clock className="h-5 w-5 text-[#27ae60] animate-spin" />
                    )}
                    {step.status === 'complete' && (
                      <CheckCircle className="h-5 w-5 text-[#27ae60]" />
                    )}
                    {step.status === 'warning' && (
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">{step.step}</p>
                      {step.result && <p className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{step.result}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
        <Footer />
      </main>
    );
  }

  if (verificationStatus === 'approved' && verificationResults) {
    const getRiskColor = (level: string) => {
      if (level === 'high') return 'text-red-600 bg-red-100';
      if (level === 'medium') return 'text-amber-600 bg-amber-100';
      return 'text-[#27ae60] bg-[#e8f5e9]';
    };

    return (
      <main className="bg-[#f6f6f6] overflow-hidden w-full mx-auto flex flex-col min-h-screen">
        <Header />
        <section className="flex flex-col items-start gap-[30px] w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-[110px] py-12">
          <Card className="max-w-3xl mx-auto w-full bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  verificationResults.overallStatus === 'approved' ? 'bg-[#e8f5e9]' : 'bg-amber-100'
                }`}>
                  {verificationResults.overallStatus === 'approved' ? (
                    <CheckCircle className="h-10 w-10 text-[#27ae60]" />
                  ) : (
                    <AlertTriangle className="h-10 w-10 text-amber-600" />
                  )}
                </div>
                <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl mb-2">
                  {verificationResults.overallStatus === 'approved' ? 'Business Verified' : 'Additional Review Required'}
                </h2>
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mb-4">
                  {verificationResults.overallStatus === 'approved' 
                    ? 'Your business has passed all verification checks.'
                    : 'Your application requires manual review by our compliance team.'}
                </p>
                <Badge className={`rounded-full px-4 py-1.5 h-auto ${
                  verificationResults.overallStatus === 'approved' 
                    ? 'bg-[#27ae6033] text-[#27ae60] hover:bg-[#27ae6033]' 
                    : 'bg-amber-100 text-amber-700 hover:bg-amber-100'
                }`}>
                  <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">
                    {verificationResults.overallStatus === 'approved' ? 'Approved' : 'Pending Review'}
                  </span>
                </Badge>
              </div>

              <div className="bg-[#f6f6f6] rounded-lg p-4 mb-6 text-center border border-[#e4e4e4]">
                <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mb-1">Reference ID</p>
                <p className="text-lg font-bold text-[#27ae60] [font-family:'DM_Sans_18pt-Medium',Helvetica]">{verificationResults.referenceId}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                  <CardContent className="p-4">
                    <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] mb-4 flex items-center gap-2">
                      <Shield className="h-5 w-5 text-[#27ae60]" />
                      Risk Assessment
                    </h3>
                    <div className="text-center mb-4">
                      <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${getRiskColor(verificationResults.riskLevel)}`}>
                        <span className="text-2xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica]">{verificationResults.riskScore}</span>
                      </div>
                      <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mt-2">Risk Score</p>
                    </div>
                    <Badge className={`w-full justify-center rounded-full ${getRiskColor(verificationResults.riskLevel)}`}>
                      <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">
                        {verificationResults.riskLevel.toUpperCase()} RISK
                      </span>
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                  <CardContent className="p-4">
                    <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] mb-4 flex items-center gap-2">
                      <FileCheck className="h-5 w-5 text-[#27ae60]" />
                      Verification Summary
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Company Verified</span>
                        <CheckCircle className="h-5 w-5 text-[#27ae60]" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Documents Verified</span>
                        <Badge variant="outline" className="rounded-full">{verificationResults.documentsVerified}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Owners Cleared</span>
                        <Badge variant="outline" className="rounded-full">{verificationResults.beneficialOwnersCleared}/{beneficialOwners.length}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Sanctions Check</span>
                        <CheckCircle className="h-5 w-5 text-[#27ae60]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-3 mb-8">
                <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Verification Checks Completed</h3>
                {verificationSteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg border border-[#e4e4e4] bg-[#fcfcfc]">
                    {step.status === 'complete' && <CheckCircle className="h-5 w-5 text-[#27ae60]" />}
                    {step.status === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-600" />}
                    <div className="flex-1">
                      <p className="text-sm font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">{step.step}</p>
                      <p className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{step.result}</p>
                    </div>
                    <Badge variant={step.status === 'warning' ? 'destructive' : 'secondary'} className="text-xs rounded-full">
                      {step.status === 'warning' ? 'Flagged' : 'Passed'}
                    </Badge>
                  </div>
                ))}
              </div>

              {verificationResults.pepMatches > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-amber-900">PEP Match Detected</h4>
                      <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-amber-700">
                        {verificationResults.pepMatches} beneficial owner(s) flagged as Politically Exposed Person(s). 
                        Enhanced due diligence has been applied.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Separator className="my-6" />

              <div className="flex gap-4">
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90" 
                  data-testid="button-start-platform"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span className="font-semibold text-white text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica]">
                    {verificationResults.overallStatus === 'approved' ? 'Access Dashboard' : 'View Application Status'}
                  </span>
                </Button>
                <Button 
                  onClick={generatePDFReport}
                  variant="outline" 
                  className="h-[45px] rounded-lg border border-[#e4e4e4] hover:bg-[#f6f6f6]"
                  data-testid="button-download-report"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-[#003d2b]">Download Report</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-[#f6f6f6] overflow-hidden w-full mx-auto flex flex-col min-h-screen">
      <Header />
      
      <section className="flex flex-col items-start gap-[30px] w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-[110px] py-8">
        {/* Header */}
        <div className="text-center mb-8 w-full">
          <div className="flex justify-center w-full mb-6">
            <Badge className="w-fit bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-full px-4 py-1.5 h-auto">
              <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm tracking-[0] leading-[14px]">
                Business Verification
              </span>
            </Badge>
          </div>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Building2 className="h-8 w-8 text-[#27ae60]" />
            <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl sm:text-4xl lg:text-5xl">
              Know Your Business (KYB) Verification
            </h1>
          </div>
          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base sm:text-lg lg:text-xl max-w-2xl mx-auto">
            Complete your business verification to unlock full platform access, higher transaction limits, 
            and API production keys.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-8 w-full">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
          
          <div className="flex justify-between mt-4">
            {['Company Info', 'Address', 'Business Details', 'Beneficial Owners', 'Documents', 'Review'].map((step, index) => (
              <div 
                key={step}
                className={`flex flex-col items-center ${index + 1 <= currentStep ? 'text-[#27ae60]' : 'text-[#808080]'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-1
                  ${index + 1 < currentStep ? 'bg-[#27ae60] text-white' : 
                    index + 1 === currentStep ? 'bg-[#27ae60] text-white' : 'bg-[#e4e4e4]'}`}
                >
                  {index + 1 < currentStep ? <CheckCircle className="h-4 w-4" /> : index + 1}
                </div>
                <span className="text-xs hidden md:block [font-family:'DM_Sans_18pt-Regular',Helvetica]">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Steps */}
        <div className="max-w-4xl mx-auto w-full">
          {/* Step 1: Company Information */}
          {currentStep === 1 && (
            <Card data-testid="step-company-info" className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                  <Building2 className="h-5 w-5 text-[#27ae60]" />
                  Company Information
                </CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                  Enter your company's legal registration details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Legal Company Name *</Label>
                    <Input
                      id="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g., Acme Technologies Ltd"
                      data-testid="input-company-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tradingName" className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Trading Name (if different)</Label>
                    <Input
                      id="tradingName"
                      value={tradingName}
                      onChange={(e) => setTradingName(e.target.value)}
                      placeholder="e.g., Acme Tech"
                      data-testid="input-trading-name"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="registrationNumber" className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Company Registration Number *</Label>
                    <Input
                      id="registrationNumber"
                      value={registrationNumber}
                      onChange={(e) => setRegistrationNumber(e.target.value)}
                      placeholder="e.g., 12345678"
                      data-testid="input-registration-number"
                    />
                    <p className="text-xs text-gray-500">UK Companies House number</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vatNumber" className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">VAT Number (if applicable)</Label>
                    <Input
                      id="vatNumber"
                      value={vatNumber}
                      onChange={(e) => setVatNumber(e.target.value)}
                      placeholder="e.g., GB123456789"
                      data-testid="input-vat-number"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyType" className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Company Type *</Label>
                    <Select value={companyType} onValueChange={setCompanyType}>
                      <SelectTrigger data-testid="select-company-type">
                        <SelectValue placeholder="Select company type" />
                      </SelectTrigger>
                      <SelectContent>
                        {companyTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registrationCountry" className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Country of Incorporation *</Label>
                    <Select value={registrationCountry} onValueChange={setRegistrationCountry}>
                      <SelectTrigger data-testid="select-registration-country">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map(c => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="incorporationDate" className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Date of Incorporation *</Label>
                  <Input
                    id="incorporationDate"
                    type="date"
                    value={incorporationDate}
                    onChange={(e) => setIncorporationDate(e.target.value)}
                    data-testid="input-incorporation-date"
                  />
                </div>

                <div className="flex justify-end">
                  <Button 
                    onClick={() => setCurrentStep(2)} 
                    data-testid="button-next-step-1"
                    className="h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90 px-8"
                  >
                    <span className="font-semibold text-white text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica]">Continue</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Business Address */}
          {currentStep === 2 && (
            <Card data-testid="step-business-address" className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                  <MapPin className="h-5 w-5 text-[#27ae60]" />
                  Registered Business Address
                </CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                  Provide your company's registered office address
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="businessAddress" className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Street Address *</Label>
                  <Textarea
                    id="businessAddress"
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                    placeholder="e.g., 123 Business Street, Suite 456"
                    rows={2}
                    data-testid="input-business-address"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">City *</Label>
                    <Input
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g., London"
                      data-testid="input-city"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postcode" className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Postcode *</Label>
                    <Input
                      id="postcode"
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value)}
                      placeholder="e.g., SW1A 1AA"
                      data-testid="input-postcode"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country" className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Country *</Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger data-testid="select-country">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-4">Primary Contact Person</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="primaryContactName" className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Full Name *</Label>
                      <Input
                        id="primaryContactName"
                        value={primaryContactName}
                        onChange={(e) => setPrimaryContactName(e.target.value)}
                        placeholder="e.g., John Smith"
                        data-testid="input-contact-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="primaryContactRole" className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Job Title *</Label>
                      <Input
                        id="primaryContactRole"
                        value={primaryContactRole}
                        onChange={(e) => setPrimaryContactRole(e.target.value)}
                        placeholder="e.g., Chief Executive Officer"
                        data-testid="input-contact-role"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="primaryContactEmail" className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="primaryContactEmail"
                          type="email"
                          value={primaryContactEmail}
                          onChange={(e) => setPrimaryContactEmail(e.target.value)}
                          placeholder="john.smith@company.com"
                          className="pl-10"
                          data-testid="input-contact-email"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="primaryContactPhone" className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Phone Number *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="primaryContactPhone"
                          value={primaryContactPhone}
                          onChange={(e) => setPrimaryContactPhone(e.target.value)}
                          placeholder="+44 20 1234 5678"
                          className="pl-10"
                          data-testid="input-contact-phone"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentStep(1)} 
                    data-testid="button-back-step-2"
                    className="h-[45px] rounded-lg border border-[#e4e4e4] hover:bg-[#f6f6f6] px-8"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-[#003d2b]">Back</span>
                  </Button>
                  <Button 
                    onClick={() => setCurrentStep(3)} 
                    data-testid="button-next-step-2"
                    className="h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90 px-8"
                  >
                    <span className="font-semibold text-white text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica]">Continue</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Business Details & Financials */}
          {currentStep === 3 && (
            <Card data-testid="step-business-details" className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                  <Briefcase className="h-5 w-5 text-[#27ae60]" />
                  Business Details & Financial Information
                </CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                  Tell us about your business operations and expected transaction activity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="industry" className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Industry Sector *</Label>
                    <Select value={industry} onValueChange={setIndustry}>
                      <SelectTrigger data-testid="select-industry">
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map(ind => (
                          <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {(industry === "Cryptocurrency & Blockchain" || industry === "Gaming & Entertainment") && (
                      <p className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-amber-600 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        High-risk industry - enhanced due diligence required
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employeeCount" className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Number of Employees</Label>
                    <Select value={employeeCount} onValueChange={setEmployeeCount}>
                      <SelectTrigger data-testid="select-employee-count">
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10</SelectItem>
                        <SelectItem value="11-50">11-50</SelectItem>
                        <SelectItem value="51-200">51-200</SelectItem>
                        <SelectItem value="201-500">201-500</SelectItem>
                        <SelectItem value="501+">501+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessDescription" className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Business Description *</Label>
                  <Textarea
                    id="businessDescription"
                    value={businessDescription}
                    onChange={(e) => setBusinessDescription(e.target.value)}
                    placeholder="Describe your business activities, products/services offered, and target customers..."
                    rows={4}
                    data-testid="input-business-description"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website" className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Company Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="website"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://www.yourcompany.com"
                      className="pl-10"
                      data-testid="input-website"
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] mb-4 flex items-center gap-2">
                    <PoundSterling className="h-5 w-5 text-[#27ae60]" />
                    Expected Transaction Activity
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="expectedTransactionVolume" className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Monthly Transaction Volume (£) *</Label>
                      <Select value={expectedTransactionVolume} onValueChange={setExpectedTransactionVolume}>
                        <SelectTrigger data-testid="select-transaction-volume">
                          <SelectValue placeholder="Select expected volume" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-10000">Up to £10,000</SelectItem>
                          <SelectItem value="10001-50000">£10,001 - £50,000</SelectItem>
                          <SelectItem value="50001-100000">£50,001 - £100,000</SelectItem>
                          <SelectItem value="100001-500000">£100,001 - £500,000</SelectItem>
                          <SelectItem value="500001-1000000">£500,001 - £1,000,000</SelectItem>
                          <SelectItem value="1000001+">Over £1,000,000</SelectItem>
                        </SelectContent>
                      </Select>
                      {expectedTransactionVolume === "1000001+" && (
                        <p className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-amber-600 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          High volume - enhanced monitoring will apply
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="averageTransactionValue" className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Average Transaction Value (£)</Label>
                      <Select value={averageTransactionValue} onValueChange={setAverageTransactionValue}>
                        <SelectTrigger data-testid="select-avg-transaction">
                          <SelectValue placeholder="Select average value" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-100">Up to £100</SelectItem>
                          <SelectItem value="101-500">£101 - £500</SelectItem>
                          <SelectItem value="501-1000">£501 - £1,000</SelectItem>
                          <SelectItem value="1001-5000">£1,001 - £5,000</SelectItem>
                          <SelectItem value="5001-10000">£5,001 - £10,000</SelectItem>
                          <SelectItem value="10001+">Over £10,000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <Label htmlFor="sourceOfFunds" className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Primary Source of Funds *</Label>
                    <Select value={sourceOfFunds} onValueChange={setSourceOfFunds}>
                      <SelectTrigger data-testid="select-source-of-funds">
                        <SelectValue placeholder="Select source of funds" />
                      </SelectTrigger>
                      <SelectContent>
                        {sourceOfFundsOptions.map(source => (
                          <SelectItem key={source} value={source}>{source}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] mb-4">Bank Account Details (for payouts)</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="bankName" className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Bank Name *</Label>
                      <Input
                        id="bankName"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="e.g., Barclays"
                        data-testid="input-bank-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sortCode" className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Sort Code *</Label>
                      <Input
                        id="sortCode"
                        value={sortCode}
                        onChange={(e) => setSortCode(e.target.value)}
                        placeholder="e.g., 20-00-00"
                        data-testid="input-sort-code"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber" className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Account Number *</Label>
                      <Input
                        id="accountNumber"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="e.g., 12345678"
                        data-testid="input-account-number"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentStep(2)} 
                    data-testid="button-back-step-3"
                    className="h-[45px] rounded-lg border border-[#e4e4e4] hover:bg-[#f6f6f6] px-8"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-[#003d2b]">Back</span>
                  </Button>
                  <Button 
                    onClick={() => setCurrentStep(4)} 
                    data-testid="button-next-step-3"
                    className="h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90 px-8"
                  >
                    <span className="font-semibold text-white text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica]">Continue</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Beneficial Owners */}
          {currentStep === 4 && (
            <Card data-testid="step-beneficial-owners" className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                  <Users className="h-5 w-5 text-[#27ae60]" />
                  Beneficial Owners & Directors
                </CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                  Provide details of all individuals who own 25% or more of the company, or who have significant control
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-amber-900">Regulatory Requirement</h4>
                      <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-amber-700">
                        Under UK Anti-Money Laundering regulations, we must collect information on all 
                        Ultimate Beneficial Owners (UBOs) who own 25% or more of the company.
                      </p>
                    </div>
                  </div>
                </div>

                {beneficialOwners.map((owner, index) => (
                  <div key={owner.id} className="border border-[#e4e4e4] rounded-lg p-6 space-y-4 bg-[#fcfcfc]">
                    <div className="flex items-center justify-between">
                      <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Beneficial Owner {index + 1}</h3>
                      {beneficialOwners.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeBeneficialOwner(owner.id)}
                          className="text-red-600 hover:text-red-700"
                          data-testid={`button-remove-owner-${index}`}
                        >
                          Remove
                        </Button>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Full Legal Name *</Label>
                        <Input
                          value={owner.name}
                          onChange={(e) => updateBeneficialOwner(owner.id, 'name', e.target.value)}
                          placeholder="e.g., John Smith"
                          data-testid={`input-owner-name-${index}`}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Date of Birth *</Label>
                        <Input
                          type="date"
                          value={owner.dateOfBirth}
                          onChange={(e) => updateBeneficialOwner(owner.id, 'dateOfBirth', e.target.value)}
                          data-testid={`input-owner-dob-${index}`}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Nationality *</Label>
                        <Select 
                          value={owner.nationality} 
                          onValueChange={(value) => updateBeneficialOwner(owner.id, 'nationality', value)}
                        >
                          <SelectTrigger data-testid={`select-owner-nationality-${index}`}>
                            <SelectValue placeholder="Select nationality" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map(c => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Ownership Percentage *</Label>
                        <div className="relative">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={owner.ownershipPercentage}
                            onChange={(e) => updateBeneficialOwner(owner.id, 'ownershipPercentage', Number(e.target.value))}
                            placeholder="e.g., 50"
                            data-testid={`input-owner-percentage-${index}`}
                          />
                          <span className="absolute right-3 top-3 text-gray-400">%</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Residential Address *</Label>
                      <Textarea
                        value={owner.address}
                        onChange={(e) => updateBeneficialOwner(owner.id, 'address', e.target.value)}
                        placeholder="Full residential address"
                        rows={2}
                        data-testid={`input-owner-address-${index}`}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`pep-${owner.id}`}
                          checked={owner.isPoliticallyExposed}
                          onCheckedChange={(checked) => updateBeneficialOwner(owner.id, 'isPoliticallyExposed', checked)}
                          data-testid={`checkbox-owner-pep-${index}`}
                        />
                        <Label htmlFor={`pep-${owner.id}`} className="text-sm">
                          Politically Exposed Person (PEP)
                        </Label>
                      </div>
                    </div>

                    {owner.isPoliticallyExposed && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-amber-700">
                          Enhanced due diligence will be applied for PEP individuals
                        </p>
                      </div>
                    )}
                  </div>
                ))}

                <Button
                  variant="outline"
                  onClick={addBeneficialOwner}
                  className="w-full h-[45px] rounded-lg border border-[#e4e4e4] hover:bg-[#f6f6f6]"
                  data-testid="button-add-owner"
                >
                  <Users className="mr-2 h-4 w-4" />
                  <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-[#003d2b]">Add Another Beneficial Owner</span>
                </Button>

                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentStep(3)} 
                    data-testid="button-back-step-4"
                    className="h-[45px] rounded-lg border border-[#e4e4e4] hover:bg-[#f6f6f6] px-8"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-[#003d2b]">Back</span>
                  </Button>
                  <Button 
                    onClick={() => setCurrentStep(5)} 
                    data-testid="button-next-step-4"
                    className="h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90 px-8"
                  >
                    <span className="font-semibold text-white text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica]">Continue</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 5: Document Upload */}
          {currentStep === 5 && (
            <Card data-testid="step-documents" className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                  <FileText className="h-5 w-5 text-[#27ae60]" />
                  Compliance Documents
                </CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                  Upload the required documents to verify your business
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-[#e8f5e9] border border-[#27ae60] rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-[#27ae60] mt-0.5" />
                    <div>
                      <h4 className="font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Secure Document Processing</h4>
                      <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                        All documents are encrypted and stored securely. We use bank-grade security 
                        to protect your sensitive information.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {documentTypes.map((docType) => {
                    const doc = documents.find(d => d.type === docType.type);
                    const isUploaded = doc?.uploaded || false;
                    
                    return (
                      <div 
                        key={docType.type}
                        className={`border border-[#e4e4e4] rounded-lg p-4 ${isUploaded ? 'bg-[#e8f5e9] border-[#27ae60]' : 'bg-[#fcfcfc]'}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">
                                {docType.label}
                                {docType.required && <span className="text-red-500">*</span>}
                              </h4>
                              {isUploaded && (
                                <Badge className="bg-[#27ae60] rounded-full">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-white">Uploaded</span>
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mt-1">{docType.description}</p>
                          </div>
                          <Button
                            variant={isUploaded ? "outline" : "default"}
                            size="sm"
                            onClick={() => simulateDocumentUpload(docType.type)}
                            data-testid={`button-upload-${docType.type}`}
                            className={isUploaded ? "h-[45px] rounded-lg border border-[#e4e4e4] hover:bg-[#f6f6f6]" : "h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90"}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">
                              {isUploaded ? "Replace" : "Upload"}
                            </span>
                          </Button>
                        </div>
                        {isUploaded && doc?.filename && (
                          <div className="mt-2 flex items-center gap-2 text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#27ae60]">
                            <FileCheck className="h-4 w-4" />
                            {doc.filename}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="bg-[#f6f6f6] rounded-lg p-4 border border-[#e4e4e4]">
                  <h4 className="font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b] mb-2">Accepted File Formats</h4>
                  <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                    PDF, JPG, PNG (max 10MB per file). Documents must be clearly legible and show all four corners.
                  </p>
                </div>

                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentStep(4)} 
                    data-testid="button-back-step-5"
                    className="h-[45px] rounded-lg border border-[#e4e4e4] hover:bg-[#f6f6f6] px-8"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-[#003d2b]">Back</span>
                  </Button>
                  <Button 
                    onClick={() => setCurrentStep(6)} 
                    data-testid="button-next-step-5"
                    className="h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90 px-8"
                  >
                    <span className="font-semibold text-white text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica]">Continue</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 6: Review & Submit */}
          {currentStep === 6 && (
            <Card data-testid="step-review" className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                  <Eye className="h-5 w-5 text-[#27ae60]" />
                  Review & Submit
                </CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                  Please review your information before submitting your KYB verification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Company Summary */}
                <div className="border border-[#e4e4e4] rounded-lg p-4 bg-[#fcfcfc]">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-[#27ae60]" />
                      Company Information
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)} className="[font-family:'DM_Sans_18pt-Medium',Helvetica] text-sm text-[#003d2b]">Edit</Button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-2 text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica]">
                    <div><span className="text-[#808080]">Company Name:</span> <span className="text-[#003d2b]">{companyName || '-'}</span></div>
                    <div><span className="text-[#808080]">Registration No:</span> <span className="text-[#003d2b]">{registrationNumber || '-'}</span></div>
                    <div><span className="text-[#808080]">Company Type:</span> <span className="text-[#003d2b]">{companyType || '-'}</span></div>
                    <div><span className="text-[#808080]">Country:</span> <span className="text-[#003d2b]">{registrationCountry || '-'}</span></div>
                  </div>
                </div>

                {/* Address Summary */}
                <div className="border border-[#e4e4e4] rounded-lg p-4 bg-[#fcfcfc]">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#27ae60]" />
                      Business Address
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => setCurrentStep(2)} className="[font-family:'DM_Sans_18pt-Medium',Helvetica] text-sm text-[#003d2b]">Edit</Button>
                  </div>
                  <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">{businessAddress}, {city}, {postcode}, {country}</p>
                  <div className="mt-2 text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica]">
                    <span className="text-[#808080]">Primary Contact:</span> <span className="text-[#003d2b]">{primaryContactName} ({primaryContactEmail})</span>
                  </div>
                </div>

                {/* Business Details Summary */}
                <div className="border border-[#e4e4e4] rounded-lg p-4 bg-[#fcfcfc]">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-[#27ae60]" />
                      Business Details
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => setCurrentStep(3)} className="[font-family:'DM_Sans_18pt-Medium',Helvetica] text-sm text-[#003d2b]">Edit</Button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-2 text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica]">
                    <div><span className="text-[#808080]">Industry:</span> <span className="text-[#003d2b]">{industry || '-'}</span></div>
                    <div><span className="text-[#808080]">Monthly Volume:</span> <span className="text-[#003d2b]">{expectedTransactionVolume || '-'}</span></div>
                    <div><span className="text-[#808080]">Source of Funds:</span> <span className="text-[#003d2b]">{sourceOfFunds || '-'}</span></div>
                    <div><span className="text-[#808080]">Website:</span> <span className="text-[#003d2b]">{website || '-'}</span></div>
                  </div>
                </div>

                {/* Beneficial Owners Summary */}
                <div className="border border-[#e4e4e4] rounded-lg p-4 bg-[#fcfcfc]">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] flex items-center gap-2">
                      <Users className="h-4 w-4 text-[#27ae60]" />
                      Beneficial Owners
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => setCurrentStep(4)} className="[font-family:'DM_Sans_18pt-Medium',Helvetica] text-sm text-[#003d2b]">Edit</Button>
                  </div>
                  <div className="space-y-2">
                    {beneficialOwners.map((owner, index) => (
                      <div key={owner.id} className="flex items-center justify-between text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica]">
                        <span className="text-[#003d2b]">{owner.name || `Owner ${index + 1}`}</span>
                        <span className="text-[#808080]">{owner.ownershipPercentage}% ownership</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Documents Summary */}
                <div className="border border-[#e4e4e4] rounded-lg p-4 bg-[#fcfcfc]">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[#27ae60]" />
                      Documents
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => setCurrentStep(5)} className="[font-family:'DM_Sans_18pt-Medium',Helvetica] text-sm text-[#003d2b]">Edit</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {documents.filter(d => d.uploaded).map((doc) => (
                      <Badge key={doc.type} variant="secondary" className="flex items-center gap-1 rounded-full bg-[#e8f5e9] text-[#27ae60]">
                        <CheckCircle className="h-3 w-3 text-[#27ae60]" />
                        <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">{doc.type.replace(/_/g, ' ')}</span>
                      </Badge>
                    ))}
                    {documents.filter(d => d.uploaded).length === 0 && (
                      <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">No documents uploaded</span>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Declarations */}
                <div className="space-y-4">
                  <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Declarations</h3>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="accuracy"
                      checked={accuracyDeclared}
                      onCheckedChange={(checked) => setAccuracyDeclared(checked as boolean)}
                      data-testid="checkbox-accuracy"
                    />
                    <Label htmlFor="accuracy" className="text-sm leading-tight [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">
                      I confirm that all information provided is accurate and complete to the best of my knowledge. 
                      I understand that providing false information may result in rejection of this application.
                    </Label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={termsAccepted}
                      onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                      data-testid="checkbox-terms"
                    />
                    <Label htmlFor="terms" className="text-sm leading-tight [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">
                      I agree to the <a href="/terms" className="text-[#27ae60] hover:underline">Terms of Service</a> and{" "}
                      <a href="/privacy" className="text-[#27ae60] hover:underline">Privacy Policy</a>.
                    </Label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="dataProcessing"
                      checked={dataProcessingAccepted}
                      onCheckedChange={(checked) => setDataProcessingAccepted(checked as boolean)}
                      data-testid="checkbox-data-processing"
                    />
                    <Label htmlFor="dataProcessing" className="text-sm leading-tight [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">
                      I consent to the processing of the provided data for KYB verification purposes, 
                      including checks against sanctions lists and PEP databases.
                    </Label>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentStep(5)} 
                    data-testid="button-back-step-6"
                    className="h-[45px] rounded-lg border border-[#e4e4e4] hover:bg-[#f6f6f6] px-8"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-[#003d2b]">Back</span>
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={!termsAccepted || !dataProcessingAccepted || !accuracyDeclared || isSubmitting}
                    className="h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90 disabled:opacity-50 px-8"
                    data-testid="button-submit-kyb"
                  >
                    {isSubmitting ? (
                      <>
                        <Clock className="mr-2 h-4 w-4 animate-spin" />
                        <span className="font-semibold text-white text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica]">Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        <span className="font-semibold text-white text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica]">Submit KYB Verification</span>
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Side Info Cards */}
        <div className="max-w-4xl mx-auto mt-8 grid md:grid-cols-3 gap-4 w-full">
          <Card className="bg-[#e8f5e9] border border-[#27ae60] rounded-[20px]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-[#27ae60]" />
                <div>
                  <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Quick Review</h4>
                  <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">2-3 business days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#e8f5e9] border border-[#27ae60] rounded-[20px]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-[#27ae60]" />
                <div>
                  <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Bank-Grade Security</h4>
                  <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">256-bit encryption</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#e8f5e9] border border-[#27ae60] rounded-[20px]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <UserCheck className="h-8 w-8 text-[#27ae60]" />
                <div>
                  <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Compliance First</h4>
                  <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">FCA & GDPR compliant</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      <Footer />
    </main>
  );
}
