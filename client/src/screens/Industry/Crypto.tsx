import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  CheckCircle2, 
  ArrowRight, 
  Wallet,
  Lock,
  Globe,
  FileCheck,
  AlertTriangle,
  Network,
  Code
} from "lucide-react";

export default function CryptoIndustryPage() {
  return (
    <main className="bg-[#f6f6f6] overflow-hidden w-full mx-auto flex flex-col min-h-screen">
      <Header />
      
      {/* Hero */}
      <section className="flex flex-col items-start gap-[30px] w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-[110px] py-20">
        <div className="w-full text-center mb-8">
          <div className="flex justify-center w-full mb-6">
            <Badge className="w-fit bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-full px-4 py-1.5 h-auto">
              <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm tracking-[0] leading-[14px]">
                Crypto & Web3
              </span>
            </Badge>
          </div>
          <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl sm:text-4xl lg:text-5xl mb-4">
            Comprehensive Crypto Compliance & Fraud Protection
          </h1>
          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base sm:text-lg lg:text-xl max-w-3xl mx-auto mb-8">
            Navigate the complex crypto regulatory landscape with wallet risk scoring, 
            smart contract auditing, Travel Rule compliance, and cross-chain analytics. 
            Stay ahead of DeFi exploits and emerging Web3 threats.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link to="/cybertrust">
              <Button 
                size="lg" 
                className="h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90 px-8 py-4" 
                data-testid="button-try-demo"
              >
                <span className="font-semibold text-white text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica]">Explore CyberTrust</span>
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/enterprise-contact">
              <Button 
                size="lg" 
                variant="outline" 
                className="relative h-[45px] rounded-lg border-none before:content-[''] before:absolute before:inset-0 before:p-px before:rounded-lg before:[background:linear-gradient(118deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] hover:bg-gray-50 px-8 py-4" 
                data-testid="button-contact-sales"
              >
                <span className="bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] bg-clip-text text-transparent font-semibold text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica]">Contact Sales</span>
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl mx-auto">
          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-[#27ae60] [font-family:'Suisse_Intl-SemiBold',Helvetica] mb-2">FATF</div>
              <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Travel Rule</div>
            </CardContent>
          </Card>
          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-[#27ae60] [font-family:'Suisse_Intl-SemiBold',Helvetica] mb-2">MiCA</div>
              <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Ready</div>
            </CardContent>
          </Card>
          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-[#27ae60] [font-family:'Suisse_Intl-SemiBold',Helvetica] mb-2">50+</div>
              <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Blockchains</div>
            </CardContent>
          </Card>
          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-[#27ae60] [font-family:'Suisse_Intl-SemiBold',Helvetica] mb-2">1B+</div>
              <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Wallets Scored</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Use Cases Tabs */}
      <section className="flex flex-col items-start gap-[30px] w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-[110px] py-20">
        <div className="text-center mb-12 w-full">
          <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl mb-4">
            Crypto & Web3 Use Cases
          </h2>
          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-xl max-w-3xl mx-auto">
            From centralized exchanges to DeFi protocols, we provide 
            comprehensive protection for the crypto ecosystem.
          </p>
        </div>

        <Tabs defaultValue="exchanges" className="w-full" data-testid="crypto-tabs">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8 bg-gray-200 rounded-lg p-1">
              <TabsTrigger value="exchanges" data-testid="tab-exchanges">Exchanges</TabsTrigger>
              <TabsTrigger value="defi" data-testid="tab-defi">DeFi Protocols</TabsTrigger>
              <TabsTrigger value="custody" data-testid="tab-custody">Custody & Wallets</TabsTrigger>
              <TabsTrigger value="nft" data-testid="tab-nft">NFT Platforms</TabsTrigger>
            </TabsList>

            <TabsContent value="exchanges" className="space-y-6">
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    <Wallet className="w-6 h-6 text-[#27ae60]" />
                    Crypto Exchanges
                  </CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                    Regulatory-compliant onboarding and transaction monitoring
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Travel Rule Compliance</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">FATF-compliant VASP data exchange</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Wallet Risk Scoring</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Real-time wallet reputation analysis</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Sanctions Screening</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">OFAC, Tornado Cash, and mixer detection</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">KYC Verification</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Global ID verification with proof of address</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Transaction Monitoring</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Cross-chain transaction tracing</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="defi" className="space-y-6">
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    <Network className="w-6 h-6 text-[#27ae60]" />
                    DeFi Protocols
                  </CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                    Smart contract security and protocol protection
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Smart Contract Auditing</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Automated vulnerability detection</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Rug Pull Detection</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Identify high-risk token contracts</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Flash Loan Protection</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Detect exploit patterns in real-time</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Protocol Health Monitoring</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">TVL, liquidity, and risk metrics</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Oracle Manipulation Detection</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Price feed integrity monitoring</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="custody" className="space-y-6">
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    <Lock className="w-6 h-6 text-[#27ae60]" />
                    Custody & Wallet Providers
                  </CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                    Enterprise-grade security for digital asset custody
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Address Whitelisting</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Risk-score based address approval</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Counterparty Due Diligence</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">VASP and exchange verification</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Withdrawal Screening</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Pre-transaction risk assessment</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Insurance Integration</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Risk scoring for coverage eligibility</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="nft" className="space-y-6">
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    <Code className="w-6 h-6 text-[#27ae60]" />
                    NFT Marketplaces
                  </CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                    Fraud prevention for digital collectibles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Wash Trading Detection</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Identify artificial volume patterns</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Stolen NFT Screening</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Cross-platform theft database</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Creator Verification</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">KYC for verified artist badges</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Royalty Enforcement</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Track royalty compliance</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
        </Tabs>
      </section>

      {/* Regulations */}
      <section className="flex flex-col items-start gap-[30px] w-full px-4 sm:px-6 lg:px-[110px] py-16 bg-white">
        <div className="text-center mb-12 w-full">
          <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl mb-4">
            Crypto Regulatory Compliance
          </h2>
        </div>
        <div className="grid md:grid-cols-4 gap-6 w-full max-w-7xl mx-auto">
          <Card className="text-center bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
            <CardContent className="pt-6">
              <Globe className="w-10 h-10 text-[#27ae60] mx-auto mb-3" />
              <h3 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b] mb-1">FATF Travel Rule</h3>
              <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">VASP data exchange</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
            <CardContent className="pt-6">
              <Shield className="w-10 h-10 text-[#27ae60] mx-auto mb-3" />
              <h3 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b] mb-1">MiCA</h3>
              <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">EU crypto regulation</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
            <CardContent className="pt-6">
              <FileCheck className="w-10 h-10 text-[#27ae60] mx-auto mb-3" />
              <h3 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b] mb-1">FCA Registration</h3>
              <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">UK crypto compliance</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
            <CardContent className="pt-6">
              <AlertTriangle className="w-10 h-10 text-[#27ae60] mx-auto mb-3" />
              <h3 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b] mb-1">OFAC Sanctions</h3>
              <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Sanctioned address screening</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="flex flex-col items-start gap-[30px] w-full max-w-7xl mx-auto rounded-xl px-4 sm:px-6 lg:px-[110px] py-10 my-16 bg-app-primary text-white">
        <div className="max-w-4xl mx-auto text-center space-y-6 w-full">
          <h2 className="text-2xl md:text-3xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-white">
            Ready to Secure Your Crypto Platform?
          </h2>
          <p className="text-lg [font-family:'DM_Sans_18pt-Regular',Helvetica] text-white/90">
            Stay compliant and protected in the evolving crypto landscape
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/cybertrust">
              <Button size="lg" className="h-[45px] rounded-lg bg-white text-[#003d2b] hover:bg-gray-100" data-testid="button-start-trial">
                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">Explore CyberTrust</span>
              </Button>
            </Link>
            <Link to="/api-documentation">
              <Button size="lg" variant="outline" className="h-[45px] rounded-lg bg-transparent border border-white text-white hover:bg-white/90" data-testid="button-view-docs">
                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">View API Docs</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
