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
  CreditCard,
  Users,
  Zap,
  Store,
  TrendingUp,
  UserCheck
} from "lucide-react";

export default function EcommerceIndustryPage() {
  return (
    <main className="bg-[#f6f6f6] overflow-hidden w-full mx-auto flex flex-col min-h-screen">
      <Header />
      
      {/* Hero */}
      <section className="flex flex-col items-start gap-[30px] w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-[110px] py-20">
        <div className="w-full text-center mb-8">
          <div className="flex justify-center w-full mb-6">
            <Badge className="w-fit bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-full px-4 py-1.5 h-auto">
              <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm tracking-[0] leading-[14px]">
                E-commerce & Marketplaces
              </span>
            </Badge>
          </div>
          <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl sm:text-4xl lg:text-5xl mb-4">
            Protect Revenue, Not Just Transactions
          </h1>
          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base sm:text-lg lg:text-xl max-w-3xl mx-auto mb-8">
            Reduce chargebacks by up to 80% while maintaining conversion rates. 
            Our AI-powered fraud prevention protects every step of the customer 
            journey from account creation to checkout.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link to="/fraud-demo">
              <Button 
                size="lg" 
                className="h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90 px-8 py-4" 
                data-testid="button-try-demo"
              >
                <span className="font-semibold text-white text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica]">Try Fraud Demo</span>
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
              <div className="text-3xl font-bold text-[#27ae60] [font-family:'Suisse_Intl-SemiBold',Helvetica] mb-2">80%</div>
              <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Chargeback Reduction</div>
            </CardContent>
          </Card>
          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-[#27ae60] [font-family:'Suisse_Intl-SemiBold',Helvetica] mb-2">99.5%</div>
              <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Good Order Rate</div>
            </CardContent>
          </Card>
          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-[#27ae60] [font-family:'Suisse_Intl-SemiBold',Helvetica] mb-2">&lt;100ms</div>
              <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Decision Time</div>
            </CardContent>
          </Card>
          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-[#27ae60] [font-family:'Suisse_Intl-SemiBold',Helvetica] mb-2">£10M+</div>
              <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Fraud Prevented</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Use Cases Tabs */}
      <section className="flex flex-col items-start gap-[30px] w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-[110px] py-20">
        <div className="text-center mb-12 w-full">
          <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl mb-4">
            E-commerce Protection Suite
          </h2>
          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-xl max-w-3xl mx-auto">
            From single-brand stores to multi-vendor marketplaces, 
            we protect the entire e-commerce ecosystem.
          </p>
        </div>

        <Tabs defaultValue="checkout" className="w-full" data-testid="ecommerce-tabs">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8 bg-gray-200 rounded-lg p-1">
              <TabsTrigger value="checkout" data-testid="tab-checkout">Checkout Fraud</TabsTrigger>
              <TabsTrigger value="account" data-testid="tab-account">Account Protection</TabsTrigger>
              <TabsTrigger value="seller" data-testid="tab-seller">Seller Verification</TabsTrigger>
              <TabsTrigger value="promo" data-testid="tab-promo">Promo Abuse</TabsTrigger>
            </TabsList>

            <TabsContent value="checkout" className="space-y-6">
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    <CreditCard className="w-6 h-6 text-[#27ae60]" />
                    Checkout Fraud Prevention
                  </CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                    Real-time transaction screening with minimal friction
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Card-Not-Present Protection</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">AI detection for online card fraud</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">3DS2 Integration</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Risk-based authentication decisions</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Chargeback Guarantee</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Optional liability shift on approved orders</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Address Verification</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Billing/shipping mismatch detection</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Velocity Controls</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Limit card testing and rapid orders</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account" className="space-y-6">
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    <Users className="w-6 h-6 text-[#27ae60]" />
                    Account Protection
                  </CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                    Prevent account takeover and fake account creation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Account Takeover Prevention</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Detect credential stuffing and phishing</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Fake Account Detection</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Block bot-created accounts</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Device Fingerprinting</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Recognize returning bad actors</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Email Risk Scoring</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Assess email reputation at signup</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seller" className="space-y-6">
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    <Store className="w-6 h-6 text-[#27ae60]" />
                    Seller & Merchant Verification
                  </CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                    KYB verification for marketplace sellers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Business Verification</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Company registry and UBO checks</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Counterfeit Detection</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Identify sellers of fake goods</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Seller Risk Scoring</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Ongoing seller reputation monitoring</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Payout Protection</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Secure disbursement to verified sellers</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="promo" className="space-y-6">
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    <Zap className="w-6 h-6 text-[#27ae60]" />
                    Promo & Loyalty Abuse Prevention
                  </CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                    Protect promotions from abuse and fraud
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Multi-Account Detection</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Prevent promo stacking with fake accounts</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Referral Fraud</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Block self-referral schemes</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Loyalty Point Fraud</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Detect abnormal redemption patterns</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Return Abuse</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Identify serial returners and wardrobing</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
      </section>

      {/* Stats */}
      <section className="flex flex-col items-start gap-[30px] w-full px-4 sm:px-6 lg:px-[110px] py-16 bg-white">
        <div className="text-center mb-12 w-full">
          <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl mb-4">
            Proven E-commerce Results
          </h2>
        </div>
        <div className="grid md:grid-cols-4 gap-6 w-full max-w-7xl mx-auto">
          <Card className="text-center bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
            <CardContent className="pt-6">
              <TrendingUp className="w-10 h-10 text-[#27ae60] mx-auto mb-3" />
              <h3 className="text-2xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#27ae60] mb-1">80%</h3>
              <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Chargeback Reduction</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
            <CardContent className="pt-6">
              <UserCheck className="w-10 h-10 text-[#27ae60] mx-auto mb-3" />
              <h3 className="text-2xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#27ae60] mb-1">99.5%</h3>
              <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Good Order Approval</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
            <CardContent className="pt-6">
              <Zap className="w-10 h-10 text-[#27ae60] mx-auto mb-3" />
              <h3 className="text-2xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#27ae60] mb-1">&lt;100ms</h3>
              <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Decision Latency</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
            <CardContent className="pt-6">
              <Shield className="w-10 h-10 text-[#27ae60] mx-auto mb-3" />
              <h3 className="text-2xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#27ae60] mb-1">£10M+</h3>
              <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Fraud Prevented Monthly</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="flex flex-col items-start gap-[30px] w-full px-4 sm:px-6 lg:px-[110px] py-20 bg-white" id="pricing">
        <div className="text-center mb-12 w-full">
          <Badge className="bg-[#27ae6033] text-[#27ae60] rounded-full mb-4">
            <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Competitive Pricing</span>
          </Badge>
          <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl mb-4">
            E-commerce & Marketplace Pricing
          </h2>
          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-xl max-w-3xl mx-auto">
            Transparent, usage-based pricing designed for businesses of all sizes. 
            30-50% below market leaders with no hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12 w-full max-w-7xl mx-auto">
          {/* SME Starter */}
          <Card className="relative border-2 border-[#e4e4e4] hover:border-[#27ae60] transition-colors bg-[#fcfcfc] rounded-[20px]">
            <CardHeader>
              <CardTitle className="flex items-center justify-between [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                <span>SME Starter</span>
              </CardTitle>
              <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">For growing e-commerce businesses</CardDescription>
              <div className="pt-4">
                <span className="text-4xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b]">£349</span>
                <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#27ae60]" />
                  <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Up to 1,000 verifications/month</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#27ae60]" />
                  <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Checkout fraud screening</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#27ae60]" />
                  <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Account protection</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#27ae60]" />
                  <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Basic promo abuse detection</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#27ae60]" />
                  <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Email support</span>
                </div>
              </div>
              <Link to="/enterprise-contact">
                <Button className="w-full mt-4 h-[45px] rounded-lg border border-[#e4e4e4] hover:bg-[#f6f6f6]" variant="outline" data-testid="button-sme-starter">
                  <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-[#003d2b]">Get Started</span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Growth - Popular */}
          <Card className="relative border-2 border-[#27ae60] shadow-lg bg-[#fcfcfc] rounded-[20px]">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-[#27ae60] text-white rounded-full">
                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Most Popular</span>
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="flex items-center justify-between [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                <span>Growth</span>
              </CardTitle>
              <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">For scaling marketplace platforms</CardDescription>
              <div className="pt-4">
                <span className="text-4xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b]">£749</span>
                <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#27ae60]" />
                  <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Up to 5,000 verifications/month</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#27ae60]" />
                  <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Everything in SME Starter</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#27ae60]" />
                  <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Seller/merchant KYB verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#27ae60]" />
                  <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Advanced promo abuse prevention</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#27ae60]" />
                  <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Priority support</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#27ae60]" />
                  <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">API access</span>
                </div>
              </div>
              <Link to="/enterprise-contact">
                <Button className="w-full mt-4 h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90" data-testid="button-growth">
                  <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-white">Get Started</span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Enterprise */}
          <Card className="relative border-2 border-[#e4e4e4] hover:border-[#27ae60] transition-colors bg-[#fcfcfc] rounded-[20px]">
            <CardHeader>
              <CardTitle className="flex items-center justify-between [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                <span>Enterprise</span>
              </CardTitle>
              <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">For high-volume platforms</CardDescription>
              <div className="pt-4">
                <span className="text-4xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b]">£1,249</span>
                <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#27ae60]" />
                  <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Unlimited verifications</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#27ae60]" />
                  <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Everything in Growth</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#27ae60]" />
                  <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Chargeback guarantee option</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#27ae60]" />
                  <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Custom fraud rules</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#27ae60]" />
                  <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Dedicated account manager</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#27ae60]" />
                  <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">SLA guarantee</span>
                </div>
              </div>
              <Link to="/enterprise-contact">
                <Button className="w-full mt-4 h-[45px] rounded-lg border border-[#e4e4e4] hover:bg-[#f6f6f6]" variant="outline" data-testid="button-enterprise">
                  <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-[#003d2b]">Contact Sales</span>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Usage-based pricing note */}
        <div className="bg-[#f6f6f6] rounded-xl p-6 text-center w-full max-w-7xl mx-auto border border-[#e4e4e4]">
          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mb-2">
            <strong className="[font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Usage-based overage:</strong> £0.25 per additional verification
          </p>
          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-sm">
            Annual contracts receive 15% discount • Volume pricing available for 10,000+ verifications/month
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="flex flex-col items-start gap-[30px] w-full max-w-7xl mx-auto rounded-xl px-4 sm:px-6 lg:px-[110px] py-10 my-16 bg-app-primary text-white">
        <div className="max-w-4xl mx-auto text-center space-y-6 w-full">
          <h2 className="text-2xl md:text-3xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-white">
            Ready to Protect Your E-commerce Revenue?
          </h2>
          <p className="text-lg [font-family:'DM_Sans_18pt-Regular',Helvetica] text-white/90">
            Join leading retailers using TrustVerify
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/fraud-demo">
              <Button size="lg" className="h-[45px] rounded-lg bg-white text-[#003d2b] hover:bg-gray-100" data-testid="button-start-trial">
                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">Start Free Trial</span>
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
