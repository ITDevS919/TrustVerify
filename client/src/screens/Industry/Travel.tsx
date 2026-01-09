import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Plane, 
  Shield, 
  CheckCircle2, 
  ArrowRight, 
  CreditCard,
  Zap,
  Globe,
  Hotel,
  Car,
  Clock
} from "lucide-react";

export default function TravelIndustryPage() {
  return (
    <main className="bg-[#f6f6f6] overflow-hidden w-full mx-auto flex flex-col min-h-screen">
      <Header />
      
      {/* Hero */}
      <section className="flex flex-col items-start gap-[30px] w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-[110px] py-20">
        <div className="w-full text-center mb-8">
          <div className="flex justify-center w-full mb-6">
            <Badge className="w-fit bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-full px-4 py-1.5 h-auto">
              <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm tracking-[0] leading-[14px]">
                Travel & Hospitality
              </span>
            </Badge>
          </div>
          <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl sm:text-4xl lg:text-5xl mb-4">
            Secure Bookings, Seamless Experiences
          </h1>
          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base sm:text-lg lg:text-xl max-w-3xl mx-auto mb-8">
            Protect against booking fraud, CNP chargebacks, and identity theft 
            while maintaining the frictionless experience travellers expect. 
            From airlines to car rentals, we secure the entire journey.
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
              <div className="text-3xl font-bold text-[#27ae60] [font-family:'Suisse_Intl-SemiBold',Helvetica] mb-2">75%</div>
              <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Fraud Reduction</div>
            </CardContent>
          </Card>
          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-[#27ae60] [font-family:'Suisse_Intl-SemiBold',Helvetica] mb-2">99%</div>
              <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Booking Approval</div>
            </CardContent>
          </Card>
          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-[#27ae60] [font-family:'Suisse_Intl-SemiBold',Helvetica] mb-2">&lt;200ms</div>
              <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Decision Time</div>
            </CardContent>
          </Card>
          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-[#27ae60] [font-family:'Suisse_Intl-SemiBold',Helvetica] mb-2">PCI DSS</div>
              <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Compliant</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Use Cases Tabs */}
      <section className="flex flex-col items-start gap-[30px] w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-[110px] py-20">
        <div className="text-center mb-12 w-full">
          <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl mb-4">
            Travel Industry Solutions
          </h2>
          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-xl max-w-3xl mx-auto">
            Comprehensive fraud protection for airlines, hotels, OTAs, 
            and ground transportation providers.
          </p>
        </div>

        <Tabs defaultValue="airlines" className="w-full" data-testid="travel-tabs">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8 bg-gray-200 rounded-lg p-1">
              <TabsTrigger value="airlines" data-testid="tab-airlines">Airlines</TabsTrigger>
              <TabsTrigger value="hotels" data-testid="tab-hotels">Hotels & Lodging</TabsTrigger>
              <TabsTrigger value="ota" data-testid="tab-ota">OTAs & Agencies</TabsTrigger>
              <TabsTrigger value="ground" data-testid="tab-ground">Ground Transport</TabsTrigger>
            </TabsList>

            <TabsContent value="airlines" className="space-y-6">
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    <Plane className="w-6 h-6 text-[#27ae60]" />
                    Airlines & Aviation
                  </CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                    IATA-compliant fraud prevention for air travel
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Ticket Fraud Prevention</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Detect CNP fraud at booking</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Agent Fraud Detection</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Identify fraudulent travel agents</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Loyalty Program Protection</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Prevent miles/points fraud</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Passport Verification</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Pre-travel document checks</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Chargeback Prevention</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">3DS integration for bookings</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="hotels" className="space-y-6">
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    <Hotel className="w-6 h-6 text-[#27ae60]" />
                    Hotels & Lodging
                  </CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                    Secure reservations and guest verification
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Booking Fraud Detection</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Real-time risk scoring for reservations</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Guest Identity Verification</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Digital check-in with ID validation</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">No-Show Prevention</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Reduce fraudulent bookings</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Vacation Rental Protection</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Guest and host verification</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ota" className="space-y-6">
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    <Globe className="w-6 h-6 text-[#27ae60]" />
                    OTAs & Travel Agencies
                  </CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                    Multi-supplier fraud protection
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Multi-Product Scoring</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Unified risk across flights, hotels, packages</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Agency Verification</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">B2B partner validation</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Price Manipulation Detection</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Block fare scraping and abuse</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Liability Protection</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Chargeback guarantee options</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ground" className="space-y-6">
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    <Car className="w-6 h-6 text-[#27ae60]" />
                    Ground Transportation
                  </CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                    Car rental and ride-share protection
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Driver Verification</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">License and identity validation</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Rental Fraud Prevention</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Detect stolen card bookings</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Damage Claim Verification</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Reduce fraudulent claims</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#27ae60] mt-1" />
                        <div>
                          <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Fleet Protection</h4>
                          <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Vehicle theft prevention</p>
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
            Travel Industry Results
          </h2>
        </div>
        <div className="grid md:grid-cols-4 gap-6 w-full max-w-7xl mx-auto">
          <Card className="text-center bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
            <CardContent className="pt-6">
              <Shield className="w-10 h-10 text-[#27ae60] mx-auto mb-3" />
              <h3 className="text-2xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#27ae60] mb-1">75%</h3>
              <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Fraud Reduction</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
            <CardContent className="pt-6">
              <Zap className="w-10 h-10 text-[#27ae60] mx-auto mb-3" />
              <h3 className="text-2xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#27ae60] mb-1">99%</h3>
              <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Booking Approval Rate</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
            <CardContent className="pt-6">
              <Clock className="w-10 h-10 text-[#27ae60] mx-auto mb-3" />
              <h3 className="text-2xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#27ae60] mb-1">&lt;200ms</h3>
              <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Decision Latency</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
            <CardContent className="pt-6">
              <CreditCard className="w-10 h-10 text-[#27ae60] mx-auto mb-3" />
              <h3 className="text-2xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#27ae60] mb-1">PCI DSS</h3>
              <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Level 1 Certified</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="flex flex-col items-start gap-[30px] w-full max-w-7xl mx-auto rounded-xl px-4 sm:px-6 lg:px-[110px] py-10 my-16 bg-app-primary text-white">
        <div className="max-w-4xl mx-auto text-center space-y-6 w-full">
          <h2 className="text-2xl md:text-3xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica]">
            Ready to Secure Your Travel Business?
          </h2>
          <p className="text-lg [font-family:'DM_Sans_18pt-Regular',Helvetica] text-white/90">
            Protect bookings without sacrificing the customer experience
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
