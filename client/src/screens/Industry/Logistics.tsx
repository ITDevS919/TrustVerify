import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  ArrowRight, 
  Truck,
  Package,
  MapPin,
  FileCheck,
  Warehouse,
  Ship,
  AlertTriangle
} from "lucide-react";

export default function LogisticsIndustryPage() {
  return (
    <main className="bg-[#f6f6f6] overflow-hidden w-full mx-auto flex flex-col min-h-screen">
      <Header />
      
      {/* Hero */}
      <section className="flex flex-col items-start gap-[30px] w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-[110px] py-20">
        <div className="w-full text-center mb-8">
          <div className="flex justify-center w-full mb-6">
            <Badge className="w-fit bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-full px-4 py-1.5 h-auto">
              <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm tracking-[0] leading-[14px]">
                Logistics & Supply Chain
              </span>
            </Badge>
          </div>
          <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl sm:text-4xl lg:text-5xl mb-4">
            Shipment Verification & Supply Chain Security
          </h1>
          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base sm:text-lg lg:text-xl max-w-3xl mx-auto mb-8">
            Authenticate carriers, verify deliveries, and prevent supply chain fraud 
            with comprehensive verification solutions. Ensure transparency and trust 
            across your entire logistics network.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link to="/developer-portal">
              <Button 
                size="lg" 
                className="h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90 px-8 py-4" 
                data-testid="button-get-api"
              >
                <span className="font-semibold text-white text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica]">Get API Access</span>
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
              <div className="text-3xl font-bold text-[#27ae60] [font-family:'Suisse_Intl-SemiBold',Helvetica] mb-2">99.9%</div>
              <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Delivery Accuracy</div>
            </CardContent>
          </Card>
          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-[#27ae60] [font-family:'Suisse_Intl-SemiBold',Helvetica] mb-2">Real-time</div>
              <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Tracking</div>
            </CardContent>
          </Card>
          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-[#27ae60] [font-family:'Suisse_Intl-SemiBold',Helvetica] mb-2">50+</div>
              <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Countries</div>
            </CardContent>
          </Card>
          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-[#27ae60] [font-family:'Suisse_Intl-SemiBold',Helvetica] mb-2">ISO 27001</div>
              <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Certified</div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="flex flex-col items-start gap-[30px] w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-[110px] py-20">
        <div className="text-center mb-12 w-full">
          <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl mb-4">
            Logistics Use Cases
          </h2>
          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-xl max-w-3xl mx-auto">
            From last-mile delivery to international freight, we power verification 
            across the entire supply chain.
          </p>
        </div>

        <Tabs defaultValue="carrier" className="w-full" data-testid="logistics-tabs">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8 bg-gray-200 rounded-lg p-1">
              <TabsTrigger value="carrier" data-testid="tab-carrier">Carrier Verification</TabsTrigger>
              <TabsTrigger value="delivery" data-testid="tab-delivery">Delivery Confirmation</TabsTrigger>
              <TabsTrigger value="freight" data-testid="tab-freight">Freight & Shipping</TabsTrigger>
              <TabsTrigger value="warehouse" data-testid="tab-warehouse">Warehouse Security</TabsTrigger>
            </TabsList>

            <TabsContent value="carrier" className="space-y-6">
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    <Truck className="w-6 h-6 text-[#27ae60]" />
                    Carrier Identity Verification
                  </CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                    Authenticate drivers and carriers before pickup
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Key Features</h4>
                      <ul className="space-y-2">
                        {[
                          "Driver license verification",
                          "Carrier authority validation",
                          "Insurance certificate checks",
                          "Vehicle registration verification",
                          "Background screening"
                        ].map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                            <CheckCircle2 className="w-4 h-4 text-[#27ae60] mt-0.5 shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-[#f6f6f6] rounded-lg p-4 border border-[#e4e4e4]">
                      <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b] mb-3">Fraud Prevention</h4>
                      <div className="space-y-2">
                        <Badge variant="outline" className="mr-2 rounded-full border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Cargo theft</Badge>
                        <Badge variant="outline" className="mr-2 rounded-full border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Double brokering</Badge>
                        <Badge variant="outline" className="mr-2 rounded-full border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Identity fraud</Badge>
                        <Badge variant="outline" className="mr-2 rounded-full border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">False documentation</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="delivery" className="space-y-6">
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    <Package className="w-6 h-6 text-[#27ae60]" />
                    Delivery Confirmation System
                  </CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                    Secure proof of delivery with identity verification
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { title: "Recipient Verification", desc: "ID verification at delivery" },
                      { title: "Photo Evidence", desc: "Tamper-proof delivery photos" },
                      { title: "Digital Signatures", desc: "Secure e-signature capture" }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-[#f6f6f6] p-4 rounded-lg border border-[#e4e4e4]">
                        <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">{item.title}</h4>
                        <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="freight" className="space-y-6">
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    <Ship className="w-6 h-6 text-[#27ae60]" />
                    Freight & International Shipping
                  </CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                    Global supply chain verification and compliance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { title: "Customs Compliance", desc: "Document verification" },
                      { title: "Sanctions Screening", desc: "Trade compliance checks" },
                      { title: "Chain of Custody", desc: "End-to-end tracking" }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-[#f6f6f6] p-4 rounded-lg border border-[#e4e4e4]">
                        <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">{item.title}</h4>
                        <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="warehouse" className="space-y-6">
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    <Warehouse className="w-6 h-6 text-[#27ae60]" />
                    Warehouse Security Solutions
                  </CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                    Access control and inventory verification
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { title: "Access Control", desc: "Biometric & ID verification" },
                      { title: "Inventory Tracking", desc: "Real-time stock verification" },
                      { title: "Audit Trails", desc: "Complete activity logging" }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-[#f6f6f6] p-4 rounded-lg border border-[#e4e4e4]">
                        <h4 className="font-semibold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">{item.title}</h4>
                        <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
      </section>

      <section className="flex flex-col items-start gap-[30px] w-full px-4 sm:px-6 lg:px-[110px] py-16 bg-white">
        <div className="text-center mb-12 w-full">
          <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl mb-4">
            Logistics API Capabilities
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto">
          {[
            { icon: Truck, title: "Carrier Verification", desc: "Driver & vehicle authentication" },
            { icon: MapPin, title: "Location Tracking", desc: "Real-time shipment visibility" },
            { icon: FileCheck, title: "Document Validation", desc: "BOL & customs document checks" },
            { icon: AlertTriangle, title: "Fraud Detection", desc: "Cargo theft prevention" }
          ].map((feature, idx) => (
            <Card key={idx} className="hover:shadow-lg transition-shadow bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardHeader>
                <feature.icon className="h-10 w-10 text-[#27ae60] mb-2" />
                <CardTitle className="text-lg [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="flex flex-col items-start gap-[30px] w-full max-w-7xl mx-auto rounded-xl px-4 sm:px-6 lg:px-[110px] py-10 my-16 bg-app-primary text-white">
        <div className="max-w-4xl mx-auto text-center space-y-6 w-full">
          <h2 className="text-3xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] mb-4">
            Ready to Secure Your Supply Chain?
          </h2>
          <p className="text-xl [font-family:'DM_Sans_18pt-Regular',Helvetica] text-white/90 mb-8">
            Join leading logistics companies using TrustVerify for carrier verification and fraud prevention.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/developer-portal">
              <Button size="lg" className="h-[45px] rounded-lg bg-white text-[#003d2b] hover:bg-gray-100">
                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">Get API Access</span>
              </Button>
            </Link>
            <Link to="/enterprise-contact">
              <Button size="lg" variant="outline" className="h-[45px] rounded-lg bg-transparent border border-white text-white hover:bg-white/90">
                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">Contact Sales</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
