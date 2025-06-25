import React, { useEffect, useState } from "react";
import { Card, Typography, Avatar, Divider, Tag, Spin } from "antd";
import {
    UserOutlined,
    CrownOutlined,
    CheckCircleOutlined,
    ShopOutlined,
    EnvironmentOutlined,
    MailOutlined,
    PhoneOutlined,
} from "@ant-design/icons";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../Auth/msalConfig";
import apiService from "../../services/api";

const { Title, Text } = Typography;

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

const Profile: React.FC = () => {
    const data = JSON.parse(sessionStorage.getItem("userData") || "{}");
    const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([]);
    const [loading, setLoading] = useState(true);
    const { instance, accounts } = useMsal();

    const userInfo = {
        firstName: data?.first_name || "",
        lastName: data?.last_name || "",
        email: data?.email || "",
        contact: data?.contact_number || "",
        address: data?.address || "",
    };

    const vendorInfo = {
        name: data?.vendor?.name || "",
        email: data?.vendor?.email || "",
        contact: data?.vendor?.contact_number || "",
        address: data?.vendor?.address || "",
    };

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                if (accounts.length > 0) {
                    const response = await instance.acquireTokenSilent({
                        ...loginRequest,
                        account: accounts[0],
                    });

                    const plansResponse = await apiService.getPlans(
                        response.accessToken
                    );
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

    const getCurrentPlan = () => {
        return (
            pricingTiers.find((tier) => tier.status === "ACTIVE") ||
            pricingTiers[0]
        );
    };

    // Show loading state while fetching plans
    if (loading) {
        return (
            <div className="pl-24 pr-24 pt-5 pb-5 bg-gray-50 min-h-screen">
                <div className="w-full">
                    <Title level={3} className="text-lg ml-10 pt-5" ellipsis>
                        Profile Details
                    </Title>
                    <div className="flex justify-center items-center py-8">
                        <Spin tip="Loading plan details..." />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pl-24 pr-24 pt-5 pb-5 bg-gray-50 min-h-screen">
            <div className="w-full">
                <Title level={3} className="text-lg ml-10 pt-5" ellipsis>
                    Profile Details
                </Title>

                {/* First row with User and Vendor details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full pl-10 pr-10 pt-5">
                    {/* User Details Section */}
                    <Card
                        className="shadow-md hover:shadow-lg transition-shadow duration-300 w-full h-full p-8"
                        bordered={false}
                    >
                        <div className="flex flex-col items-start mb-8">
                            <Avatar
                                size={80}
                                icon={<UserOutlined />}
                                className="bg-blue-500 mb-6"
                            />
                            <div className="w-full">
                                <Title
                                    level={3}
                                    className="m-0 text-2xl mb-3"
                                    ellipsis
                                >
                                    {userInfo.firstName} {userInfo.lastName}
                                </Title>
                                <Text
                                    type="secondary"
                                    className="block mb-4 text-lg truncate w-full"
                                >
                                    {userInfo.email}
                                </Text>
                            </div>
                        </div>

                        <Divider className="my-6" />

                        <div className="space-y-6">
                            <div className="flex flex-col">
                                <Text
                                    strong
                                    className="text-gray-600 mb-1 text-lg"
                                >
                                    <MailOutlined className="mr-2" />
                                    Email
                                </Text>
                                <Tag className="px-3 py-1 truncate max-w-full text-base text-gray-700 bg-gray-50">
                                    {userInfo.email}
                                </Tag>
                            </div>
                            <div className="flex flex-col">
                                <Text
                                    strong
                                    className="text-gray-600 mb-1 text-lg"
                                >
                                    <PhoneOutlined className="mr-2" />
                                    Contact
                                </Text>
                                <Tag className="px-3 py-1 truncate max-w-full text-base text-gray-700 bg-gray-50">
                                    {userInfo.contact}
                                </Tag>
                            </div>
                            <div className="flex flex-col">
                                <Text
                                    strong
                                    className="text-gray-600 mb-1 text-lg"
                                >
                                    <EnvironmentOutlined className="mr-2" />
                                    Address
                                </Text>
                                <Tag className="px-3 py-1 truncate max-w-full text-base text-gray-700 bg-gray-50">
                                    {userInfo.address}
                                </Tag>
                            </div>
                        </div>
                    </Card>

                    {/* Vendor Details Section */}
                    <Card
                        className="shadow-md hover:shadow-lg transition-shadow duration-300 w-full h-full p-8"
                        bordered={false}
                    >
                        <div className="mb-8">
                            <div className="relative flex items-center">
                                <ShopOutlined className="text-3xl text-blue-500 relative top-[2px]" />
                                <Title
                                    level={3}
                                    className="m-0 text-2xl ml-3 mt-3 leading-none relative top-[2px]"
                                    ellipsis
                                >
                                    Vendor Details
                                </Title>
                            </div>
                        </div>

                        <Divider className="my-6" />

                        <div className="space-y-6">
                            <div className="flex flex-col">
                                <Text
                                    strong
                                    className="text-gray-600 mb-1 text-lg"
                                >
                                    Company
                                </Text>
                                <Tag className="px-3 py-1 truncate max-w-full text-base text-gray-700 bg-gray-50">
                                    {vendorInfo.name}
                                </Tag>
                            </div>
                            <div className="flex flex-col">
                                <Text
                                    strong
                                    className="text-gray-600 mb-1 text-lg"
                                >
                                    <MailOutlined className="mr-2" />
                                    Email
                                </Text>
                                <Tag className="px-3 py-1 truncate max-w-full text-base text-gray-700 bg-gray-50">
                                    {vendorInfo.email}
                                </Tag>
                            </div>
                            <div className="flex flex-col">
                                <Text
                                    strong
                                    className="text-gray-600 mb-1 text-lg"
                                >
                                    <PhoneOutlined className="mr-2" />
                                    Contact
                                </Text>
                                <Tag className="px-3 py-1 truncate max-w-full text-base text-gray-700 bg-gray-50">
                                    {vendorInfo.contact}
                                </Tag>
                            </div>
                            <div className="flex flex-col">
                                <Text
                                    strong
                                    className="text-gray-600 mb-1 text-lg"
                                >
                                    <EnvironmentOutlined className="mr-2" />
                                    Address
                                </Text>
                                <Tag className="px-3 py-1 truncate max-w-full text-base text-gray-700 bg-gray-50">
                                    {vendorInfo.address}
                                </Tag>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Second row with Plan details */}
                <div className="w-full pl-10 pr-10 pt-5">
                    <Card
                        className="shadow-md hover:shadow-lg transition-shadow duration-300 w-full p-8"
                        bordered={false}
                    >
                        <div className="mb-8">
                            <div className="relative flex items-center">
                                <CrownOutlined className="text-3xl text-yellow-500 relative top-[2px]" />
                                <Title
                                    level={3}
                                    className="m-0 text-2xl ml-3 mt-3 leading-none relative top-[2px]"
                                    ellipsis
                                >
                                    Plan Details
                                </Title>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg mb-6">
                            <Text className="font-medium flex items-center text-lg truncate">
                                <Tag className="mr-2 text-base text-gray-700 bg-gray-50">
                                    {getCurrentPlan()?.name || "Loading..."}
                                </Tag>
                                Current
                            </Text>
                        </div>

                        <div className="space-y-3">
                            <Title level={4} className="!mb-3 text-xl" ellipsis>
                                Features:
                            </Title>
                            {getCurrentPlan() ? (
                                formatFeatures(getCurrentPlan()!).map(
                                    (feature, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center"
                                        >
                                            <CheckCircleOutlined className="text-green-500 mr-2 text-lg shrink-0" />
                                            <Text className="text-lg truncate">
                                                {feature}
                                            </Text>
                                        </div>
                                    )
                                )
                            ) : (
                                <div className="text-center py-4">
                                    <Text type="secondary">
                                        No plan information available
                                    </Text>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
                {/* Plan Details Section */}
            </div>
        </div>
    );
};

export default Profile;
