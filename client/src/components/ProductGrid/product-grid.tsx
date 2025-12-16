import { Product, ProductCategory } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Zap } from "lucide-react";

interface ProductCardProps {
  product: Product;
  featured?: boolean;
  hidePricing?: boolean;
}

export function ProductCard({ product, featured = false, hidePricing = false }: ProductCardProps) {
  const Icon = product.icon;
  
  return (
    <Card className={`group relative overflow-hidden transition-all duration-300 hover:shadow-[0_14px_50px_rgba(0,0,0,0.05)] hover:-translate-y-1 rounded-[20px] border border-[#e4e4e4] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)] ${
      featured ? 'ring-2 ring-[#1DBF73]' : ''
    }`}>
      {product.popular && (
        <div className="absolute top-3 right-3">
          <Badge className="bg-[#27ae60] text-white hover:bg-[#27ae60]/90 rounded-[800px] px-2 py-1">
            <Star className="w-2 h-2 mr-1" />
            <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-xs">Popular</span>
          </Badge>
        </div>
      )}
      
      {product.new && (
        <div className="absolute top-3 right-3">
          <Badge className="bg-[#0a3778] text-white rounded-[800px] px-3 py-1">
            <Zap className="w-3 h-3 mr-1" />
            <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-xs">New</span>
          </Badge>
        </div>
      )}
      
      <CardHeader className="pt-10">
        <div className="flex items-start space-x-4">
          <div className={`p-3 rounded-xl ${
            featured ? 'bg-gradient-to-br from-[#0A3778] to-[#27ae60]' : 'bg-gradient-to-br from-[#0A3778] to-[#27ae60]'
          } text-white transition-transform group-hover:scale-110`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-lg text-[#003d2b] group-hover:text-[#1DBF73] transition-colors">
              {product.name}
            </CardTitle>
            {product.pricing && !hidePricing && (
              <div className="flex items-baseline space-x-1 mt-1">
                <span className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-2xl text-[#003d2b]">{product.pricing.price}</span>
                {product.pricing.period && (
                  <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-sm text-[#808080]">/{product.pricing.period}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] leading-relaxed">
          {product.description}
        </CardDescription>
        
        <div className="space-y-2 pb-4">
          <h4 className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-[#003d2b]">Key Features:</h4>
          <ul className="space-y-1">
            {product.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080]">
                <div className="w-1.5 h-1.5 bg-[#1DBF73] rounded-full mt-2 flex-shrink-0"></div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <Link to={product.cta.href}>
          <Button className={`w-full group rounded-[10px] ${
            featured 
              ? 'bg-gradient-to-r from-[#0A3778] to-[#1DBF73] hover:shadow-lg transform hover:scale-105 text-white' 
              : 'bg-[#0A3778] hover:bg-[#1DBF73] text-white'
          } transition-all duration-300 [font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold`}>
            {product.cta.text}
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

interface ProductGridProps {
  products: Product[];
  title?: string;
  description?: string;
  featuredProductId?: string;
  columns?: 2 | 3 | 4;
  hidePricing?: boolean;
}

export function ProductGrid({ 
  products, 
  title, 
  description, 
  featuredProductId,
  columns = 3,
  hidePricing = false 
}: ProductGridProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3', 
    4: 'md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className="space-y-8">
      {(title || description) && (
        <div className="text-center space-y-4">
          {title && (
            <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-3xl text-[#003d2b]">{title}</h2>
          )}
          {description && (
            <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-lg text-[#808080] max-w-3xl mx-auto">{description}</p>
          )}
        </div>
      )}
      
      <div className={`grid grid-cols-1 ${gridCols[columns]} gap-6`}>
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            featured={product.id === featuredProductId}
            hidePricing={hidePricing}
          />
        ))}
      </div>
    </div>
  );
}

interface CategoryOverviewProps {
  category: ProductCategory;
}

export function CategoryOverview({ category }: CategoryOverviewProps) {
  return (
    <div className="space-y-12">
      {/* Products Grid */}
      <ProductGrid 
        products={category.products}
        columns={category.products.length >= 4 ? 4 : 3}
      />
    </div>
  );
}