import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { TrendingUp, ArrowRightIcon } from "lucide-react";

const contactCards = [
  {
    id: 1,
    backgroundImage: "/sub-image6.png",
    icon: "/call.png",
    title: "Call Us Any Time!",
    description: "Speak directly with our support team for urgent issues!",
    details: [{ label: "UK:", value: "+44 20 7123 4567" }],
    footer: "24/7 emergency support available",
  },
  {
    id: 2,
    backgroundImage: "/sub-image7.png",
    icon: "/mail.png",
    title: "Send Us E-mail",
    description:
      "Get Help with your account, technical issues, or general inquiries",
    details: [
      { label: "General:", value: "hello@trustverify.com" },
      { label: "Sales:", value: "Sales@trustverify.com" },
    ],
    footer: null,
  },
  {
    id: 3,
    backgroundImage: "/sub-image8.png",
    icon: "/time.png",
    title: "Response Time",
    description: "Our commitment to fast, reliable support",
    details: [
      { label: "General Inquiries:", value: "< 24 hour" },
      { label: "Technical Support:", value: "< 4 hours" },
      { label: "Sales Question:", value: "< 2 hours" },
    ],
    footer: null,
  },
];

const buttons = [
  {
    label: "Enterprise Sales",
    variant: "default" as const,
    className:
      "bg-white text-app-primary hover:bg-white/90 [font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-[10px] sm:text-sm md:text-base lg:text-lg tracking-[-0.20px] rounded-lg",
  },
  {
    label: "Partnership Opportunities",
    variant: "outline" as const,
    className:
      "border-white text-white hover:bg-white/10 [font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-[10px] sm:text-sm md:text-base lg:text-lg tracking-[-0.20px] bg-transparent rounded-lg",
  },
];

const supportOptions = [
  {
    icon: "/security_icon.png",
    title: "Security Issues",
    description: "Report security vulnerabilities or concerns immediately",
    linkText: "Report Now",
  },
  {
    icon: "/community_icon.png",
    title: "Community Form",
    description: "Connect with other users and get help from the community",
    linkText: "View Community",
  },
  {
    icon: "/livechat_icon.png",
    title: "LIve Chat",
    description:
      "Get instant help from our support team during business hours.",
    linkText: "Start Chat",
  },
];  


