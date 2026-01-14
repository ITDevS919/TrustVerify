import { useState } from "react";
import JSZip from "jszip";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Label } from "../../../components/ui/label";
import { Download, Code, FileText, ExternalLink, Copy, CheckCircle2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { useToast } from "../../../hooks/use-toast";

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
  const { toast } = useToast();
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const [downloadingSdk, setDownloadingSdk] = useState<string | null>(null);

  const copyCommand = (command: string, sdkId: string) => {
    navigator.clipboard.writeText(command);
    setCopiedCommand(sdkId);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  const generateSDKFiles = (sdk: typeof sdks[0]): { [filename: string]: string } => {
    const files: { [filename: string]: string } = {};

    switch (sdk.id) {
      case "javascript":
        files["package.json"] = JSON.stringify({
          name: "@trustverify/sdk",
          version: sdk.version,
          description: sdk.description,
          main: "index.js",
          types: "index.d.ts",
          scripts: {
            test: "echo \"Error: no test specified\" && exit 1"
          },
          keywords: ["trustverify", "sdk", "fraud", "kyc", "aml"],
          author: "TrustVerify",
          license: "MIT",
          dependencies: {
            "axios": "^1.6.0"
          }
        }, null, 2);
        files["index.js"] = `/**
 * TrustVerify SDK for JavaScript/TypeScript
 * Version ${sdk.version}
 */

const TrustVerifySDK = {
  apiKey: null,
  baseUrl: 'https://api.trustverify.co.uk/v1',
  
  init(apiKey) {
    this.apiKey = apiKey;
    return this;
  },
  
  async verifyIdentity(data) {
    // Implementation for identity verification
    return { success: true, data };
  },
  
  async checkFraud(data) {
    // Implementation for fraud checking
    return { success: true, data };
  }
};

module.exports = TrustVerifySDK;
`;
        files["index.d.ts"] = `export interface TrustVerifyConfig {
  apiKey: string;
  baseUrl?: string;
}

export class TrustVerifySDK {
  constructor(config: TrustVerifyConfig);
  verifyIdentity(data: any): Promise<any>;
  checkFraud(data: any): Promise<any>;
}
`;
        files["README.md"] = `# TrustVerify JavaScript/TypeScript SDK

${sdk.description}

## Installation

\`\`\`bash
${sdk.installCommand}
\`\`\`

## Usage

\`\`\`javascript
const TrustVerify = require('@trustverify/sdk');

const sdk = new TrustVerify({
  apiKey: 'your-api-key-here'
});

// Verify identity
const result = await sdk.verifyIdentity({
  firstName: 'John',
  lastName: 'Doe'
});
\`\`\`

## Documentation

For full documentation, visit: https://docs.trustverify.co.uk
`;
        break;

      case "python":
        files["setup.py"] = `from setuptools import setup, find_packages

setup(
    name="trustverify-sdk",
    version="${sdk.version}",
    description="${sdk.description}",
    author="TrustVerify",
    packages=find_packages(),
    install_requires=[
        "requests>=2.31.0",
    ],
)
`;
        files["trustverify/__init__.py"] = `"""
TrustVerify SDK for Python
Version ${sdk.version}
"""

__version__ = "${sdk.version}"

from .client import TrustVerifyClient

__all__ = ["TrustVerifyClient"]
`;
        files["trustverify/client.py"] = `import requests

class TrustVerifyClient:
    def __init__(self, api_key: str, base_url: str = "https://api.trustverify.co.uk/v1"):
        self.api_key = api_key
        self.base_url = base_url
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
    
    def verify_identity(self, data: dict):
        """Verify identity"""
        response = requests.post(
            f"{self.base_url}/verify/identity",
            json=data,
            headers=self.headers
        )
        return response.json()
    
    def check_fraud(self, data: dict):
        """Check for fraud"""
        response = requests.post(
            f"{self.base_url}/fraud/check",
            json=data,
            headers=self.headers
        )
        return response.json()
`;
        files["README.md"] = `# TrustVerify Python SDK

${sdk.description}

## Installation

\`\`\`bash
${sdk.installCommand}
\`\`\`

## Usage

\`\`\`python
from trustverify import TrustVerifyClient

client = TrustVerifyClient(api_key="your-api-key-here")

# Verify identity
result = client.verify_identity({
    "firstName": "John",
    "lastName": "Doe"
})
\`\`\`

## Documentation

For full documentation, visit: https://docs.trustverify.co.uk
`;
        break;

      case "php":
        files["composer.json"] = JSON.stringify({
          name: "trustverify/sdk",
          description: sdk.description,
          type: "library",
          version: sdk.version,
          require: {
            "php": ">=7.4",
            "guzzlehttp/guzzle": "^7.0"
          },
          autoload: {
            "psr-4": {
              "TrustVerify\\": "src/"
            }
          }
        }, null, 2);
        files["src/TrustVerifyClient.php"] = `<?php

namespace TrustVerify;

class TrustVerifyClient
{
    private $apiKey;
    private $baseUrl;

    public function __construct($apiKey, $baseUrl = 'https://api.trustverify.co.uk/v1')
    {
        $this->apiKey = $apiKey;
        $this->baseUrl = $baseUrl;
    }

    public function verifyIdentity($data)
    {
        // Implementation for identity verification
        return ['success' => true, 'data' => $data];
    }

    public function checkFraud($data)
    {
        // Implementation for fraud checking
        return ['success' => true, 'data' => $data];
    }
}
`;
        files["README.md"] = `# TrustVerify PHP SDK

${sdk.description}

## Installation

\`\`\`bash
${sdk.installCommand}
\`\`\`

## Usage

\`\`\`php
<?php
require 'vendor/autoload.php';

use TrustVerify\\TrustVerifyClient;

$client = new TrustVerifyClient('your-api-key-here');

// Verify identity
$result = $client->verifyIdentity([
    'firstName' => 'John',
    'lastName' => 'Doe'
]);
\`\`\`

## Documentation

For full documentation, visit: https://docs.trustverify.co.uk
`;
        break;

      case "ruby":
        files["trustverify-sdk.gemspec"] = `Gem::Specification.new do |spec|
  spec.name          = "trustverify-sdk"
  spec.version       = "${sdk.version}"
  spec.authors       = ["TrustVerify"]
  spec.description   = "${sdk.description}"
  spec.summary       = "TrustVerify SDK for Ruby"
  spec.license       = "MIT"
  spec.files         = Dir["lib/**/*"]
  spec.require_paths = ["lib"]
  spec.add_dependency "httparty", "~> 0.21"
end
`;
        files["lib/trustverify.rb"] = `# TrustVerify SDK for Ruby
# Version ${sdk.version}

module TrustVerify
  class Client
    def initialize(api_key, base_url = 'https://api.trustverify.co.uk/v1')
      @api_key = api_key
      @base_url = base_url
    end

    def verify_identity(data)
      # Implementation for identity verification
      { success: true, data: data }
    end

    def check_fraud(data)
      # Implementation for fraud checking
      { success: true, data: data }
    end
  end
end
`;
        files["README.md"] = `# TrustVerify Ruby SDK

${sdk.description}

## Installation

\`\`\`bash
${sdk.installCommand}
\`\`\`

## Usage

\`\`\`ruby
require 'trustverify'

client = TrustVerify::Client.new('your-api-key-here')

# Verify identity
result = client.verify_identity(
  firstName: 'John',
  lastName: 'Doe'
)
\`\`\`

## Documentation

For full documentation, visit: https://docs.trustverify.co.uk
`;
        break;

      case "go":
        files["go.mod"] = `module github.com/trustverify/sdk-go

go 1.21

require (
    github.com/go-resty/resty/v2 v2.11.0
)
`;
        files["client.go"] = `package trustverify

import (
    "github.com/go-resty/resty/v2"
)

type Client struct {
    apiKey  string
    baseURL string
    client  *resty.Client
}

func NewClient(apiKey string) *Client {
    return &Client{
        apiKey:  apiKey,
        baseURL: "https://api.trustverify.co.uk/v1",
        client:  resty.New(),
    }
}

func (c *Client) VerifyIdentity(data map[string]interface{}) (map[string]interface{}, error) {
    // Implementation for identity verification
    return map[string]interface{}{"success": true, "data": data}, nil
}

func (c *Client) CheckFraud(data map[string]interface{}) (map[string]interface{}, error) {
    // Implementation for fraud checking
    return map[string]interface{}{"success": true, "data": data}, nil
}
`;
        files["README.md"] = `# TrustVerify Go SDK

${sdk.description}

## Installation

\`\`\`bash
${sdk.installCommand}
\`\`\`

## Usage

\`\`\`go
package main

import (
    "github.com/trustverify/sdk-go"
)

func main() {
    client := trustverify.NewClient("your-api-key-here")
    
    // Verify identity
    result, err := client.VerifyIdentity(map[string]interface{}{
        "firstName": "John",
        "lastName": "Doe",
    })
}
\`\`\`

## Documentation

For full documentation, visit: https://docs.trustverify.co.uk
`;
        break;
    }

    return files;
  };

  const handleDownloadSDK = async (sdk: typeof sdks[0]) => {
    try {
      setDownloadingSdk(sdk.id);
      
      const zip = new JSZip();
      const files = generateSDKFiles(sdk);

      // Add all files to zip
      Object.entries(files).forEach(([filename, content]) => {
        zip.file(filename, content);
      });

      // Generate zip file
      const blob = await zip.generateAsync({ type: "blob" });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `trustverify-sdk-${sdk.id}-${sdk.version}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "SDK Downloaded",
        description: `${sdk.name} SDK v${sdk.version} has been downloaded successfully.`,
      });
    } catch (error: any) {
      console.error("Error downloading SDK:", error);
      toast({
        title: "Download Failed",
        description: error.message || "Failed to download SDK. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDownloadingSdk(null);
    }
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
                  onClick={() => handleDownloadSDK(sdk)}
                  disabled={downloadingSdk === sdk.id}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {downloadingSdk === sdk.id ? "Downloading..." : "Download"}
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

