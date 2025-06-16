import React, { useEffect, useState } from "react";
import { Card, Button, Badge } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import apiService from "../../services/api";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../Auth/msalConfig";

interface PricingTier {
  id: number;
  name: string;
  price: string;
  discount: string;
  msg_credit_per_month: number;
  agents: number;
  bots: number;
  characters_per_month: number;
  team_members: number;
  ai_actions: number;
  version: number;
  status: string;
}

function Price() {
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([]);
  const [loading, setLoading] = useState(true);
  const { instance, accounts } = useMsal();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        if (accounts.length > 0) {
          const response = await instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0],
          });

          const plansResponse = await apiService.getPlans(response.accessToken);
          if (plansResponse.data.success) {
            setPricingTiers(plansResponse.data.data);
          }
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [instance, accounts]);

  const formatFeatures = (tier: PricingTier) => {
    return [
      `${tier.msg_credit_per_month.toLocaleString()} message credits/month`,
      `${tier.agents} agents`,
      `${tier.bots} bots`,
      `${tier.characters_per_month.toLocaleString()} characters/month`,
      `${tier.team_members} team members`,
      `${tier.ai_actions} AI actions`,
    ];
  };

  if (loading) {
    return <div className="text-center py-8">Loading plans...</div>;
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {pricingTiers.map((tier) => (
          <Card
            key={tier.id}
            className={`h-full min-w-[380px] ${
              tier.status === "ACTIVE"
                ? "border-2 border-blue-500 shadow-lg transform hover:scale-105"
                : "border hover:shadow-md"
            } transition-all duration-300`}
            title={
              <div className="text-left">
                {tier.status === "ACTIVE" && (
                  <Badge.Ribbon
                    text="Active"
                    color="blue"
                    className="text-base"
                  />
                )}
                <h3 className="text-2xl font-semibold mb-3">{tier.name}</h3>
                <div className="flex items-center justify-center gap-2">
                  {tier.discount && (
                    <span className="text-gray-400 line-through text-xl">
                      $
                      {(
                        parseFloat(tier.price) + parseFloat(tier.discount)
                      ).toFixed(2)}
                    </span>
                  )}
                  <span className="text-5xl font-bold">${tier.price}</span>
                  <span className="text-gray-600 text-lg">/month</span>
                </div>
              </div>
            }
          >
            <div className="space-y-4">
              <ul className="space-y-4">
                {formatFeatures(tier).map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckOutlined className="text-blue-500 mt-1.5 text-lg" />
                    <span className="text-lg">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-8">
                <Button
                  type={tier.status === "ACTIVE" ? "primary" : "default"}
                  block
                  size="large"
                  className={`text-lg h-12 ${
                    tier.status === "ACTIVE" ? "bg-blue-500" : ""
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
