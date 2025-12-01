import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { Card, CardContent } from "../../components/ui/card";
import { ArrowRightIcon, CalendarIcon, TrendingUp, ChevronRight, StarIcon} from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";


const supportOptions = [
  {
    icon: "/security_icon.png",
    title: "Security Issues",
    description: "Report security vulnerabilities or concerns immediately",
    linkText: "Report Now",
  },
  {
    icon: "/community_icon.png",
    title: "Contact Support",
    description: "Get help from our expert team instantly.",
    linkText: "Start Chat",
  },
  {
    icon: "/livechat_icon.png",
    title: "Report An Issue",
    description:
      "Report technical problem and bugs related to platform.",
    linkText: "Report Issue",
  },
  {
    icon: "/livechat_icon.png",
    title: "Request Feature",
    description:
      "Suggest new features and improvements in the platform.",
    linkText: "Submit Request",
  },
];  

const articles = [
  {
    image: "/post-1.png",
    date: "15 Sep, 2024",
    title:
      "10 Essential Steps To Create\nfoolproof Financial Plan For\nlong-term Stability",
  },
  {
    image: "/post-2.png",
    date: "15 Sep, 2024",
    title:
      "Top 10 Financial Mistakes\nindividuals And Businesses\nshould Avoid In 2024",
  },
  {
    image: "/post-3.png",
    date: "15 Sep, 2024",
    title:
      "Mastering Budgeting Practical\nsteps To Ensure Your Financial\nsuccess",
  },
  {
    image: "/post-4.png",
    date: "15 Sep, 2024",
    title:
      "Understanding Cash Flow Key\nto Healthy Busines And\nfinancial Stability",
  },
];

const insightsData = [
  {
    icon: "/background-21.png",
    title: "Documentation",
    description:
      "Comprehensive guides and technical documentation for developers and users.",
    linkText: "Browse Docs",
    linkWidth: "w-[130.25px]",
    iconLeft: "left-[119px]",
  },
  {
    icon: "/background-22.png",
    title: "Community Form",
    description:
      "Connect with users, share experiences, adn get peer-to-peer support.",
    linkText: "Join Forum",
    linkWidth: "w-[130.25px]",
    iconLeft: "left-[103px]",
  },
  {
    icon: "/background-23.png",
    title: "Status Page",
    description:
      "Check real-time system status, schedules maintenance, and service updates.",
    linkText: "View Status",
    linkWidth: "w-[130.25px]",
    iconLeft: "left-[110px]",
  },
];


const clientImages = [
  { src: "/client-image1.png", alt: "Client 1" },
  { src: "/client-image2.png", alt: "Client 2" },
  { src: "/client-image3.png", alt: "Client 3" },
  { src: "/client-image4.png", alt: "Client 4" },
  { src: "/client-image5.png", alt: "Client 5" },
];

const faqItems = [
  {
    id: "item-1",
    question: "What services do you offer?",
    answer: null,
  },
  {
    id: "item-2",
    question: "How do I know if I need a financial consultant?",
    answer:
      "If you're uncertain about managing investments, planning for retirement, or structuring your finances, consulting a financial professional can help. Our team assists in clarifying your goals, optimizing your strategies.",
  },
  {
    id: "item-3",
    question: "What can I expect from an initial consultation?",
    answer: null,
  },
  {
    id: "item-4",
    question: "Are my consultations confidential?",
    answer: null,
  },
  {
    id: "item-5",
    question: "What kind of clients do you work with?",
    answer: null,
  },
];


