import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRightIcon, CopyIcon, X } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";
import { Header } from "../../components/Header";

  const apiEndpoints = [
    {
      id: "authentication",
      label: "Authentication",
      icon: "/fi-263069.svg",
      active: true,
    },
    {
      id: "transactions",
      label: "Transactions",
      icon: "/fi-4475436.svg",
      active: false,
    },
    {
      id: "kyc",
      label: "KYC Verification",
      icon: "/fi-7355471.svg",
      active: false,
    },
    {
      id: "fraud",
      label: "Fraud Detection",
      icon: "/fi-11083384.svg",
      active: false,
    },
    {
      id: "webhooks",
      label: "Webhooks",
      icon: "/fi-2449158.svg",
      active: false,
    },
  ];
  
  const errorCodes = [
    {
      code: "400",
      title: "Bad Request",
      description: "Invalid request parameters or missing required fields",
    },
    {
      code: "401",
      title: "Unauthorized",
      description: "Invalid or missing API key",
    },
    {
      code: "403",
      title: "Forbidden",
      description: "Insufficient permissions for the requested operation",
    },
    {
      code: "429",
      title: "Rate Limited",
      description: "Too many requests, please slow down",
    },
  ];

  const transactionEndpoints = [
    {
      method: "POST",
      methodColor: "bg-[#436cc833] text-[#436cc8]",
      url: "/api/transactions",
      description: "Create a new transaction",
      codeExample: `curl -X POST https://api.trustverify.com/api/transactions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Website Development",
    "description": "Custom e-commerce website",
    "amount": 2500.00,
    "currency": "USD",
    "buyerEmail": "buyer@example.com",
    "sellerEmail": "seller@example.com",
    "category": "digital_services",
    "deliveryTimeframe": "14_days"
  }'`,
    },
    {
      method: "GET",
      methodColor: "bg-[#27ae6033] text-[#27ae60]",
      url: "/api/transactions/{id}",
      description: "Get transaction details",
      codeExample: `curl -X GET https://api.trustverify.com/api/transactions/txn_123 \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
    },
    {
      method: "PUT",
      methodColor: "bg-[#eab30833] text-yellow-500",
      url: "/api/transactions/{id}/status",
      description: "Update transaction status",
      codeExample: `curl -X PUT https://api.trustverify.com/api/transactions/txn_123/status \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "status": "completed",
    "completedBy": "buyer",
    "deliveryProof": "Delivery confirmation received"
  }'`,
    },
  ];

  // Content structure for each endpoint
  // Add content for other endpoints by adding new objects with the endpoint id as key
  const endpointContent: Record<string, JSX.Element> = {
    authentication: (
      <>
        <Card className="w-full bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-[#e4e4e4]">
          <CardContent className="flex flex-col items-start gap-6 sm:gap-[39px] p-4 sm:p-6">
            <div className="inline-flex items-start gap-2 sm:gap-2.5">
              <img
                className="w-10 h-10 sm:w-[46px] sm:h-[46px]"
                alt="Quick Start"
                src="/p-2-rounded-lg-bg-accent-10-1.svg"
              />
              <div className="flex flex-col items-start gap-0.5">
                <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg sm:text-xl tracking-[0] leading-5 sm:leading-6">
                  Quick Start
                </h3>
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xs sm:text-sm tracking-[0] leading-5 sm:leading-6">
                  Get Started With The Trustvault Api In Seconds
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start gap-4 sm:gap-[30px] w-full">
              <Card className="w-full bg-[#f7f7f7] rounded-[14px] border-0">
                <CardContent className="flex flex-col items-start gap-4 sm:gap-6 p-4 sm:p-6">
                  <h4 className="text-base sm:text-lg [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] tracking-[0] leading-5 sm:leading-6">
                    Authentication
                  </h4>

                  <div className="flex flex-col items-start gap-2 sm:gap-2.5 w-full">
                    <p className="text-[#0052cc] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-sm sm:text-[15px] tracking-[0] leading-5 sm:leading-6 break-words">
                      Include Your Api Key In Authorization Header For All
                      Request
                    </p>

                    <div className="flex items-center gap-2 sm:gap-2.5 px-4 sm:px-[23px] py-4 sm:py-6 w-full bg-[#121728] rounded-[10px] min-h-[48px] sm:h-[55px]">
                      <code className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#27ae60] text-sm sm:text-base tracking-[0] leading-5 sm:leading-6 break-all">
                        Authorization: Bearer YOUR_API_KEY
                      </code>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4 sm:gap-0 sm:max-w-[596px]">
                <div className="flex flex-col items-start gap-2">
                  <div className="[font-family:'Suisse_Intl-Medium',Helvetica] font-medium text-[#003d2b] text-sm sm:text-base tracking-[0] leading-4 sm:leading-5">
                    Content Type
                  </div>
                  <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm sm:text-base tracking-[0] leading-5 sm:leading-6">
                    application/json
                  </div>
                </div>

                <div className="flex flex-col items-start gap-2">
                  <div className="[font-family:'Suisse_Intl-Medium',Helvetica] font-medium text-[#003d2b] text-sm sm:text-base tracking-[0] leading-4 sm:leading-5">
                    Rate Limit
                  </div>
                  <div className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-[#a308f7] text-sm sm:text-base tracking-[0] leading-5 sm:leading-6">
                    1000 Requests/hour
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-[#e4e4e4]">
          <CardContent className="flex flex-col items-start gap-4 sm:gap-6 p-4 sm:p-6">
            <div className="inline-flex items-start gap-2 sm:gap-2.5">
              <img
                className="w-10 h-10 sm:w-[46px] sm:h-[46px]"
                alt="Authentication"
                src="/p-2-rounded-lg-bg-accent-10.svg"
              />
              <div className="flex flex-col items-start gap-0.5">
                <h3 className="text-lg sm:text-xl [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] tracking-[0] leading-5 sm:leading-6">
                  Authentication
                </h3>
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xs sm:text-sm tracking-[0] leading-5 sm:leading-6">
                  Api Key Management And Authentication
                </p>
              </div>
            </div>

            <Card className="w-full bg-[#f7f7f7] rounded-[14px] border-0">
              <CardContent className="flex flex-col items-start gap-4 sm:gap-6 p-4 sm:p-6">
                <div className="inline-flex items-center gap-2 sm:gap-2.5 flex-wrap">
                  <Badge className="bg-[#3f4ef833] text-[#3f4ef8] hover:bg-[#3f4ef833] rounded-[50px] px-2 sm:px-2.5 py-1.5 sm:py-[7px] h-auto">
                    <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-xs tracking-[0] leading-[9.2px]">
                      POST
                    </span>
                  </Badge>
                  <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm sm:text-base tracking-[0.48px] leading-4 sm:leading-5 break-all">
                    /api/auth/validate
                  </span>
                </div>

                <p className="text-[#808080] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-sm sm:text-[15px] tracking-[0] leading-5 sm:leading-6">
                  Validate API Key and get permissions
                </p>

                <div className="flex items-start justify-between w-full px-4 sm:px-[23px] py-4 sm:py-6 bg-[#121728] rounded-[10px] gap-3">
                  <div className="inline-flex flex-col items-start justify-center gap-2 sm:gap-2.5 flex-1 min-w-0">
                    <Badge className="bg-white text-[#003d2b] hover:bg-white rounded-[50px] px-2 sm:px-2.5 py-1.5 sm:py-[7px] h-auto">
                      <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-xs tracking-[0] leading-[9.2px]">
                        cURL Example
                      </span>
                    </Badge>
                    <pre className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-white text-xs sm:text-sm md:text-base tracking-[0] leading-5 sm:leading-6 whitespace-pre-wrap break-all overflow-x-auto w-full">
                      {`curl -X GET "https://api.trustvault.com/v1/auth/verify" \\
                        -H "Authorization: Bearer YOUR_API_KEY" \\
                        -H "Content-Type: application/json"`}
                    </pre>
                  </div>
                  <button className="p-2 sm:p-0 flex-shrink-0">
                    <CopyIcon className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-white cursor-pointer" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </>
    ),

    transactions: (
      <>
        <Card className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-[#e4e4e4] w-full">
            <CardContent className="p-4 sm:p-6 flex flex-col gap-6 sm:gap-[39px]">
              <div className="flex items-start gap-2 sm:gap-2.5">
                <img
                  className="w-10 h-10 sm:w-[46px] sm:h-[46px]"
                  alt="Transactions icon"
                  src="/p-2-rounded-lg-bg-accent-10-2.svg"
                />
                <div className="flex flex-col gap-0.5">
                  <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg sm:text-xl tracking-[0] leading-5 sm:leading-6">
                    Transactions
                  </h2>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xs sm:text-sm tracking-[0] leading-5 sm:leading-6">
                    Create And Manage Secure Transactions
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:gap-6">
                {transactionEndpoints.map((endpoint, index) => (
                  <Card
                    key={index}
                    className="bg-[#f7f7f7] rounded-[14px] border-0"
                  >
                    <CardContent className="p-4 sm:p-6 flex flex-col gap-3 sm:gap-[10px]">
                      <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                        <Badge
                          className={`${endpoint.methodColor} rounded-[50px] px-2 sm:px-2.5 py-1.5 sm:py-[7px] h-auto`}
                        >
                          <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-xs text-center tracking-[0] leading-[9.2px]">
                            {endpoint.method}
                          </span>
                        </Badge>
                        <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm sm:text-base tracking-[0.48px] leading-4 sm:leading-5 break-all">
                          {endpoint.url}
                        </span>
                      </div>

                      <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm sm:text-[15px] tracking-[0] leading-5 sm:leading-6">
                        {endpoint.description}
                      </p>

                      <div className="bg-[#121728] rounded-[10px] p-4 sm:p-6 flex items-start justify-between gap-3">
                        <div className="flex flex-col gap-2 sm:gap-2.5 flex-1 min-w-0">
                          <Badge className="bg-white rounded-[50px] px-2 sm:px-2.5 py-1.5 sm:py-[7px] h-auto w-fit">
                            <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-xs text-center tracking-[0] leading-[9.2px]">
                              cURL Example
                            </span>
                          </Badge>
                          <pre className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-white text-xs sm:text-sm md:text-base tracking-[0] leading-5 sm:leading-6 whitespace-pre-wrap break-all overflow-x-auto">
                            {endpoint.codeExample}
                          </pre>
                        </div>
                        <button className="p-2 sm:p-0 flex-shrink-0">
                          <img
                            className="w-5 h-5 sm:w-[22px] sm:h-[22px]"
                            alt="Copy"
                            src="/fi-5859288.svg"
                          />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
      </>
    ),

    kyc: (
      <>
        <Card className="w-full bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-[#e4e4e4]">
            <CardContent className="flex flex-col items-start gap-6 sm:gap-[39px] p-4 sm:p-6">
              <div className="inline-flex items-start gap-2 sm:gap-2.5">
                <img
                  className="w-10 h-10 sm:w-[46px] sm:h-[46px]"
                  alt="KYC icon"
                  src="/p-2-rounded-lg-bg-accent-10-3.svg"
                />
                <div className="flex flex-col items-start gap-0.5">
                  <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg sm:text-xl tracking-[0] leading-5 sm:leading-6">
                    KYC Verification
                  </h2>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xs sm:text-sm tracking-[0] leading-5 sm:leading-6">
                    Identity Verification And Compliance
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start gap-4 sm:gap-6 w-full">
                <Card className="w-full bg-[#f7f7f7] rounded-[14px] border-0">
                  <CardContent className="flex flex-col items-start gap-4 sm:gap-6 p-4 sm:p-6">
                    <div className="inline-flex items-center gap-2 sm:gap-2.5 flex-wrap">
                      <Badge className="bg-[#436cc833] text-[#436cc8] hover:bg-[#436cc833] rounded-[50px] px-2 sm:px-2.5 py-1.5 sm:py-[7px] h-auto">
                        <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-xs tracking-[0] leading-[9.2px]">
                          POST
                        </span>
                      </Badge>
                      <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm sm:text-base tracking-[0.48px] leading-4 sm:leading-5 break-all">
                        /api/kyc/submit
                      </span>
                    </div>

                    <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm sm:text-[15px] tracking-[0] leading-5 sm:leading-6 w-full">
                      Submit KYC verification documents
                    </p>

                    <div className="flex items-start justify-between w-full bg-[#121728] rounded-[10px] px-4 sm:px-[23px] py-4 sm:py-6 gap-3">
                      <div className="inline-flex flex-col items-start justify-center gap-2 sm:gap-2.5 flex-1 min-w-0">
                        <Badge className="bg-white text-[#003d2b] hover:bg-white rounded-[50px] px-2 sm:px-2.5 py-1.5 sm:py-[7px] h-auto">
                          <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-xs tracking-[0] leading-[9.2px]">
                            cURL Example
                          </span>
                        </Badge>
                        <pre className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-white text-xs sm:text-sm md:text-base tracking-[0] leading-5 sm:leading-6 whitespace-pre-wrap break-all overflow-x-auto">
                          {`curl -X POST https://api.trustverify.com/api/kyc/submit \\
-H "Authorization: Bearer YOUR_API_KEY" \\
-H "Content-type: application/json" \\
-d '{
  "userId": "user_123",
  "documentType": "passport",
  "documentNumber": "P123456789",
  "personalInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1990-01-01"
  },
  "documents": {
    "frontId": "base64_encoded_image",
    "backId": "base64_encoded_image",
    "selfie": "base64_encoded_image"
  }
}'`}
                        </pre>
                      </div>
                      <button className="p-2 sm:p-0 flex-shrink-0">
                        <CopyIcon className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-white" />
                      </button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="w-full bg-[#f7f7f7] rounded-[14px] border-0">
                  <CardContent className="flex flex-col items-start gap-4 sm:gap-6 p-4 sm:p-6">
                    <div className="inline-flex items-center gap-2 sm:gap-2.5 flex-wrap">
                      <Badge className="bg-[#27ae6033] text-[#27ae60] hover:bg-[#27ae6033] rounded-[50px] px-2 sm:px-2.5 py-1.5 sm:py-[7px] h-auto">
                        <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-xs tracking-[0] leading-[9.2px]">
                          GET
                        </span>
                      </Badge>
                      <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm sm:text-base tracking-[0.48px] leading-4 sm:leading-5 break-all">
                        /api/kyc/status/{"{"}userid{"}"}
                      </span>
                    </div>

                    <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm sm:text-[15px] tracking-[0] leading-5 sm:leading-6 w-full">
                      Get KYC verification status
                    </p>

                    <div className="flex items-start justify-between w-full bg-[#121728] rounded-[10px] px-4 sm:px-[23px] py-4 sm:py-6 gap-3">
                      <div className="inline-flex flex-col items-start justify-center gap-2 sm:gap-2.5 flex-1 min-w-0">
                        <Badge className="bg-white text-[#003d2b] hover:bg-white rounded-[50px] px-2 sm:px-2.5 py-1.5 sm:py-[7px] h-auto">
                          <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-xs tracking-[0] leading-[9.2px]">
                            cURL Example
                          </span>
                        </Badge>
                        <pre className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-white text-xs sm:text-sm md:text-base tracking-[0] leading-5 sm:leading-6 whitespace-pre-wrap break-all overflow-x-auto">
                          {`curl -X GET https://api.trustverify.com/api/kyc/status/user_123 \\
-H "Authorization: Bearer YOUR_API_KEY"`}
                        </pre>
                      </div>
                      <button className="p-2 sm:p-0 flex-shrink-0">
                        <CopyIcon className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-white" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
      </>
    ),

    fraud: (
      <>
        <Card className="w-full bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
            <CardContent className="flex flex-col items-start gap-6 sm:gap-[39px] p-4 sm:p-6">
              <div className="inline-flex items-start gap-2 sm:gap-2.5">
                <img
                  className="w-10 h-10 sm:w-[46px] sm:h-[46px]"
                  alt="Fraud Detection"
                  src="/p-2-rounded-lg-bg-accent-10-4.svg"
                />
                <div className="flex flex-col items-start gap-0.5">
                  <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg sm:text-xl tracking-[0] leading-5 sm:leading-6">
                    Fraud Detection
                  </h3>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xs sm:text-sm tracking-[0] leading-5 sm:leading-6">
                    Real-time Fraud Analysis And Scoring
                  </p>
                </div>
              </div>

              <div className="w-full bg-[#f7f7f7] rounded-[14px] p-4 sm:p-6 flex flex-col gap-3 sm:gap-4">
                <div className="inline-flex items-center gap-2 sm:gap-2.5 flex-wrap">
                  <Badge className="bg-[#436cc833] text-[#436cc8] hover:bg-[#436cc833] rounded-[50px] px-2 sm:px-2.5 py-1.5 sm:py-[7px] h-auto">
                    <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-xs tracking-[0] leading-[9.2px]">
                      POST
                    </span>
                  </Badge>
                  <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm sm:text-base tracking-[0.48px] leading-4 sm:leading-5 break-all">
                    /api/fraud/analyze
                  </span>
                </div>

                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm sm:text-[15px] tracking-[0] leading-5 sm:leading-6">
                  Analyze transaction for fraud risk
                </p>

                <div className="w-full bg-[#121728] rounded-[10px] p-4 sm:p-6 flex items-start justify-between gap-3">
                  <div className="inline-flex flex-col items-start justify-center gap-2 sm:gap-2.5 flex-1 min-w-0">
                    <Badge className="bg-white text-[#003d2b] hover:bg-white rounded-[50px] px-2 sm:px-2.5 py-1.5 sm:py-[7px] h-auto">
                      <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-xs tracking-[0] leading-[9.2px]">
                        cURL Example
                      </span>
                    </Badge>
                    <pre className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-white text-xs sm:text-sm md:text-base tracking-[0] leading-5 sm:leading-6 whitespace-pre-wrap break-all overflow-x-auto">
                      {`curl -X POST https://api.trustverify.com/api/fraud/analyze \\
-H "Authorization: Bearer YOUR_API_KEY" \\
-H "Content-Type: application/json" \\
-d '{
  "transactionId": "txn_123",
  "userAgent": "Mozilla/5.0...",
  "ipAddress": "192.168.1.1",
  "deviceFingerprint": "device_hash_123",
  "behaviorData": {
    "sessionDuration": 120,
    "clickPattern": "normal",
    "typingSpeed": "average"
  }
}'`}
                    </pre>
                  </div>
                  <button className="p-2 sm:p-0 flex-shrink-0">
                    <img
                      className="w-5 h-5 sm:w-[22px] sm:h-[22px]"
                      alt="Copy"
                      src="/fi-5859288.svg"
                    />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
      </>
    ),

    webhooks: (
      <>
        <Card className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-[#e4e4e4] w-full">
            <CardContent className="flex flex-col items-start gap-6 sm:gap-[39px] p-4 sm:p-6">
              <div className="inline-flex items-start gap-2 sm:gap-2.5">
                <img
                  className="w-10 h-10 sm:w-[46px] sm:h-[46px] flex-shrink-0"
                  alt="Webhooks icon"
                  src="/p-2-rounded-lg-bg-accent-10-4.svg"
                />
                <div className="flex flex-col items-start gap-0.5">
                  <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg sm:text-xl leading-5 sm:leading-6 tracking-[0]">
                    Webhooks
                  </h2>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xs sm:text-sm tracking-[0] leading-5 sm:leading-6">
                    Real-time Event Notifications
                  </p>
                </div>
              </div>

              <Card className="bg-[#f7f7f7] rounded-[14px] w-full">
                <CardContent className="flex flex-col items-start gap-4 sm:gap-6 p-4 sm:p-6">
                  <div className="inline-flex items-center gap-2 sm:gap-2.5 flex-wrap">
                    <Badge className="bg-[#436cc833] hover:bg-[#436cc833] rounded-[50px] px-2 sm:px-2.5 py-1.5 sm:py-[7px] h-auto">
                      <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#436cc8] text-xs text-center leading-[9.2px]">
                        POST
                      </span>
                    </Badge>
                    <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm sm:text-base tracking-[0.48px] leading-4 sm:leading-5 break-all">
                      /api/webhooks
                    </span>
                  </div>

                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm sm:text-[15px] tracking-[0] leading-5 sm:leading-6 w-full">
                    Create webhook endpoint
                  </p>

                  <Card className="bg-[#121728] rounded-[10px] w-full">
                    <CardContent className="flex items-start justify-between p-4 sm:p-6 gap-3">
                      <div className="inline-flex flex-col items-start justify-center gap-2 sm:gap-2.5 flex-1 min-w-0">
                        <Badge className="bg-white hover:bg-white rounded-[50px] px-2 sm:px-2.5 py-1.5 sm:py-[7px] h-auto">
                          <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-xs text-center tracking-[0] leading-[9.2px]">
                            cURL Example
                          </span>
                        </Badge>
                        <pre className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-white text-xs sm:text-sm md:text-base tracking-[0] leading-5 sm:leading-6 whitespace-pre-wrap break-all overflow-x-auto">
                          {`curl -X POST https://api.trustverify.com/api/webhooks \\
-H "Authorization: Bearer YOUR API KEY" \\
-H "Content-Type: application/json" \\
-d '{
"url": "https://your-app.com/webhooks/trustverify",
"events": ["transaction.created", "transaction.completed", "kyc.approved"],
"secret": "your_webhook_secret"
}'`}
                        </pre>
                      </div>
                      <button className="p-2 sm:p-0 flex-shrink-0">
                        <img
                          className="w-5 h-5 sm:w-[22px] sm:h-[22px]"
                          alt="Copy"
                          src="/fi-5859288.svg"
                        />
                      </button>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
      </>
    ),
  };

export const ApiReferences = (): JSX.Element => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>("authentication");
  const [isApiEndpointsMenuOpen, setIsApiEndpointsMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  
  return (
    <div className="bg-[#f6f6f6] w-full flex flex-col relative">
        <Header />

        <div className="flex flex-col items-start gap-4 sm:gap-[30px] w-full px-4 sm:px-6 md:px-[100px] pt-6 sm:pt-[50px] pb-8 sm:pb-[120px]">
            <div className="flex flex-col items-start gap-4 sm:gap-6 w-full">
                <button
                  className="inline-flex items-center gap-2 sm:gap-2.5 p-2 sm:p-0"
                  onClick={() => navigate(-1)}
                >
                <img
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    alt="Back"
                    src="/flat-color-icons-next.svg"
                />
                <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base sm:text-lg md:text-[22px] tracking-[0] leading-[normal]">
                    Back
                </div>
                </button>

                <div className="flex flex-col items-start gap-2 sm:gap-2.5 w-full">
                <div className="flex items-center gap-3 w-full">
                  {/* Mobile Hamburger Button for API Endpoints */}
                  
                  <div className="flex flex-col items-start gap-2 sm:gap-2.5 flex-1">
                    <div className="flex items-center gap-2 sm:gap-2.5">
                        <button
                    onClick={() => setIsApiEndpointsMenuOpen(!isApiEndpointsMenuOpen)}
                    className="md:hidden p-2.5 transition-colors flex-shrink-0"
                    aria-label="Toggle API endpoints menu"
                  >
                    <img
                      className="w-5 h-5"
                      alt="Menu"
                      src="/fi-9091429.png"
                    />
                  </button>
                        <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-[0] leading-[normal]">
                        API Reference
                        </h1>
                    </div>
                    <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base sm:text-lg md:text-xl tracking-[0] leading-6 sm:leading-8">
                        Complete reference for TrustVault REST API endpoints
                    </p>
                  </div>
                </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-start gap-4 sm:gap-[21px] w-full">
                <Card className="hidden md:block w-full md:w-[389px] bg-white rounded-[14px] border-[0.8px] border-neutral-200 shadow-[0px_0px_0px_transparent,0px_0px_0px_transparent,0px_0px_0px_transparent,0px_0px_0px_transparent,0px_1px_3px_#0000001a,0px_1px_2px_-1px_#0000001a]">
                    <CardContent className="flex flex-col items-start gap-6 sm:gap-[50px] p-4 sm:p-6">
                    <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg sm:text-xl tracking-[0] leading-4">
                    API Endpoints 
                    </h2>

                    <div className="flex flex-col items-start gap-4 sm:gap-[21px] w-full">
                        <div className="flex flex-col items-start gap-2 sm:gap-2.5 w-full">
                            {apiEndpoints.map((endpoint) => {
                                const isActive = selectedEndpoint === endpoint.id;
                                return (
                                <button
                                    key={endpoint.id}
                                    onClick={() => setSelectedEndpoint(endpoint.id)}
                                    className={`flex items-center justify-between w-full h-[44px] sm:h-[50px] rounded-[10px] px-3 sm:px-[15px] transition-colors ${
                                    isActive ? "bg-app-secondary" : "bg-[#f8f8f8]"
                                    }`}
                                >
                                    <div className="inline-flex items-center gap-2 sm:gap-2.5">
                                    <img
                                        className="w-5 h-5 sm:w-6 sm:h-6"
                                        alt={endpoint.label}
                                        src={endpoint.icon}
                                    />
                                    <span
                                        className={`[font-family:'DM_Sans_18pt-${
                                        isActive ? "SemiBold" : "Regular"
                                        }',Helvetica] ${
                                        isActive ? "font-semibold" : "font-normal"
                                        } ${
                                        isActive ? "text-white" : "text-[#b4b4b4]"
                                        } text-xs sm:text-sm tracking-[0] leading-5 whitespace-nowrap`}
                                    >
                                        {endpoint.label}
                                    </span>
                                    </div>
                                    <ChevronRightIcon
                                    className={`w-3 h-3 sm:w-3 sm:h-3 ${
                                        isActive ? "text-white" : "text-[#b4b4b4]"
                                    }`}
                                    />
                                </button>
                                );
                            })}
                        </div>

                        <Card className="w-full bg-[#eef5fe] rounded-[14px] border-[0.8px] border-[#bddaff]">
                            <CardContent className="flex items-start gap-3 sm:gap-4 p-3 sm:p-[19px]">
                            <img
                                className="w-[36px] sm:w-[42px] h-8 sm:h-10"
                                alt="Base URL"
                                src="/p-2-bg-blue-100-rounded-lg.svg"
                            />
                            <div className="flex flex-col items-start gap-1">
                                <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#1b388e] text-sm sm:text-base tracking-[0] leading-5 sm:leading-6">
                                Base URL
                                </div>
                                <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#1347e5] text-xs sm:text-sm tracking-[0] leading-4 sm:leading-5 break-all">
                                https://api.trustvault.com/v1
                                </div>
                            </div>
                            </CardContent>
                        </Card>
                    </div>
                    </CardContent>
                </Card>

                {/* Mobile API Endpoints Sidebar Drawer */}
                <div
                  className={`fixed top-0 left-0 h-full w-[320px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
                    isApiEndpointsMenuOpen ? "translate-x-0" : "-translate-x-full"
                  } md:hidden`}
                >
                  <Card className="h-full bg-white rounded-none border-0 shadow-none">
                    <CardContent className="flex flex-col items-start gap-6 p-6 pt-20">
                      <div className="flex items-center justify-between w-full mb-2">
                        <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl tracking-[0] leading-4">
                          API Endpoints
                        </h2>
                        <button
                          onClick={() => setIsApiEndpointsMenuOpen(false)}
                          className="p-2 rounded-lg bg-[#f8f8f8] hover:bg-[#e8e8e8] transition-colors"
                          aria-label="Close menu"
                        >
                          <X className="w-5 h-5 text-[#003d2b]" />
                        </button>
                      </div>

                      <div className="flex flex-col items-start gap-4 w-full">
                        <div className="flex flex-col items-start gap-2.5 w-full">
                          {apiEndpoints.map((endpoint) => {
                            const isActive = selectedEndpoint === endpoint.id;
                            return (
                              <button
                                key={endpoint.id}
                                onClick={() => {
                                  setSelectedEndpoint(endpoint.id);
                                  setIsApiEndpointsMenuOpen(false);
                                }}
                                className={`flex items-center justify-between w-full h-[50px] rounded-[10px] px-[15px] transition-colors ${
                                  isActive ? "bg-app-secondary" : "bg-[#f8f8f8]"
                                }`}
                              >
                                <div className="inline-flex items-center gap-2.5">
                                  <img
                                    className="w-6 h-6"
                                    alt={endpoint.label}
                                    src={endpoint.icon}
                                  />
                                  <span
                                    className={`[font-family:'DM_Sans_18pt-${
                                      isActive ? "SemiBold" : "Regular"
                                    }',Helvetica] ${
                                      isActive ? "font-semibold" : "font-normal"
                                    } ${
                                      isActive ? "text-white" : "text-[#b4b4b4]"
                                    } text-sm tracking-[0] leading-5 whitespace-nowrap`}
                                  >
                                    {endpoint.label}
                                  </span>
                                </div>
                                <ChevronRightIcon
                                  className={`w-3 h-3 ${
                                    isActive ? "text-white" : "text-[#b4b4b4]"
                                  }`}
                                />
                              </button>
                            );
                          })}
                        </div>

                        <Card className="w-full bg-[#eef5fe] rounded-[14px] border-[0.8px] border-[#bddaff]">
                          <CardContent className="flex items-start gap-4 p-[19px]">
                            <img
                              className="w-[42px] h-10"
                              alt="Base URL"
                              src="/p-2-bg-blue-100-rounded-lg.svg"
                            />
                            <div className="flex flex-col items-start gap-1">
                              <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#1b388e] text-base tracking-[0] leading-6">
                                Base URL
                              </div>
                              <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#1347e5] text-sm tracking-[0] leading-5 break-all">
                                https://api.trustvault.com/v1
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Overlay for mobile API endpoints menu */}
                {isApiEndpointsMenuOpen && (
                  <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsApiEndpointsMenuOpen(false)}
                  />
                )}

            <div className="flex flex-col flex-1 items-start gap-4 sm:gap-6 w-full">
                {/* Dynamic content based on selected endpoint */}
                {endpointContent[selectedEndpoint] || (
                    <div className="w-full p-6 text-center text-[#808080]">
                        Content for this endpoint is coming soon...
                    </div>
                )}

                <Card className="w-full bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-[#e4e4e4]">
                    <CardContent className="flex flex-col items-start gap-4 sm:gap-[30px] p-4 sm:p-6">
                    <div className="flex flex-col items-start gap-0.5">
                        <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg sm:text-xl tracking-[0] leading-6">
                        Error Codes
                        </h3>
                        <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xs sm:text-sm tracking-[0] leading-5 sm:leading-6">
                        Common Http Status Codes And Error Responses
                        </p>
                    </div>

                    <div className="flex flex-col items-start gap-4 sm:gap-[38px] w-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-[319px] w-full">
                        {errorCodes.slice(0, 2).map((error) => (
                            <div
                            key={error.code}
                            className="flex flex-col items-start gap-2 sm:gap-[7px]"
                            >
                            <div className="inline-flex items-center gap-2.5 sm:gap-3.5">
                                <Badge className="bg-[#e24843] hover:bg-[#e24843] text-white rounded-[5px] px-2 sm:px-2.5 py-1.5 sm:py-[7px] h-auto">
                                <span className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-xs sm:text-sm tracking-[0] leading-[9.2px]">
                                    {error.code}
                                </span>
                                </Badge>
                                <span className="[font-family:'Suisse_Intl-Medium',Helvetica] font-medium text-[#003d2b] text-sm sm:text-base tracking-[0] leading-4 sm:leading-5">
                                {error.title}
                                </span>
                            </div>
                            <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm sm:text-base tracking-[0] leading-5 sm:leading-6">
                                {error.description}
                            </p>
                            </div>
                        ))}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-[319px] w-full">
                        {errorCodes.slice(2, 4).map((error) => (
                            <div
                            key={error.code}
                            className="flex flex-col items-start gap-2 sm:gap-[7px]"
                            >
                            <div className="inline-flex items-center gap-2.5 sm:gap-3.5">
                                <Badge className="bg-[#e24843] hover:bg-[#e24843] text-white rounded-[5px] px-2 sm:px-2.5 py-1.5 sm:py-[7px] h-auto">
                                <span className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-xs sm:text-sm tracking-[0] leading-[9.2px]">
                                    {error.code}
                                </span>
                                </Badge>
                                <span className="[font-family:'Suisse_Intl-Medium',Helvetica] font-medium text-[#003d2b] text-sm sm:text-base tracking-[0] leading-4 sm:leading-5">
                                {error.title}
                                </span>
                            </div>
                            <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm sm:text-base tracking-[0] leading-5 sm:leading-6">
                                {error.description}
                            </p>
                            </div>
                        ))}
                        </div>
                    </div>
                    </CardContent>
                </Card>
                </div>
            </div>
            </div>
        </div>
  );
};
