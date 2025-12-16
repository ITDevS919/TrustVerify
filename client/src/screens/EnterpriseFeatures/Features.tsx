import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Note: LegalDisclaimer component - commented out if not available
import { useNavigate } from "react-router-dom";
import { 
  Shield, 
  Globe, 
  Code, 
  FileText, 
  Search, 
  ExternalLink,
  Lock,
  Download,
  Settings,
  Server,
  CheckCircle,
  Play,
  ArrowRight
} from "lucide-react";

interface FeatureCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  features: Feature[];
}

interface Feature {
  title: string;
  description: string;
  path: string;
  badge: string;
  icon: React.ElementType;
  demo?: string;
  actions: string[];
}

export function Features() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<'en' | 'es' | 'fr'>('en');

  const featureCategories: FeatureCategory[] = [
    {
      id: 'security',
      title: 'Security & Analysis',
      description: 'Real-time website security analysis and trust verification',
      icon: Shield,
      features: [
        {
          title: 'Website Integrity Checker',
          description: 'Comprehensive real-time security analysis with SSL validation, security headers check, and threat intelligence scanning',
          path: '/website-integrity',
          badge: 'Live Analysis',
          icon: Shield,
          demo: 'Try with google.com',
          actions: [
            'SSL certificate validation',
            'Security headers analysis', 
            'Threat intelligence scanning',
            'Trust score calculation',
            'Detailed security reports'
          ]
        },
        {
          title: 'Fraud Prevention Dashboard',
          description: 'Multi-layered fraud detection with domain analysis, phone verification, and risk assessment tools',
          path: '/fraud-prevention',
          badge: 'Real-time',
          icon: Search,
          demo: 'Check suspicious domains',
          actions: [
            'Domain trust analysis',
            'Phone number verification',
            'Risk pattern detection',
            'Fraud report generation',
            'Blacklist monitoring'
          ]
        }
      ]
    },
    {
      id: 'widgets',
      title: 'Embeddable Widgets',
      description: 'Business-ready trust widgets for website integration',
      icon: Code,
      features: [
        {
          title: 'TrustVerify Badge',
          description: 'Professional certification badges with color-coded trust levels for business compliance display',
          path: '/website-integrity',
          badge: 'B2B Ready',
          icon: CheckCircle,
          demo: 'See live badges',
          actions: [
            'Enterprise certification display',
            'Color-coded trust levels',
            'Compliance status indicators',
            'Professional branding',
            'Customizable appearances'
          ]
        },
        {
          title: 'TrustScore Widget',
          description: 'Embeddable trust score widgets with iframe and JavaScript integration for business websites',
          path: '/website-integrity',
          badge: 'Embeddable',
          icon: Code,
          demo: 'View embed codes',
          actions: [
            'Iframe embedding support',
            'JavaScript integration',
            'Multiple size options',
            'Multilingual support',
            'Real-time trust scores'
          ]
        }
      ]
    },
    {
      id: 'reports',
      title: 'Trust Reports & SEO',
      description: 'Public trust reports optimized for search engines and business credibility',
      icon: FileText,
      features: [
        {
          title: 'Public Trust Reports',
          description: 'SEO-optimized public trust report pages for Google indexing and business credibility verification',
          path: '/trust-report/google.com',
          badge: 'SEO Indexed',
          icon: FileText,
          demo: 'View sample report',
          actions: [
            'Google indexing optimization',
            'Social media sharing',
            'Comprehensive analysis display',
            'Business credibility proof',
            'Public verification links'
          ]
        },
        {
          title: 'PDF Report Generation',
          description: 'Professional PDF reports with detailed security analysis for compliance and documentation',
          path: '/pdf-report',
          badge: 'Professional',
          icon: Download,
          demo: 'Generate sample PDF',
          actions: [
            'Professional formatting',
            'Compliance documentation',
            'Detailed security metrics',
            'Executive summaries',
            'Branding customization'
          ]
        }
      ]
    },
    {
      id: 'api',
      title: 'Developer APIs',
      description: 'Enterprise-grade APIs with comprehensive documentation and testing tools',
      icon: Server,
      features: [
        {
          title: 'RESTful API Suite',
          description: 'Comprehensive fraud prevention APIs with authentication, rate limiting, and detailed documentation',
          path: '/api-reference',
          badge: 'Enterprise',
          icon: Server,
          demo: 'View API docs',
          actions: [
            'REST API endpoints',
            'API key authentication',
            'Rate limiting controls',
            'Usage analytics',
            'Comprehensive documentation'
          ]
        },
        {
          title: 'Developer Portal',
          description: 'Complete developer experience with API keys, testing sandbox, and usage monitoring',
          path: '/api-reference',
          badge: 'Developer Tools',
          icon: Settings,
          demo: 'Access portal',
          actions: [
            'API key management',
            'Testing sandbox',
            'Usage monitoring',
            'Code examples',
            'Support resources'
          ]
        }
      ]
    },
    {
      id: 'multilingual',
      title: 'Global Reach',
      description: 'Multilingual support and international business features',
      icon: Globe,
      features: [
        {
          title: 'Multilingual Interface',
          description: 'Complete platform support for English, Spanish, and French with cultural adaptation',
          path: '/',
          badge: '3 Languages',
          icon: Globe,
          demo: 'Switch languages',
          actions: [
            'English (EN) support',
            'Spanish (ES) localization',
            'French (FR) translation',
            'Cultural adaptation',
            'Regional compliance'
          ]
        },
        {
          title: 'International Compliance',
          description: 'GDPR, CCPA, and international data protection compliance with regional adaptation',
          path: '/regulatory-compliance',
          badge: 'Compliant',
          icon: Lock,
          demo: 'View compliance',
          actions: [
            'GDPR compliance',
            'CCPA adherence',
            'Data protection',
            'Regional requirements',
            'Privacy controls'
          ]
        }
      ]
    }
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleDemo = (demoPath: string) => {
    navigate(demoPath);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Header */}
      <section className="relative overflow-hidden px-6 pt-24 pb-20 bg-gradient-to-br from-[#0A3778] to-[#1DBF73]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-24 -top-32 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute right-[-120px] top-6 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="relative max-w-[1270px] mx-auto text-center">
          <Badge className="h-[30px] bg-white/15 text-white rounded-[800px] px-4 mb-6 border-0">
            <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm leading-[14px] tracking-[0]">
              TRUSTVERIFY FEATURES
            </span>
          </Badge>
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[42px] sm:text-[48px] lg:text-[54px] leading-[110%] text-white tracking-[-0.8px]">
              TrustVerify Features
            </h1>
            <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-lg sm:text-xl text-white/90 leading-[27px]">
              Comprehensive fraud prevention platform with enterprise-grade security analysis, 
              embeddable widgets, and developer-friendly APIs
            </p>
          </div>
            
          {/* Language Selector */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-lg p-1">
              {(['en', 'es', 'fr'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-2 rounded text-sm transition-colors [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium ${
                    language === lang 
                      ? 'bg-white text-[#0A3778]' 
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  {lang === 'en' ? '🇺🇸 English' : lang === 'es' ? '🇪🇸 Español' : '🇫🇷 Français'}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => handleNavigate('/website-integrity')}
              className="bg-white text-[#0A3778] hover:bg-gray-100 rounded-[10px] min-h-[46px]"
            >
              <Shield className="h-4 w-4 mr-2" />
              <span className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold">Check Website Security</span>
            </Button>
            <Button
              onClick={() => handleNavigate('/fraud-prevention')}
              variant="outline"
              className="border-white text-white hover:bg-white/10 rounded-[10px] min-h-[46px]"
            >
              <Search className="h-4 w-4 mr-2" />
              <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Fraud Prevention</span>
            </Button>
            <Button
              onClick={() => handleNavigate('/api-reference')}
              variant="outline"
              className="border-white text-white hover:bg-white/10 rounded-[10px] min-h-[46px]"
            >
              <Code className="h-4 w-4 mr-2" />
              <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Developer API</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Categories */}
      <div className="max-w-[1270px] mx-auto px-6 md:px-10 py-16">
        <Tabs defaultValue="security" className="w-full">
          <TabsList className="grid w-full h-50 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1 max-w-4xl mx-auto mb-12 bg-[#f4f4f4] rounded-lg p-1">
            {featureCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-4 data-[state=active]:bg-app-secondary data-[state=active]:text-white text-xs sm:text-sm rounded-lg [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium"
                >
                  <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>{category.title}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {featureCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[34px] sm:text-[40px] text-[#003d2b] mb-2">{category.title}</h2>
                <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-lg text-[#808080]">{category.description}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {category.features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <Card key={index} className="group hover:shadow-[0_14px_50px_rgba(0,0,0,0.05)] transition-all duration-300 border-2 border-[#e4e4e4] hover:border-app-secondary rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <div className="bg-gradient-to-br from-[#0b3a78] to-[#1DBF73] p-3 rounded-lg group-hover:from-[#0A3778] group-hover:to-[#1DBF73] transition-colors">
                              <IconComponent className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-xl font-semibold text-[#003d2b] mb-2">
                                {feature.title}
                              </CardTitle>
                              <Badge className="bg-[#003d2b1a] text-[#003d2b] border-0 rounded-[800px] mb-2 [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">
                                {feature.badge}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] leading-relaxed">
                          {feature.description}
                        </p>
                      </CardHeader>
                      
                      <CardContent className="space-y-6">
                        <div>
                          <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] mb-3">Key Features:</h4>
                          <ul className="space-y-2">
                            {feature.actions.map((action, actionIndex) => (
                              <li key={actionIndex} className="flex items-center gap-3 text-sm">
                                <CheckCircle className="h-4 w-4 text-app-secondary flex-shrink-0" />
                                <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{action}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-[#e4e4e4]">
                          <Button
                            onClick={() => handleNavigate(feature.path)}
                            className="flex-1 bg-app-secondary hover:bg-app-secondary/90 text-white rounded-[10px] min-h-[44px]"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            <span className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold">Access Feature</span>
                          </Button>
                          
                          {feature.demo && (
                            <Button
                              onClick={() => handleDemo(feature.path)}
                              variant="outline"
                              className="flex-1 border-[#0b3a78] text-[#0b3a78] hover:bg-[#0b3a780d] rounded-[10px] min-h-[44px]"
                            >
                              <Play className="h-4 w-4 mr-2" />
                              <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">{feature.demo}</span>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Feature Discovery CTA */}
      <section className="bg-gradient-to-br from-[#0A3778] to-[#1DBF73] py-16">
        <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
          <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[34px] sm:text-[40px] text-white mb-4">
            Ready to Explore TrustVerify?
          </h2>
          <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-xl text-white/90 mb-8">
            Start with our most popular features or dive into the full platform
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={() => handleNavigate('/website-integrity')}
              className="bg-white text-[#0A3778] hover:bg-gray-100 h-auto py-4 flex flex-col items-center gap-2 rounded-[10px]"
            >
              <Shield className="h-8 w-8" />
              <span className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold">Security Check</span>
              <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-xs opacity-70">Most Popular</span>
            </Button>
            
            <Button
              onClick={() => handleNavigate('/fraud-prevention')}
              variant="outline"
              className="border-white text-white hover:bg-white/10 h-auto py-4 flex flex-col items-center gap-2 rounded-[10px]"
            >
              <Search className="h-8 w-8" />
              <span className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold">Fraud Prevention</span>
              <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-xs opacity-70">Comprehensive</span>
            </Button>
            
            <Button
              onClick={() => handleNavigate('/api-reference')}
              variant="outline"
              className="border-white text-white hover:bg-white/10 h-auto py-4 flex flex-col items-center gap-2 rounded-[10px]"
            >
              <Code className="h-8 w-8" />
              <span className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold">Developer API</span>
              <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-xs opacity-70">Enterprise</span>
            </Button>
            
            <Button
              onClick={() => handleNavigate('/auth')}
              className="bg-app-secondary text-white hover:bg-app-secondary/90 h-auto py-4 flex flex-col items-center gap-2 rounded-[10px]"
            >
              <ArrowRight className="h-8 w-8" />
              <span className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold">Get Started</span>
              <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-xs opacity-70">Start Now</span>
            </Button>
          </div>
        </div>
        
        {/* Legal Disclaimer */}
        {/* <div className="max-w-[1270px] mx-auto px-6 md:px-10 py-8">
          <LegalDisclaimer variant="compact" />
        </div> */}
      </section>
      <Footer />
    </div>
  );
}