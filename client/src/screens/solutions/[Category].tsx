import { useParams } from "react-router-dom";
import { getCategoryById } from "@/data/products";
import { CategoryOverview } from "@/components/ProductGrid";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import NotFound from "../NotFound/NotFound";

export default function CategoryPage() {
  const { category: categoryId } = useParams<{ category: string }>();
  
  if (!categoryId) {
    return <NotFound />;
  }
  
  const category = getCategoryById(categoryId);
  
  if (!category) {
    return <NotFound />;
  }

  const Icon = category.icon;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Breadcrumb Navigation */}
      <section className="py-4 bg-white border-b border-[#e4e4e4]">
        <div className="max-w-[1270px] mx-auto px-6 md:px-10">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/" className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#003d2b] hover:text-[#1DBF73] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-[#808080]" />
            <Link to="/solutions" className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#003d2b] hover:text-[#1DBF73] transition-colors">
              Solutions
            </Link>
            <ChevronRight className="w-4 h-4 text-[#808080]" />
            <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080]">{category.name}</span>
          </div>
        </div>
      </section>

      {/* Back Button */}
      <section className="py-6">
        <div className="max-w-[1270px] mx-auto px-6 md:px-10">
          <Link to="/solutions">
            <Button variant="outline" className="group border border-[#e4e4e4] bg-white hover:bg-[#f7f7f7] rounded-[10px]">
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1 text-[#003d2b]" />
              <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Back to All Solutions</span>
            </Button>
          </Link>
        </div>
      </section>

      {/* Category Content */}
      <section className="pb-20 bg-white">
        <div className="max-w-[1270px] mx-auto px-6 md:px-10">
          <CategoryOverview category={category} />
        </div>
      </section>

      {/* Related CTA */}
      <section className="py-16 text-white">
        <div className="max-w-7xl bg-app-primary mx-auto rounded-xl px-6 md:px-10 py-10 text-center space-y-6">
          <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-2xl md:text-3xl leading-[110%]">
            Need Help Choosing the Right Solution?
          </h2>
          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-lg text-white/90 leading-[27px]">
            Our fraud protection experts are here to help you find the perfect solution for your needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className=" bg-white text-app-primary hover:bg-white/90 rounded-[10px] [font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold">
                Talk to an Expert
              </Button>
            </Link>
            <Link to="/demo">
              <Button size="lg" variant="outline" className="border-l bg-transparent border-white text-white hover:bg-white hover:text-[#003d2b] rounded-[10px] [font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold">
                Try Live Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}