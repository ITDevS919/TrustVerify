import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, CheckCircle, AlertTriangle, XCircle, Award } from "lucide-react";

interface TrustVerifyBadgeProps {
  domain: string;
  trustScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  variant?: 'compact' | 'detailed' | 'embeddable';
  certificationLevel?: 'basic' | 'standard' | 'enterprise';
}

export function TrustVerifyBadge({ 
  domain, 
  trustScore, 
  riskLevel, 
  variant = 'compact',
  certificationLevel = 'standard'
}: TrustVerifyBadgeProps) {
  
  // B2B Compliance Color Scheme - TrustVerify Brand
  const getBadgeConfig = () => {
    switch (riskLevel) {
      case 'low':
        return {
          color: 'bg-[#1DBF73]',
          icon: CheckCircle,
          label: 'BUSINESS CERTIFIED',
          textColor: 'text-[#1DBF73]',
          borderColor: 'border-[#1DBF73]',
          bgColor: 'bg-[#0A3778]'
        };
      case 'medium':
        return {
          color: 'bg-[#FFB400]',
          icon: AlertTriangle,
          label: 'MONITORED USE',
          textColor: 'text-[#FFB400]',
          borderColor: 'border-[#FFB400]',
          bgColor: 'bg-[#0A3778]'
        };
      case 'high':
        return {
          color: 'bg-orange-500',
          icon: AlertTriangle,
          label: 'REQUIRES REVIEW',
          textColor: 'text-orange-400',
          borderColor: 'border-orange-500',
          bgColor: 'bg-[#0A3778]'
        };
      case 'critical':
        return {
          color: 'bg-red-500',
          icon: XCircle,
          label: 'NOT CERTIFIED',
          textColor: 'text-red-400',
          borderColor: 'border-red-500',
          bgColor: 'bg-[#0A3778]'
        };
    }
  };

  const config = getBadgeConfig();
  const IconComponent = config.icon;

  if (variant === 'embeddable') {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${config.borderColor} ${config.bgColor}`}>
        <Shield className={`h-4 w-4 ${config.color.replace('bg-', 'text-')}`} />
        <span className={`text-sm font-semibold text-white`}>
          TrustVerify {config.label}
        </span>
        <span className="text-xs text-white/60">{trustScore}%</span>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-3 p-3 sm:p-4 rounded-lg border ${config.borderColor} ${config.bgColor}`}>
        <div className={`p-2 rounded-full ${config.color} flex-shrink-0`}>
          <IconComponent className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className={`font-semibold text-sm text-white`}>
            {config.label}
          </div>
          <div className="text-xs text-white/60 truncate">
            {domain} • Score: {trustScore}%
          </div>
        </div>
        <Badge variant="outline" className="text-xs flex-shrink-0 whitespace-nowrap border-white/30 text-white/70">
          {certificationLevel.toUpperCase()}
        </Badge>
      </div>
    );
  }

  // Detailed variant for B2B certification dashboard
  return (
    <Card className={`${config.borderColor} ${config.bgColor} border-2 w-full max-w-full`}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className={`p-2 sm:p-3 rounded-full ${config.color} flex-shrink-0`}>
            <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 mb-2">
              <h3 className={`font-bold text-base sm:text-lg text-white min-w-0`}>
                TrustVerify {config.label}
              </h3>
              <Badge 
                variant="secondary"
                className={`text-xs whitespace-nowrap font-semibold ${
                  riskLevel === 'low' ? 'bg-[#1DBF73]/20 text-[#1DBF73] border-[#1DBF73]' : 
                  riskLevel === 'medium' ? 'bg-[#FFB400]/20 text-[#FFB400] border-[#FFB400]' : 
                  riskLevel === 'high' ? 'bg-orange-500/20 text-orange-400 border-orange-500' : 
                  'bg-red-500/20 text-red-400 border-red-500'
                }`}
              >
                {certificationLevel.toUpperCase()} TIER
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2 min-w-0">
                <span className="text-xs sm:text-sm font-semibold text-white/80 flex-shrink-0">Domain:</span>
                <span className="text-xs sm:text-sm text-white/60 font-mono truncate min-w-0">{domain}</span>
              </div>
              
              <div className="flex items-center justify-between gap-2 min-w-0">
                <span className="text-xs sm:text-sm font-semibold text-white/80 flex-shrink-0">Trust Score:</span>
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-16 sm:w-20 bg-white/20 rounded-full h-2 flex-shrink-0">
                    <div 
                      className={`h-2 rounded-full ${config.color}`}
                      style={{ width: `${Math.min(trustScore, 100)}%` }}
                    />
                  </div>
                  <span className={`text-base sm:text-lg font-bold text-[#1DBF73] whitespace-nowrap`}>
                    {trustScore}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 min-w-0">
                <span className="text-xs sm:text-sm font-semibold text-white/80 flex-shrink-0">Risk Level:</span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <IconComponent className={`h-4 w-4 ${config.textColor}`} />
                  <span className={`text-xs sm:text-sm font-semibold text-white/90 whitespace-nowrap`}>
                    {riskLevel.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/20 min-w-0">
                <span className="text-xs sm:text-sm font-semibold text-white/80 flex-shrink-0">Valid Until:</span>
                <span className="text-xs sm:text-sm text-white/60 whitespace-nowrap">
                  {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </span>
              </div>
            </div>

            {riskLevel === 'low' && (
              <div className="mt-4 p-3 bg-[#1DBF73]/10 rounded-lg border border-[#1DBF73]/30">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="h-4 w-4 text-[#1DBF73]" />
                  <span className="text-sm font-semibold text-white">
                    Enterprise Certification Benefits
                  </span>
                </div>
                <ul className="text-xs text-white/70 space-y-1">
                  <li>✓ Suitable for B2B transactions</li>
                  <li>✓ Insurance underwriting support</li>
                  <li>✓ Compliance framework verified</li>
                  <li>✓ Reduced due diligence requirements</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="flex items-center justify-between text-xs text-white/60">
            <span className="font-medium">Verified by TrustVerify Enterprise</span>
            <span className="font-mono">Cert ID: TV-{Date.now().toString(36).toUpperCase()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}