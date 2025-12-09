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
import { MessagesChat } from "./screens/MessagesChat";
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
import { SubscriptionManagement, SubscriptionSuccess, SubscriptionCancel } from "./screens/Subscriptions";
import ZendeskChat from "./components/ChatBot/ZendeskChat";


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
              <Route path="/compliances" element={<RegulatoryCompliances />} />
              <Route path="/terms" element={<TermsOfServices />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/training" element={<Training />} />
              <Route path="/consumer-protection" element={<ConsumerProtection />} />
              <Route path="/developer-center" element={<DeveloperCenter />} />
              <Route path="/api-documentation" element={<ApiReferences />} />
              <Route path="/fraud-prevention" element={<FraudPrevention />} />
              <Route path="/live-demo" element={<LiveDemo />} />
              
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
                path="/messages" 
                element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/messages-chat" 
                element={
                  <ProtectedRoute>
                    <MessagesChat />
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
                path="/id-verification" 
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
            </Routes>
          </Router>
          <ZendeskChat />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
