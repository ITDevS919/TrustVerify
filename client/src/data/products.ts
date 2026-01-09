import { 
    Shield, 
    Eye, 
    CreditCard, 
    Users, 
    AlertTriangle, 
    PoundSterling, 
    FileText, 
    Smartphone, 
    Globe, 
    Database, 
    Zap, 
    UserCheck, 
    Lock, 
    Activity, 
    TrendingUp, 
    Building, 
    Code, 
    BarChart3, 
    Phone, 
    Mail, 
    Briefcase,
    PiggyBank,
    Headphones,
    FileCheck,
    Gavel,
    Star,
    Wallet,
    ShoppingBag,
    Plane,
    Coins,
    Building2
  } from "lucide-react";
  
  export interface Product {
    id: string;
    name: string;
    description: string;
    icon: any;
    features: string[];
    pricing?: {
      tier?: string;
      price?: string;
      period?: string;
    };
    cta: {
      text: string;
      href: string;
    };
    category: string;
    popular?: boolean;
    new?: boolean;
  }
  
  export interface ProductCategory {
    id: string;
    name: string;
    description: string;
    icon: any;
    products: Product[];
  }
  
  export const productCategories: ProductCategory[] = [
    {
      id: "identity-protection",
      name: "Identity Protection",
      description: "Comprehensive personal data and credit monitoring solutions",
      icon: Shield,
      products: [
        {
          id: "credit-monitoring",
          name: "Credit Monitoring",
          description: "Real-time credit score tracking with instant alerts for changes and suspicious activity",
          icon: TrendingUp,
          features: [
            "Real-time credit score updates",
            "Dark web monitoring",
            "Identity theft alerts",
            "Credit report analysis"
          ],
          pricing: {
            tier: "Premium",
            price: "£9.99",
            period: "month"
          },
          cta: {
            text: "Start Monitoring",
            href: "/pricing"
          },
          category: "identity-protection",
          popular: true
        },
        {
          id: "id-vault",
          name: "ID Vault",
          description: "Secure digital wallet for storing and managing personal identification documents",
          icon: Lock,
          features: [
            "Encrypted document storage",
            "Biometric access control",
            "Secure sharing capabilities",
            "Automatic expiry alerts"
          ],
          pricing: {
            tier: "Protect",
            price: "£14.99",
            period: "month"
          },
          cta: {
            text: "Secure Your ID",
            href: "/pricing"
          },
          category: "identity-protection"
        },
        {
          id: "open-banking-alerts",
          name: "Open Banking Alerts",
          description: "Monitor bank account activity and receive instant notifications for unusual transactions",
          icon: Activity,
          features: [
            "Real-time transaction monitoring",
            "Unusual spending alerts",
            "Account takeover protection",
            "Multi-bank integration"
          ],
          pricing: {
            tier: "Total",
            price: "£19.99",
            period: "month"
          },
          cta: {
            text: "Connect Banks",
            href: "/pricing"
          },
          category: "identity-protection",
          new: true
        }
      ]
    },
    {
      id: "fraud-prevention",
      name: "Fraud Prevention",
      description: "Advanced fraud detection and prevention for individuals and businesses",
      icon: Eye,
      products: [
        {
          id: "business-account-protection",
          name: "Business Account Protection",
          description: "Enterprise-grade fraud protection for business accounts and transactions",
          icon: Building,
          features: [
            "Multi-layered fraud detection",
            "Employee access monitoring",
            "Transaction verification",
            "Real-time risk scoring"
          ],
          pricing: {
            tier: "Essential",
            price: "£499",
            period: "month"
          },
          cta: {
            text: "Protect Business",
            href: "/business"
          },
          category: "fraud-prevention"
        },
        {
          id: "risk-scoring",
          name: "Risk Scoring Engine",
          description: "AI-powered risk assessment for transactions, users, and business relationships",
          icon: BarChart3,
          features: [
            "Machine learning algorithms",
            "Custom risk parameters",
            "Real-time scoring",
            "Historical analysis"
          ],
          pricing: {
            tier: "Professional",
            price: "£999",
            period: "month"
          },
          cta: {
            text: "Get API Access",
            href: "/developers"
          },
          category: "fraud-prevention"
        },
        {
          id: "api-verification",
          name: "API Verification Suite",
          description: "Comprehensive API endpoints for email, phone, and identity verification",
          icon: Code,
          features: [
            "Email validation API",
            "Phone verification API",
            "Document verification",
            "Biometric authentication"
          ],
          pricing: {
            tier: "Enterprise",
            price: "",
            period: ""
          },
          cta: {
            text: "View Documentation",
            href: "/api-documentation"
          },
          category: "fraud-prevention",
          popular: true
        },
        {
          id: "website-scanner",
          name: "Website Security Scanner",
          description: "Automated security scanning and fraud detection for websites and domains",
          icon: Globe,
          features: [
            "Malware detection",
            "Phishing identification",
            "SSL certificate monitoring",
            "Domain reputation scoring"
          ],
          pricing: {
            tier: "Premium",
            price: "£9.99",
            period: "month"
          },
          cta: {
            text: "Scan Website",
            href: "/developers/demo"
          },
          category: "fraud-prevention"
        }
      ]
    },
    {
      id: "recovery-insurance",
      name: "Recovery & Insurance",
      description: "Comprehensive fraud recovery and insurance protection services",
      icon: PiggyBank,
      products: [
        {
          id: "fraud-insurance",
          name: "Fraud Insurance",
          description: "Financial protection against fraud losses with up to £5,000 coverage",
          icon: PoundSterling,
          features: [
            "Up to £5,000 fraud coverage",
            "Identity theft reimbursement",
            "Legal expense coverage",
            "24/7 claims support"
          ],
          pricing: {
            tier: "Total",
            price: "£19.99",
            period: "month"
          },
          cta: {
            text: "Get Coverage",
            href: "/pricing"
          },
          category: "recovery-insurance",
          popular: true
        },
        {
          id: "dispute-support",
          name: "Dispute Resolution Support",
          description: "Expert assistance with fraud disputes and financial recovery processes",
          icon: Gavel,
          features: [
            "Expert dispute management",
            "Legal document preparation",
            "Bank communication support",
            "72-hour resolution process"
          ],
          pricing: {
            tier: "Protect",
            price: "£14.99",
            period: "month"
          },
          cta: {
            text: "Get Support",
            href: "/pricing"
          },
          category: "recovery-insurance"
        },
        {
          id: "white-glove-recovery",
          name: "White-Glove Recovery",
          description: "Premium recovery service with dedicated fraud specialists and concierge support",
          icon: Headphones,
          features: [
            "Dedicated fraud specialist",
            "24/7 concierge support",
            "Full recovery management",
            "Priority processing"
          ],
          pricing: {
            tier: "Total",
            price: "£19.99",
            period: "month"
          },
          cta: {
            text: "Premium Support",
            href: "/pricing"
          },
          category: "recovery-insurance",
          new: true
        }
      ]
    },
    {
      id: "business-services",
      name: "Business Services",
      description: "Enterprise-grade fraud protection and compliance solutions for businesses",
      icon: Briefcase,
      products: [
        {
          id: "api-integrations",
          name: "API Integration Suite",
          description: "Complete fraud prevention APIs for seamless business integration",
          icon: Zap,
          features: [
            "RESTful API endpoints",
            "Webhook notifications",
            "Custom integration support",
            "99.99% uptime SLA"
          ],
          pricing: {
            tier: "Essential",
            price: "£499",
            period: "month"
          },
          cta: {
            text: "View API Docs",
            href: "/api-documentation"
          },
          category: "business-services"
        },
        {
          id: "compliance-scoring",
          name: "Compliance Scoring",
          description: "Automated compliance scoring and regulatory reporting for financial institutions",
          icon: FileCheck,
          features: [
            "Automated compliance checks",
            "Regulatory reporting",
            "Risk assessment scoring",
            "Audit trail generation"
          ],
          pricing: {
            tier: "Professional",
            price: "£999",
            period: "month"
          },
          cta: {
            text: "Compliance Demo",
            href: "/developers/demo"
          },
          category: "business-services"
        },
        {
          id: "custom-solutions",
          name: "Custom Solutions",
          description: "Tailored fraud prevention solutions designed for specific industry requirements",
          icon: Star,
          features: [
            "Custom algorithm development",
            "Industry-specific rules",
            "Dedicated support team",
            "White-label options"
          ],
          pricing: {
            tier: "Custom",
            price: "Contact Sales",
            period: ""
          },
          cta: {
            text: "Contact Sales",
            href: "/enterprise-contact"
          },
          category: "business-services"
        }
      ]
    },
    {
      id: "fintech",
      name: "Fintech & Banking",
      description: "Comprehensive fraud prevention and compliance solutions for financial technology companies",
      icon: CreditCard,
      products: [
        {
          id: "payment-fraud-detection",
          name: "Payment Fraud Detection",
          description: "Advanced fraud detection for payment processing and transactions",
          icon: Eye,
          features: [
            "Real-time transaction monitoring",
            "Machine learning algorithms",
            "Card fraud prevention",
            "Chargeback reduction"
          ],
          pricing: {
            tier: "Professional",
            price: "£999",
            period: "month"
          },
          cta: {
            text: "View Demo",
            href: "/developers/demo"
          },
          category: "fintech"
        },
        {
          id: "open-banking-security",
          name: "Open Banking Security",
          description: "Secure API integration and monitoring for open banking platforms",
          icon: Lock,
          features: [
            "API security monitoring",
            "Consent management",
            "Data encryption",
            "Compliance automation"
          ],
          pricing: {
            tier: "Essential",
            price: "£499",
            period: "month"
          },
          cta: {
            text: "Learn More",
            href: "/developers"
          },
          category: "fintech",
          new: true
        }
      ]
    },
    {
      id: "marketplaces",
      name: "Marketplaces & Sharing Economy",
      description: "Trust and safety solutions for online marketplaces and sharing economy platforms",
      icon: ShoppingBag,
      products: [
        {
          id: "transaction-protection",
          name: "Transaction Protection",
          description: "Secure escrow and payment protection for marketplace transactions",
          icon: Shield,
          features: [
            "Escrow services",
            "Payment verification",
            "Dispute resolution",
            "Fraud prevention"
          ],
          pricing: {
            tier: "Essential",
            price: "£499",
            period: "month"
          },
          cta: {
            text: "Learn More",
            href: "/secure-escrow"
          },
          category: "marketplaces"
        },
        {
          id: "trust-scoring",
          name: "Trust & Safety Scoring",
          description: "AI-powered trust scoring for users and transactions on marketplace platforms",
          icon: TrendingUp,
          features: [
            "User behavior analysis",
            "Transaction risk scoring",
            "Reputation management",
            "Automated moderation"
          ],
          pricing: {
            tier: "Enterprise",
            price: "£1,999+",
            period: "month"
          },
          cta: {
            text: "View Demo",
            href: "/developers/demo"
          },
          category: "marketplaces"
        }
      ]
    },
    {
      id: "ecommerce",
      name: "eCommerce & Retail",
      description: "Fraud prevention and identity verification solutions for online retail businesses",
      icon: ShoppingBag,
      products: [
        {
          id: "guest-checkout-verification",
          name: "Guest Checkout Verification",
          description: "Identity verification for guest checkout without account creation",
          icon: UserCheck,
          features: [
            "Email verification",
            "Phone verification",
            "Address validation",
            "Quick verification flow"
          ],
          pricing: {
            tier: "Essential",
            price: "£499",
            period: "month"
          },
          cta: {
            text: "Learn More",
            href: "/developers"
          },
          category: "ecommerce"
        },
        {
          id: "account-takeover-protection",
          name: "Account Takeover Protection",
          description: "Protect customer accounts from unauthorized access and fraudulent activity",
          icon: Lock,
          features: [
            "Login anomaly detection",
            "Multi-factor authentication",
            "Session monitoring",
            "Automated threat response"
          ],
          pricing: {
            tier: "Enterprise",
            price: "£1,999+",
            period: "month"
          },
          cta: {
            text: "View Demo",
            href: "/developers/demo"
          },
          category: "ecommerce",
          new: true
        }
      ]
    },
    {
      id: "travel",
      name: "Travel & Hospitality",
      description: "Identity verification and fraud prevention for travel and hospitality businesses",
      icon: Plane,
      products: [
        {
          id: "traveler-verification",
          name: "Traveler Identity Verification",
          description: "Verify traveler identities for bookings and check-ins",
          icon: UserCheck,
          features: [
            "Passport verification",
            "ID document scanning",
            "Age verification",
            "Watchlist screening"
          ],
          pricing: {
            tier: "Professional",
            price: "£999",
            period: "month"
          },
          cta: {
            text: "Get Started",
            href: "/kyc-verification"
          },
          category: "travel",
          popular: true
        },
        {
          id: "booking-fraud-prevention",
          name: "Booking Fraud Prevention",
          description: "Detect and prevent fraudulent bookings and reservations",
          icon: Eye,
          features: [
            "Fake booking detection",
            "Payment fraud prevention",
            "Duplicate booking detection",
            "Chargeback protection"
          ],
          pricing: {
            tier: "Essential",
            price: "£499",
            period: "month"
          },
          cta: {
            text: "Learn More",
            href: "/fraud-prevention"
          },
          category: "travel"
        },
        {
          id: "loyalty-program-security",
          name: "Loyalty Program Security",
          description: "Protect loyalty programs from fraud and abuse",
          icon: Star,
          features: [
            "Points fraud detection",
            "Account security",
            "Redemption verification",
            "Anomaly detection"
          ],
          pricing: {
            tier: "Enterprise",
            price: "£1,999+",
            period: "month"
          },
          cta: {
            text: "View Demo",
            href: "/developers/demo"
          },
          category: "travel"
        }
      ]
    }
  ];
  
  export const getAllProducts = (): Product[] => {
    return productCategories.flatMap(category => category.products);
  };
  
  export const getProductsByCategory = (categoryId: string): Product[] => {
    const category = productCategories.find(cat => cat.id === categoryId);
    return category ? category.products : [];
  };
  
  export const getProductById = (productId: string): Product | undefined => {
    return getAllProducts().find(product => product.id === productId);
  };
  
  export const getCategoryById = (categoryId: string): ProductCategory | undefined => {
    return productCategories.find(category => category.id === categoryId);
  };