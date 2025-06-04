import React from "react";
import { Card, Button, Badge } from "antd";
import { CheckOutlined } from "@ant-design/icons";

interface PricingTier {
  name: string;
  price: string;
  originalPrice?: string;
  period: string;
  features: string[];
  popular?: boolean;
}

function Price() {
  const pricingTiers: PricingTier[] = [
    {
      name: "Free",
      price: "0",
      period: "",
      features: [
        "Access to fast models",
        "15 message credits",
        "1 agents",
        "1 Team members",
        "500,000 characters/agent",
        "Limit to 500 links to train on",
        "Embed on unlimited websites",
        "Upload multiple files",
        "Capture leads",
        "View conversation history",
      ],
    },
    {
      name: "Hobby",
      price: "120",
      originalPrice: "190",
      period: "/year",
      features: [
        "Access to advanced models",
        "2,000 message credits/month",
        "2 agents",
        "2,000,000 characters/agent",
        "Unlimited links to train on",
      ],
    },
    {
      name: "Standard",
      price: "600",
      originalPrice: "990",
      period: "/year",
      popular: true,
      features: [
        "10,000 message credits/month",
        "5 agents",
        "10 AI Actions/agent",
        "3 Team members",
        "6,000,000 characters/agent",
        "Integrations",
        "API access",
      ],
    },
    {
      name: "Pro",
      price: "2400",
      originalPrice: "3990",
      period: "/year",
      features: [
        "40,000 message credits/month",
        "10 agents",
        "15 AI Actions/agent",
        "5 Team members",
        "11,000,000 characters/agent",
        "Remove 'Powered by Sass Chatbot'",
      ],
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {pricingTiers.map((tier) => (
          <Card
            key={tier.name}
            className={`h-full min-w-[280px] ${
              tier.popular
                ? "border-2 border-blue-500 shadow-lg transform hover:scale-105"
                : "border hover:shadow-md"
            } transition-all duration-300`}
            title={
              <div className="text-center">
                {tier.popular && (
                  <Badge.Ribbon
                    text="Most popular"
                    color="blue"
                    className="text-base"
                  />
                )}
                <h3 className="text-2xl font-semibold mb-3">{tier.name}</h3>
                <div className="flex items-center justify-center gap-2">
                  {tier.originalPrice && (
                    <span className="text-gray-400 line-through text-xl">
                      ${tier.originalPrice}
                    </span>
                  )}
                  <span className="text-5xl font-bold">${tier.price}</span>
                  <span className="text-gray-600 text-lg">{tier.period}</span>
                </div>
              </div>
            }
          >
            <div className="space-y-4">
              {tier.name !== "Free" && (
                <p className="text-gray-600 mb-4 text-lg">
                  Everything in {tier.name === "Hobby" ? "Free" : "Hobby"} and
                  ...
                </p>
              )}
              <ul className="space-y-4">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckOutlined className="text-blue-500 mt-1.5 text-lg" />
                    <span className="text-lg">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-8">
                <Button
                  type={tier.popular ? "primary" : "default"}
                  block
                  size="large"
                  className={`text-lg h-12 ${
                    tier.popular ? "bg-blue-500" : ""
                  }`}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Price;
