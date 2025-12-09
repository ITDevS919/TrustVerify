import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon, MenuIcon, XIcon, User2, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";

export interface HeaderContentProps {
  badge?: {
    text: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
    className?: string;
  };
  title?: string;
  description?: string;
  tags?: string[];
  buttons?: {
    primary?: {
      text: string;
      onClick?: () => void;
      className?: string;
    };
    secondary?: {
      text: string;
      onClick?: () => void;
      className?: string;
    };
  };
  width?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "full" | "auto";
  maxWidth?: string; // Custom max-width value
}

export interface HeaderProps {
  backgroundImage?: string;
  content?: HeaderContentProps;
}

interface SubItem {
  label: string;
  path: string;
  description?: string;
}

interface NavigationItem {
  label: string;
  hasDropdown: boolean;
  path?: string;
  subItems?: SubItem[];
}

const navigationItems: NavigationItem[] = [
  { label: "Platform",
    hasDropdown: true, 
    path: "/platform",
    subItems: [
      { label: "Platform Suite", path: "/platform", description: "Tailored solutions for every industry" },
      { label: "Consumer Protection Suite", path: "/consumer-protection", description: "training" },
      { label: "Our Mission", path: "/our-mission", description: "Marketplace protection" },
    ]
  },
  { 
    label: "Solutions", 
    hasDropdown: true, 
    path: "/solutions",
    subItems: [
      { label: "Industry Solutions", path: "/industry", description: "Tailored solutions for every industry" },
      { label: "Regulatory Compliances", path: "/compliances", description: "Marketplace protection" },
    ]
  },
  { 
    label: "Enterprises", 
    hasDropdown: true, 
    path: "/Enterprises",
    subItems: [
      { label: "Training", path: "/training", description: "Training" },
      { label: "Help Center", path: "/help", description: "Help Center" },
      { label: "Contact Us", path: "/contact", description: "Contact US" },
    ]
  },
  { label: "Developers", hasDropdown: false, path: "/developer-center" },
  { label: "Pricing", hasDropdown: false, path: "/pricing" },
];

// Helper function to get width class and style
const getWidthClass = (width?: string, maxWidth?: string) => {
  const widthMap = {
    sm: "max-w-sm",
    md: "max-w-md", 
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
    full: "max-w-full",
    auto: "max-w-none"
  };
  
  return {
    className: widthMap[width as keyof typeof widthMap] || "max-w-[1009px]",
    style: maxWidth ? { maxWidth } : undefined
  };
};

