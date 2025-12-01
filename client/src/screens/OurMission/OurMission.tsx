import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";
import { ChevronRightIcon, ClockIcon, MapPinIcon, CheckCircle2Icon } from "lucide-react";
import { ScrollArea } from "../../components/ui/scroll-area";

const features = [
  {
    icon: "/impact.png",
    title: "Meaningful Impact",
    description:
      "Protect billions in transactions and help create a more secure digital world.",
  },
  {
    icon: "/team.png",
    title: "World-Class Team",
    description:
      "Work alongside experts from Google, PayPal, Stripe, and leading security firms.",
  },
  {
    icon: "/tech.png",
    title: "Cutting-Edge Technology",
    description:
      "Build with the latest AI/ML, security, and cloud technologies at massive scale.",
  },
  {
    icon: "/reach.png",
    title: "Global Reach",
    description:
      "Your work impacts users and businesses across 190+ countries worldwide.",
  },
];

const benefitsData = [
  {
    title: "Health & Wellness",
    description:
      "Comprehensive health insurance, mental health support and wellness programs.",
    icon: "/benefit-icon1.png",
    hasBg: true,
  },
  {
    title: "Remote-first Culture",
    description:
      "Work from anywhere with flexible hours. Home office setup allowance and co-working stipends.",
    icon: "/benefit-icon2.png",
    hasBg: false,
  },
  {
    title: "Learning & Development",
    description:
      "Annual learning budget, conference attendance, certification reimbursements, and mentorship programs.",
    icon: "/benefit-icon3.png",
    hasBg: true,
  },
  {
    title: "Work-life Balance",
    description:
      "Unlimited PTO, parental leave, sabbatical options and flexible working arrangements.",
    icon: "/benefit-icon4.png",
    hasBg: false,
  },
  {
    title: "Equity & Compensation",
    description:
      "Competitive equity, salary participation, performance bonuses and comprehensive compensation reviews.",
    icon: "/benefit-icon5.png",
    hasBg: true,
  },
  {
    title: "Team Building",
    description:
      "Regular team events, and opportunities to connect with global colleagues.",
    icon: "/benefit-icon6.png",
    hasBg: false,
  },
];

const jobPositions = [
  {
    id: "01",
    title: "Senior Security Engineer",
    categories: [
      { label: "Engineering", color: "bg-[#27ae6033] text-[#27ae60]" },
      { label: "Fulltime", color: "bg-[#0b3a7833] text-[#0b3a78]" },
    ],
    location: "San Francisco, CA / Remote",
    type: "Full-time",
    description:
      "Lead the development of our next-generation fraud detection systems and security infrastructure.",
  },
  {
    id: "02",
    title: "Product Manager - Identity Verification",
    categories: [{ label: "Product", color: "bg-[#27ae6033] text-[#27ae60]" }],
    location: "Remote",
    type: "Full-time",
    description:
      "Drive product strategy for our KYC and identity verification platforms serving global markets.",
  },
  {
    id: "03",
    title: "Data Scientist - Ml/ai",
    categories: [
      { label: "Engineering", color: "bg-[#27ae6033] text-[#27ae60]" },
    ],
    location: "San Francisco, CA",
    type: "Full-time",
    description:
      "Build and optimize machine learning models for real-time fraud detection and risk assessment.",
  },
  {
    id: "04",
    title: "Data Scientist - Ml/ai",
    categories: [
      { label: "Engineering", color: "bg-[#27ae6033] text-[#27ae60]" },
    ],
    location: "San Francisco, CA",
    type: "Full-time",
    description:
      "Build and optimize machine learning models for real-time fraud detection and risk assessment.",
  },
  {
    id: "05",
    title: "Data Scientist - Ml/ai",
    categories: [
      { label: "Engineering", color: "bg-[#27ae6033] text-[#27ae60]" },
    ],
    location: "San Francisco, CA",
    type: "Full-time",
    description:
      "Build and optimize machine learning models for real-time fraud detection and risk assessment.",
  },
];