export const ContactUS = (): JSX.Element => {
  return (
    <main className="bg-white overflow-hidden w-full relative">
      <Header 
        backgroundImage = '/Header_Contact.png'
        content={{
          badge: {
            text: "REACH US NOW",
            variant: "secondary"
          },
          title: "Contact US",
          description: "Get in touch with our team of fraud prevention experts. We’re here to help you to secure your business and answer any questions about our platform.",
        }}
      />
      <section className="relative w-full overflow-hidden">
        <img
          className="absolute top-[120px] right-[110px] w-[30px] h-[30px]"
          alt="Icon star"
          src="/icon-star-1.svg"
        />
        <img
          className="absolute top-[484px] left-[100px] w-[30px] h-[30px]"
          alt="Icon star"
          src="/icon-star.svg"
        />
        <div className="flex flex-col xl:flex-row items-center gap-6 py-24 w-full px-6 md:px-10 max-w-[1408px] mx-auto justify-between">
          {contactCards.map((card) => (
            <Card
              key={card.id}
              className="relative w-full max-w-[382px] h-[424.5px] bg-white rounded-[20px] overflow-hidden border border-solid border-[#e4e4e4]"
            >
              <div
                className="absolute w-full top-0 left-0 h-[237px] bg-cover bg-[50%_50%]"
                style={{ backgroundImage: `url(${card.backgroundImage})` }}
              />

              <CardContent className="w-full flex flex-col items-center gap-[22px] absolute top-[196px]">
                <img
                  className="relative w-[74px] h-[74px]"
                  alt={card.title}
                  src={card.icon}
                />

                <div className="flex flex-col items-center gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="flex flex-col items-center gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
                    <div className="flex flex-col items-center gap-[5px] relative self-stretch w-full flex-[0_0_auto]">
                      <h3 className="relative flex items-center justify-center self-stretch mt-[-1.00px] [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl text-center tracking-[0] leading-6">
                        {card.title}
                      </h3>

                      <p className="relative flex items-center justify-center self-stretch [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base text-center tracking-[0] leading-[27px]">
                        {card.description}
                      </p>
                    </div>

                    <div className="flex flex-col items-center gap-[5px] relative">
                      {card.details.map((detail, index) => (
                        <div
                          key={index}
                          className="relative flex items-center justify-center [font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-normal text-[#808080] text-base text-center tracking-[0] leading-[27px]"
                        >
                          <span className="font-semibold">{detail.label}</span>
                          <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica]">
                            {" "}
                            {detail.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {card.footer && (
                    <p className="relative flex items-center justify-center self-stretch [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xs text-center tracking-[0] leading-[27px]">
                      {card.footer}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="relative w-full overflow-hidden">
        <img
          className="absolute top-[-119px] left-[100px] w-[30px] h-[30px]"
          alt="Icon star"
          src="/icon-star.svg"
        />
        <img
          className="absolute top-[1323px] left-0 w-[222px] h-[653px]"
          alt="Line flow"
          src="/line-flow.svg"
        />
        <div className="relative w-full px-6 md:px-10 flex justify-between bg-[#f4f4f4] py-[69px]">
          <div className="div mx-auto  flex flex-col xl:flex-row items-center gap-[97px] max-w-[1370px]">
            <img
              className="w-full object-cover rounded-lg"
              alt="Contact us representative"
              src="/group-form.png"
            />

            <div className="flex flex-col w-full max-w-[635px] gap-[19px]">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-5 max-w-[552px]">
                    <Badge className="w-fit bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-full px-4 py-1.5 h-auto">
                      <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm tracking-[0] leading-[14px]">
                        GET IN TOUCH
                      </span>
                    </Badge>

                    <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[54px] tracking-[-0.92px] leading-[67px]">
                      <span className="text-[#003d2b] tracking-[-0.50px]">
                        Send
                      </span>
                      <span className="text-[#0b3a78] tracking-[-0.50px]">
                        &nbsp;
                      </span>
                      <span className="text-[#003d2b] tracking-[-0.50px]">
                        Us A
                      </span>
                      <span className="text-[#0b3a78] tracking-[-0.50px]">
                        {" "}
                        Message
                      </span>
                    </h1>
                  </div>

                  <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg tracking-[0] leading-[27px]">
                    Have questions or need assistance? Reach out to us today!
                    We&#39;re here to provide expert solutions and friendly support.
                  </p>
                </div>

                <div className="z-10 flex flex-col gap-[21px] max-w-[610px]">
                  <div className="flex flex-col sm:flex-row gap-[30px]">
                    <Input
                      placeholder="First name"
                      className="flex h-[51px] bg-white rounded-md [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base"
                    />
                    <Input
                      placeholder="Last name"
                      className="flex h-[51px] bg-white rounded-md [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-[30px]">
                    <Input
                      placeholder="Phone No."
                      className="flex h-[51px] bg-white rounded-md [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base"
                    />
                    <Input
                      placeholder="E-mail Address"
                      className="flex h-[51px] bg-white rounded-md [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base"
                    />
                  </div>

                  <Textarea
                    placeholder="Message"
                    className="h-[127px] bg-white rounded-md [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base resize-none"
                  />
                </div>
              </div>

              <Button className="w-[215px] h-14 bg-app-primary hover:bg-app-primary/90 rounded-[10px]">
                <span className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-white text-lg tracking-[-0.20px] leading-[18px]">
                  Send Message
                </span>
                <TrendingUp className="ml-2 w-[30px] h-[30px]" />
              </Button>
            </div>
          </div>

          <img
            className="absolute bottom-0 right-0 w-[213px] h-[199px]"
            alt="Decorative shape"
            src="/shape-nate-30-svg-fill.svg"
          />
        </div>

      </section>

      <section className="relative w-full overflow-hidden">
        <div className="max-w-[1406px] mx-auto px-6 md:px-10 py-24">
          <Card className="relative w-full bg-app-primary rounded-[20px] shadow-[0px_4px_10px_#003d2b1a] border-0 overflow-hidden">
            <img
              className="absolute top-0 left-0 w-full h-full object-cover"
              alt="Background pattern"
              src="/message-form.png"
            />
            <CardContent className="relative flex flex-col items-center justify-center gap-[31px] px-4 py-[57px]">
              <div className="flex flex-col w-full max-w-[1053px] items-start gap-5">
                <p className="w-full [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-white text-2xl lg:text-[40px] text-center tracking-[-0.50px] leading-[20px] md:leading-[67px]">
                  Enterprise &amp; Partnership Opportunities
                </p>

                <p className="w-full [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-white text-sm md:text-base lg:text-[22px] text-center tracking-[0] md:leading-[30px]">
                  Looking for enterprise solutions or interested in partnering with
                  TrustVerify? Our Business development team is ready to discuss
                  custom solutions.
                </p>
              </div>

              <div className="flex items-center gap-5 flex-wrap justify-center">
                {buttons.map((button, index) => (
                  <Button
                    key={index}
                    variant={button.variant}
                    className={button.className}
                  >
                    {button.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>


      <section className="relative w-full overflow-hidden">
        <img
          className="absolute bottom-[218px] left-[225px] w-[30px] h-[30px]"
          alt="Icon star"
          src="/icon-star-1.svg"
        />
        <img
          className="absolute top-[102px] right-[95px] w-[30px] h-[30px]"
          alt="Icon star"
          src="/icon-star.svg"
        />
        <img
          className="absolute top-0 -left-[222px] w-[439px] h-[653px]"
          alt="shape"
          src="/shape_nate_32.png"
        />
        <div className="flex flex-col w-full items-center gap-9 px-6 md:px-10">
          <header className="z-10 flex flex-col max-w-[1129px] items-center gap-5">
            <div className="flex flex-col max-w-[710px] items-center gap-[19px]">
              <Badge
                variant="secondary"
                className="bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-full px-5 py-1.5 h-[30px]"
              >
                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm tracking-[0] leading-[14px]">
                  NEED HELP?
                </span>
              </Badge>

              <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[54px] text-center tracking-[-0.92px] leading-[67px]">
                <span className="text-[#003d2b] tracking-[-0.50px]">
                  Additional{" "}
                </span>
                <span className="text-[#0b3a78] tracking-[-0.50px]">Support</span>
                <span className="text-[#003d2b] tracking-[-0.50px]"> Options</span>
              </h2>
            </div>

            <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg text-center tracking-[-0.20px] leading-7 max-w-full">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </header>

          <div className="z-10 flex flex-col lg:flex-row items-start gap-[30px] w-full max-w-[1290px]">
            <Card className="flex-1 bg-white rounded-[10px] border-0 shadow-sm">
              <CardContent className="p-[30px]">
                <img
                  className="w-[106px] h-[107px] mb-[29px]"
                  alt="Group"
                  src="/logo1.png"
                />

                <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-[24.9px] tracking-[-0.50px] leading-8 mb-2.5">
                  New to TrustVerify?
                </h3>

                <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#6b6b6b] text-lg tracking-[-0.20px] leading-7 mb-[38px]">
                  Our TrustVerify team is happy to help you with all things
                  regarding Security.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {supportOptions.map((option, index) => (
                    <Card
                      key={index}
                      className="bg-[#f3f3f3] rounded-[10px] border-0 shadow-none"
                    >
                      <CardContent className="p-[26px] flex flex-col h-[244px]">
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

                        <button className="flex items-center gap-2.5 mt-[17px] text-app-secondary [font-family:'Inter',Helvetica] font-medium text-[17.4px] tracking-[0] leading-[18px] hover:opacity-80 transition-opacity">
                          {option.linkText}
                          <ArrowRightIcon className="w-[11.25px] h-[18px]" />
                        </button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="w-full lg:w-[410px] h-[516px] rounded-[14px] overflow-hidden border-0 shadow-sm relative">
              <CardContent className="p-0 h-full relative">
                <img
                  src="/background.png"
                  alt="Background"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute w-full h-[60%] top-[40%] left-0 bg-[linear-gradient(0deg,rgba(39,174,96,1)_0%,rgba(0,61,43,1)_50%,rgba(0,61,43,0)_100%)]" />

                <div className="absolute inset-0 flex flex-col items-center justify-end pb-[30px] px-[30px]">
                  <h3 className="[font-family:'Inter',Helvetica] font-normal text-white text-[23.4px] text-center tracking-[0] leading-8 mb-[15px]">
                    Already a customer?
                  </h3>

                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-white text-lg text-center tracking-[0] leading-[26px] mb-[27px] max-w-[331px]">
                    Make a claim, manage your security concerns or ask a question.
                  </p>

                  <Button className="w-full h-[50px] bg-[#003d2b] hover:bg-[#003d2b]/90 rounded-[10px] text-white">
                    <span className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-lg tracking-[-0.20px] leading-[18px]">
                      Log In
                    </span>
                    <img
                      className="w-[30px] h-[30px] ml-2.5"
                      alt="Arrow"
                      src="/image.svg"
                    />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <Footer/>
    </main>
  );
};