export const Header = ({ backgroundImage, content }: HeaderProps): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logoutMutation } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mobileExpandedItems, setMobileExpandedItems] = useState<Set<string>>(new Set());
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown) {
        const ref = dropdownRefs.current[openDropdown];
        if (ref && !ref.contains(event.target as Node)) {
          setOpenDropdown(null);
        }
      }
      if (isUserMenuOpen && userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown, isUserMenuOpen]);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      setIsUserMenuOpen(false);
      navigate("/");
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.username) {
      return user.username;
    }
    if (user?.email) {
      return user.email.split("@")[0];
    }
    return "User";
  };

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  const getTrustScore = () => {
    if (user?.trustScore) {
      const score = typeof user.trustScore === 'string' 
        ? parseFloat(user.trustScore) 
        : Number(user.trustScore);
      return isNaN(score) ? null : score.toFixed(1);
    }
    return null;
  };

  const toggleMobileDropdown = (label: string) => {
    setMobileExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(label)) {
        newSet.delete(label);
      } else {
        newSet.add(label);
      }
      return newSet;
    });
  };

  const headerStyle = backgroundImage 
    ? {
        backgroundImage: `url(${backgroundImage}), linear-gradient(37deg, rgba(39,174,96,1) 0%, rgba(0,82,204,1) 100%)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    : {
      background: `linear-gradient(37deg, rgba(39,174,96,1) 0%, rgba(0,82,204,1) 100%)`
      };
  
  return (
    <div 
      className="flex flex-col w-full items-start gap-2.5 border-b-2 [border-bottom-style:solid] border-[#ffffff1a] "
      style={headerStyle}
    >
      <header className="w-full relative bg-transparent z-10">
      <div className="max-w-[1488px]  mx-auto relative flex items-center justify-between my-4 px-6 xl:px-10 2xl:px-0 h-16 sm:h-20">

        <Link to="/">
          <img
            className="w-[184px] h-[38px] cursor-pointer"
            alt="TrustVerify logo"
            src="/logo2.png"
            srcSet="/logo.png 1x, /logo2.png 2x"
            width={184}
            height={38}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center justify-center gap-3 xl:gap-8 absolute top-[29px] left-1/2 -translate-x-1/2">
          {navigationItems.map((item, index) => (
            <div 
              key={index} 
              className="relative"
              ref={(el) => {
                if (item.hasDropdown) {
                  dropdownRefs.current[item.label] = el;
                }
              }}
              onMouseEnter={() => item.hasDropdown && setOpenDropdown(item.label)}
              onMouseLeave={() => item.hasDropdown && setOpenDropdown(null)}
            >
              {item.hasDropdown ? (
                <>
                  <button 
                    className="inline-flex items-end justify-center gap-[5px] relative flex-[0_0_auto] bg-transparent border-none cursor-pointer hover:text-white transition-colors"
                    onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                  >
                    <span className={`relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[17.7px] tracking-[0] leading-[18px] whitespace-nowrap transition-colors ${
                      openDropdown === item.label ? 'text-white' : 'text-[#d8d8d8]'
                    }`}>
                      {item.label}
                    </span>
                    <ChevronDownIcon 
                      className={`w-[12.59px] h-3.5 transition-transform ${
                        openDropdown === item.label ? 'text-white rotate-180' : 'text-[#d8d8d8]'
                      }`} 
                    />
                  </button>
                  
                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {openDropdown === item.label && item.subItems && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[280px] bg-white rounded-lg shadow-xl border border-gray-100 py-2"
                      >
                        {item.subItems.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            to={subItem.path}
                            onClick={() => setOpenDropdown(null)}
                            className="z-50 block px-4 py-3 hover:bg-gray-50 transition-colors group"
                          >
                            <div className="font-medium text-gray-900 group-hover:text-app-secondary transition-colors [font-family:'DM_Sans_18pt-Medium',Helvetica] text-base">
                              {subItem.label}
                            </div>
                            {subItem.description && (
                              <div className="text-sm text-gray-500 mt-1 [font-family:'DM_Sans_18pt-Regular',Helvetica]">
                                {subItem.description}
                              </div>
                            )}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : item.path ? (
                <Link
                  to={item.path}
                  className={`relative flex items-center justify-center w-fit [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[17.7px] tracking-[0] leading-[18px] whitespace-nowrap bg-transparent border-none cursor-pointer transition-colors ${
                    location.pathname === item.path ? 'text-white' : 'text-[#d8d8d8] hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <button className="relative flex items-center justify-center w-fit [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#d8d8d8] text-[17.7px] tracking-[0] leading-[18px] whitespace-nowrap bg-transparent border-none cursor-pointer hover:text-white transition-colors">
                  {item.label}
                </button>
              )}
              {location.pathname === item.path && !item.hasDropdown && (
                <div className="absolute top-[30px] left-[-5px] w-[85px] h-1 bg-white rounded-[30px]" />
              )}
            </div>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2.5">
          {user ? (
            <div 
              className="relative"
              ref={userMenuRef}
              onMouseEnter={() => setIsUserMenuOpen(true)}
              onMouseLeave={() => setIsUserMenuOpen(false)}
            >
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2.5 px-4 py-2 rounded-[10px] bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Avatar className="w-8 h-8 border-2 border-white">
                  <AvatarImage src={user.profileImage || undefined} alt={getUserDisplayName()} />
                  <AvatarFallback className="bg-app-secondary text-white text-sm font-semibold">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="relative w-fit [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-white text-base text-center leading-[18px] whitespace-nowrap">
                    {getUserDisplayName()}
                  </span>
                  {getTrustScore() && (
                    <span className="relative w-fit [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-white/80 text-xs leading-[14px] whitespace-nowrap">
                      Score: {getTrustScore()}
                    </span>
                  )}
                </div>
                <ChevronDownIcon 
                  className={`w-4 h-4 text-white transition-transform ${
                    isUserMenuOpen ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              
              {/* User Dropdown Menu */}
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-[200px] bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50"
                  >
                    <Link
                      to="/dashboard"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="font-medium text-gray-900 [font-family:'DM_Sans_18pt-Medium',Helvetica] text-base">
                        Dashboard
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-gray-900 [font-family:'DM_Sans_18pt-Medium',Helvetica] text-base">
                        Logout
                      </span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link to="/register">
                <Button
                  variant="outline"
                  className="h-auto inline-flex items-center justify-center gap-2.5 lg:px-6 2xl:px-12 py-4 relative flex-[0_0_auto] rounded-[10px] border border-solid border-white bg-transparent hover:bg-white/10"
                >
                  <span className="relative w-fit mt-[-1.00px] [font-family:'Suisse_Intl-Medium',Helvetica] font-medium text-white text-lg text-center leading-[18px] whitespace-nowrap flex items-center justify-center tracking-[0]">
                    Register
                  </span>
                </Button>
              </Link>
              <Link to="/login">
                <Button className="h-auto inline-flex items-center justify-center gap-2.5 lg:px-8 2xl:px-14 py-4 relative flex-[0_0_auto] bg-app-secondary hover:bg-app-secondary/90 rounded-[10px]">
                  <span className="relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-white text-lg text-center tracking-[0] leading-[18px] whitespace-nowrap">
                    Login
                  </span>
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-md bg-[#27ae60] text-white"
        >
          {isMenuOpen ? (
            <XIcon className="w-6 h-6" />
          ) : (
            <MenuIcon className="w-6 h-6" />
          )}
        </button>
      </div>
        
      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-app-secondary border-t border-white/10 overflow-hidden"
          >
            <div className="flex flex-col gap-16 items-start p-6 pb-10 space-y-3">
              <div className="w-full flex flex-col gap-6">
              {navigationItems.map((item, index) =>
               item.hasDropdown ? (
                <div key={index} className="w-full">
                  <button 
                    onClick={() => toggleMobileDropdown(item.label)}
                    className={`w-full text-left text-white text-lg font-medium ${
                      location.pathname === item.path ? "opacity-100" : "opacity-80"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="whitespace-nowrap">
                        {item.label}
                      </span>
                      <ChevronDownIcon 
                        className={`w-5 h-5 text-white transition-transform ${
                          mobileExpandedItems.has(item.label) ? 'rotate-180' : ''
                        }`} 
                      />
                    </div>
                  </button>
                  
                  {/* Mobile Sub-items */}
                  <AnimatePresence>
                    {mobileExpandedItems.has(item.label) && item.subItems && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden mt-2 ml-4"
                      >
                        <div className="flex flex-col gap-3 border-l-2 border-white/20 pl-4">
                          {item.subItems.map((subItem, subIndex) => (
                            <Link
                              key={subIndex}
                              to={subItem.path}
                              onClick={() => {
                                setIsMenuOpen(false);
                                setMobileExpandedItems(new Set());
                              }}
                              className="text-white/70 text-base font-normal hover:text-white transition-colors [font-family:'DM_Sans_18pt-Regular',Helvetica]"
                            >
                              <div className="font-medium">{subItem.label}</div>
                              {subItem.description && (
                                <div className="text-sm text-white/50 mt-0.5">
                                  {subItem.description}
                                </div>
                              )}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
               ) : item.path ? (
                  <Link
                    key={index}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`w-full text-left text-white text-lg font-medium ${
                      location.pathname === item.path ? "opacity-100" : "opacity-80"
                    }`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    key={index}
                    className="w-full text-left text-white/80 text-lg font-medium"
                  >
                    {item.label}
                  </button>
                )
              )}
              </div>
              {user ? (
                <>
                  <div className="w-full flex items-center gap-3 px-2 py-3 border-b border-white/10">
                    <Avatar className="w-10 h-10 border-2 border-white">
                      <AvatarImage src={user.profileImage || undefined} alt={getUserDisplayName()} />
                      <AvatarFallback className="bg-app-secondary text-white text-sm font-semibold">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="text-white text-lg font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica]">
                        {getUserDisplayName()}
                      </span>
                      {getTrustScore() && (
                        <span className="text-white/70 text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica]">
                          Score: {getTrustScore()}
                        </span>
                      )}
                    </div>
                  </div>
                  <Link 
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full flex items-center gap-3 text-left text-white/80 text-lg font-medium"
                  >
                    <User2 className="w-7 h-7"/>
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 text-left text-white/80 text-lg font-medium"
                  >
                    <LogOut className="w-7 h-7"/>
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full flex items-center gap-3 text-left text-white/80 text-lg font-medium"
                >
                  <User2 className="w-7 h-7"/>
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
      
      {/* Content Section */}
      {content && (
        <div 
          className={`flex flex-col items-center py-20 ${getWidthClass(content.width, content.maxWidth).className} mx-auto gap-4`}
          style={getWidthClass(content.width, content.maxWidth).style}
        >
          {/* Badge */}
          {content.badge && (
            <Badge 
              variant={content.badge.variant || "secondary"}
              className={`bg-white/60 h-[30px] mb-5 rounded-[800px] px-[10px] text-center ${content.badge.className || ''}`}
            >
              <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-[#003D2B]">
                {content.badge.text}
              </span>
            </Badge>
          )}

          {/* Title */}
          {content.title && (
            <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-white text-[70px] leading-[67px] tracking-[-0.27px] text-center w-full">
              {content.title}
            </h1>
          )}

          {/* Description */}
          {content.description && (
            <p className="w-full text-center [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-white text-[20px] tracking-[0] leading-8 px-2">
              {content.description}
            </p>
          )}

          {/* Tags */}
          {content.tags && content.tags.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-4">
              {content.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="border-white/20 text-black bg-white/50 hover:bg-white/60 h-8 rounded-[800px] px-4"
                >
                  <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">
                    {tag}
                  </span>
                </Badge>
              ))}
            </div>
          )}

          {/* Buttons */}
          {content.buttons && (
            <div className="flex items-center gap-5 mt-3">
              {content.buttons.primary && (
                <Button 
                  className={`w-[223px] h-14 bg-app-secondary hover:bg-app-secondary/90 rounded-[10px] [font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-white text-lg tracking-[-0.20px] leading-[18px] ${content.buttons.primary.className || ''}`}
                  onClick={content.buttons.primary.onClick}
                >
                  {content.buttons.primary.text}
                </Button>
              )}

              {content.buttons.secondary && (
                <Button
                  variant="outline"
                  className={`w-[198px] h-14 border-white text-white bg-transparent hover:bg-white/10 rounded-[10px] [font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-lg tracking-[-0.20px] leading-[18px] ${content.buttons.secondary.className || ''}`}
                  onClick={content.buttons.secondary.onClick}
                >
                  {content.buttons.secondary.text}
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
