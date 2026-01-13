import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./hooks/use-auth";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/toaster";
import { ProtectedRoute } from "./lib/protected-route";
import { Home } from "./screens/Home";
import { About } from "./screens/About";
import { ContactUS } from "./screens/ContactUS";
import { HelpCenter } from "./screens/HelpCenter";
import { IndustrySolutions } from "./screens/IndustrySolutions";
import { LegalDisclaimer } from "./screens/LegalDisclaimer";
import { OurMission } from "./screens/OurMission";
import { PlatformSuite } from "./screens/PlatformSuite";
import { PressMedia } from "./screens/Press&Media";
import { PricingDetail } from "./screens/PricingDetail";
import { PrivacyPolicy } from "./screens/PrivacyPolicy";
import { RegulatoryCompliances } from "./screens/RegulatoryCompliances";
import { TermsOfServices } from "./screens/Terms";
import { CookiePolicy } from "./screens/CookiePolicy";
import { Training } from "./screens/Training";
import { ConsumerProtection } from "./screens/ConsumerProtection";
import { Login } from "./screens/Login";
import { Signup } from "./screens/Signup";
import { DeveloperCenter } from "./screens/DeveloperCenter";
import { Messages } from "./screens/Messages";
import { SupportCenter } from "./screens/SupportCenter";
import { ReportScam } from "./screens/ReportScam";
import { SecureTransactions } from "./screens/SecureTransactions";
import { Dashboard } from "./screens/Dashboard";
import { IdVerification } from "./screens/IDVerification";
import { ApiReferences } from "./screens/API references";
import { SecureEscrow } from "./screens/SecureEscrow";
import { FraudPrevention } from "./screens/FraudPrevention";
import { DeveloperPortal } from "./screens/DeveloperPortal";
import { LiveDemo } from "./screens/LiveDemo";
import { NewTransaction } from "./screens/Transactions/NewTransaction";
import { AdminReview } from "./screens/AdminReview/AdminReview";
import { AdminDashboard } from "./screens/AdminDashboard";
import { ApiPricing } from "./screens/ApiPricing";
import { SubscriptionManagement, SubscriptionSuccess, SubscriptionCancel } from "./screens/Subscriptions";
import ZendeskChat from "./components/ChatBot/ZendeskChat";
import { Business } from "./screens/Business";
import { Resources } from "./screens/Resources";
import { SecurityDashboard } from "./screens/SecurityDashboard";
import { Webhook } from "./screens/Webhook";
import { OnboardingDemo } from "./screens/OnboardingDemo";
import { IntegrationExamples } from "./screens/IntegrationExample";
import { Features } from "./screens/EnterpriseFeatures";
import DemoPage from "./screens/DemoPage/DemoPage";
import { Solutions } from "./screens/Solutions";
import { ApiKeysPage } from "./screens/ApiKeys";
import { ApiDocPage } from "./screens/ApiDoc";
import { ApiDocumentationPage } from "./screens/ApiDoc";
import CategoryPage from "./screens/Solutions/[Category]";
import  Aml from "./screens/Solutions/Aml";
import  Fraud from "./screens/Solutions/Fraud";
import  Kyb from "./screens/Solutions/Kyb";
import  Kyc from "./screens/Solutions/Kyc";
import { SDKDocumentation } from "./screens/SDK-Documentation";
import { EnterpriseContact } from "./screens/EnterpriseContact";
import { WebsiteIntegrityPage } from "./screens/WebsiteIntegrity";
import { NotFound } from "./screens/NotFound";
import CRMDashboard from "./screens/CRM/dashboard";
import CRMContacts from "./screens/CRM/contacts";
import CRMLeads from "./screens/CRM/leads";
import CRMOpportunities from "./screens/CRM/opportunities";
import HRDashboard from "./screens/HR/dashboard";
import HREmployees from "./screens/HR/employees";
import HRPerformance from "./screens/HR/performance";
import HRRecruitment from "./screens/HR/recruitment";
import HRTimeOff from "./screens/HR/time-off";
import { IdentityVerification } from "./screens/IdentityVerification";
import { EscrowServices } from "./screens/EscrowServices";
import { BiometricVerification } from "./screens/BiometricVerification";
import { KYBVerificationPage } from "./screens/KYBVerification";
import { AMLScreeningPage } from "./screens/AMLScreening";
import { FraudDemo } from "./screens/FraudPrevention";
import { MenuPage } from "./screens/Menu";
import { Crypto, Fintech, Gaming, Insurance, Institutional, Travel, Ecommerce, Logistics } from "./screens/Industry";
import {TrustGraphDashboard, RegulatoryPulseDashboard, TransactionIntegrityDashboard, VendorDiligenceDashboard, GlobalRiskDashboard, CyberTrustDashboard} from "./screens/IntelligenceDashboards"
import { CaseManagementDashboard, DecisionEngineDashboard, MonitoringDashboard, SignalProviders } from "./screens/Compliance";
import BankOnboardingDemo from "./screens/DemoPage/BackOnboardingDemo";
import InstitutionalCheckout from "./screens/Industry/InstitutionalCheckout";
import TrustBadgeDemo from "./screens/DemoPage/TrustBadgeDemo";
import BankScoringDashboard from "./screens/BankScoringDashboard/BankScoringDashboard";
import TrustScoreDemo from "./screens/DemoPage/TrustScoreDemo";
import UnifiedFraudDemo from "./screens/DemoPage/UnifiedFraudDemo";
import { ApiPlayground } from "./screens/APIPlayground";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />

            
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Signup />} />

              {/* Dashboards Routes */}

              <Route path="/security-dashboard" element={<SecurityDashboard />} />
              <Route path="/fraud-prevention" element={<FraudPrevention />} />
              <Route path="/bank-scoring-dashboard" element={<BankScoringDashboard />} />


              <Route path="/trustgraph" element={<TrustGraphDashboard />} />
              <Route path="/regulatory-pulse" element={<RegulatoryPulseDashboard />} />
              <Route path="/transaction-integrity" element={<TransactionIntegrityDashboard />} />
              <Route path="/vendor-diligence" element={<VendorDiligenceDashboard />} />
              <Route path="/global-risk" element={<GlobalRiskDashboard />} />
              <Route path="/cybertrust" element={<CyberTrustDashboard />} />

              {/* Solutions Routes */}
              <Route path="/solutions" element={<Solutions />} />
              <Route path="/solutions/kyb" element={<Kyb />} />
              <Route path="/solutions/kyc" element={<Kyc />} />
              <Route path="/solutions/aml" element={<Aml />} />
              <Route path="/solutions/fraud" element={<Fraud />} />
              <Route path="/solutions/:category" element={<CategoryPage />} />

              {/* Industries Routes */}
              <Route path="/industries/crypto" element={<Crypto />} />
              <Route path="/industries/fintech" element={<Fintech />} />
              <Route path="/industries/gaming" element={<Gaming />} />
              <Route path="/industries/insurance" element={<Insurance />} />
              <Route path="/industries/institutional" element={<Institutional />} />
              <Route path="/industries/travel" element={<Travel />} />
              <Route path="/industries/ecommerce" element={<Ecommerce />} />
              <Route path="/industries/logistics" element={<Logistics />} />

              <Route path="/institutional-checkout" element={<InstitutionalCheckout />} />
              <Route path="/compliance/cases" element={<CaseManagementDashboard />} />
              <Route path="/compliance/decision-engine" element={<DecisionEngineDashboard />} />
              <Route path="/compliance/monitoring" element={<MonitoringDashboard />} />
              <Route path="/compliance/providers" element={<SignalProviders />} />

              {/* Developers Routes */}
              <Route path="/developers" element={<DeveloperCenter />} />
              <Route path="/developers/api" element={<ApiReferences />} />
              <Route path="/developers/webhooks" element={<Webhook />} />
              <Route path="/developers/workflow" element={<OnboardingDemo />} />
              <Route path="/developers/demo" element={<DemoPage />} />

              {/* Enterprise Routes */}
              <Route path="/enterprise/features" element={<Features />} />
              <Route path="/enterprise/compliance" element={<RegulatoryCompliances />} />
              <Route path="/enterprise/case-studies" element={<Resources />} />
              <Route path="/enterprise/integration" element={<IntegrationExamples />} />
              <Route path="/enterprise-contact" element={<EnterpriseContact />} />

              {/* Pricing Routes */}
              <Route path="/pricing" element={<PricingDetail />} />
              <Route path="/business" element={<Business />} />
              <Route path="/api-pricing" element={<ApiPricing />} />

              {/* Subscription Routes */}
              <Route path="/subscription/manage" element={<SubscriptionManagement />} />
              <Route path="/subscription/success" element={<SubscriptionSuccess />} />
              <Route path="/subscription/cancel" element={<SubscriptionCancel />} />

              {/* Legal Routes */}

              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<ContactUS />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/industry" element={<IndustrySolutions />} />
              <Route path="/legal" element={<LegalDisclaimer />} />
              <Route path="/our-mission" element={<OurMission />} />
              <Route path="/platform" element={<PlatformSuite />} />
              <Route path="/media" element={<PressMedia />} />
              <Route path="/policies" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfServices />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/training" element={<Training />} />
              <Route path="/consumer-protection" element={<ConsumerProtection />} />
              <Route path="/not-found" element={<NotFound />} />

              {/* Documentation Routes */}
              <Route path="/api-docs" element={<ApiDocPage />} />
              <Route path="/api-documentation" element={<ApiDocumentationPage />} />
              <Route path="/sdk-documentation" element={<SDKDocumentation />} />

              {/* Demo Routes */}
              <Route path="/live-demo" element={<LiveDemo />} />
              <Route path="/bank-onboarding-demo" element={<BankOnboardingDemo />} />
              <Route path="/fraud-demo" element={<FraudDemo />} />
              <Route path="/trustscore-demo" element={<TrustScoreDemo />} />
              <Route path="/trust-badge" element={<TrustBadgeDemo />} />
              <Route path="/complete-demo" element={<UnifiedFraudDemo />} />

              {/* Routes for Updated Pages */}
              <Route path="/identity-verification" element={<IdentityVerification />} />
              <Route path="/biometric-verification" element={<BiometricVerification />} />
              <Route path="/escrow-services" element={<EscrowServices />} />
              <Route path="/website-integrity" element={<WebsiteIntegrityPage />} />
              <Route path="/kyb-verification" element={<KYBVerificationPage />} />
              <Route path="/aml-screening" element={<AMLScreeningPage />} />
              <Route path="/api-keys" element={<ApiKeysPage />} />
              <Route path="/api-playground" element={<ApiPlayground />} />

              {/* Protected Routes */}
              <Route  
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route  
                path="/menu" 
                element={
                  <ProtectedRoute>
                    <MenuPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/messages/:transactionId?" 
                element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>          
                } 
              />
              <Route 
                path="/support-center" 
                element={
                  <ProtectedRoute>
                    <SupportCenter />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/report-scam" 
                element={
                  <ProtectedRoute>
                    <ReportScam />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/secure-transaction" 
                element={
                  <ProtectedRoute>
                    <SecureTransactions />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/kyc-verification" 
                element={
                  <ProtectedRoute>
                    <IdVerification />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="/transactions/new"
                element={
                  <ProtectedRoute>
                    <NewTransaction />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/secure-escrow" 
                element={
                  <ProtectedRoute>
                    <SecureEscrow />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/developer-portal" 
                element={
                  <ProtectedRoute>
                    <DeveloperPortal />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/kyc-review" 
                element={
                  <ProtectedRoute>
                    <AdminReview />
                  </ProtectedRoute>
                } 
              />

              {/* CRM Routes */}
              <Route 
                path="/crm" 
                element={
                  <ProtectedRoute>
                    <CRMDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/crm/contacts" 
                element={
                  <ProtectedRoute>
                    <CRMContacts />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/crm/leads" 
                element={
                  <ProtectedRoute>
                    <CRMLeads />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/crm/opportunities" 
                element={
                  <ProtectedRoute>
                    <CRMOpportunities />
                  </ProtectedRoute>
                } 
              />

              {/* HR Routes */}
              <Route 
                path="/hr" 
                element={
                  <ProtectedRoute>
                    <HRDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/hr/employees" 
                element={
                  <ProtectedRoute>
                    <HREmployees />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/hr/performance" 
                element={
                  <ProtectedRoute>
                    <HRPerformance />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/hr/recruitment" 
                element={
                  <ProtectedRoute>
                    <HRRecruitment />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/hr/time-off" 
                element={
                  <ProtectedRoute>
                    <HRTimeOff />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Router>
          <ZendeskChat />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
