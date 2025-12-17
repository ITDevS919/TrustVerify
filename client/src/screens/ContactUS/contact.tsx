import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock, MessageSquare, Shield, Users, Zap } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-900 to-indigo-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <MessageSquare className="h-16 w-16 mx-auto mb-6 text-blue-300" />
          <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-blue-100 leading-relaxed">
            Get in touch with our team of fraud prevention experts. We're here to help you 
            secure your business and answer any questions about our platform.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="shadow-lg text-center">
            <CardHeader>
              <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-xl">Email Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Get help with your account, technical issues, or general inquiries</p>
              <div className="space-y-2">
                <p><strong>General:</strong> hello@trustverify.io</p>
                <p><strong>Support:</strong> support@trustverify.io</p>
                <p><strong>Sales:</strong> sales@trustverify.io</p>
                <p><strong>Security:</strong> security@trustverify.io</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg text-center">
            <CardHeader>
              <Phone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-xl">Phone Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Speak directly with our support team for urgent issues</p>
              <div className="space-y-2">
                <p><strong>UK:</strong> +44 20 7123 4567</p>
                <p className="text-sm text-gray-500 mt-4">24/7 emergency support available</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg text-center">
            <CardHeader>
              <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-xl">Response Times</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Our commitment to fast, reliable support</p>
              <div className="space-y-2">
                <p><strong>Critical Issues:</strong> &lt; 1 hour</p>
                <p><strong>Technical Support:</strong> &lt; 4 hours</p>
                <p><strong>General Inquiries:</strong> &lt; 24 hours</p>
                <p><strong>Sales Questions:</strong> &lt; 2 hours</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form and Offices */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Send us a Message</CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you within 24 hours</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">First Name</label>
                    <Input placeholder="John" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Last Name</label>
                    <Input placeholder="Smith" />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Email Address</label>
                  <Input type="email" placeholder="john.smith@company.com" />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Company</label>
                  <Input placeholder="Your Company Name" />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Subject</label>
                  <select className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>General Inquiry</option>
                    <option>Technical Support</option>
                    <option>Sales Question</option>
                    <option>Partnership Opportunity</option>
                    <option>Security Issue</option>
                    <option>Billing Question</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Message</label>
                  <Textarea 
                    placeholder="Tell us how we can help you..."
                    className="min-h-[120px]"
                  />
                </div>
                
                <Button className="w-full bg-blue-600 hover:bg-blue-700 py-3">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Office Locations */}
          <div className="space-y-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <MapPin className="h-6 w-6 mr-2 text-blue-600" />
                  Our Offices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Headquarters - Newcastle</h3>
                  <p className="text-gray-600 mb-2">15 Grey Street<br />Newcastle upon Tyne NE1 6EE, UK</p>
                  <p className="text-sm text-gray-500">Phone: +44 20 7123 4567</p>
                  <p className="text-sm text-gray-500">Hours: Mon-Fri 9AM-6PM GMT</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Support Options */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Additional Support Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-lg text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-xl">Security Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Report security vulnerabilities or concerns immediately
                </p>
                <Button variant="outline" className="w-full">
                  Report Security Issue
                </Button>
                <p className="text-xs text-gray-500 mt-2">24/7 emergency response</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-xl">Community Forum</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Connect with other users and get help from the community
                </p>
                <Button variant="outline" className="w-full">
                  Visit Community
                </Button>
                <p className="text-xs text-gray-500 mt-2">Peer-to-peer support</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg text-center">
              <CardHeader>
                <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-xl">Live Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Get instant help from our support team during business hours
                </p>
                <Button variant="outline" className="w-full">
                  Start Live Chat
                </Button>
                <p className="text-xs text-gray-500 mt-2">Available 9AM-6PM GMT</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Partnership & Enterprise */}
        <Card className="shadow-lg mt-16 bg-blue-50">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Enterprise & Partnership Inquiries</h2>
            <p className="text-lg text-gray-600 mb-6">
              Looking for enterprise solutions or interested in partnering with TrustVerify? 
              Our business development team is ready to discuss custom solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Enterprise Sales
              </Button>
              <Button variant="outline" size="lg">
                Partnership Opportunities
              </Button>
            </div>
            <div className="mt-6 text-sm text-gray-500">
              <p>Enterprise: enterprise@trustverify.io | Partnerships: partnerships@trustverify.io</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}