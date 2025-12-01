import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { Badge } from "../../../../components/ui/badge";
import { Card, CardContent } from "../../../../components/ui/card";

const testimonials = [
  {
    name: "Reynolds Anthony",
    avatar: "/Avatar2.png",
    date: "May 14, @TrustPilot",
    text: "\"For years, I've trusted Finto Insurance. Their attentive team consistently finds me the perfect coverage. I'm confident in their protection of assets.\"",
  },
  {
    name: "Tomasz Adam",
    avatar: "/Avatar3.png",
    date: "May 14, @TrustPilot",
    text: "\"For years, I've trusted Finto Insurance. Their attentive team consistently finds me the perfect coverage. I'm confident in their protection of assets.\"",
  },
  {
    name: "Tomasz Adam",
    avatar: "/Avatar2.png",
    date: "May 14, @TrustPilot",
    text: "\"For years, I've trusted Finto Insurance. Their attentive team consistently finds me the perfect coverage. I'm confident in their protection of assets.\"",
  },
  {
    name: "Tomasz Adam",
    avatar: "/Avatar3.png",
    date: "May 14, @TrustPilot",
    text: "\"For years, I've trusted Finto Insurance. Their attentive team consistently finds me the perfect coverage. I'm confident in their protection of assets.\"",
  },
];

const testimonials2 = [
  {
    name: "Eleanor Emily",
    avatar: "/Avatar1.png",
    date: "May 14, @TrustPilot",
    text: "\"For years, I've trusted Finto Insurance. Their attentive team consistently finds me the perfect coverage. I'm confident in their protection of assets.\"",
  },
  {
    name: "Eleanor Emily",
    avatar: "/Avatar2.png",
    date: "May 14, @TrustPilot",
    text: "\"For years, I've trusted Finto Insurance. Their attentive team consistently finds me the perfect coverage. I'm confident in their protection of assets.\"",
  },
  {
    name: "Eleanor Emily",
    avatar: "/Avatar1.png",
    date: "May 14, @TrustPilot",
    text: "\"For years, I've trusted Finto Insurance. Their attentive team consistently finds me the perfect coverage. I'm confident in their protection of assets.\"",
  },
  {
    name: "Eleanor Emily",
    avatar: "/Avatar1.png",
    date: "May 14, @TrustPilot",
    text: "\"For years, I've trusted Finto Insurance. Their attentive team consistently finds me the perfect coverage. I'm confident in their protection of assets.\"",
  },
];

const reviewPlatforms = [
  {
    logo:"client_c_logo1.png",
    rating: "5.0",
    reviews: "26 REVIEWS",
    topOffset: "top-0",
  },
  {
    logo:"client_c_logo2.png",
    rating: "4.8",
    reviews: "26 REVIEWS",
    topOffset: "top-[3px]",
  },
];

