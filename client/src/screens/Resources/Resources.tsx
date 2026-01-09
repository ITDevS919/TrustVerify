import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Code, 
  FileText, 
  Video, 
  Download, 
  ExternalLink, 
  Search,
  Lightbulb,
  Users,
  MessageSquare,
  Shield
} from "lucide-react";

export default function Resources() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
  <section className="px-6 pt-24 pb-16 bg-white">
        <div className="max-w-[1270px] mx-auto text-center">
          <Badge className="h-[30px] bg-[#003d2b1a] text-[#003d2b] rounded-[800px] px-4 mb-6 border-0">
            <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm leading-[14px] tracking-[0]">
              DEVELOPER RESOURCES
            </span>
          </Badge>
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[42px] sm:text-[48px] lg:text-[54px] leading-[110%] text-[#003d2b] tracking-[-0.8px]">
              Developer Resources
            </h1>
            <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-xl text-[#808080] leading-[27px]">
              Everything you need to integrate TrustVerify into your applications. 
              Documentation, guides, SDKs, and community support.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-[1270px] mx-auto px-6 md:px-10 py-16">
        {/* Quick Access */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <Link to="/developers/api">
            <Card className="shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_14px_50px_rgba(0,0,0,0.05)] transition-shadow cursor-pointer border border-[#e4e4e4] rounded-[20px] bg-white">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 bg-[#27ae6b] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-lg font-semibold text-[#003d2b] mb-2">API Reference</h3>
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">Complete API documentation</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/sdk-documentation">
            <Card className="shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_14px_50px_rgba(0,0,0,0.05)] transition-shadow cursor-pointer border border-[#e4e4e4] rounded-[20px] bg-white">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 bg-[#27ae6b] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="h-6 w-6 text-white" />
                </div>
                <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-lg font-semibold text-[#003d2b] mb-2">SDKs</h3>
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">Language-specific libraries</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/enterprise/integration">
            <Card className="shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_14px_50px_rgba(0,0,0,0.05)] transition-shadow cursor-pointer border border-[#e4e4e4] rounded-[20px] bg-white">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 bg-[#27ae6b] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-lg font-semibold text-[#003d2b] mb-2">Examples</h3>
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">Code samples & tutorials</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/help">
            <Card className="shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_14px_50px_rgba(0,0,0,0.05)] transition-shadow cursor-pointer border border-[#e4e4e4] rounded-[20px] bg-white">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 bg-[#27ae6b] rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-lg font-semibold text-[#003d2b] mb-2">Support</h3>
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">Get help from our team</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Documentation Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* API Documentation */}
          <Card className="shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-[#e4e4e4] rounded-[20px]">
            <CardHeader>
              <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] flex items-center space-x-3">
                <Code className="h-6 w-6 text-[#0b3a78]" />
                <span>API Documentation</span>
              </CardTitle>
              <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                Comprehensive guides to integrate TrustVerify APIs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Link to="/developers/api">
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[#f4f4f4] cursor-pointer">
                    <div>
                      <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b]">API Reference</h4>
                      <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">Complete endpoint documentation</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-[#808080]" />
                  </div>
                </Link>

                <Link to="/api-documentation">
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[#f4f4f4] cursor-pointer">
                    <div>
                      <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b]">Getting Started</h4>
                      <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">Quick start guide and tutorials</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-[#808080]" />
                  </div>
                </Link>

                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[#f4f4f4] cursor-pointer">
                  <div>
                    <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b]">Authentication</h4>
                    <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">API keys and security best practices</p>
                  </div>
                  <Badge className="bg-[#003d2b1a] text-[#003d2b] border-0 rounded-[800px]">New</Badge>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[#f4f4f4] cursor-pointer">
                  <div>
                    <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b]">Rate Limiting</h4>
                    <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">Usage limits and optimization</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-[#808080]" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SDKs and Libraries */}
          <Card className="shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-[#e4e4e4] rounded-[20px]">
            <CardHeader>
              <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] flex items-center space-x-3">
                <Download className="h-6 w-6 text-app-secondary" />
                <span>SDKs & Libraries</span>
              </CardTitle>
              <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                Official libraries for popular programming languages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Link to="/sdk-documentation">
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[#f4f4f4] cursor-pointer">
                    <div>
                      <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b]">JavaScript SDK</h4>
                      <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">Node.js and browser support</p>
                    </div>
                    <Badge className="border border-[#e4e4e4] text-[#003d2b] rounded-[800px]">v2.1.0</Badge>
                  </div>
                </Link>

                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[#f4f4f4] cursor-pointer">
                  <div>
                    <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b]">Python SDK</h4>
                    <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">Full Python 3.8+ support</p>
                  </div>
                  <Badge className="border border-[#e4e4e4] text-[#003d2b] rounded-[800px]">v1.8.2</Badge>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[#f4f4f4] cursor-pointer">
                  <div>
                    <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b]">PHP SDK</h4>
                    <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">Laravel and framework integrations</p>
                  </div>
                  <Badge className="border border-[#e4e4e4] text-[#003d2b] rounded-[800px]">v1.5.1</Badge>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[#f4f4f4] cursor-pointer">
                  <div>
                    <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b]">REST API</h4>
                    <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">Direct HTTP integration</p>
                  </div>
                  <Badge className="bg-[#003d2b1a] text-[#003d2b] border-0 rounded-[800px]">Universal</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Integration Examples */}
        <Card className="shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-[#e4e4e4] rounded-[20px] mb-16">
          <CardHeader>
            <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] flex items-center space-x-3">
              <Lightbulb className="h-6 w-6 text-[#0b3a78]" />
              <span>Integration Examples</span>
            </CardTitle>
            <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
              Real-world examples and code samples for common use cases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link to="/enterprise/integration">
                <div className="p-4 rounded-[18px] border border-[#e4e4e4] hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-shadow cursor-pointer">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 rounded bg-[#27ae6b] flex items-center justify-center">
                      <Code className="h-4 w-4 text-white" />
                    </div>
                    <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b]">E-commerce Integration</h4>
                  </div>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080] mb-3">
                    Protect online stores with transaction verification
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <Badge className="border border-[#e4e4e4] text-[#003d2b] rounded-[800px] text-xs">Node.js</Badge>
                    <Badge className="border border-[#e4e4e4] text-[#003d2b] rounded-[800px] text-xs">React</Badge>
                  </div>
                </div>
              </Link>

              <div className="p-4 rounded-[18px] border border-[#e4e4e4] hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 rounded  bg-[#27ae6b] flex items-center justify-center">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b]">Banking API</h4>
                </div>
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080] mb-3">
                  KYC verification for financial institutions
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge className="border border-[#e4e4e4] text-[#003d2b] rounded-[800px] text-xs">Python</Badge>
                  <Badge className="border border-[#e4e4e4] text-[#003d2b] rounded-[800px] text-xs">Django</Badge>
                </div>
              </div>

              <div className="p-4 rounded-[18px] border border-[#e4e4e4] hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 rounded bg-[#27ae6b] flex items-center justify-center">
                    <Search className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b]">Domain Verification</h4>
                </div>
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080] mb-3">
                  Real-time website trust scoring
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge className="border border-[#e4e4e4] text-[#003d2b] rounded-[800px] text-xs">JavaScript</Badge>
                  <Badge className="border border-[#e4e4e4] text-[#003d2b] rounded-[800px] text-xs">Webhook</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Video Tutorials */}
        <Card className="shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-[#e4e4e4] rounded-[20px] mb-16">
          <CardHeader>
            <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] flex items-center space-x-3">
              <Video className="h-6 w-6 text-[#FF4B26]" />
              <span>Video Tutorials</span>
            </CardTitle>
            <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
              Step-by-step video guides for common integration scenarios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="aspect-video bg-[#f4f4f4] border border-[#e4e4e4] rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Video className="h-12 w-12 text-[#808080] mx-auto mb-2" />
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Getting Started with TrustVerify API</p>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">15 min tutorial</p>
                </div>
              </div>

              <div className="aspect-video bg-[#f4f4f4] border border-[#e4e4e4] rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Video className="h-12 w-12 text-[#808080] mx-auto mb-2" />
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Integration Best Practices</p>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">22 min deep dive</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Community & Support */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-[#e4e4e4] rounded-[20px]">
            <CardHeader>
              <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] flex items-center space-x-3">
                <Users className="h-6 w-6 text-[#0b3a78]" />
                <span>Community</span>
              </CardTitle>
              <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                Connect with other developers and get community support
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start border-[#e4e4e4] text-[#003d2b] hover:bg-[#0b3a780d] rounded-[10px]">
                <MessageSquare className="h-4 w-4 mr-2" />
                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Developer Discord</span>
              </Button>
              <Button variant="outline" className="w-full justify-start border-[#e4e4e4] text-[#003d2b] hover:bg-[#0b3a780d] rounded-[10px]">
                <FileText className="h-4 w-4 mr-2" />
                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">GitHub Discussions</span>
              </Button>
              <Button variant="outline" className="w-full justify-start border-[#e4e4e4] text-[#003d2b] hover:bg-[#0b3a780d] rounded-[10px]">
                <BookOpen className="h-4 w-4 mr-2" />
                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Stack Overflow</span>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-[#e4e4e4] rounded-[20px]">
            <CardHeader>
              <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] flex items-center space-x-3">
                <MessageSquare className="h-6 w-6 text-app-secondary" />
                <span>Support</span>
              </CardTitle>
              <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                Get help from our technical support team
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/help">
                <Button variant="outline" className="w-full justify-start border-[#e4e4e4] text-[#003d2b] hover:bg-[#0b3a780d] rounded-[10px]">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Help Center</span>
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="w-full justify-start border-[#e4e4e4] text-[#003d2b] hover:bg-[#0b3a780d] rounded-[10px]">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Contact Support</span>
                </Button>
              </Link>
              <Button className="w-full bg-app-secondary hover:bg-app-secondary/90 text-white rounded-[10px] min-h-[44px]">
                <span className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold">Submit Ticket</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}