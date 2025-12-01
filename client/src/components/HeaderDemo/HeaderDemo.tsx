import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDownIcon, MenuIcon, XIcon, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

interface SubItem {
  label: string;
  path: string;
  description?: string;
}

interface NavigationItem {
  label: string;
  hasDropdown: boolean;
  path?: string | null;
  subItems?: SubItem[];
}

const navigationItems: NavigationItem[] = [
  { label: "Demo", hasDropdown: false, path: "/live-demo" },
  { 
    label: "Business", 
    hasDropdown: true, 
    path: null,
    subItems: [
      { label: "Secure Escrow", path: "/secure-escrow", description: "Comprehensive platform features" },
      { label: "Fraud Prevention Dashboard", path: "/fraud-prevention", description: "Tailored solutions for every industry" },
      { label: "ID Verification", path: "/id-verification", description: "Custom enterprise solutions" },
    ]
  },
  { 
    label: "Developers", 
    hasDropdown: true, 
    path: "/developer",
    subItems: [
      { label: "Developer Portal", path: "/developer-portal", description: "Access developer portal" },
      { label: "Developer Center", path: "/developer-center", description: "Developer resources and tools" },
      { label: "API Documentation", path: "/api-documentation", description: "Complete API documentation" },
    ]
  },
  { label: "Pricing", hasDropdown: false, path: "/pricing" },
  { 
    label: "Support", 
    hasDropdown: true, 
    path: "/support-center",
    subItems: [
      { label: "Support Center", path: "/support-center", description: "Get help and support" },
      { label: "Report Scam", path: "/report-scam", description: "Reach out to our team" },
      { label: "Messages", path: "/messages", description: "Training resources" },
    ]
  },
];

export const HeaderDemo = (): JSX.Element => {
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

  return (
    <header className="w-full bg-[linear-gradient(37deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] border-b border-white/10 z-50">
      <div className="max-w-[1488px] mx-auto relative flex items-center justify-between px-4 sm:px-6 lg:px-6 h-16 sm:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="TrustVerify"
            className="h-8 sm:h-10 w-auto cursor-pointer"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center justify-center gap-8 absolute left-1/2 -translate-x-1/2">
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
                    className={`inline-flex items-center gap-1 text-[17px] transition-colors ${
                      openDropdown === item.label ? 'text-white' : 'text-[#d8d8d8] hover:text-white'
                    }`}
                    onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                  >
                    {item.label}
                    <ChevronDownIcon 
                      className={`w-4 h-4 transition-transform ${
                        openDropdown === item.label ? 'rotate-180' : ''
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
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[280px] bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50"
                      >
                        {item.subItems.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            to={subItem.path}
                            onClick={() => setOpenDropdown(null)}
                            className="block px-4 py-3 hover:bg-gray-50 transition-colors group"
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
                  className={`text-[17px] ${
                    location.pathname === item.path
                      ? "text-white font-medium"
                      : "text-[#d8d8d8] hover:text-white"
                  } transition-colors`}
                >
                  {item.label}
                </Link>
              ) : (
                <button className="text-[17px] text-[#d8d8d8] hover:text-white transition-colors">
                  {item.label}
                </button>
              )}
              {location.pathname === item.path && !item.hasDropdown && (
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-white rounded-full" />
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
            className="lg:hidden bg-[linear-gradient(37deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] border-t border-white/10 overflow-hidden"
          >
            <div className="flex flex-col items-start p-4 space-y-3">
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
              
              {/* Mobile User Profile Section */}
              {user ? (
                <div className="w-full pt-4 mt-4 border-t border-white/20">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-10 h-10 border-2 border-white">
                      <AvatarImage src={user.profileImage || undefined} alt={getUserDisplayName()} />
                      <AvatarFallback className="bg-app-secondary text-white text-sm font-semibold">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-white text-base font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica]">
                        {getUserDisplayName()}
                      </span>
                      {getTrustScore() && (
                        <span className="text-white/80 text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica]">
                          Score: {getTrustScore()}
                        </span>
                      )}
                    </div>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-left text-white text-base font-medium py-2 [font-family:'DM_Sans_18pt-Medium',Helvetica]"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left text-white text-base font-medium py-2 flex items-center gap-2 [font-family:'DM_Sans_18pt-Medium',Helvetica]"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="w-full pt-4 mt-4 border-t border-white/20 flex flex-col gap-3">
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-center text-white text-base font-medium py-2 border border-white rounded-[10px] [font-family:'Suisse_Intl-Medium',Helvetica]"
                  >
                    Register
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-center text-white text-base font-bold py-2 bg-app-secondary rounded-[10px] [font-family:'DM_Sans_18pt-Bold',Helvetica]"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
