import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle, AlertTriangle, XCircle, ExternalLink, Copy, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface TrustScoreWidgetProps {
  domain: string;
  trustScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  language?: 'en' | 'es' | 'fr';
  size?: 'small' | 'medium' | 'large';
  showEmbed?: boolean;
}

const translations = {
  en: {
    verified: "Verified by TrustVerify",
    trustScore: "Trust Score",
    viewReport: "View Full Report",
    embed: "Embed Widget",
    copyCode: "Copy Embed Code",
    businessCertified: "Business Certified",
    monitoredUse: "Monitored Use", 
    requiresReview: "Requires Review",
    notCertified: "Not Certified",
    riskLevels: {
      low: "Low Risk",
      medium: "Medium Risk", 
      high: "High Risk",
      critical: "Critical Risk"
    }
  },
  es: {
    verified: "Verificado por TrustVerify",
    trustScore: "Puntuación de Confianza",
    viewReport: "Ver Informe Completo",
    embed: "Insertar Widget",
    copyCode: "Copiar Código",
    businessCertified: "Certificado Empresarial",
    monitoredUse: "Uso Monitoreado",
    requiresReview: "Requiere Revisión", 
    notCertified: "No Certificado",
    riskLevels: {
      low: "Riesgo Bajo",
      medium: "Riesgo Medio",
      high: "Riesgo Alto", 
      critical: "Riesgo Crítico"
    }
  },
  fr: {
    verified: "Vérifié par TrustVerify",
    trustScore: "Score de Confiance",
    viewReport: "Voir le Rapport Complet",
    embed: "Intégrer Widget",
    copyCode: "Copier le Code",
    businessCertified: "Certifié Entreprise",
    monitoredUse: "Utilisation Surveillée",
    requiresReview: "Nécessite Révision",
    notCertified: "Non Certifié", 
    riskLevels: {
      low: "Risque Faible",
      medium: "Risque Moyen",
      high: "Risque Élevé",
      critical: "Risque Critique"
    }
  }
};

