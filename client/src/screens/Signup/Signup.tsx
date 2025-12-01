import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../hooks/use-auth";
import { useToast } from "../../hooks/use-toast";

const socialLogins = [
  {
    icon: "/google.svg",
    label: "Google",
  },
  {
    icon: "/github.svg",
    label: "Github",
  },
  {
    icon: "/apple.svg",
    label: "Apple",
  },
  {
    icon: "/facebook.svg",
    label: "Facebook",
  },
];

export const Signup = (): JSX.Element => {
  const navigate = useNavigate();
  const { user, registerMutation } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    if (!agreedToTerms) {
      toast({
        title: "Error",
        description: "Please agree to the Terms of Service",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await registerMutation.mutateAsync({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
      });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'github' | 'facebook' | 'apple') => {
    // Use the proxy path which will be forwarded to the backend server
    // The Vite proxy is configured to forward /auth/* to http://localhost:5000
    // If you get a 404, ensure:
    // 1. Backend server is running on port 5000
    // 2. Vite dev server is running (restart if needed)
    // 3. OAuth credentials are configured in backend .env
    console.log(`Initiating ${provider} OAuth...`);
    window.location.href = `/auth/${provider}`;
  };

  return (
    <main className="bg-white overflow-hidden w-full relative">
      <div className="w-full max-w-[1700px] mx-auto flex items-center justify-between xl:gap-10 2xl:gap-36 px-6 sm:px-28 py-16">
        <div className="w-full xl:w-2/5 flex flex-col gap-[72px] items-start justify-between py-36">
          <div className="flex items-center justify-between">
            <Link to="/">
              <img
                className="w-60 h-12 cursor-pointer"
                alt="Group"
                src="/logo2.png"
              />
            </Link>
          </div>
          <form onSubmit={handleSubmit} className="w-full flex flex-col justify-center items-start">
             <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[32px] leading-auto text-[#003D2B]">
                Sign Up To Dashboard
            </p>
            <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[16px] leading-[24px] text-[#808080]">
                Hey, Create your new account to enjoy TrustVerify Services.
            </p>

            <div className="flex flex-col items-start gap-6 w-full flex-[0_0_auto] pt-6">
              <div className="grid grid-cols-2 grid-rows-2 xl:grid-cols-4 xl:grid-rows-1 gap-3 w-full">
                {socialLogins.map((social, index) => {
                  const providerMap: Record<number, 'google' | 'github' | 'apple' | 'facebook' | null> = {
                    0: 'google',
                    1: 'github',
                    2: 'apple',
                    3: 'facebook'
                  };
                  const provider = providerMap[index];
                  
                  return (
                    <Button
                      key={index}
                      type="button"
                      onClick={provider ? () => handleSocialLogin(provider) : undefined}
                      disabled={!provider}
                      className="flex h-11 items-center justify-center gap-2 px-10 py-2.5 relative flex-1 grow bg-[#f6f6f6] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#e8e8e8] transition-colors"
                    >
                      <img
                        className="relative w-[18px] h-[18px]"
                        alt={social.label}
                        src={social.icon}
                      />
                      <span className="relative w-fit [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm tracking-[0] leading-5 whitespace-nowrap">
                        {social.label}
                      </span>
                    </Button>
                  );
                })}
              </div>

              <div className="flex h-5 items-center gap-4 relative self-stretch w-full">
                <div className="w-full h-px bg-slate-200"></div>
                <span className="relative flex items-center justify-center w-fit mt-[-1.00px] font-body-small-reguler font-[number:var(--body-small-reguler-font-weight)] text-[#808080] text-[length:var(--body-small-reguler-font-size)] tracking-[var(--body-small-reguler-letter-spacing)] leading-[var(--body-small-reguler-line-height)] whitespace-nowrap [font-style:var(--body-small-reguler-font-style)]">
                  Or
                </span>
                <div className="w-full h-px bg-slate-200"></div>
              </div>
            </div>
            <div className="flex flex-col items-start gap-6 w-full pt-9">
              <div className="flex items-center justify-between gap-4">
                <div className="flex w-full flex-col gap-3">
                  <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[16px] leading-auto text-[#003D2B]">
                    First Name
                  </span>
                  <div className="flex h-[50px] items-center gap-2.5 px-5 py-[15px] relative self-stretch w-full bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4]">
                    <img
                      className="w-4 h-4 absolute top-4 left-4"
                      alt="first name"
                      src="/user-left-01.png"
                      />
                    <input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="Enter Your First Name"
                      className="w-full ml-6 [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base focus:outline-none focus:ring-0"
                    />
                  </div>
                </div>
                <div className="flex w-full flex-col gap-3">
                  <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[16px] leading-auto text-[#003D2B]">
                    Last Name
                  </span>
                  <div className="flex h-[50px] items-center gap-2.5 px-5 py-[15px] relative self-stretch w-full bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4]">
                    <img
                      className="w-4 h-4 absolute top-4 left-4"
                      alt="last name"
                      src="/user-right-01.png"
                      />
                    <input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Enter Your Last Name"
                      className="w-full ml-6 [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base focus:outline-none focus:ring-0"
                    />
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-col gap-3">
                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[16px] leading-auto text-[#003D2B]">
                  Email Address
                </span>
                <div className="flex h-[50px] items-center gap-2.5 px-5 py-[15px] relative self-stretch w-full bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4]">
                  <img
                    className="w-4 h-4 absolute top-4 left-4"
                    alt="email"
                    src="/fi_646094.svg"
                    />
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter Your Email Address"
                    className="w-full ml-6 [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base focus:outline-none focus:ring-0"
                    required
                  />
                </div>
              </div>
              <div className="flex w-full flex-col gap-3">
                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[16px] leading-auto text-[#003D2B]">
                  Password
                </span>
                <div className="flex h-[50px] items-center gap-2.5 px-5 py-[15px] relative self-stretch w-full bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4]">
                  <img
                    className="w-4 h-4 absolute top-4 left-4"
                    alt="password"
                    src="/lock-password.svg"
                    />
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter Your Password"
                    className="w-full ml-6 [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base focus:outline-none focus:ring-0"
                    required
                  />
                </div>
              </div>
              <div className="flex items-start justify-center gap-2">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-4 h-4 bg-app-primary mt-1"
                  />
                  <p className="w-full [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[14px] leading-auto text-[#808080] ">By creating an account, you agree to the <Link to="/terms"><u className="text-[#27AE60]">Terms of Service.</u></Link>  We'll occasionally send you account-related emails.</p>
              </div>
              <div className="flex w-full flex-col gap-3">
                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[16px] leading-auto text-[#003D2B]">
                  Username
                </span>
                <div className="flex h-[50px] items-center gap-2.5 px-5 py-[15px] relative self-stretch w-full bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4]">
                  <img
                    className="w-4 h-4 absolute top-4 left-4"
                    alt="user"
                    src="/fi_747376.svg"
                    />
                  <input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="Enter Your Username"
                    className="w-full ml-6 [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base focus:outline-none focus:ring-0"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-5 w-full pt-12">
              <Button 
                type="submit"
                disabled={isLoading}
                className="w-full h-[51px] rounded-[10px] overflow-hidden bg-[linear-gradient(90deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90 disabled:opacity-50"
              >
                <span className="h-[18px] flex items-center justify-center [font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-white text-base text-center tracking-[0] leading-[18px] whitespace-nowrap">
                  {isLoading ? "Creating Account..." : "Sign Up"}
                </span>
              </Button>
              <p className="relative flex items-center justify-center self-stretch [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-transparent text-sm text-center tracking-[0] leading-[14px]">
                <span className="text-[#808080] leading-[0.1px]">Already have an account? </span>
                <Link to="/login" className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#27ae60] leading-5 hover:underline">Sign In</Link>
              </p>
            </div>
          </form>
        </div>
        <div className="hidden xl:block xl:w-3/5">
          <img 
            className="w-full object-cover"
            alt="background"
            src="background-login.png"
          />
        </div>
      </div> 
    </main>
  );
};
