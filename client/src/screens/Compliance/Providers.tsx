import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { 
  Shield, 
  Zap, 
  CheckCircle, 
  AlertTriangle,
  Globe,
  Clock,
  TrendingUp,
  DollarSign,
  Star,
  ExternalLink,
  ArrowRight
} from "lucide-react";

interface SignalProvider {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  accuracyScore: number;
  falsePositiveRate: number;
  avgResponseTime: number;
  uptime: number;
  costPerCheck: number;
  currency: string;
  isPrimary: boolean;
  isRecommended: boolean;
  strengths: string[];
  coverage: string[];
}

const providers: SignalProvider[] = [
  {
    id: "ondato",
    name: "Ondato",
    category: "Identity & KYB",
    subcategory: "Primary ID Verification",
    accuracyScore: 99.2,
    falsePositiveRate: 0.8,
    avgResponseTime: 2400,
    uptime: 99.95,
    costPerCheck: 0.85,
    currency: "GBP",
    isPrimary: true,
    isRecommended: true,
    strengths: ["Liveness detection", "Document verification", "Global coverage"],
    coverage: ["200+ countries", "6000+ document types"]
  },
  {
    id: "didit",
    name: "Didit",
    category: "Identity & KYB",
    subcategory: "Secondary/Fallback ID",
    accuracyScore: 98.8,
    falsePositiveRate: 1.2,
    avgResponseTime: 1800,
    uptime: 99.90,
    costPerCheck: 0.65,
    currency: "GBP",
    isPrimary: false,
    isRecommended: false,
    strengths: ["Fast processing", "Cost-effective", "EU focus"],
    coverage: ["150+ countries", "4000+ document types"]
  },
  {
    id: "companies_house",
    name: "Companies House API",
    category: "Corporate Registry",
    subcategory: "UK Business Verification",
    accuracyScore: 99.9,
    falsePositiveRate: 0.1,
    avgResponseTime: 450,
    uptime: 99.99,
    costPerCheck: 0.00,
    currency: "GBP",
    isPrimary: true,
    isRecommended: true,
    strengths: ["Official registry", "Real-time data", "Free tier available"],
    coverage: ["UK companies", "Directors", "Filing history"]
  },
  {
    id: "sanction_scanner",
    name: "Sanction Scanner",
    category: "AML & Sanctions",
    subcategory: "Sanctions/PEP Screening",
    accuracyScore: 99.5,
    falsePositiveRate: 2.1,
    avgResponseTime: 350,
    uptime: 99.97,
    costPerCheck: 0.12,
    currency: "GBP",
    isPrimary: true,
    isRecommended: true,
    strengths: ["Real-time updates", "Low cost", "Comprehensive lists"],
    coverage: ["1500+ sanctions lists", "PEP databases", "Adverse media"]
  },
  {
    id: "complyadvantage",
    name: "ComplyAdvantage",
    category: "AML & Sanctions",
    subcategory: "Premium AML",
    accuracyScore: 99.8,
    falsePositiveRate: 1.5,
    avgResponseTime: 280,
    uptime: 99.99,
    costPerCheck: 0.45,
    currency: "GBP",
    isPrimary: false,
    isRecommended: false,
    strengths: ["AI-powered", "Lowest false positives", "Enterprise features"],
    coverage: ["Global sanctions", "PEP", "Adverse media", "Crypto addresses"]
  },
  {
    id: "maxmind",
    name: "MaxMind GeoIP",
    category: "Fraud & Technical Risk",
    subcategory: "IP/Geolocation",
    accuracyScore: 98.5,
    falsePositiveRate: 1.8,
    avgResponseTime: 50,
    uptime: 99.99,
    costPerCheck: 0.001,
    currency: "GBP",
    isPrimary: true,
    isRecommended: true,
    strengths: ["Ultra-fast", "Extremely low cost", "Industry standard"],
    coverage: ["Global IP database", "Proxy/VPN detection", "Risk scoring"]
  },
  {
    id: "minfingerprint",
    name: "MinFingerprint",
    category: "Fraud & Technical Risk",
    subcategory: "Device Fingerprinting",
    accuracyScore: 99.1,
    falsePositiveRate: 1.2,
    avgResponseTime: 120,
    uptime: 99.95,
    costPerCheck: 0.008,
    currency: "GBP",
    isPrimary: true,
    isRecommended: true,
    strengths: ["Browser/device ID", "Bot detection", "Fraud patterns"],
    coverage: ["All browsers", "Mobile devices", "Cross-device linking"]
  },
  {
    id: "escrow_com",
    name: "Escrow.com",
    category: "Transaction Assurance",
    subcategory: "Payment Protection",
    accuracyScore: 99.9,
    falsePositiveRate: 0.1,
    avgResponseTime: 3000,
    uptime: 99.99,
    costPerCheck: 0.00,
    currency: "GBP",
    isPrimary: true,
    isRecommended: true,
    strengths: ["Licensed escrow", "Multi-currency", "Milestone payments"],
    coverage: ["190+ countries", "All major currencies", "B2B & B2C"]
  }
];

const getAccuracyColor = (score: number) => {
  if (score >= 99.5) return "text-green-600";
  if (score >= 99.0) return "text-green-500";
  if (score >= 98.0) return "text-yellow-600";
  return "text-orange-600";
};

