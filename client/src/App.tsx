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
import { Solutions } from "./screens/solutions";
import { ApiKeysPage } from "./screens/ApiKeys";
import { ApiDocPage } from "./screens/ApiDoc";
import { ApiDocumentationPage } from "./screens/ApiDoc";
import CategoryPage from "./screens/solutions/[Category]";
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
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Signup />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<ContactUS />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/industry" element={<IndustrySolutions />} />
              <Route path="/legal" element={<LegalDisclaimer />} />
              <Route path="/our-mission" element={<OurMission />} />
              <Route path="/platform" element={<PlatformSuite />} />
              <Route path="/media" element={<PressMedia />} />
              <Route path="/pricing" element={<PricingDetail />} />
              <Route path="/subscription/manage" element={<SubscriptionManagement />} />
              <Route path="/subscription/success" element={<SubscriptionSuccess />} />
              <Route path="/subscription/cancel" element={<SubscriptionCancel />} />
              <Route path="/policies" element={<PrivacyPolicy />} />
              <Route path="/regulatory-compliance" element={<RegulatoryCompliances />} />
              <Route path="/terms" element={<TermsOfServices />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/training" element={<Training />} />
              <Route path="/consumer-protection" element={<ConsumerProtection />} />
              <Route path="/developers" element={<DeveloperCenter />} />
              <Route path="/reference-api" element={<ApiReferences />} />
              <Route path="/api-pricing" element={<ApiPricing />} />
              <Route path="/api-keys" element={<ApiKeysPage />} />
              <Route path="/api-docs" element={<ApiDocPage />} />
              <Route path="/api-documentation" element={<ApiDocumentationPage />} />
              <Route path="/sdk-documentation" element={<SDKDocumentation />} />
              <Route path="/fraud-prevention" element={<FraudPrevention />} />
              <Route path="/live-demo" element={<LiveDemo />} />
              <Route path="/not-found" element={<NotFound />} />
              {/* New Routes for Updated Pages */}
              <Route path="/business" element={<Business />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/security-dashboard" element={<SecurityDashboard />} />
              <Route path="/webhooks" element={<Webhook />} />
              <Route path="/onboarding-demo" element={<OnboardingDemo />} />
              <Route path="/integration-examples" element={<IntegrationExamples />} />
              <Route path="/enterprise/features" element={<Features />} />
              <Route path="/enterprise-contact" element={<EnterpriseContact />} />
              <Route path="/demo" element={<DemoPage />} />
              <Route path="/solutions" element={<Solutions />} />
              <Route path="/solutions/:category" element={<CategoryPage />} />
              <Route path="/identity-verification" element={<IdentityVerification />} />
              <Route path="/biometric-verification" element={<BiometricVerification />} />
              <Route path="/escrow-services" element={<EscrowServices />} />
              <Route path="/website-integrity" element={<WebsiteIntegrityPage />} />
              <Route path="/kyb-verification" element={<KYBVerificationPage />} />
              <Route path="/aml-screening" element={<AMLScreeningPage />} />
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