const diversityItems = [
  "Equal Opportunity Employer Committed To Diversity",
  "Employee Resource Groups And Mentorship Programs",
  "Inclusive Hiring Practices And Bias Training",
  "Support For Underrepresented Communities In Tech",
];

const growthItems = [
  "Clear Career Progression Paths And Regular Reviews",
  "Internal Mobility And Cross-functional Opportunities",
  "Leadership Development And Management Training",
  "External Conference Speaking And Thought Leadership",
];


const processSteps = [
  {
    number: "1",
    icon: "/apply.png",
    title: "Apply",
    description:
      "Submit your application through our careers page. We review every application carefully.",
  },
  {
    number: "2",
    icon: "/screen.png",
    title: "Screen",
    description:
      "Initial phone or video call with our talent team to discuss your background and interests.",
  },
  {
    number: "3",
    icon: "/team.png",
    title: "Interview",
    description:
      "Technical and behavioral interviews with team members and hiring managers.",
  },
  {
    number: "4",
    icon: "/offer.png",
    title: "Offer",
    description:
      "Reference checks, offer discussion, and welcome to the TrustVerify team!",
  },
];

const arrows = [
  {
    src: "/arrow.png",
    className: "absolute w-[8.59%] h-[5.64%] top-0 left-[19.63%] hidden xl:block",
  },
  {
    src: "/arrow.png",
    className: "absolute w-[8.59%] h-[5.64%] top-0 left-[71.37%] hidden xl:block",
  },
  {
    src: "/arrow1.png",
    className: "absolute w-[8.59%] h-[5.64%] top-[94.06%] left-[45.62%] hidden xl:block",
  },
];

