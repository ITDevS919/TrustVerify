import { useState } from "react";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";

type NavigationItem = {
  label: string;
  isActive?: boolean;
};

type APIHeaderProps = {
  navigationItems: NavigationItem[];
};

export function APIHeader({ navigationItems }: APIHeaderProps): JSX.Element {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  return (
    <header className="flex w-full relative flex-col items-start gap-2.5 px-4 sm:px-6 md:px-[110px] py-4 sm:py-[35px] bg-[linear-gradient(169deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)]">
      <div className="relative w-full flex items-center justify-between">
        <img
          className="w-[120px] sm:w-[150px] md:w-[184px] h-auto"
          alt="TrustVerify Logo"
          src="/group.png"
        />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-16 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {navigationItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className={`h-auto p-0 hover:bg-transparent whitespace-nowrap ${
                item.isActive
                  ? "[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#d8d8d8] text-lg"
                  : "[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#d8d8d8] text-[17.7px]"
              } tracking-[0] leading-[18px]`}
            >
              {item.label}
            </Button>
          ))}
        </nav>

        {/* Mobile Hamburger Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2.5 rounded-lg bg-[#27ae60] hover:bg-[#229954] transition-colors shadow-md"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5 text-white" />
          ) : (
            <Menu className="w-5 h-5 text-white" />
          )}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[280px] bg-[linear-gradient(169deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="flex flex-col p-6 pt-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-white text-xl">
              Menu
            </h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          <nav className="flex flex-col gap-2">
            {navigationItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`h-auto py-3 px-4 rounded-lg text-left justify-start hover:bg-white/10 ${
                  item.isActive
                    ? "[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-white text-base bg-white/10"
                    : "[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#d8d8d8] text-base"
                } tracking-[0] leading-[18px]`}
              >
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </header>
  );
}