export function TrustScoreWidget({ 
  domain, 
  trustScore, 
  riskLevel, 
  language = 'en',
  size = 'medium',
  showEmbed = false 
}: TrustScoreWidgetProps) {
  const [embedOpen, setEmbedOpen] = useState(false);
  const { toast } = useToast();
  const t = translations[language];

  const getBadgeConfig = () => {
    switch (riskLevel) {
      case 'low':
        return {
          color: 'bg-[#1DBF73]',
          icon: CheckCircle,
          label: t.businessCertified,
          textColor: 'text-[#1DBF73]',
          borderColor: 'border-[#1DBF73]',
          bgColor: 'bg-[#0A3778]'
        };
      case 'medium':
        return {
          color: 'bg-[#FFB400]',
          icon: AlertTriangle,
          label: t.monitoredUse,
          textColor: 'text-[#FFB400]',
          borderColor: 'border-[#FFB400]',
          bgColor: 'bg-[#0A3778]'
        };
      case 'high':
        return {
          color: 'bg-orange-500',
          icon: AlertTriangle,
          label: t.requiresReview,
          textColor: 'text-orange-400',
          borderColor: 'border-orange-500',
          bgColor: 'bg-[#0A3778]'
        };
      case 'critical':
        return {
          color: 'bg-red-500',
          icon: XCircle,
          label: t.notCertified,
          textColor: 'text-red-400',
          borderColor: 'border-red-500',
          bgColor: 'bg-[#0A3778]'
        };
    }
  };

  const config = getBadgeConfig();
  const IconComponent = config.icon;

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          container: 'p-4',
          icon: 'h-4 w-4',
          title: 'text-sm font-semibold',
          score: 'text-lg font-bold',
          subtitle: 'text-xs',
          gap: 'gap-2'
        };
      case 'large':
        return {
          container: 'p-6',
          icon: 'h-6 w-6', 
          title: 'text-lg font-bold',
          score: 'text-2xl font-bold',
          subtitle: 'text-sm',
          gap: 'gap-4'
        };
      default:
        return {
          container: 'p-5',
          icon: 'h-5 w-5',
          title: 'text-base font-semibold', 
          score: 'text-xl font-bold',
          subtitle: 'text-xs',
          gap: 'gap-3'
        };
    }
  };

  const sizeClasses = getSizeClasses();

  const generateEmbedCode = () => {
    const baseUrl = window.location.origin;
    return `<iframe 
  src="${baseUrl}/widget/trust-score?domain=${encodeURIComponent(domain)}&lang=${language}&size=${size}" 
  width="${size === 'small' ? '280' : size === 'large' ? '400' : '320'}" 
  height="${size === 'small' ? '120' : size === 'large' ? '180' : '140'}"
  frameborder="0" 
  style="border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
</iframe>

<!-- Alternative: Direct embed script -->
<script>
  (function() {
    var tv = document.createElement('div');
    tv.innerHTML = '<div id="trustverify-widget-${domain.replace(/[^a-zA-Z0-9]/g, '')}"></div>';
    document.currentScript.parentNode.insertBefore(tv, document.currentScript);
    var script = document.createElement('script');
    script.src = '${baseUrl}/js/trustverify-widget.js?domain=${encodeURIComponent(domain)}&lang=${language}&size=${size}';
    document.head.appendChild(script);
  })();
</script>`;
  };

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(generateEmbedCode());
    toast({
      title: "Embed code copied!",
      description: "Widget code has been copied to your clipboard",
      variant: "default",
    });
  };

  const viewFullReport = () => {
    window.open(`/trust-report/${encodeURIComponent(domain)}`, '_blank');
  };

  return (
    <Card className={`${config.borderColor} ${config.bgColor} border-2 w-full max-w-full sm:max-w-sm`}>
      <CardContent className={sizeClasses.container}>
        <div className={`flex items-start ${sizeClasses.gap}`}>
          <div className={`${config.color} p-2 rounded-full flex-shrink-0`}>
            <Shield className={`${sizeClasses.icon} text-white`} />
          </div>
          
          <div className="flex-1 min-w-0 space-y-3">
            {/* Header Section */}
            <div className="space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <h3 className={`text-white ${sizeClasses.title} leading-tight min-w-0 font-bold`}>
                  TrustVerify
                </h3>
                <Badge 
                  variant="secondary"
                  className={`text-xs px-2 py-0.5 whitespace-nowrap flex-shrink-0 font-semibold ${
                    riskLevel === 'low' ? 'bg-[#1DBF73]/20 text-[#1DBF73] border-[#1DBF73]' : 
                    riskLevel === 'medium' ? 'bg-[#FFB400]/20 text-[#FFB400] border-[#FFB400]' : 
                    riskLevel === 'high' ? 'bg-orange-500/20 text-orange-400 border-orange-500' : 
                    'bg-red-500/20 text-red-400 border-red-500'
                  }`}
                >
                  {config.label}
                </Badge>
              </div>
            </div>
            
            {/* Trust Score Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <span className={`${sizeClasses.subtitle} font-semibold text-white/80 whitespace-nowrap flex-shrink-0`}>
                  {t.trustScore}
                </span>
                <span className={`${sizeClasses.score} font-bold text-[#1DBF73]`}>
                  {trustScore}%
                </span>
              </div>
              
              <div className="flex items-center justify-between gap-2 min-w-0">
                <span className={`${sizeClasses.subtitle} text-white/60 truncate flex-1 min-w-0`}>
                  {domain}
                </span>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <IconComponent className={`h-3 w-3 ${config.textColor}`} />
                  <span className={`${sizeClasses.subtitle} font-semibold text-white/90 whitespace-nowrap`}>
                    {t.riskLevels[riskLevel]}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons Section */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 pt-1">
              <Button
                onClick={viewFullReport}
                variant="outline"
                size="sm"
                className={`${sizeClasses.subtitle} h-7 px-3 basis-[45%] sm:flex-1 min-w-0`}
                data-testid="button-view-report"
              >
                <ExternalLink className="h-3 w-3 mr-1.5 flex-shrink-0" />
                <span className="truncate">{t.viewReport}</span>
              </Button>
              
              {showEmbed && (
                <Dialog open={embedOpen} onOpenChange={setEmbedOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`${sizeClasses.subtitle} h-7 px-3 basis-[45%] sm:flex-1 min-w-0`}
                      data-testid="button-embed-widget"
                    >
                      <Code className="h-3 w-3 mr-1.5 flex-shrink-0" />
                      <span className="truncate">{t.embed}</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{t.embed} - {domain}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Preview:</h4>
                        <div className="border rounded-lg p-4 bg-gray-50">
                          <TrustScoreWidget
                            domain={domain}
                            trustScore={trustScore}
                            riskLevel={riskLevel}
                            language={language}
                            size={size}
                            showEmbed={false}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">Embed Code:</h4>
                          <Button onClick={copyEmbedCode} size="sm">
                            <Copy className="h-4 w-4 mr-1" />
                            {t.copyCode}
                          </Button>
                        </div>
                        <Textarea
                          value={generateEmbedCode()}
                          readOnly
                          className="font-mono text-xs h-32"
                        />
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {/* Verified Footer */}
            <div className={`${sizeClasses.subtitle} text-white/70 font-semibold text-center pt-1`}>
              {t.verified}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}