export const OurMission = (): JSX.Element => {
  return (
    <main className="bg-white overflow-hidden w-full relative flex flex-col">
      <Header 
        backgroundImage = '/Header_Mission.png'
        content={{
          badge: {
            text: "OUR MISSION",
            variant: "secondary"
          },
          title: "Join Our Mission",
          description: "Help us build the future of secure transactions. Join a team of world-class engineers, product leaders and security experts working to eliminate fraud and create trust in digital commerce.",
        }}
      />

      <section className="flex flex-col w-full items-center gap-9 py-24 relative">
        <img
          className="absolute top-[187px] right-24 w-[30px] h-[30px]"
          alt="Icon star"
          src="/icon-star-1.svg"
        />
        <div className="z-10 flex flex-col w-full max-w-[418px] items-center gap-5">
          <Badge className="bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] h-[30px] px-4 rounded-[800px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm tracking-[0] leading-[14px]">
            WHY CHOOSE US
          </Badge>

          <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[54px] text-center tracking-[-0.27px] leading-[67px] whitespace-nowrap">
            <span className="text-[#003d2b]">Why </span>
            <span className="text-[#0b3a78]">Trust</span>
            <span className="text-[#27ae60]">Verify?</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-[1232px] px-4">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-none bg-transparent">
              <CardContent className="flex flex-col items-center gap-5 p-0">
                <img
                  className="h-16 w-16"
                  alt={feature.title}
                  src={feature.icon}
                />
                <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl tracking-[0] leading-7 text-center">
                  {feature.title}
                </h3>
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base text-center tracking-[0] leading-[27px]">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      
      <section className="w-full relative overflow-hidden bg-app-primary py-20">
          <img
            className="absolute top-[164px] right-[134px] w-[30px] h-[30px] text-white" 
            alt="Icon star"
            src="/icon-star-2.svg"
          />

          <img
            className="absolute right-0 bottom-0 w-[191px] h-[173px] opacity-15"
            alt="Shape nate"
            src="/shape-nate-30-svg-fill.svg"
          />

          <img
            className="absolute top-0 -left-[222px] w-[439px] h-[653px] opacity-15"
            alt="shape"
            src="/shape_nate_32.png"
          />

          <img
            className="absolute bottom-[93px] left-[191px] w-[30px] h-[30px]"
            alt="Icon star"
            src="/icon-star-3.svg"
          />
  
          <div className="z-10 relative flex flex-col max-w-[1270px] mx-auto items-center gap-[60px] px-6 md:px-10">
            <header className="flex flex-col max-w-[1129px] items-center gap-[19px]">
              <Badge className="bg-[#ffffff1a] text-white text-sm font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] tracking-[0] leading-[14px] h-[30px] px-6 rounded-[800px] border-0 hover:bg-[#ffffff1a]">
                BENEFITS
              </Badge>

              <div className="flex flex-col items-center gap-5 w-full">
                <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[54px] text-center tracking-[-0.27px] leading-[67px]">
                  <span className="text-white">Exclusive </span>
                  <span className="text-[#27ae60]">Benefits &amp; Perks</span>
                  <span className="text-white"> with TrustVerify</span>
                </h2>

                <p className="max-w-[1055px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-white text-lg text-center tracking-[-0.20px] leading-7">
                  Unlock a world of protection, credibility, and growth with every
                  feature we offer. From trust badges to advanced fraud prevention,
                  we ensure your business thrives with confidence.
                </p>
              </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 sm:gap-4 lg:gap-0 w-full">
              {benefitsData.map((benefit, index) => (
                <Card
                  key={index}
                  className={`w-full h-[280.56px] rounded-[20px] border-0 ${
                    benefit.hasBg ? "bg-[#ffffff1a]" : "bg-transparent"
                  }`}
                >
                  <CardContent className="relative h-full p-10">
                    <div className={`w-[50px] h-[50px] border-0 rounded-lg p-2 flex items-center justify-center ${
                    benefit.hasBg ? "bg-app-primary" : "bg-[#ffffff1a]"
                    }`}
                  >
                      <img
                        className="w-7 h-7"
                        alt={benefit.title}
                        src={benefit.icon}
                      />
                    </div>
                    <h3 className="absolute top-[120px] left-10 [font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-white text-xl tracking-[0] leading-6 whitespace-nowrap">
                      {benefit.title}
                    </h3>

                    <p className="absolute top-[162px] left-10 max-w-[343px] opacity-80 [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-white text-base tracking-[0] leading-[27.2px]">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
      </section>
      
      <section className="w-full relative overflow-hidden">
        <img
          className="absolute bottom-[310px] left-40 w-[30px] h-[30px]"
          alt="Icon star"
          src="/icon-star.svg"
        />
        <img
          className="absolute top-44 -right-[200px] w-[400px] h-[528px]"
          alt="Nate shape"
          src="/nate-shape-1.svg"
        />
        <div className="flex flex-col lg:flex-row items-start gap-[50px] w-full max-w-[1326px] mx-auto px-6 md:px-10 py-24">
          <div className="flex flex-col w-full items-start gap-[41px]">
            <header className="flex flex-col items-start gap-5 w-full">
              <Badge className="h-[30px] px-6 bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-full [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">
                JOIN US NOW
              </Badge>

              <h2 className="flex items-center justify-center w-full [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[46px] tracking-[-0.92px] leading-[55.2px]">
                <span className="text-[#003d2b] tracking-[-0.42px]">Open </span>
                <span className="text-[#0b3a78] tracking-[-0.42px]">Positions</span>
              </h2>

              <p className="flex items-center justify-center w-full [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg tracking-[0] leading-[27.2px]">
                Discover exciting career opportunities where your skills can shine.
                Join our team and grow with a culture built on innovation and trust.
              </p>
            </header>

            <div className="relative w-full pr-4">
                <img
                  className="w-full h-full object-cover"
                  alt="Office workspace"
                  src="/subsection-image4.png"
                />            
            </div>
          </div>
          <ScrollArea className="w-full h-[798px]">
            <div className="flex flex-col w-full items-start gap-[23px] pr-4">
              {jobPositions.map((job) => (
                <Card
                  key={job.id}
                  className="w-full bg-[#f6f6f6] rounded-[20px] border-0 overflow-hidden"
                >
                  <CardContent className="relative p-0">
                    <div className="absolute bottom-[30px] right-[27px] flex items-center justify-center [-webkit-text-stroke:1px_#808080] opacity-15 [font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-transparent text-[100px] tracking-[3.00px] leading-[120px]">
                      {job.id}
                    </div>

                    <div className="flex flex-col w-full max-w-[560px] items-start gap-5 p-[30px_41px]">
                      <div className="flex flex-col items-start gap-3.5 w-full">
                        <div className="flex flex-col w-full max-w-[448px] items-start gap-4">
                          <div className="flex items-center gap-[15px] w-full flex-wrap">
                            <h3 className="flex items-center justify-center [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl tracking-[0] leading-6">
                              {job.title}
                            </h3>

                            <div className="inline-flex items-center gap-2.5">
                              {job.categories.map((category, index) => (
                                <Badge
                                  key={index}
                                  className={`${category.color} h-auto px-3.5 py-2 rounded-full [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm hover:${category.color}`}
                                >
                                  {category.label}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="inline-flex items-center gap-5 flex-wrap">
                            <div className="inline-flex items-center gap-[5px]">
                              <MapPinIcon className="w-4 h-4 text-[#003d2b]" />
                              <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#003d2b] text-base tracking-[0] leading-6 whitespace-nowrap">
                                {job.location}
                              </span>
                            </div>

                            <div className="inline-flex items-center gap-[5px]">
                              <ClockIcon className="w-4 h-4 text-[#003d2b]" />
                              <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#003d2b] text-base tracking-[0] leading-6 whitespace-nowrap">
                                {job.type}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="flex items-center justify-center w-full [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base tracking-[0] leading-6">
                          {job.description}
                        </p>
                      </div>

                      <a
                        href="#"
                        className="inline-flex items-center gap-2 [font-family:'Inter',Helvetica] font-medium text-app-secondary text-[17.4px] tracking-[0] leading-[18px] hover:opacity-80 transition-opacity"
                      >
                        Apply Now
                        <ChevronRightIcon className="w-5 h-5" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

      </section>
      
      <section className="relative w-full bg-[#f4f4f4] py-16">
        <div className="container mx-auto px-6 md:px-10 max-w-[1270px]">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="z-10 flex flex-col w-full items-start gap-6">
              <div className="flex flex-col items-start gap-5 w-full">
                <Badge className="bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-full px-4 py-2 h-auto">
                  <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">
                    OUR CULTURE
                  </span>
                </Badge>

                <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[46px] leading-[55.2px] tracking-[-0.92px]">
                  <span className="text-[#003d2b]">Work </span>
                  <span className="text-[#0b3a78]">Environment</span>
                </h2>

                <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg leading-[27.2px]">
                  At TrustVerify, we believe that diverse teams build better
                  products. We&#39;re committed to creating an inclusive
                  environment where everyone can do their best work and grow their
                  careers.
                </p>
              </div>

              <div className="flex flex-col md:flex-row items-start gap-[53px] w-full">
                <div className="flex flex-col w-full md:w-[257px] items-start gap-6">
                  <img
                    className="w-14 h-14"
                    alt="Diversity and Inclusion"
                    src="/icon-group1.png"
                  />

                  <div className="flex flex-col items-start gap-5 w-full">
                    <h3 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] text-[#040303] font-semibold text-xl leading-6">
                      Diversity &amp; Inclusion
                    </h3>

                    <div className="flex flex-col items-start gap-[19px] w-full">
                      {diversityItems.map((item, index) => (
                        <div key={index} className="flex items-start gap-2.5">
                          <CheckCircle2Icon className="w-5 h-5 text-[#00cc61] flex-shrink-0 mt-0.5" />
                          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm leading-[23px]">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col w-full md:w-[257px] items-start gap-6">
                  <img
                    className="w-14 h-14"
                    alt="Professional Growth"
                    src="/icon-group2.png"
                  />

                  <div className="flex flex-col items-start gap-5 w-full">
                    <h3 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] text-[#040303] font-semibold text-xl leading-6">
                      Professional Growth
                    </h3>

                    <div className="flex flex-col items-start gap-[19px] w-full">
                      {growthItems.map((item, index) => (
                        <div key={index} className="flex items-start gap-2.5">
                          <CheckCircle2Icon className="w-5 h-5 text-[#00cc61] flex-shrink-0 mt-0.5" />
                          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm leading-[23px]">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="z-10 w-full">
              <img className="w-full h-full object-cover" alt="Group" src="/subsection-image3.png" />
            </div>
          </div>
        </div>

        <img
          className="absolute left-0 bottom-px w-[153px] h-[153px] md:w-[200px] md:h-[200px] xl:w-[307px] xl:h-[310px]"
          alt="Pattern"
          src="/pattern-1.svg"
        />

        <img
          className="absolute top-0 right-0 w-[153px] h-[153px] md:w-[200px] md:h-[200px] xl:w-[307px] xl:h-[310px]"
          alt="Pattern" 
          src="/pattern-2.svg"
        />
      </section>
      
      <section className="w-full relative overflow-hidden">
        <img
          className="absolute top-0 -left-[222px] w-[439px] h-[653px]"
          alt="shape"
          src="/shape_nate_32.png"
        />
        <div className="flex flex-col w-full items-center gap-[50px] py-12 px-6 md:px-10">
          <div className="flex flex-col items-center gap-[19px]">
            <Badge className="bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-full px-4 py-2 h-auto">
              <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">
                HIRING PROCESS
              </span>
            </Badge>

            <div className="flex flex-col items-center gap-5 w-full">
              <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[54px] text-center tracking-[-0.27px] leading-[67px]">
                <span className="text-[#003d2b]">Our Application </span>
                <span className="text-[#0b3a78]">Process</span>
              </h2>

              <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg text-center tracking-[-0.20px] leading-7">
                Our streamlined hiring process is designed to be transparent and
                respectful of your time
              </p>
            </div>
          </div>

          <div className="relative w-full max-w-[1177px]">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 justify-items-center gap-[50px] py-10">
              {processSteps.map((step, index) => (
                <Card
                  key={index}
                  className="w-[257px] h-[279px] bg-[#f3f3f3] rounded-[20px] border-0"
                >
                  <CardContent className="p-0 relative h-full">
                    <div className="absolute top-[calc(50.00%-110px)] left-[calc(50.00%-102px)] w-24 h-16">
                      <div className="absolute top-7 left-[calc(50.00%+16px)] w-8 h-8 flex items-center justify-center bg-[#27ae60] rounded-[26843500px]">
                        <span className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-white text-sm tracking-[0] leading-5">
                          {step.number}
                        </span>
                      </div>

                      <img
                        className="absolute top-0 left-0 w-16 h-16"
                        alt={`${step.title} icon`}
                        src={step.icon}
                      />
                    </div>

                    <div className="flex flex-col w-[218px] items-start gap-4 absolute top-[114px] left-[26px]">
                      <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-[17.4px] tracking-[0] leading-[22px]">
                        {step.title}
                      </h3>

                      <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base tracking-[0] leading-6">
                        {step.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {arrows.map((arrow, index) => (
              <img
                key={index}
                className={arrow.className}
                alt="Arrow"
                src={arrow.src}
              />
            ))}
          </div>
        </div>

      </section>
      <Footer/>
    </main>
  );
};