export default function SignalProviders() {
  const categories = Array.from(new Set(providers.map(p => p.category)));
  
  // Calculate combined accuracy (simplified)
  const primaryProviders = providers.filter(p => p.isPrimary);
  const avgAccuracy = primaryProviders.reduce((sum, p) => sum + p.accuracyScore, 0) / primaryProviders.length;
  const totalMonthlyCost = primaryProviders.reduce((sum, p) => sum + (p.costPerCheck * 1000), 0);

  return (
    <main className="bg-[#f6f6f6] overflow-hidden w-full mx-auto flex flex-col min-h-screen">
      <Header />
      
      <div className="flex flex-col items-start gap-[30px] w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-[110px] py-20">
        <div className="w-full">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl flex items-center gap-3">
                <Zap className="h-8 w-8 text-[#27ae60]" />
                Signal Providers
              </h1>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mt-1">
                Best-in-class providers for 99.8% accuracy at competitive pricing
              </p>
            </div>
            <Link to="/enterprise-contact">
              <Button className="h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90">
                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-white">Request Custom Pricing</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-green-200">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-5 w-5 text-[#27ae60]" />
                  <span className="text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#27ae60]">Combined Accuracy</span>
                </div>
                <div className="text-3xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#27ae60]">{avgAccuracy.toFixed(1)}%</div>
                <div className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#27ae60] mt-1">Target: 99.8%</div>
              </CardContent>
            </Card>
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="h-5 w-5 text-[#808080]" />
                  <span className="text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080]">Active Providers</span>
                </div>
                <div className="text-3xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b]">{primaryProviders.length}</div>
                <div className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mt-1">Primary providers</div>
              </CardContent>
            </Card>
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-5 w-5 text-[#808080]" />
                  <span className="text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080]">Avg Response</span>
                </div>
                <div className="text-3xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b]">
                  {Math.round(primaryProviders.reduce((sum, p) => sum + p.avgResponseTime, 0) / primaryProviders.length)}ms
                </div>
                <div className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mt-1">Across all providers</div>
              </CardContent>
            </Card>
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="h-5 w-5 text-[#808080]" />
                  <span className="text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080]">Est. Monthly Cost</span>
                </div>
                <div className="text-3xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b]">£{totalMonthlyCost.toFixed(0)}</div>
                <div className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mt-1">Per 1,000 verifications</div>
              </CardContent>
            </Card>
          </div>

          {categories.map(category => (
            <div key={category} className="mb-8 w-full">
              <h2 className="text-xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b] mb-4">{category}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {providers.filter(p => p.category === category).map(provider => (
                  <Card key={provider.id} className={`bg-[#fcfcfc] rounded-[20px] border ${provider.isRecommended ? "border-[#27ae60] border-2" : "border-[#e4e4e4]"}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {provider.isRecommended && (
                            <Star className="h-4 w-4 text-[#27ae60] fill-[#27ae60]" />
                          )}
                          <CardTitle className="text-lg [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">{provider.name}</CardTitle>
                        </div>
                        {provider.isPrimary ? (
                          <Badge className="bg-[#27ae60] text-white rounded-full">Primary</Badge>
                        ) : (
                          <Badge variant="outline" className="rounded-full border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Secondary</Badge>
                        )}
                      </div>
                      <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{provider.subcategory}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Accuracy</div>
                            <div className={`font-bold [font-family:'DM_Sans_18pt-Medium',Helvetica] ${getAccuracyColor(provider.accuracyScore)}`}>
                              {provider.accuracyScore}%
                            </div>
                          </div>
                          <div>
                            <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">False Positive</div>
                            <div className="font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">{provider.falsePositiveRate}%</div>
                          </div>
                          <div>
                            <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Response</div>
                            <div className="font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">{provider.avgResponseTime}ms</div>
                          </div>
                          <div>
                            <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Cost/Check</div>
                            <div className="font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">
                              {provider.costPerCheck === 0 ? "Free" : `£${provider.costPerCheck.toFixed(3)}`}
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mb-1">Uptime</div>
                          <div className="flex items-center gap-2">
                            <Progress value={provider.uptime} className="h-2 flex-1" />
                            <span className="text-xs font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">{provider.uptime}%</span>
                          </div>
                        </div>

                        <div>
                          <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mb-1">Strengths</div>
                          <div className="flex flex-wrap gap-1">
                            {provider.strengths.map(s => (
                              <Badge key={s} variant="secondary" className="text-xs rounded-full [font-family:'DM_Sans_18pt-Regular',Helvetica]">
                                {s}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mb-1">Coverage</div>
                          <div className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                            {provider.coverage.join(" • ")}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}

          <Card className="mt-8 bg-app-primary text-white rounded-[20px] border-0">
            <CardContent className="py-8">
              <div className="max-w-3xl mx-auto text-center">
                <h3 className="text-2xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] mb-4">
                  Combined Provider Stack: 99.8% Accuracy Target
                </h3>
                <p className="opacity-90 mb-6 [font-family:'DM_Sans_18pt-Regular',Helvetica]">
                  Our recommended provider stack delivers institutional-grade accuracy at 30-50% below 
                  market leader pricing. All providers are integrated into our Decision Engine for 
                  automated orchestration.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/compliance/decision-engine">
                    <Button className="bg-white text-[#003d2b] hover:bg-gray-100 h-[45px] rounded-lg">
                      <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">View Decision Engine</span>
                    </Button>
                  </Link>
                  <Link to="/industries/institutional">
                    <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/90 h-[45px] rounded-lg">
                      <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">Full Compliance Suite</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </main>
  );
}
