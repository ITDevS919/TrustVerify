import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Shield, 
  Scale, 
  Eye, 
  FileText, 
  Users, 
  CheckCircle, 
  AlertTriangle,
  Building2,
  Gavel,
  TrendingUp,
  ArrowRight,
  Zap
} from "lucide-react";

export default function InstitutionalCompliance() {
  return (
    <main className="bg-[#f6f6f6] overflow-hidden w-full mx-auto flex flex-col min-h-screen">
      <Header />
      
      {/* Hero */}
      <section className="flex flex-col items-start gap-[30px] w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-[110px] py-20">
        <div className="w-full text-center mb-8">
          <div className="flex justify-center w-full mb-6">
            <Badge className="w-fit bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-full px-4 py-1.5 h-auto">
              <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm tracking-[0] leading-[14px]">
                Institutional Grade
              </span>
            </Badge>
          </div>
          <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl sm:text-4xl lg:text-5xl mb-4">
            Compliance Infrastructure for<br />
            <span className="text-[#27ae60]">Investment Firms & Hedge Funds</span>
          </h1>
          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base sm:text-lg lg:text-xl max-w-3xl mx-auto mb-8">
            Complete decision engine, case management, ongoing monitoring, and audit trail 
            designed to meet the requirements of LPs, fund administrators, and regulators.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link to="/institutional-checkout">
              <Button 
                size="lg" 
                className="h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90 px-8 py-4" 
                data-testid="button-get-started"
              >
                <span className="font-semibold text-white text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica]">Get Started Now</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/compliance/decision-engine">
              <Button 
                size="lg" 
                variant="outline" 
                className="relative h-[45px] rounded-lg border-none before:content-[''] before:absolute before:inset-0 before:p-px before:rounded-lg before:[background:linear-gradient(118deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] hover:bg-gray-50 px-8 py-4" 
                data-testid="button-view-demo"
              >
                <span className="bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] bg-clip-text text-transparent font-semibold text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica]">View Demo Dashboard</span>
              </Button>
            </Link>
            <Link to="/compliance/cases">
              <Button 
                size="lg" 
                variant="outline" 
                className="relative h-[45px] rounded-lg border-none before:content-[''] before:absolute before:inset-0 before:p-px before:rounded-lg before:[background:linear-gradient(118deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] hover:bg-gray-50 px-8 py-4" 
                data-testid="button-case-management"
              >
                <span className="bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] bg-clip-text text-transparent font-semibold text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica]">Case Management</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-start gap-[30px] w-full px-4 sm:px-6 lg:px-[110px] py-16 bg-white">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-12">
            <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl mb-4">
              Client Readiness Levels
            </h2>
            <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] max-w-2xl mx-auto">
              Our platform scales from startup to institutional requirements
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-[#27ae60] bg-[#e8f5e9] rounded-[20px]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge className="bg-[#27ae60] text-white rounded-full">Ready</Badge>
                  <TrendingUp className="h-6 w-6 text-[#27ae60]" />
                </div>
                <CardTitle className="text-xl [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Startups</CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                  Basic compliance requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Automated KYC/KYB</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Basic AML checks</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Fraud detection signals</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Simple decision logic</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-[#27ae60] border-2 bg-[#e8f5e9] rounded-[20px]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge className="bg-[#27ae60] text-white rounded-full">Full Support</Badge>
                  <Building2 className="h-6 w-6 text-[#27ae60]" />
                </div>
                <CardTitle className="text-xl [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Mid-Tier Investment Firms</CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                  Documented policies & audit trails
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Configurable Decision Engine</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Manual escalation workflows</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Complete audit trails</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Repeatable decisions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Case management</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-[#27ae60] bg-[#e8f5e9] rounded-[20px]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge className="bg-[#27ae60] text-white rounded-full">Enterprise</Badge>
                  <Gavel className="h-6 w-6 text-[#27ae60]" />
                </div>
                <CardTitle className="text-xl [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Hedge Funds</CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                  Full institutional compliance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Sanctions & PEP screening</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Beneficial ownership clarity</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Ongoing monitoring</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Human oversight workflows</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Explainable decisions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Formal reporting</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-start gap-[30px] w-full px-4 sm:px-6 lg:px-[110px] py-16 bg-white">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-12">
            <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl mb-4">
              Core Compliance Infrastructure
            </h2>
            <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] max-w-2xl mx-auto">
              The control system that turns signal providers into institutional-grade compliance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardHeader>
                <Scale className="h-10 w-10 text-[#27ae60] mb-2" />
                <CardTitle className="text-lg [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Decision Engine</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mb-4">
                  Configurable rules and thresholds that consume provider signals and produce 
                  deterministic decisions.
                </p>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[#27ae60] border-[#27ae60] rounded-full">Approved</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-yellow-600 border-yellow-200 rounded-full">EDD Required</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-red-600 border-red-200 rounded-full">Rejected</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardHeader>
                <Users className="h-10 w-10 text-[#27ae60] mb-2" />
                <CardTitle className="text-lg [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Case Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mb-4">
                  Human governance layer with case creation, assignment, notes, and approval hierarchy.
                </p>
                <ul className="space-y-1 text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                  <li>• Analyst assignment</li>
                  <li>• SLA tracking</li>
                  <li>• Override with justification</li>
                  <li>• Approval workflows</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardHeader>
                <Eye className="h-10 w-10 text-[#27ae60] mb-2" />
                <CardTitle className="text-lg [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Ongoing Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mb-4">
                  Scheduled re-checks with change detection and alerting for continuous compliance.
                </p>
                <ul className="space-y-1 text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                  <li>• Daily/weekly/monthly checks</li>
                  <li>• Director changes</li>
                  <li>• Sanctions updates</li>
                  <li>• Adverse media alerts</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardHeader>
                <FileText className="h-10 w-10 text-[#27ae60] mb-2" />
                <CardTitle className="text-lg [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Audit & Reporting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mb-4">
                  LP-ready reports with decision rationale, provider attribution, and full audit trails.
                </p>
                <ul className="space-y-1 text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                  <li>• Due diligence reports</li>
                  <li>• Decision summaries</li>
                  <li>• PDF & JSON export</li>
                  <li>• Regulator-ready format</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-[#f6f6f6] text-[#003d2b]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Signal Provider Stack
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Best-in-class providers for 99.8% accuracy at competitive pricing
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#00A859]" />
                Identity & KYB
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Ondato</span>
                  <Badge className="bg-green-600">Primary</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Didit</span>
                  <Badge variant="outline" className="text-gray-400">Secondary</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Companies House</span>
                  <Badge className="bg-blue-600">Registry</Badge>
                </div>
              </div>
            </div>

            <div className="bg-background border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                AML & Sanctions
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Sanction Scanner</span>
                  <Badge className="bg-green-600">Recommended</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">ComplyAdvantage</span>
                  <Badge variant="outline" className="text-gray-400">Premium</Badge>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Entry-tier pricing with 99.5%+ accuracy
                </p>
              </div>
            </div>

            <div className="bg-background border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-500" />
                Fraud & Technical Risk
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">MaxMind</span>
                  <Badge className="bg-green-600">IP/Geo</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">MinFingerprint</span>
                  <Badge className="bg-blue-600">Device</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Escrow.com</span>
                  <Badge variant="outline" className="text-gray-400">Settlement</Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-4">
              Combined accuracy target: <span className="text-[#00A859] font-bold">99.8%</span> | 
              Cost: <span className="text-[#00A859] font-bold">30-50% below market leaders</span>
            </p>
            <Link to="/compliance/providers">
              <Button variant="outline" className= "mt-5 text-[#003d2b]">
                View Provider Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Auditors & LPs Will Ask
            </h2>
            <p className="text-gray-600">
              Our platform provides clear answers to every audit question
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "How do you decide approve vs reject?",
                answer: "Configurable decision engine with explicit rules, thresholds, and deterministic outcomes. Every decision is logged with full rationale."
              },
              {
                question: "Who reviews exceptions?",
                answer: "Case management system with analyst assignment, SLA tracking, approval hierarchy, and override justification requirements."
              },
              {
                question: "How do you track changes over time?",
                answer: "Ongoing monitoring with scheduled re-checks, baseline comparison, and automated alerting for any detected changes."
              },
              {
                question: "Can you reproduce a decision from six months ago?",
                answer: "Immutable audit logs store the exact provider signals, rules evaluated, and decision rationale for every decision made."
              },
              {
                question: "What happens when a provider changes data?",
                answer: "Change detection compares new data against baselines, generates alerts, and triggers case creation for human review."
              }
            ].map((item, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="bg-[#00A859] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                      Q
                    </span>
                    {item.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 pl-8">{item.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="flex flex-col items-start gap-[30px] w-full max-w-7xl mx-auto rounded-xl px-4 sm:px-6 lg:px-[110px] py-10 my-16 bg-app-primary text-white">
        <div className="max-w-4xl mx-auto text-center space-y-6 w-full">
          <h2 className="text-3xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] mb-4">
            Ready for Institutional Compliance?
          </h2>
          <p className="text-xl [font-family:'DM_Sans_18pt-Regular',Helvetica] opacity-90 mb-8">
            Get started in minutes. No sales calls required.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/institutional-checkout">
              <Button size="lg" className="h-[45px] rounded-lg bg-white text-[#003d2b] hover:bg-gray-100" data-testid="button-subscribe-now">
                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">Subscribe Now</span>
              </Button>
            </Link>
            <Link to="/compliance/decision-engine">
              <Button size="lg" variant="outline" className="h-[45px] rounded-lg bg-transparent border border-white text-white hover:bg-white/90" data-testid="button-explore-platform">
                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">Explore Platform</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
