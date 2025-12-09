import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export const SEO = ({
  title = "TrustVerify - Secure Fraud Prevention & Identity Verification Platform",
  description = "TrustVerify provides comprehensive fraud prevention, identity verification (KYC/AML), trust scoring, and secure escrow services. Protect your business with advanced cybersecurity solutions.",
  keywords = "fraud prevention, identity verification, KYC, AML, trust scoring, escrow services, cybersecurity, fintech, secure transactions",
  ogImage = "https://trustverify.online/logo.png",
  ogType = "website",
  canonicalUrl,
  noindex = false,
  nofollow = false,
}: SEOProps) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, attribute: string = "name") => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Basic meta tags
    updateMetaTag("description", description);
    updateMetaTag("keywords", keywords);

    // Robots meta
    const robotsContent = [
      noindex ? "noindex" : "index",
      nofollow ? "nofollow" : "follow",
    ].join(", ");
    updateMetaTag("robots", robotsContent);

    // Open Graph tags
    updateMetaTag("og:title", title, "property");
    updateMetaTag("og:description", description, "property");
    updateMetaTag("og:image", ogImage, "property");
    updateMetaTag("og:type", ogType, "property");
    updateMetaTag("og:url", canonicalUrl || window.location.href, "property");
    updateMetaTag("og:site_name", "TrustVerify", "property");

    // Twitter Card tags
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", title);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:image", ogImage);
    updateMetaTag("twitter:site", "@trustverify");
    updateMetaTag("twitter:creator", "@trustverify");

    // Additional SEO meta tags
    updateMetaTag("author", "TrustVerify");
    updateMetaTag("theme-color", "#003366");
    updateMetaTag("format-detection", "telephone=no");

    // Canonical URL
    let canonicalLink = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", canonicalUrl || window.location.href);

    // Structured Data (JSON-LD) - Organization
    const organizationData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "TrustVerify",
      url: "https://trustverify.online",
      logo: "https://trustverify.online/logo.png",
      description: description,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+1-809-120-705",
        contactType: "Customer Service",
        email: "info@trustverify.com",
        areaServed: "Worldwide",
        availableLanguage: ["en"],
      },
      sameAs: [
        "https://www.linkedin.com/company/trustverify",
        "https://www.facebook.com/trustverify",
        "https://www.instagram.com/trustverify",
        "https://twitter.com/trustverify",
      ],
      address: {
        "@type": "PostalAddress",
        addressCountry: "GB",
      },
    };

    // WebSite Structured Data
    const websiteData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "TrustVerify",
      url: "https://www.trustverify.co.uk",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://www.trustverify.co.uk/search?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    };

    // Service Structured Data
    const serviceData = {
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: "Fraud Prevention & Identity Verification",
      provider: {
        "@type": "Organization",
        name: "TrustVerify",
      },
      areaServed: {
        "@type": "Country",
        name: "Worldwide",
      },
      description: description,
      offers: {
        "@type": "Offer",
        priceCurrency: "GBP",
        availability: "https://schema.org/InStock",
      },
    };

    // Remove existing structured data
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach((script) => script.remove());

    // Add Organization structured data
    const orgScript = document.createElement("script");
    orgScript.type = "application/ld+json";
    orgScript.text = JSON.stringify(organizationData);
    document.head.appendChild(orgScript);

    // Add WebSite structured data
    const websiteScript = document.createElement("script");
    websiteScript.type = "application/ld+json";
    websiteScript.text = JSON.stringify(websiteData);
    document.head.appendChild(websiteScript);

    // Add Service structured data
    const serviceScript = document.createElement("script");
    serviceScript.type = "application/ld+json";
    serviceScript.text = JSON.stringify(serviceData);
    document.head.appendChild(serviceScript);
  }, [title, description, keywords, ogImage, ogType, canonicalUrl, noindex, nofollow]);

  return null;
};

