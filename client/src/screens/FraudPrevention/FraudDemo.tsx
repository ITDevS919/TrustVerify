import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Shield, 
  CheckCircle, 
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  UserCheck,
  Eye,
  Globe,
  CreditCard,
  AlertTriangle,
  TrendingUp,
  Lock,
  Zap,
  FileCheck,
  Database,
  Network,
  ShoppingCart,
  Settings,
  MessageSquare,
  Gavel,
  PoundSterling
} from "lucide-react";

interface DemoStep {
  id: number;
  title: string;
  description: string;
  component: React.ReactNode;
  duration: number;
}

export function FraudDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const demoSteps: DemoStep[] = [
    {
      id: 1,
      title: "Transaction Initiation",
      description: "A new transaction is created and enters our fraud prevention system",
      duration: 3000,
      component: (
        <div className="space-y-4">
          <div className="bg-[#e8f5e9] border-2 border-[#27ae60] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b]">New Transaction Request</h4>
              <Badge className="bg-[#27ae6033] text-[#27ae60] rounded-full">Processing</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] min-w-0">Amount:</span>
                <span className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b] sm:ml-2 truncate">£2,500.00</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] min-w-0">Type:</span>
                <span className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b] sm:ml-2 truncate">E-commerce Purchase</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center min-w-0">
                <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] flex-shrink-0">Buyer:</span>
                <span className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b] sm:ml-2 truncate text-xs sm:text-sm break-all">john.buyer@email.com</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center min-w-0">
                <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] flex-shrink-0">Seller:</span>
                <span className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b] sm:ml-2 truncate text-xs sm:text-sm break-all">secure.store@merchant.com</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#e8f5e9] border border-[#27ae60]">
              <div className="flex items-center space-x-2 mb-2">
                <ShoppingCart className="h-5 w-5 text-[#27ae60]" />
                <span className="font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">E-commerce</span>
              </div>
              <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Category: Electronics</div>
            </div>
            <div className="p-4 rounded-xl bg-[#e8f5e9] border border-[#27ae60]">
              <div className="flex items-center space-x-2 mb-2">
                <CreditCard className="h-5 w-5 text-[#27ae60]" />
                <span className="font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Payment</span>
              </div>
              <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Method: Credit Card</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Identity Verification",
      description: "Advanced KYC/AML checks verify both parties in real-time",
      duration: 4000,
      component: (
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-[#e8f5e9] rounded-xl border-2 border-[#27ae60]">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-[#27ae60] flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Buyer Identity Verified</span>
                  <div className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Level 3 KYC Complete</div>
                </div>
              </div>
              <CheckCircle className="h-6 w-6 text-[#27ae60]" />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-[#e8f5e9] rounded-xl border-2 border-[#27ae60]">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-[#27ae60] flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Seller Identity Verified</span>
                  <div className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Business License Confirmed</div>
                </div>
              </div>
              <CheckCircle className="h-6 w-6 text-[#27ae60]" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-[#e8f5e9] text-center border border-[#27ae60]">
              <FileCheck className="h-6 w-6 text-[#27ae60] mx-auto mb-2" />
              <div className="text-xs font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Document Scan</div>
              <div className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Verified</div>
            </div>
            <div className="p-3 rounded-xl bg-[#e8f5e9] text-center border border-[#27ae60]">
              <Eye className="h-6 w-6 text-[#27ae60] mx-auto mb-2" />
              <div className="text-xs font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Biometric</div>
              <div className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Matched</div>
            </div>
            <div className="p-3 rounded-xl bg-[#e8f5e9] text-center border border-[#27ae60]">
              <Database className="h-6 w-6 text-[#27ae60] mx-auto mb-2" />
              <div className="text-xs font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">AML Check</div>
              <div className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Clear</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Real-Time Fraud Detection",
      description: "AI algorithms analyze transaction patterns for suspicious activity",
      duration: 5000,
      component: (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#fff3cd] border-2 border-[#ffc107]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-[#ffc107] flex items-center justify-center">
                  <Eye className="h-5 w-5 text-white" />
                </div>
                <span className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">AI Fraud Analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#27ae60] rounded-full animate-pulse"></div>
                <span className="text-sm font-bold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#27ae60]">Analyzing</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Device fingerprinting</span>
                <CheckCircle className="h-4 w-4 text-[#27ae60]" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Behavioral analysis</span>
                <CheckCircle className="h-4 w-4 text-[#27ae60]" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Pattern recognition</span>
                <CheckCircle className="h-4 w-4 text-[#27ae60]" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Risk assessment</span>
                <CheckCircle className="h-4 w-4 text-[#27ae60]" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-[#e8f5e9] text-center border border-[#27ae60]">
              <Zap className="h-6 w-6 text-[#27ae60] mx-auto mb-2" />
              <div className="text-xs font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">AI Score</div>
              <div className="text-sm font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#27ae60]">95/100</div>
            </div>
            <div className="p-3 rounded-xl bg-[#e8f5e9] text-center border border-[#27ae60]">
              <Network className="h-6 w-6 text-[#27ae60] mx-auto mb-2" />
              <div className="text-xs font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Risk Level</div>
              <div className="text-sm font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#27ae60]">Low</div>
            </div>
            <div className="p-3 rounded-xl bg-[#e8f5e9] text-center border border-[#27ae60]">
              <TrendingUp className="h-6 w-6 text-[#27ae60] mx-auto mb-2" />
              <div className="text-xs font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Confidence</div>
              <div className="text-sm font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#27ae60]">99.8%</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Global Risk Intelligence",
      description: "Cross-platform database checks for known fraud indicators",
      duration: 3000,
      component: (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#f6f6f6] border-2 border-[#e4e4e4]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-[#27ae60] flex items-center justify-center">
                  <Globe className="h-5 w-5 text-white" />
                </div>
                <span className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Global Database Check</span>
              </div>
              <Badge className="bg-[#27ae6033] text-[#27ae60] rounded-full">Complete</Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Fraud watchlists</span>
                  <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Blacklist check</span>
                  <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">PEP screening</span>
                  <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Sanctions check</span>
                  <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Cross-reference</span>
                  <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Risk scoring</span>
                  <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center p-4 rounded-xl bg-[#e8f5e9] border border-[#27ae60]">
            <div className="text-2xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#27ae60] mb-1">Global</div>
            <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Coverage Ready</div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Escrow Protection",
      description: "Funds are securely held until transaction completion",
      duration: 4000,
      component: (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#e8f5e9] border-2 border-[#27ae60]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-[#27ae60] flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <span className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Escrow Protection Active</span>
              </div>
              <Badge className="bg-[#27ae6033] text-[#27ae60] rounded-full">Secured</Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-[#fcfcfc] border border-[#e4e4e4]">
                <div className="w-3 h-3 rounded-full bg-[#27ae60]"></div>
                <span className="text-sm font-medium [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Funds Secured in Escrow</span>
                <span className="ml-auto font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#27ae60]">£2,500.00</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-[#fcfcfc] border border-[#e4e4e4]">
                <div className="w-3 h-3 rounded-full bg-[#ffc107]"></div>
                <span className="text-sm font-medium [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Awaiting Delivery Confirmation</span>
                <div className="ml-auto">
                  <div className="w-4 h-4 border-2 border-[#27ae60] border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-[#f6f6f6] border border-[#e4e4e4]">
                <div className="w-3 h-3 rounded-full bg-[#808080]"></div>
                <span className="text-sm font-medium [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Auto-Release to Seller</span>
                <span className="ml-auto text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Pending</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-[#e8f5e9] text-center border border-[#27ae60]">
              <Lock className="h-6 w-6 text-[#27ae60] mx-auto mb-2" />
              <div className="text-xs font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">256-bit Encryption</div>
            </div>
            <div className="p-3 rounded-xl bg-[#e8f5e9] text-center border border-[#27ae60]">
              <Settings className="h-6 w-6 text-[#27ae60] mx-auto mb-2" />
              <div className="text-xs font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Auto-Release</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "Transaction Approved",
      description: "All security checks passed - transaction is approved and secured",
      duration: 2000,
      component: (
        <div className="space-y-4">
          <div className="p-6 rounded-xl bg-[#e8f5e9] border-2 border-[#27ae60] text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#27ae60] flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b] mb-2">Transaction Approved!</h3>
            <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mb-4">All fraud prevention checks completed successfully</p>
            <Badge className="bg-[#27ae6033] text-[#27ae60] rounded-full px-4 py-2">
              <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Secure & Protected</span>
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#fcfcfc] border border-[#27ae60]">
              <div className="text-center">
                <div className="text-2xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#27ae60]">99.8%</div>
                <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Detection Rate</div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#fcfcfc] border border-[#27ae60]">
              <div className="text-center">
                <div className="text-2xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#27ae60]">&lt; 3s</div>
                <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Processing Time</div>
              </div>
            </div>
          </div>
          
          <div className="text-center p-4 rounded-xl bg-[#e8f5e9] border border-[#27ae60]">
            <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">
              <strong className="[font-family:'DM_Sans_18pt-Medium',Helvetica]">£1.9B+</strong> protected annually through our fraud prevention system
            </p>
          </div>
        </div>
      )
    },
    {
      id: 7,
      title: "Dispute Resolution Process",
      description: "TrustVerify's 72-hour dispute resolution with independent arbitration",
      duration: 5000,
      component: (
        <div className="space-y-4">
          <div className="p-6 rounded-xl bg-[#fff3cd] border-2 border-[#ffc107]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-[#ffc107] flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b]">Dispute Initiated</h4>
                  <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Buyer reported item not received</p>
                </div>
              </div>
              <Badge className="bg-[#ffc10733] text-[#003d2b] rounded-full">Under Review</Badge>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Dispute ID:</span>
                <span className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b] ml-2">#DR-2025-001</span>
              </div>
              <div>
                <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Resolution Deadline:</span>
                <span className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b] ml-2">72 hours</span>
              </div>
            </div>
          </div>
          
          {/* Resolution Timeline */}
          <div className="space-y-3">
            <h5 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Resolution Timeline</h5>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-[#e8f5e9] border border-[#27ae60]">
                <div className="w-6 h-6 rounded-full bg-[#27ae60] flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Evidence Collection</div>
                  <div className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Completed - 15 minutes</div>
                </div>
                <div className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#27ae60]">✓ Done</div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-[#e8f5e9] border border-[#27ae60]">
                <div className="w-6 h-6 rounded-full bg-[#27ae60] flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">AI Analysis & Verification</div>
                  <div className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Analyzing shipping records & communications</div>
                </div>
                <div className="w-4 h-4 border-2 border-[#27ae60] border-t-transparent rounded-full animate-spin"></div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-[#f6f6f6] border border-[#e4e4e4]">
                <div className="w-6 h-6 rounded-full bg-[#808080] flex items-center justify-center">
                  <PoundSterling className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#808080]">Fund Resolution</div>
                  <div className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Automatic settlement within 72 hours</div>
                </div>
                <div className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Pending</div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-[#f6f6f6] border border-[#e4e4e4]">
                <div className="w-6 h-6 rounded-full bg-[#808080] flex items-center justify-center">
                  <Gavel className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#808080]">Independent Arbitration</div>
                  <div className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Expert review if needed - final step</div>
                </div>
                <div className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Pending</div>
              </div>
            </div>
          </div>
          
          {/* USP Highlight */}
          <div className="p-4 rounded-xl bg-[#e8f5e9] border-2 border-[#27ae60]">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="h-5 w-5 text-[#27ae60]" />
              <span className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Complete Resolution Process</span>
            </div>
            <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
              Unlike competitors who only detect fraud, TrustVerify provides complete dispute resolution with guaranteed settlement.
            </div>
          </div>
        </div>
      )
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 100;
          const currentStepDuration = demoSteps[currentStep]?.duration || 3000;
          
          if (newProgress >= currentStepDuration) {
            if (currentStep < demoSteps.length - 1) {
              setCurrentStep((prevStep) => prevStep + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return currentStepDuration;
            }
          }
          return newProgress;
        });
      }, 100);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, demoSteps]);

  const resetDemo = () => {
    setCurrentStep(0);
    setProgress(0);
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const currentStepData = demoSteps[currentStep];
  const progressPercentage = currentStepData ? (progress / currentStepData.duration) * 100 : 0;

  return (
    <main className="bg-[#f6f6f6] overflow-hidden w-full mx-auto flex flex-col min-h-screen">
      <Header />
      
      <section className="flex flex-col items-start gap-[30px] w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-[110px] py-12">
        {/* Header */}
        <div className="w-full mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl sm:text-4xl">
                TrustVerify Business Demo
              </h1>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-lg mt-2">
                Experience real-time business fraud prevention in action
              </p>
            </div>
            <Link to="/" className="text-[#27ae60] hover:text-[#003d2b] font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica]">
            Back to Home
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 w-full">
          {/* Demo Display */}
          <div className="lg:col-span-2">
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <div className="p-6 border-b border-[#e4e4e4]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b]">
                      Step {currentStep + 1}: {currentStepData?.title}
                    </h3>
                    <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mt-1">{currentStepData?.description}</p>
                  </div>
                  <Badge className="bg-[#27ae6033] text-[#27ae60] rounded-full px-4 py-1.5 h-auto">
                    <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">
                      {Math.round(progressPercentage)}% Complete
                    </span>
                  </Badge>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-[#e4e4e4] rounded-full h-2 mb-4">
                  <div 
                    className="bg-[#27ae60] h-2 rounded-full transition-all duration-100 ease-linear"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="p-6">
                {currentStepData?.component}
              </div>
            </Card>
          </div>

          {/* Demo Controls */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                  <Play className="h-5 w-5 text-[#27ae60]" />
                  <span>Demo Controls</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Demo Steps Navigation */}
                <div className="space-y-2">
                  <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b] text-sm">Demo Steps:</h4>
                  <div className="space-y-1">
                    {demoSteps.map((step, index) => (
                      <button
                        key={step.id}
                        onClick={() => {
                          setCurrentStep(index);
                          setProgress(0);
                          setIsPlaying(false);
                        }}
                        className={`w-full text-left p-2 rounded-lg text-sm transition-colors [font-family:'DM_Sans_18pt-Regular',Helvetica] ${
                          currentStep === index 
                            ? 'bg-[#e8f5e9] text-[#003d2b] border border-[#27ae60]' 
                            : 'hover:bg-[#f6f6f6] text-[#808080] border border-transparent'
                        }`}
                      >
                        <span className="font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica]">{index + 1}. {step.title}</span>
                        <div className="text-xs text-[#808080] mt-1">{step.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Playback Controls */}
                <div className="space-y-3 pt-4 border-t border-[#e4e4e4]">
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={togglePlayPause}
                      className={`flex-1 h-[45px] rounded-lg ${
                        isPlaying 
                          ? 'bg-red-600 hover:bg-red-700' 
                          : 'bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90'
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="h-4 w-4 mr-2" />
                          <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-white">Pause Demo</span>
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-white">
                            {currentStep === demoSteps.length - 1 && progress === demoSteps[currentStep]?.duration ? 'Restart Demo' : 'Play Demo'}
                          </span>
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={resetDemo}
                      variant="outline"
                      size="sm"
                      className="h-[45px] rounded-lg border border-[#e4e4e4] hover:bg-[#f6f6f6]"
                    >
                      <RotateCcw className="h-4 w-4 text-[#003d2b]" />
                    </Button>
                  </div>
                </div>

                {/* Demo Statistics */}
                <div className="space-y-3 pt-4 border-t border-[#e4e4e4]">
                  <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b] text-sm">Live Statistics:</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#e8f5e9] p-3 rounded-lg border border-[#27ae60]">
                      <div className="text-lg font-bold text-[#27ae60] [font-family:'Suisse_Intl-SemiBold',Helvetica]">99.8%</div>
                      <div className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Detection Rate</div>
                    </div>
                    <div className="bg-[#e8f5e9] p-3 rounded-lg border border-[#27ae60]">
                      <div className="text-lg font-bold text-[#27ae60] [font-family:'Suisse_Intl-SemiBold',Helvetica]">&lt; 3s</div>
                      <div className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Process Time</div>
                    </div>
                    <div className="bg-[#e8f5e9] p-3 rounded-lg border border-[#27ae60]">
                      <div className="text-lg font-bold text-[#27ae60] [font-family:'Suisse_Intl-SemiBold',Helvetica]">£1.9B</div>
                      <div className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Protected</div>
                    </div>
                    <div className="bg-[#e8f5e9] p-3 rounded-lg border border-[#27ae60]">
                      <div className="text-lg font-bold text-[#27ae60] [font-family:'Suisse_Intl-SemiBold',Helvetica]">72h</div>
                      <div className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Resolution</div>
                    </div>
                  </div>
                </div>

                {/* Additional Actions */}
                <div className="space-y-2 pt-4 border-t border-[#e4e4e4]">
                  <Link to="/login">
                    <Button className="w-full h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90">
                      <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-white">Get Started</span>
                    </Button>
                  </Link>
                  <Link to="/business">
                    <Button variant="outline" className="w-full h-[45px] rounded-lg border border-[#e4e4e4] hover:bg-[#f6f6f6]">
                      <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-[#003d2b]">View Business Plans</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Additional Demo Info */}
      <section className="flex flex-col items-start gap-[30px] w-full px-4 sm:px-6 lg:px-[110px] py-16 bg-white">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-12">
            <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl mb-4">
              Complete Business Fraud Prevention Solution
            </h2>
            <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-lg max-w-2xl mx-auto">
              Experience the only platform that delivers end-to-end fraud protection from detection to resolution for businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Escrow Protection",
                description: "Secure fund holding until transaction completion",
                icon: Shield,
                color: "blue"
              },
              {
                title: "AI Fraud Detection",
                description: "Real-time pattern analysis and risk assessment",
                icon: Eye,
                color: "green"
              },
              {
                title: "Identity Verification",
                description: "Advanced KYC/AML compliance and verification",
                icon: UserCheck,
                color: "purple"
              },
              {
                title: "Dispute Resolution",
                description: "72-hour guaranteed settlement process",
                icon: MessageSquare,
                color: "orange"
              }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center pb-4">
                    <div className="h-16 w-16 bg-[#e8f5e9] rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-[#27ae60]" />
                    </div>
                    <CardTitle className="text-lg [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-center text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center justify-center space-x-4 bg-[#fcfcfc] rounded-xl p-6 border border-[#e4e4e4]">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#27ae60] [font-family:'Suisse_Intl-SemiBold',Helvetica]">From Detection</div>
                <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">AI-powered analysis</div>
              </div>
              <ArrowRight className="h-8 w-8 text-[#808080]" />
              <div className="text-center">
                <div className="text-3xl font-bold text-[#27ae60] [font-family:'Suisse_Intl-SemiBold',Helvetica]">To Resolution</div>
                <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Complete settlement</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Disclaimer */}
      <section className="flex flex-col items-start gap-[30px] w-full px-4 sm:px-6 lg:px-[110px] py-8 bg-[#f6f6f6]">
        <div className="max-w-7xl mx-auto w-full">
            <Card className="bg-[#fcfcfc] border border-[#e4e4e4] rounded-lg p-6">
                <div className="flex items-start gap-3 mb-4">
                    <Shield className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                    <div>
                    <h3 className="text-lg font-semibold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b] mb-2">Important Legal Disclaimer</h3>
                    <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] leading-relaxed">
                        Please read this disclaimer carefully before using TrustVerify's services. By accessing or using our platform, you acknowledge and agree to these terms.
                    </p>
                    </div>
                </div>
                <div className="space-y-4 text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">
                    <div>
                    <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b] mb-2">Service Limitations</h4>
                    <p className="leading-relaxed text-[#808080]">
                        TrustVerify operates as a technology platform providing fraud prevention, identity verification, and transaction security tools. We do <strong>not</strong> guarantee, warrant, endorse, or certify:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4 text-[#808080]">
                        <li>The accuracy, completeness, or reliability of any analysis, verification, or scoring results</li>
                        <li>The legitimacy, trustworthiness, or financial standing of any users or businesses on our platform</li>
                        <li>The successful completion or security of any transactions facilitated through our services</li>
                        <li>The prevention of all fraudulent activities or financial losses</li>
                    </ul>
                    </div>

                    <div>
                    <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b] mb-2">User Responsibility</h4>
                    <p className="leading-relaxed text-[#808080]">
                        All users are <strong>solely responsible</strong> for:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4 text-[#808080]">
                        <li>Conducting independent due diligence on all parties, transactions, and business relationships</li>
                        <li>Verifying the identity, credentials, and legitimacy of other users independently</li>
                        <li>Making informed decisions based on their own research and professional judgment</li>
                        <li>Complying with all applicable laws, regulations, and industry standards</li>
                        <li>Understanding and accepting the risks associated with their transactions and business activities</li>
                    </ul>
                    </div>

                    <div>
                    <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b] mb-2">Limitation of Liability</h4>
                    <p className="leading-relaxed text-[#808080]">
                        To the fullest extent permitted by law, TrustVerify, its officers, directors, employees, affiliates, and service providers shall <strong>not be liable</strong> for any:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4 text-[#808080]">
                        <li>Direct, indirect, incidental, special, consequential, or punitive damages</li>
                        <li>Financial losses, business interruption, or loss of profits</li>
                        <li>Reputational damage or loss of business opportunities</li>
                        <li>Data breaches, system failures, or service interruptions</li>
                        <li>Actions or omissions of third-party users or service providers</li>
                    </ul>
                    </div>

                    <div>
                    <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b] mb-2">No Professional Advice</h4>
                    <p className="leading-relaxed text-[#808080]">
                        TrustVerify does not provide legal, financial, investment, or professional advice. Our services are purely technological tools for risk assessment and verification. Users should consult qualified professionals for advice specific to their circumstances.
                    </p>
                    </div>

                    <div>
                    <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b] mb-2">Third-Party Disclaimer</h4>
                    <p className="leading-relaxed text-[#808080]">
                        TrustVerify does not endorse, guarantee, or assume responsibility for any third-party users, businesses, products, or services. We are not party to any agreements or transactions between users and do not mediate disputes beyond our standard dispute resolution procedures.
                    </p>
                    </div>

                    <div className="border-t border-[#e4e4e4] pt-4">
                    <p className="text-xs text-[#808080] leading-relaxed">
                        <strong className="[font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">By using TrustVerify's services, you acknowledge that you have read, understood, and agree to this disclaimer and our full Terms of Service and Privacy Policy. If you do not agree with these terms, please discontinue use of our platform immediately.</strong>
                    </p>
                    </div>
                </div>
            </Card>
        </div>
      </section>
      <Footer />
    </main>
  );
}