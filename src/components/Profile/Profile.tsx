import React from "react";
import { Card, Typography, Avatar, Divider, Tag } from "antd";
import {
  UserOutlined,
  CrownOutlined,
  CheckCircleOutlined,
  ShopOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const Profile: React.FC = () => {
  const storedUserData = sessionStorage.getItem("userData");
  const userData = storedUserData ? JSON.parse(storedUserData) : null;

  const userInfo = {
    firstName: userData?.first_name || "",
    lastName: userData?.last_name || "",
    email: userData?.email || "",
    contact: userData?.contact_number || "",
    address: userData?.address || "",
  };

  const vendorInfo = {
    name: userData?.vendor?.name || "",
    email: userData?.vendor?.email || "",
    contact: userData?.vendor?.contact_number || "",
    address: userData?.vendor?.address || "",
  };

  return (
    <div className="p-24 bg-gray-50 min-h-screen">
      <div className="w-full">
        <Title level={1} className="text-3xl ml-10 pt-5" ellipsis>
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
                <Title level={3} className="m-0 text-2xl mb-3" ellipsis>
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
                <Text strong className="text-gray-600 mb-1 text-lg">
                  <MailOutlined className="mr-2" />
                  Email
                </Text>
                <Tag className="px-3 py-1 truncate max-w-full text-base text-gray-700 bg-gray-50">
                  {userInfo.email}
                </Tag>
              </div>
              <div className="flex flex-col">
                <Text strong className="text-gray-600 mb-1 text-lg">
                  <PhoneOutlined className="mr-2" />
                  Contact
                </Text>
                <Tag className="px-3 py-1 truncate max-w-full text-base text-gray-700 bg-gray-50">
                  {userInfo.contact}
                </Tag>
              </div>
              <div className="flex flex-col">
                <Text strong className="text-gray-600 mb-1 text-lg">
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
                <Text strong className="text-gray-600 mb-1 text-lg">
                  Company
                </Text>
                <Tag className="px-3 py-1 truncate max-w-full text-base text-gray-700 bg-gray-50">
                  {vendorInfo.name}
                </Tag>
              </div>
              <div className="flex flex-col">
                <Text strong className="text-gray-600 mb-1 text-lg">
                  <MailOutlined className="mr-2" />
                  Email
                </Text>
                <Tag className="px-3 py-1 truncate max-w-full text-base text-gray-700 bg-gray-50">
                  {vendorInfo.email}
                </Tag>
              </div>
              <div className="flex flex-col">
                <Text strong className="text-gray-600 mb-1 text-lg">
                  <PhoneOutlined className="mr-2" />
                  Contact
                </Text>
                <Tag className="px-3 py-1 truncate max-w-full text-base text-gray-700 bg-gray-50">
                  {vendorInfo.contact}
                </Tag>
              </div>
              <div className="flex flex-col">
                <Text strong className="text-gray-600 mb-1 text-lg">
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
          {/* Plan Details Section */}
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

            <Divider className="my-6" />

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <Text className="font-medium flex items-center text-lg truncate">
                <Tag className="mr-2 text-base text-gray-700 bg-gray-50">
                  FREE PLAN
                </Tag>
                Current
              </Text>
            </div>

            <div className="space-y-3">
              <Title level={4} className="!mb-3 text-xl" ellipsis>
                Features:
              </Title>
              <div className="flex items-center">
                <CheckCircleOutlined className="text-green-500 mr-2 text-lg shrink-0" />
                <Text className="text-lg truncate">Basic profile</Text>
              </div>
              <div className="flex items-center">
                <CheckCircleOutlined className="text-green-500 mr-2 text-lg shrink-0" />
                <Text className="text-lg truncate">Standard support</Text>
              </div>
              <div className="flex items-center">
                <CheckCircleOutlined className="text-green-500 mr-2 text-lg shrink-0" />
                <Text className="text-lg truncate">Community access</Text>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
