import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardContentReverse } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { CheckCircle2Icon } from "lucide-react";

const missionVisionValues = [
  {
    title: "Our Mission",
    description:
      "To create a world where every transaction is secure, transparent, and trustworthy. We empower businesses and individuals with cutting-edge fraud prevention technology that makes digital commerce safer for everyone.",
    image: "/card-image1.png",
    iconBg: "/background-18.svg",
  },
  {
    title: "Our Vision",
    description:
      "To be the global standard for trust and security in digital transactions. We envision a future where fraud is eliminated through intelligent prevention systems and verified identities.",
    image: "/card-image2.png",
    iconBg: "/background-19.svg",
  },
  {
    title: "Our Value",
    description:
      "Transparency in all operations\n Security-first approach\nCustomer-centric innovation\nEthical business practices\nGlobal accessibility",
    image: "/card-image3.png",
    iconBg: "/background-20.svg",
  },
];

const goalsData = [
  {
    icon: "/Launch.png",
    title: "Launch",
    subtitle: "2025 Platform Launch",
  },
  {
    icon: "/AI.png",
    title: "Ai First",
    subtitle: "Advanced Detection",
  },
  {
    icon: "/Global.png",
    title: "Global",
    subtitle: "Worldwide Coverage",
  },
  {
    icon: "/Trusted.png",
    title: "Trusted",
    subtitle: "Secure Platform",
  },
];

const certifications = [
  { name: "SOC 2 Type II", checked: true },
  { name: "ISO 27001", checked: true },
  { name: "PCI DSS", checked: true },
  { name: "GDPR", checked: true },
];

