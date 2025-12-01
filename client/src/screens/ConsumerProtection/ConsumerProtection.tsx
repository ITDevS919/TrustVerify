import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

const services = [
  {
    icon: "/background-5.svg",
    title: "Trustverify Personal Monitor",
    subtitle: "24/7 Identity & Dark Web Surveillance",
    description:
      "Continuous monitoring of your personal information across the dark web and breach databases.",
    features: [
      "Dark web credential monitoring",
      "Data breach alert system",
      "Social media profile monitoring",
      "Public records surveillance",
    ],
  },
  {
    icon: "/background-2.svg",
    title: "Trustverify Credit Guardian",
    subtitle: "Complete Credit & Financial Protection",
    description:
      "Advanced credit monitoring with real-time alerts and identity theft protection.",
    features: [
      "3-bureau credit monitoring",
      "Identity theft alerts",
      "Credit score tracking",
      "Financial account monitoring",
    ],
  },
  {
    icon: "/background.svg",
    title: "Trustverify Digital Vault",
    subtitle: "Secure Personal Document Storage",
    description:
      "Military-grade encryption for your important documents with biometric access control.",
    features: [
      "End-to-end encryption storage",
      "Biometric authentication",
      "Secure document sharing",
      "Emergency access recovery",
    ],
  },
  {
    icon: "/background-3.svg",
    title: "Trustverify Mobile Shield",
    subtitle: "Smartphone & Device Security",
    description:
      "Comprehensive mobile device protection against scams, malware, and privacy threats.",
    features: [
      "Real-time scam call blocking",
      "SMS phishing protection",
      "App security auditing",
      "Wi-Fi safety monitoring",
    ],
  },
  {
    icon: "/background-4.svg",
    title: "Trustverify Web Guardian",
    subtitle: "Browse & Online Shopping Protection",
    description:
      "Safe browsing protection with real-time website verification and shopping security.",
    features: [
      "Malicious website blocking",
      "Shopping site verification",
      "Privacy protection tools",
      "Safe download scanning",
    ],
  },
  {
    icon: "/background-1.svg",
    title: "Trustverify Family Plus",
    subtitle: "Family-Wide Security Protection",
    description:
      "Comprehensive family protection plan covering all members with centralized monitoring and control.",
    features: [
      "Up to 6 family members",
      "Parental monitoring tools",
      "Centralized security dashboard",
      "Family emergency response",
    ],
  },
];

export const ConsumerProtection = (): JSX.Element => {
  return (
    <main className="bg-white overflow-hidden w-full relative">
      <Header 
        backgroundImage = '/Header_Customer.png'
        content={{
          title: "Consumer Protection Demo",
          description: "Experience our personal security solutions. Safeguard your identity, finances, and digital life with advanced consumer protection tools designed for the modern world.",
          tags: ["IDENTITY MONITORING", "PERSONAL PROTECTION", "REAL-TIME ANALYSIS"],
          maxWidth: "930px",
        }}
      />
      <section className="w-full relative flex flex-col items-center gap-[60px] bg-[#f4f4f4] py-24">
        <img
          className="absolute top-[145px] right-[101px] w-[30px] h-[30px]"
          alt="Icon star"
          src="/icon-star-1.svg"
        />
        <img
          className="absolute bottom-[634px] left-[100px] w-[30px] h-[30px]"
          alt="Icon star"
          src="/icon-star.svg"
        />
        <img
          className="absolute top-[527px] -right-[222px] w-[439px] h-[653px] z-10 pointer-events-none"
          alt="shape"
          src="/shape_nate_31.png"
        />
        <img
          className="absolute top-[74px] -left-[227px] w-[399px] h-[528px]"
          alt="Nate shape"
          src="/nate-shape.svg"
        />
        <div className="z-10 flex flex-col max-w-[968px] px-6 md:px-10 items-center gap-5">
            <div className="flex flex-col items-center gap-5 w-full">
              <Badge
                variant="secondary"
                className="bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-full px-6 py-1.5 [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm tracking-[0] leading-[14px]"
              >
                SECURITY SERVICES
              </Badge>

              <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[54px] text-center tracking-[-0.27px] leading-[67px]">
                <span className="text-[#003d2b]">Personal </span>
                <span className="text-[#0b3a78]">Security</span>
                <span className="text-[#003d2b]"> Services</span>
              </h2>
            </div>

            <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-center tracking-[-0.20px] leading-7 text-[#808080] text-lg">
              Comprehensive personal protection solutions. Advanced security for
              individuals and families.
            </p>
        </div>

        <div className="flex flex-col items-start gap-9 w-full max-w-[1404px] px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9 w-full">
            {services.map((service, index) => (
              <Card
                key={index}
                className="z-10 bg-white rounded-[20px] border border-solid border-[#e4e4e4] overflow-hidden"
              >
                <CardContent className="p-9">
                  <div className="flex flex-col items-start gap-5">
                    <div className="flex flex-col items-start gap-5 w-full">
                      <div className="flex items-start gap-4">
                        <img
                          className="w-16 h-16 flex-shrink-0"
                          alt={service.title}
                          src={service.icon}
                        />

                        <div className="flex flex-col items-start gap-[5px] flex-1">
                          <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl tracking-[0] leading-6">
                            {service.title}
                          </h3>

                          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-lg tracking-[0] leading-[27px]">
                            {service.subtitle}
                          </p>
                        </div>
                      </div>

                      <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-lg tracking-[0] leading-[27px]">
                        {service.description}
                      </p>
                    </div>

                    <div className="flex flex-col items-start gap-[15px] w-full">
                      <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-app-primary text-lg tracking-[0] leading-[27px]">
                        Key Features:
                      </p>

                      <ul className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-lg tracking-[0] leading-[30px] list-none">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div className="z-10 px-6 md:px-10">
          <Card className="w-full bg-app-primary rounded-[20px] shadow-[0px_4px_10px_#003d2b1a] border-0 max-w-[1290px] mx-auto mt-24">
            <CardContent className="flex flex-col lg:flex-row items-center gap-[54px] py-12 px-14">
              <div className="flex w-full flex-col items-start gap-[31px]">
                <div className="flex flex-col items-start gap-2.5 w-full">
                  <h2 className="mt-[-1.00px] text-white text-[40px] tracking-[-0.50px] leading-[67px] flex items-center justify-center [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold">
                    Try Our Consumer Protection Tool
                  </h2>

                  <p className="flex items-center justify-center [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-white text-[22px] tracking-[0] leading-[30px]">
                    Enter any email, phone number, website, or company name to check fraud risk and protect yourself.
                  </p>
                </div>
                <div className="flex items-center gap-0 w-full max-w-[637px]">
                    <Input
                      type="email"
                      placeholder="Enter Your Email, phone, website etc..."
                      className="flex-1 h-[59px] rounded-[10px_0px_0px_10px] border-[#ffffff33] border-r-0 bg-transparent text-white placeholder:text-white placeholder:opacity-80 [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-base opacity-80"
                    />
                    <Button className="h-[59px] rounded-[0px_10px_10px_0px] bg-app-secondary hover:bg-app-secondary/90">
                      <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Check for fraud</span>
                      <img className="w-full h-full" alt="Button" src="/button.svg" />
                    </Button>
                </div>
              </div>

              <img
                className="mt-[29px] w-[293px] h-[263px]"
                alt="Frame"
                src="/frame.svg"
              />
            </CardContent>
          </Card>
        </div>

      </section>
      <Footer/>
    </main>
  );
};
