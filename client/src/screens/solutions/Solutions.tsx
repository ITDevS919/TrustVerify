import { productCategories, getAllProducts } from "@/data/products";
import { ProductGrid } from "@/components/ProductGrid";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Building, Shield, Headphones } from "lucide-react";

export default function Solutions() {
  const allProducts = getAllProducts();
  const popularProducts = allProducts.filter(product => product.popular);
  const newProducts = allProducts.filter(product => product.new);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-24 -top-32 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute right-[-120px] top-6 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="relative max-w-[1270px] mx-auto text-center">
          <Badge className="h-[30px] bg-[#003d2b1a] text-[#003d2b] rounded-[800px] px-4 mb-6 border-0">
            <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm leading-[14px] tracking-[0]">
              COMPLETE SOLUTIONS
            </span>
          </Badge>
          <div className="space-y-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[42px] sm:text-[48px] lg:text-[54px] leading-[110%] text-[#003d2b] tracking-[-0.8px]">
                Our <span className="text-[#0b3a78]">Complete</span> Solutions
              </h1>
              <p className="[font-family:'DM_Sans_18pt',Helvetica] font-medium text-[#808080] text-lg text-center tracking-[0.20px] max-w-full">
                From detection to resolution - comprehensive fraud protection for individuals and businesses worldwide
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/pricing">
                <Button size="lg" className="bg-app-primary hover:bg-app-primary/90 rounded-[10px] [font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold px-8 py-4">
                  <Users className="w-5 h-5 mr-2" />
                  Consumer Solutions
                </Button>
              </Link>
              <Link to="/business">
                <Button size="lg" variant="outline" className="border-l border-[#27ae60] text-app-secondary hover:bg-[#27ae60]/10 rounded-[10px] [font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold px-8 py-4">
                  <Building className="w-5 h-5 mr-2" />
                  Business Solutions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[1270px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center space-y-2 bg-[#f7f7f7] px-3 py-6 rounded-lg">
              <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-3xl text-[#003d2b]">AI-Powered</div>
              <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080]">Fraud Detection</div>
            </div>
            <div className="text-center space-y-2 bg-[#f7f7f7] px-3 py-6 rounded-lg">
              <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-3xl text-[#003d2b]">72hrs</div>
              <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080]">Resolution Time</div>
            </div>
            <div className="text-center space-y-2 bg-[#f7f7f7] px-3 py-6 rounded-lg">
              <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-3xl text-[#003d2b]">Enterprise</div>
              <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080]">Grade Security</div>
            </div>
            <div className="text-center space-y-2 bg-[#f7f7f7] px-3 py-6 rounded-lg">
              <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-3xl text-[#003d2b]">24/7</div>
              <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080]">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Products Section */}
      {popularProducts.length > 0 && (
        <section className="py-20 bg-[#f7f7f7]">
          <div className="max-w-[1270px] mx-auto px-6 md:px-10">
            <ProductGrid 
              products={popularProducts}
              title="Most Popular Solutions"
              description="Our top-rated fraud protection services designed for modern businesses"
              columns={3}
            />
          </div>
        </section>
      )}

      {/* Product Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-[1270px] mx-auto px-6 md:px-10">
          <div className="text-center space-y-4 mb-16">
            <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-3xl md:text-4xl text-[#003d2b]">
              Complete Product Categories
            </h2>
            <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-lg text-[#808080] max-w-3xl mx-auto">
              Explore our comprehensive range of fraud protection solutions organized by category
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {productCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Card key={category.id} className="group hover:shadow-[0_14px_50px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 rounded-[20px] border border-[#e4e4e4] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gradient-to-br from-[#0A3778] to-[#1DBF73] rounded-xl text-white group-hover:scale-110 transition-transform">
                        <Icon className="w-8 h-8" />
                      </div>
                      <div>
                        <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-xl text-[#003d2b] group-hover:text-[#1DBF73] transition-colors">
                          {category.name}
                        </CardTitle>
                        <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-sm text-[#808080] mt-1">
                          {category.products.length} Products
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] leading-relaxed">
                      {category.description}
                    </CardDescription>
                    
                    <div className="space-y-3 pb-6">
                      <h4 className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-[#003d2b]">Featured Products:</h4>
                      <div className="space-y-2">
                        {category.products.slice(0, 3).map((product) => (
                          <div key={product.id} className="flex items-center space-x-3 text-sm">
                            <div className="w-2 h-2 bg-[#1DBF73] rounded-full"></div>
                            <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080]">{product.name}</span>
                            {product.popular && (
                              <Badge className="bg-[#27ae60] text-white rounded-[800px] px-2 py-0.5 text-xs [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">
                                Popular
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Link to={`/solutions/${category.id}`}>
                      <Button className="w-full bg-[#0A3778] hover:bg-[#1DBF73] transition-all duration-300 group rounded-[10px] [font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-white">
                        Explore {category.name}
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* New Products Section */}
      {newProducts.length > 0 && (
        <section className="py-20 bg-[#f7f7f7]">
          <div className="max-w-[1270px] mx-auto px-6 md:px-10">
            <ProductGrid 
              products={newProducts}
              title="Latest Innovations"
              description="Cutting-edge fraud protection technologies now available"
              columns={newProducts.length >= 3 ? 3 : 2}
            />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 w-full  text-white">
        <div className="max-w-7xl bg-[#0A3778] mx-auto rounded-xl px-6 md:px-10 py-10 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-3xl md:text-4xl leading-[110%]">
              Ready to Get Started?
            </h2>
            <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-xl text-white/90 leading-[27px]">
              Choose the right fraud protection solution for your needs today
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/pricing">
              <Button size="lg" className="bg-white text-app-primary hover:bg-white/90 rounded-[10px] [font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold px-8 py-4">
                <Shield className="w-5 h-5 mr-2" />
                Get Started
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-l bg-transparent border-white text-white hover:bg-white hover:text-app-primary rounded-[10px] [font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold px-8 py-4">
                <Headphones className="w-5 h-5 mr-2" />
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}