import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Label } from "../../../components/ui/label";
import { Download, Code, FileText, ExternalLink, Copy, CheckCircle2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";

const sdks = [
  {
    id: "javascript",
    name: "JavaScript/TypeScript",
    version: "2.1.0",
    description: "Official SDK for Node.js and browser environments",
    language: "JavaScript",
    installCommand: "npm install @trustverify/sdk",
    downloadUrl: "#",
    changelog: [
      { version: "2.1.0", date: "2025-01-15", changes: ["Performance improvements", "New webhook support"] },
      { version: "2.0.0", date: "2025-01-01", changes: ["Major rewrite", "TypeScript support"] },
    ],
  },
  {
    id: "python",
    name: "Python",
    version: "1.8.2",
    description: "Python SDK for server-side integrations",
    language: "Python",
    installCommand: "pip install trustverify-sdk",
    downloadUrl: "#",
    changelog: [
      { version: "1.8.2", date: "2025-01-10", changes: ["Bug fixes", "Async support improvements"] },
      { version: "1.8.0", date: "2024-12-20", changes: ["New async methods", "Better error handling"] },
    ],
  },
  {
    id: "php",
    name: "PHP",
    version: "1.5.0",
    description: "PHP SDK for web applications",
    language: "PHP",
    installCommand: "composer require trustverify/sdk",
    downloadUrl: "#",
    changelog: [
      { version: "1.5.0", date: "2024-12-15", changes: ["PSR-4 compliance", "Updated dependencies"] },
    ],
  },
  {
    id: "ruby",
    name: "Ruby",
    version: "1.3.1",
    description: "Ruby gem for Ruby on Rails and other frameworks",
    language: "Ruby",
    installCommand: "gem install trustverify-sdk",
    downloadUrl: "#",
    changelog: [
      { version: "1.3.1", date: "2024-12-01", changes: ["Security updates"] },
    ],
  },
  {
    id: "go",
    name: "Go",
    version: "1.2.0",
    description: "Go SDK for high-performance applications",
    language: "Go",
    installCommand: "go get github.com/trustverify/sdk-go",
    downloadUrl: "#",
    changelog: [
      { version: "1.2.0", date: "2024-11-20", changes: ["Context support", "Better concurrency"] },
    ],
  },
];

export const SDKManager = () => {
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const copyCommand = (command: string, sdkId: string) => {
    navigator.clipboard.writeText(command);
    setCopiedCommand(sdkId);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex flex-col gap-2.5">
        <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl md:text-3xl lg:text-[40px] tracking-[0] leading-[normal]">
          SDK Management
        </h2>
        <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm md:text-base lg:text-lg tracking-[0] leading-6 md:leading-8">
          Download and integrate our SDKs into your applications
        </p>
      </div>

      {/* SDK Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sdks.map((sdk) => (
          <Card
            key={sdk.id}
            className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4] hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg mb-1">
                    {sdk.name}
                  </CardTitle>
                  <Badge variant="outline" className="mt-1">
                    v{sdk.version}
                  </Badge>
                </div>
                <Code className="w-6 h-6 text-[#808080]" />
              </div>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm mt-2">
                {sdk.description}
              </p>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div>
                <Label className="text-xs text-[#808080] mb-1 block">Install Command</Label>
                <div className="flex items-center gap-2 p-2 bg-[#121728] rounded-lg">
                  <code className="flex-1 text-[#27ae60] text-sm font-mono">
                    {sdk.installCommand}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyCommand(sdk.installCommand, sdk.id)}
                    className="h-8 w-8 p-0"
                  >
                    {copiedCommand === sdk.id ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-white" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => window.open(sdk.downloadUrl, "_blank")}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    // Scroll to changelog section
                    const element = document.getElementById(`changelog-${sdk.id}`);
                    element?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <FileText className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Changelog Section */}
      <Card className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
        <CardHeader>
          <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl">
            Changelog
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={sdks[0].id} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              {sdks.map((sdk) => (
                <TabsTrigger key={sdk.id} value={sdk.id}>
                  {sdk.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {sdks.map((sdk) => (
              <TabsContent key={sdk.id} value={sdk.id} id={`changelog-${sdk.id}`}>
                <div className="flex flex-col gap-4 mt-4">
                  {sdk.changelog.map((entry, index) => (
                    <div
                      key={index}
                      className="p-4 bg-white rounded-lg border border-[#e4e4e4]"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">v{entry.version}</Badge>
                          <span className="text-sm text-[#808080]">{entry.date}</span>
                        </div>
                      </div>
                      <ul className="list-disc list-inside text-sm text-[#003d2b] space-y-1">
                        {entry.changes.map((change, changeIndex) => (
                          <li key={changeIndex}>{change}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

