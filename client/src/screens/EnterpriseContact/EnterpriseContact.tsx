import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Shield, Zap, Mail, Phone, Calendar } from "lucide-react";

export default function EnterpriseContact() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-24 -top-32 h-72 w-72 rounded-full bg-[#003d2b0d] blur-3xl" />
          <div className="absolute right-[-120px] top-6 h-80 w-80 rounded-full bg-[#0b3a7815] blur-3xl" />
        </div>
        <div className="relative max-w-[1270px] mx-auto text-center">
          <Badge className="h-[30px] bg-[#003d2b1a] text-[#003d2b] rounded-[800px] px-4 mb-6 border-0">
            <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm leading-[14px] tracking-[0]">
              ENTERPRISE SALES
            </span>
          </Badge>
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-[#0A3778] to-[#1DBF73] rounded-2xl text-white">
              <Building2 className="w-12 h-12" />
            </div>
          </div>
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[42px] sm:text-[48px] lg:text-[54px] leading-[110%] text-[#003d2b] tracking-[-0.8px]">
              Enterprise Sales
            </h1>
            <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-xl text-[#808080] leading-[27px]">
              Scale your fraud prevention with enterprise-grade solutions. Get dedicated support, 
              custom integrations, and priority onboarding for your organization.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button size="lg" className="bg-app-secondary hover:bg-app-secondary/90 text-white rounded-[10px] [font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold px-8 py-4">
              Schedule Demo
            </Button>
            <Button variant="outline" size="lg" className="border-[#0b3a78] text-[#0b3a78] hover:bg-[#0b3a780d] rounded-[10px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium px-8 py-4">
              Download Enterprise Guide
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-[1270px] mx-auto px-6 md:px-10 py-16">
        {/* Enterprise Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4] shadow-[0_10px_30px_rgba(0,0,0,0.04)] text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-[#27AE6D] rounded-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-xl text-[#003d2b]">Dedicated Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] mb-4">24/7 priority support with dedicated account manager</p>
              <ul className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-sm text-[#808080] space-y-1">
                <li>• Named account executive</li>
                <li>• Priority technical support</li>
                <li>• Quarterly business reviews</li>
                <li>• Training & onboarding</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4] shadow-[0_10px_30px_rgba(0,0,0,0.04)] text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-[#27AE6D] rounded-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-xl text-[#003d2b]">Enterprise Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] mb-4">Advanced security features and compliance certifications</p>
              <ul className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-sm text-[#808080] space-y-1">
                <li>• SOC 2 Type II compliance</li>
                <li>• GDPR & CCPA ready</li>
                <li>• Single Sign-On (SSO)</li>
                <li>• Custom data retention</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4] shadow-[0_10px_30px_rgba(0,0,0,0.04)] text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-[#27AE6D] rounded-lg">
                  <Zap className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-xl text-[#003d2b]">Custom Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] mb-4">Tailored solutions for your specific business needs</p>
              <ul className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-sm text-[#808080] space-y-1">
                <li>• Custom API endpoints</li>
                <li>• White-label solutions</li>
                <li>• Advanced analytics</li>
                <li>• Multi-region deployment</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form and Enterprise Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enterprise Contact Form */}
          <Card className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <CardHeader>
              <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-2xl text-[#003d2b]">Contact Enterprise Sales</CardTitle>
              <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080]">
                Tell us about your organization and we'll get back to you within 4 hours
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-[#003d2b] mb-2 block">First Name *</label>
                    <Input placeholder="John" required className="h-[50px] bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080]" />
                  </div>
                  <div>
                    <label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-[#003d2b] mb-2 block">Last Name *</label>
                    <Input placeholder="Smith" required className="h-[50px] bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080]" />
                  </div>
                </div>
                
                <div>
                  <label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-[#003d2b] mb-2 block">Business Email *</label>
                  <Input type="email" placeholder="john.smith@company.com" required className="h-[50px] bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080]" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-[#003d2b] mb-2 block">Company *</label>
                    <Input placeholder="Acme Corporation" required className="h-[50px] bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080]" />
                  </div>
                  <div>
                    <label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-[#003d2b] mb-2 block">Job Title</label>
                    <Input placeholder="Chief Technology Officer" className="h-[50px] bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080]" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-[#003d2b] mb-2 block">Company Size</label>
                    <select className="w-full h-[50px] px-4 bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] focus:border-[#003d2b] focus:ring-0">
                      <option>Select size</option>
                      <option>50-200 employees</option>
                      <option>200-1,000 employees</option>
                      <option>1,000-5,000 employees</option>
                      <option>5,000+ employees</option>
                    </select>
                  </div>
                  <div>
                    <label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-[#003d2b] mb-2 block">Industry</label>
                    <select className="w-full h-[50px] px-4 bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] focus:border-[#003d2b] focus:ring-0">
                      <option>Select industry</option>
                      <option>Financial Services</option>
                      <option>E-commerce</option>
                      <option>Healthcare</option>
                      <option>Technology</option>
                      <option>Manufacturing</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-[#003d2b] mb-2 block">Tell us about your needs</label>
                  <Textarea 
                    placeholder="Describe your fraud prevention challenges, expected transaction volume, integration requirements, etc..."
                    className="min-h-[120px] bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080]"
                  />
                </div>

                <div className="flex items-start space-x-2">
                  <input type="checkbox" className="mt-1" required />
                  <label className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-sm text-[#808080]">
                    I agree to receive communications about TrustVerify enterprise solutions and understand I can unsubscribe at any time.
                  </label>
                </div>
                
                <Button type="submit" className="w-full bg-app-secondary hover:bg-app-secondary/90 text-white rounded-[10px] [font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold py-3">
                  Request Enterprise Demo
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Enterprise Sales Team */}
          <div className="space-y-6">
            <Card className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <CardHeader>
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-xl text-[#003d2b]">Enterprise Sales Team</CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080]">Dedicated specialists for enterprise customers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-app-secondary" />
                  <div>
                    <p className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b]">Enterprise Sales</p>
                    <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-sm text-[#808080]">enterprise@trustverify.io</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-app-secondary" />
                  <div>
                    <p className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b]">Enterprise Hotline</p>
                    <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-sm text-[#808080]">+1 (555) 123-ENTERPRISE</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-app-secondary" />
                  <div>
                    <p className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b]">Response Time</p>
                    <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-sm text-[#808080]">Within 4 hours during business days</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#f7f7f7] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <CardHeader>
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-xl text-[#003d2b]">Enterprise Pricing</CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080]">Custom pricing for your organization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#003d2b]">Custom API Limits</span>
                    <span className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b]">Included</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#003d2b]">Dedicated Support</span>
                    <span className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b]">24/7</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#003d2b]">SLA Guarantee</span>
                    <span className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b]">99.9%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#003d2b]">Implementation</span>
                    <span className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b]">Assisted</span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-[#e4e4e4]">
                  <p className="text-center [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm">
                    Volume-based pricing starting at £2,500/month
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center bg-app-primary rounded-[20px] py-10 px-8 text-white">
          <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-3xl mb-4">Ready to Scale Your Fraud Prevention?</h2>
          <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join hundreds of enterprises protecting billions in transactions with TrustVerify's 
            enterprise-grade fraud prevention platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-app-primary hover:bg-white/90 rounded-[10px] [font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold px-8 py-4">
              Schedule Demo Today
            </Button>
            <Button variant="outline" size="lg" className="border-white bg-transparent text-white hover:bg-white hover:text-[#003366] rounded-[10px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium px-8 py-4">
              View Enterprise Features
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}