export const HelpCenter = (): JSX.Element => {
  return (
    <main className="bg-white overflow-hidden w-full relative">
      <Header 
        backgroundImage = '/Header_Help.png'
        content={{
          badge: {
            text: "HELP & SUPPORT",
            variant: "secondary"
          },
          title: "Help Center",
          description: "Get in touch with our team of fraud prevention experts. We’re here to help you to secure your business and answer any questions about our platform.",
        }}
      />
      <section className="relative w-full overflow-hidden">
        <img
          className="absolute top-[184px] right-[101px] w-[30px] h-[30px]"
          alt="Icon star"
          src="/icon-star-1.svg"
        />
        <img
          className="absolute top-[56px] left-[-227px] w-[399px] h-[528px] pointer-events-none"
          alt="Nate shape"
          src="/nate-shape.svg"
        />
        <div className="max-w-[1197px] px-6 md:px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mx-auto gap-7 py-24">
          {supportOptions.map((option, index) => (
            <Card
              key={index}
              className="z-10 bg-[#f3f3f3] rounded-[10px] border-0 shadow-none"
            >
              <CardContent className="p-[26px] flex flex-col h-full">
                <img
                  className="w-[38px] h-[38px] mb-[22px]"
                  alt={option.title}
                  src={option.icon}
                />

                <h4 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-[17.4px] tracking-[0] leading-[22px] mb-2">
                  {option.title}
                </h4>

                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#6b6b6b] text-base tracking-[0] leading-6 mb-auto">
                  {option.description}
                </p>

                <button className="flex items-center gap-1 sm:gap-2.5 mt-[17px] text-app-secondary [font-family:'Inter',Helvetica] font-medium text-[15px] sm:text-[17.4px] tracking-[0] leading-[18px] hover:opacity-80 transition-opacity">
                  {option.linkText}
                  <ChevronRight className="w-[11.25px] h-[18px]" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <section className="relative w-full bg-[#f3f3f3] py-[52px]">
        <div className="container mx-auto max-w-[1270px] px-4">
          <div className="flex flex-col items-center gap-[50px]">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-[376px] w-full">
              <div className="flex flex-col w-full lg:w-[645px] items-start gap-5">
                <div className="flex flex-col items-start gap-5 w-full">
                  <Badge className="h-[30px] px-4 bg-[#003d2b1a] hover:bg-[#003d2b1a] rounded-[800px] border-0">
                    <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm tracking-[0] leading-[14px]">
                      POST / ARTICLES
                    </span>
                  </Badge>

                  <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[54px] tracking-[-0.50px] leading-[67px]">
                    <span className="text-[#0b3a78]">Fraud Prevention</span>
                    <span className="text-[#003d2b]">
                      {" "}
                      Insights Trends And Updates.
                    </span>
                  </h1>
                </div>

                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-lg tracking-[0] leading-[27px]">
                  Most frequently accessed help topics / articles.
                </p>
              </div>

              <Button className="h-14 px-6 bg-app-primary hover:bg-app-primary/90 rounded-[10px] whitespace-nowrap">
                <span className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-white text-lg tracking-[-0.20px] leading-[18px]">
                  View All Articles
                </span>
                <img
                  className="w-[30px] h-[30px] ml-2"
                  alt="Arrow"
                  src="/image.svg"
                />
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[30px] w-full">
              {articles.map((article, index) => (
                <article
                  key={index}
                  className="z-10 flex flex-col sm:flex-row items-center gap-[30px] w-full"
                >
                  <div
                    className="w-full sm:w-[295px] h-[251px] rounded-[20px] bg-cover bg-center flex-shrink-0"
                    style={{ backgroundImage: `url(${article.image})` }}
                  />

                  <div className="w-full flex flex-col justify-between flex-1 py-9">
                    <div className="w-full flex flex-col gap-5">
                      <div className="flex items-center gap-[4.6px]">
                        <CalendarIcon className="w-[14.36px] h-4 text-[#808080]" />
                        <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base tracking-[0] leading-[27.2px]">
                          {article.date}
                        </span>
                      </div>

                      <p className="[font-family:'Suisse_Intl-Medium',Helvetica] font-medium text-[#040303] text-xl tracking-[0] leading-7">
                        {article.title}
                      </p>
                    </div>

                    <div className="flex items-start justify-start gap-3 mt-6">
                      <span className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-app-primary text-lg tracking-[0] leading-[27.2px]">
                        Read More
                      </span>
                      <TrendingUp className="w-6 h-6 text-app-primary" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <img
          className="absolute left-0 bottom-0 w-[153px] h-[153px] md:w-[200px] md:h-[200px] xl:w-[307px] xl:h-[310px]"
          alt="Pattern"
          src="/pattern-1.svg"
        />

        <img
          className="absolute right-0 bottom-0  w-[153px] h-[153px] md:w-[200px] md:h-[200px] xl:w-[307px] xl:h-[310px]"
          alt="Pattern"
          src="/pattern.svg"
        />
      </section>

      <section className="relative w-full pt-14">
        <img
          className="absolute top-[184px] left-[100px] w-[30px] h-[30px] z-10 pointer-events-none"
          alt="Icon star"
          src="/icon-star.svg"
        />
        <img
          className="absolute top-[274px] -right-[222px] w-[439px] h-[653px] z-10 pointer-events-none"
          alt="shape"
          src="/shape_nate_31.png"
        />
        <div className="flex flex-col xl:flex-row px-6 md:px-10 items-center justify-center gap-9 w-full py-12">
        {insightsData.map((insight, index) => (
          <Card
            key={index}
            className="w-full max-w-[417px] h-[328px] bg-white rounded-[20px] overflow-hidden border border-solid border-[#e4e4e4] z-20"
          >
            <CardContent className="flex flex-col items-start gap-[22px] h-full justify-center px-9">
              <div className="flex flex-col items-start gap-[23px] w-full">
                <img
                  className="w-16 h-16"
                  alt={insight.title}
                  src={insight.icon}
                />

                <div className="flex flex-col items-start gap-4 w-full">
                  <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl tracking-[0] leading-6">
                    {insight.title}
                  </h3>

                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-lg tracking-[0] leading-[27px]">
                    {insight.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <button className="h-[18px] flex items-center gap-2 justify-center [font-family:'Inter',Helvetica] font-medium text-app-secondary text-[17.4px] tracking-[0] leading-[18px] whitespace-nowrap">
                  {insight.linkText}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      </section>
      <section className="relative w-full pb-24">
        <div className="flex flex-col w-full items-center px-6 md:px-10 gap-[60px] py-12">
          <header className="z-10 flex flex-col max-w-[1129px] items-center gap-[19px]">
            <Badge
              variant="secondary"
              className="bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-full px-4 py-1.5 h-[30px]"
            >
              <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm tracking-[0] leading-[14px]">
                FAQS
              </span>
            </Badge>

            <div className="flex flex-col items-center gap-5 w-full">
              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[54px] text-center tracking-[-0.27px] leading-[67px]">
                <span className="text-[#003d2b]">Your Most Frequently Asked </span>
                <span className="text-[#0b3a78]">Questions</span>
              </p>

              <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg text-center tracking-[-0.20px] leading-7">
                Find quick answers to common questions about TrustVerify.
              </p>
            </div>
          </header>

          <div className="flex flex-col lg:flex-row items-center gap-[30px] w-full max-w-[1270px]">
            <div className="relative w-full lg:w-1/2 flex-shrink-0">
              <div className="w-11/12 h-[400px] sm:h-[586px] rounded-[20px] bg-[url(/faq_image.png)] bg-cover bg-center" />

              <div className="absolute right-0 bottom-10 w-[140px] lg:w-[210px] bg-app-primary rounded-[10px] p-5 flex flex-col gap-5">
                <div className="flex flex-col items-center">
                  <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm lg:text-base text-white tracking-[0] leading-[30.6px]">
                    100+ Client
                  </span>

                  <div className="flex items-center gap-0.5 lg:gap-1">
                    <StarIcon className="w-4 h-4 text-white fill-white" />
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-white text-[10px] lg:text-base tracking-tighter leading-[20px] lg:leading-[30.6px] opacity-80">
                      5.0 (250 Reviews)
                    </span>
                  </div>
                </div>

                <div className="flex items-center">
                  {clientImages.map((client, index) => (
                    <div
                      key={index}
                      className={`w-8 h-8 rounded-full border border-[#004050] overflow-hidden flex items-center justify-center ${
                        index > 0 ? '-ml-2' : ''
                      }`}
                    >
                      <div
                        className="w-[30px] h-[30px] bg-cover bg-center"
                        style={{ backgroundImage: `url(${client.src})` }}
                      />
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full border border-[#004050] bg-white overflow-hidden flex items-center justify-center -ml-2">
                    <span className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-[#040303] text-xs tracking-[0] leading-[20.4px]">
                      17+
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="z-10 flex flex-col w-full lg:w-1/2 flex-shrink-0">
              <Accordion
                type="single"
                collapsible
                defaultValue="item-2"
                className="flex flex-col gap-[30px]"
              >
                {faqItems.map((item) => (
                  <AccordionItem
                    key={item.id}
                    value={item.id}
                    className="rounded-[10px] border border-[#e4e4e4] overflow-hidden data-[state=open]:border-app-primary"
                  >
                    <AccordionTrigger className="px-5 py-4 hover:no-underline data-[state=open]:bg-app-primary data-[state=open]:text-white data-[state=open]:border-b data-[state=open]:border-[#ffffff1a]">
                      <span className="[font-family:'Suisse_Intl-Medium',Helvetica] font-medium text-xl tracking-[0] leading-6 text-left">
                        {item.question}
                      </span>
                    </AccordionTrigger>
                    {item.answer && (
                      <AccordionContent className="px-5 py-5 bg-app-primary">
                        <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-white text-base tracking-[0] leading-[27.2px] opacity-80">
                          {item.answer}
                        </p>
                      </AccordionContent>
                    )}
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      <Footer/>
    </main>
  );
};