export const About = (): JSX.Element => {
  return (
    <main className="bg-white overflow-hidden w-full relative">
      <Header 
        backgroundImage = '/Header_About.png'
        content={{
          badge: {
            text: "WHO WE ARE",
            variant: "secondary"
          },
          title: "About TrustVerify",
          description: "We're building the future of secure transactions through innovative fraud prevention, identity verification, and escrow services that protect businesses and individuals worldwide.",
        }}
      />
      <section className="relative w-full overflow-hidden">
        <img
          className="absolute top-[367px] left-[-227px] w-[399px] h-[528px] z-0 pointer-events-none"
          alt="Nate shape"
          src="/nate-shape.svg"
        />
        <img
          className="absolute top-[184px] right-[101px] w-[30px] h-[30px]"
          alt="Icon star"
          src="/icon-star-1.svg"
        />
        <div className="flex flex-col items-center justify-between gap-12 md:gap-10 py-[100px] px-6 sm:px-10  mx-auto max-w-[1406px]">
          <div className="z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-12">
           <div className="flex flex-col gap-5 w-full  md:w-1/2 ">
            <Badge className="w-fit bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] h-[30px] rounded-[800px] px-[10px]">
              <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">
                OUR APPROACH
              </span>
            </Badge>
            <h2 className="text-[54px] tracking-[-0.27px] leading-[67px] [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold">
              <span className="text-[#003d2b]"> Customized Strategies For </span>
              <span className="text-[#0b3a78]"> Fraud Prevention. </span>
            </h2>
           </div>
           <div className="flex flex-col items-start md:items-end justify-between gap-5 w-full md:w-1/2 ">
            <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg tracking-[-0.20px] leading-7">
              Tailored solutions designed to address unique risks, empowering businesses with smarter protection.
            </p>
            <Button className="h-auto px-8 py-4 bg-app-primary hover:bg-app-primary/90 rounded-[10px] [font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-white text-lg">
              Contact US
            </Button>
           </div>
          </div>
          <div className="z-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12 md:gap-8 max-w-[1326px]">
          {missionVisionValues.map((item, index) => (
            <Card               
              key={index}            
              className="flex bg-white rounded-[20px] overflow-hidden border border-solid border-[#e4e4e4]"
            >
              <CardContentReverse className="flex flex-col justify-between h-full ">
                <div className="px-8 pt-10 pb-7 flex flex-col gap-4">
                  <div className="flex flex-col items-start gap-5">
                    <img
                      alt="badge"
                      src = {item.iconBg}
                    />
                    <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl tracking-[0] leading-6">
                      {item.title}
                    </h3>

                  </div>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-lg tracking-[-0.20px] leading-7">
                    {item.description}
                  </p>
                </div>
                <img
                  className="w-full"
                  src={item.image}
                  alt={item.title}
                />
              </CardContentReverse>
            </Card>
          ))}
          </div>
        </div>
      </section>
      <section className="relative w-full bg-[#f3f3f3] py-20">
        <img
          className="absolute bottom-[169px] left-[100px] w-[30px] h-[30px]"
          alt="Icon star"
          src="/icon-star.svg"
        />
        <div className="mx-auto px-6 sm:px-10 max-w-[1406px]">
          <div className="z-10 flex flex-col xl:flex-row items-center xl:items-start gap-24 justify-between">
              <div className="z-10 w-full  xl:w-1/2">
                <img className="w-full h-full object-cover" alt="Group" src="/subsection-image1.png" />
              </div>
              <div className="flex flex-col items-start gap-8 w-full xl:w-1/2">
                <Badge className="bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] h-[30px] rounded-[800px] px-[10px]">
                  <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">
                    TRUST PAGES
                  </span>
                </Badge>
                <div className="flex justify-between gap-4 items-center">
                  <img 
                  className="w-[51px] h-[51px]"
                    src="/logo1.png"
                  />
                  <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[54px] leading-[67px] tracking-[-0.27px] text-center">
                    <span className="text-[#003d2b]">Our </span>
                    <span className="text-[#0b3a78]">Story</span>
                  </h2>
                </div>
                <p className="z-10 [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg tracking-[-0.20px] leading-7">
                  Founded in 2025, TrustVerify was born from a simple observation:
                  traditional fraud prevention methods were failing to keep pace
                  with increasingly sophisticated cyber threats. Our founders,
                  veterans of the cybersecurity and fintech industries, recognized
                  the need for a comprehensive platform that could provide real-time
                  fraud detection, identity verification, and secure transaction
                  management.
                  <br />
                  <br />
                  Starting with a dedicated team of security experts and engineers,
                  we have developed advanced AI-powered fraud detection algorithms.
                  As a newly launched platform, we're building our customer base and
                  preparing to protect businesses globally with cutting-edge
                  security technology.
                  <br />
                  <br />
                  Our platform has evolved to include comprehensive identity
                  verification, secure escrow services, and advanced risk
                  intelligence, making us a one-stop solution for transaction
                  security and trust.
                </p>
              </div>
          </div>
        </div>
        <img
          className="absolute bottom-0 right-0 w-[213px] h-[199px]"
          alt="Decorative shape"
          src="/shape-nate-30-svg-fill.svg"
        />
      </section>

      <section className="relative w-full pt-24">
        <img
          className="absolute top-[345px] right-[-200px] w-[399px] h-[528px]"
          alt="Nate shape"
          src="/nate-shape-1.svg"
        />
        <img
          className="absolute top-[1320px] right-0 w-[287px] h-[682px]"
          alt="Nate shape"
          src="/nate-shape-2.png"
        />    
        <div className="mx-auto px-6 md:px-10 max-w-[1210px]">    
          <div className="w-full flex flex-col gap-5 items-center justify-between">
            <Badge className="bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] h-[30px] rounded-[800px] px-[10px]">
              <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">
                OUR GOALS
              </span>
            </Badge>
            <div className="w-full flex flex-col items-center gap-5">
              <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[54px] text-center tracking-[-0.27px] leading-[67px]">
                <span className="text-[#003d2b]">Our </span>
                <span className="text-[#0b3a78]">Goals</span>
                <span className="text-[#003d2b]"> And </span>
                <span className="text-[#27ae60]">Vision</span>
              </h2>

              <p className="max-w-5xl text-center [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg tracking-[-0.20px] leading-7">
                Driving innovation to eliminate fraud and build digital trust,
                while shaping a secure future for global intelligence and fraud
                prevention.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[17px] w-full mt-8">
                {goalsData.map((goal, index) => (
                  <Card
                    key={index}
                    className="z-10 bg-[#f6f6f6] rounded-[20px] border-0 shadow-none"
                  >
                    <CardContent className="flex items-center gap-[17px] p-6">
                      <img className="w-16 h-16" alt={goal.title} src={goal.icon} />

                      <div className="flex flex-col gap-[5px]">
                        <h3 className="[font-family:'DM_Sans_18pt-ExtraBold',Helvetica] font-extrabold text-[#040303] text-xl tracking-[0] leading-6">
                          {goal.title}
                        </h3>
                        <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base tracking-[0] leading-6">
                          {goal.subtitle}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full relative flex flex-col items-center gap-[19px] py-24 px-6 md:px-10 max-w-[1432px] mx-auto">
          <img
            className="absolute top-56 md:top-48 right-0 md:right-20 w-20 h-[107px] md:w-36 md:h-[191px]"
            alt="Vector"
            src="/Vector.png"
          />
            <Badge className="bg-[#003d2b1a] text-[#003d2b] px-6 py-2 rounded-full [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">
              OUR GOALS
            </Badge>
            <div className="z-10 w-full flex flex-col items-center gap-5">
              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[54px] text-center tracking-[-0.27px] leading-[67px] md:whitespace-nowrap">
                <span className="text-[#003d2b]">We'd Love To </span>
                <span className="text-[#0b3a78]">Hear</span>
                <span className="text-[#003d2b]"> From </span>
                <span className="text-[#27ae60]">You</span>
              </p>
              <p className="text-center [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg tracking-[-0.20px] leading-7">
                We have offices and teams from all around the world.
              </p>
            </div>
            <div className="z-20 pt-24">
              <img className="w-full bg-cover" alt="World map" src="/Map.png" />
            </div>
        </div>
      </section>
      <section className="relative w-full py-20">
        <div className="mx-auto px-6 md:px-10 max-w-[1406px]">
          <div className="flex flex-col xl:flex-row gap-24 justify-between">
            <div className="flex flex-col items-start gap-8 w-full xl:w-1/2">
              <Badge className="bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] h-[30px] rounded-[800px] px-[10px]">
                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">
                  TRUST PAGES
                </span>
              </Badge>
              <div className="flex justify-between gap-4 items-center">
                <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[54px] leading-[67px] tracking-[-0.27px] text-start">
                  <span className="text-[#0b3a78]">Certifications </span>
                  <span className="text-[#003d2b]">And Compliance</span>
                </h2>
              </div>
              <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg tracking-[-0.20px] leading-7">
                We adhere to internationally recognized certifications and compliance frameworks to ensure our operations meet the highest industry benchmarks. This commitment not only guarantees safety and reliability but also reinforces transparency with our clients and partners.
              </p>
              <div className="w-full grid grid-cols-2 grid-rows-2 gap-4">
                {certifications.map((cert, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2Icon className="w-5 h-5 text-[#00cc61]" />
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#003d2b] text-base tracking-[0] leading-[27.2px]">
                      {cert.name}
                    </span>
                  </div>
                ))}
              </div>

            </div>
            <div className="w-full xl:w-1/2">
                <img className="w-full h-full object-cover" alt="Group" src="/subsection-image2.png" />
            </div>
          </div>
        </div>
      </section>
      <Footer/>
    </main>
  );
};