export const SectionComponentNodeSubsection = (): JSX.Element => {
  return (
    <section className="relative w-full pt-[120px] pb-[100px]">
      <div className="w-full grid grid-cols-1 xl:grid-cols-3 gap-[60px] max-w-[1290px] px-6 md:px-10 mx-auto">
        <div className="hidden xl:block relative h-[670px] overflow-hidden">
          <div className="flex flex-col items-center gap-8 absolute top-[-663px] left-[15px]">
            {testimonials.map((testimonial, index) => (
              <Card
                key={`testimonial-1-${index}`}
                className="w-full bg-white rounded-[10px] shadow-[0px_4px_10px_#003d2b1a]"
              >
                <CardContent className="p-[30px]">
                  <div className="flex items-start gap-[15px] mb-[31px]">
                    <Avatar className="w-[50px] h-[50px] bg-[#f3f3f3]">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback className="bg-[#f3f3f3]">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-[7px]">
                      <div className="[font-family:'Inter',Helvetica] font-normal text-[#003d2b] text-[15.5px] tracking-[0] leading-4">
                        {testimonial.name}
                      </div>
                      <div className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#6b6b6b] text-sm tracking-[0] leading-[21px]">
                        {testimonial.date}
                      </div>
                    </div>
                  </div>
                  <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-lg tracking-[-0.20px] leading-[27px]">
                    {testimonial.text}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="top-0 bg-[linear-gradient(0deg,rgba(255,255,255,0)_0%,rgba(255,255,255,1)_100%)] absolute w-full left-0 h-[100px] pointer-events-none z-10" />
          <div className="bottom-[-678px] bg-[linear-gradient(0deg,rgba(255,255,255,1)_0%,rgba(255,255,255,0)_100%)] absolute w-full left-0 h-[100px] pointer-events-none z-10" />
        </div>

        <div className="hidden xl:block relative h-[670px] overflow-hidden">
          <div className="flex flex-col items-center gap-8 absolute top-[15px] left-[15px]">
            {testimonials2.map((testimonial, index) => (
              <Card
                key={`testimonial-2-${index}`}
                className="w-full bg-white rounded-[10px] shadow-[0px_4px_10px_#003d2b1a]"
              >
                <CardContent className="p-[30px]">
                  <div className="flex items-start gap-[15px] mb-[31px]">
                    <Avatar className="w-[50px] h-[50px] bg-[#f3f3f3]">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback className="bg-[#f3f3f3]">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-[7px]">
                      <div className="[font-family:'Inter',Helvetica] font-normal text-[#003d2b] text-[15.9px] tracking-[0] leading-4">
                        {testimonial.name}
                      </div>
                      <div className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#6b6b6b] text-sm tracking-[0] leading-[21px]">
                        {testimonial.date}
                      </div>
                    </div>
                  </div>
                  <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-lg tracking-[-0.20px] leading-[27px]">
                    {testimonial.text}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="bottom-[-678px] bg-[linear-gradient(0deg,rgba(255,255,255,1)_0%,rgba(255,255,255,0)_100%)] absolute w-full left-0 h-[100px] pointer-events-none z-10" />
          <div className="top-0 bg-[linear-gradient(0deg,rgba(255,255,255,0)_0%,rgba(255,255,255,1)_100%)] absolute w-full left-0 h-[100px] pointer-events-none z-10" />
        </div>

        <div className="flex flex-col items-start gap-[50px] px-0 sm:px-10 md:px-20 xl:px-0 pt-0 lg:pt-10">
          <div className="flex flex-col items-start gap-[29px] w-full ">
            <div className="flex flex-col items-start gap-[21px] w-full">
              <Badge className="h-[30px] px-[10px] bg-[#003d2b1a] rounded-[800px] hover:bg-[#003d2b1a]">
                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm text-center tracking-[0] leading-[14px]">
                  OUR CLIENT FEEDBACK
                </span>
              </Badge>
              <p className="w-full [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-[52.2px] tracking-[-0.50px] leading-[67px]">
                Highly rated 4.9 out of 5 by 1200+ entrepreneurs just like synox
              </p>
            </div>
            <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#6b6b6b] text-lg tracking-[-0.20px] leading-7">
              Join the ranks of over 1200 entrepreneurs who have
              entrusted us with their insurance needs and our
              exceptional service firsthand.
            </p>
          </div>

          <div className="relative w-full h-[134.23px]">
            {reviewPlatforms.map((platform, index) => (
              <div
                key={`platform-${index}`}
                className={`absolute ${platform.topOffset} ${index === 0 ? "left-0" : "left-44"} w-[146px] ${index === 0 ? "h-[134px]" : "h-32"}`}
              >
                <img
                  className={`absolute top-0 left-0 w-[51px] ${index === 0 ? "h-[57px]" : "h-[51px]"} bg-cover bg-[50%_50%]`}
                  alt = "logo"
                  src = {platform.logo}
                />
                <div
                  className="flex gap-[4px] absolute left-0"
                  style={{ top: index === 0 ? "80px" : "74px" }}
                >
                  <img className="w-[18px] h-4" alt="Icon" src="/icon.svg" />
                  <img className="w-[18px] h-4" alt="Icon" src="/icon.svg" />
                  <img className="w-[18px] h-4" alt="Icon" src="/icon.svg" />
                  <img className="w-[18px] h-4" alt="Icon" src="/icon.svg" />
                  <img className="w-5 h-4" alt="Icon" src="/icon-4.svg" />
                </div>
                <div
                  className={`absolute ${index === 0 ? "top-[78px]" : "top-[72px]"} left-[121px] [font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-[#003d2b] text-base tracking-[0] leading-6 whitespace-nowrap`}
                >
                  {platform.rating}
                </div>
                <div
                  className={`absolute ${index === 0 ? "top-[107px]" : "top-[101px]"} left-0 [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-white text-lg tracking-[0] leading-[27px] whitespace-nowrap`}
                >
                  {platform.reviews}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="xl:hidden relative h-[670px] overflow-hidden">
          <div className="flex flex-col w-[340px] items-center gap-8 absolute -top-64 left-1/2 -translate-x-1/2">
            {testimonials2.map((testimonial, index) => (
              <Card
                key={`testimonial-2-${index}`}
                className="w-full bg-white rounded-[10px] shadow-[0px_4px_10px_#003d2b1a]"
              >
                <CardContent className="p-[30px]">
                  <div className="flex items-start gap-[15px] mb-[31px]">
                    <Avatar className="w-[50px] h-[50px] bg-[#f3f3f3]">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback className="bg-[#f3f3f3]">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-[7px]">
                      <div className="[font-family:'Inter',Helvetica] font-normal text-[#003d2b] text-[15.9px] tracking-[0] leading-4">
                        {testimonial.name}
                      </div>
                      <div className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#6b6b6b] text-sm tracking-[0] leading-[21px]">
                        {testimonial.date}
                      </div>
                    </div>
                  </div>
                  <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-lg tracking-[-0.20px] leading-[27px]">
                    {testimonial.text}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="bottom-[-678px] bg-[linear-gradient(0deg,rgba(255,255,255,1)_0%,rgba(255,255,255,0)_100%)] absolute w-full left-0 h-[100px] pointer-events-none z-10" />
          <div className="top-0 bg-[linear-gradient(0deg,rgba(255,255,255,0)_0%,rgba(255,255,255,1)_100%)] absolute w-full left-0 h-[100px] pointer-events-none z-10" />
        </div>
      </div>
    </section>
  );
};
