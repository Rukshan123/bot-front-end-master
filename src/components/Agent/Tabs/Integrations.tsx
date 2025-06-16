import React from "react";
import { Card } from "antd";
import {
  GlobalOutlined,
  MobileOutlined,
  MessageOutlined,
} from "@ant-design/icons";

const integrations = [
  {
    icon: <GlobalOutlined className="text-2xl text-blue-500" />, // Website
    title: "Embed On Website",
    description: "Integrate your bot directly on your website.",
  },
  {
    icon: <MessageOutlined className="text-2xl text-green-500" />, // WhatsApp (closest in antd)
    title: "On Whatsapp",
    description: "Connect your bot to WhatsApp for direct messaging.",
  },
  {
    icon: <MobileOutlined className="text-2xl text-purple-500" />, // Mobile App
    title: "On Mobile App",
    description: "Use your bot in your mobile application.",
  },
];

function Integrations() {
  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-14 mt-8">
        {integrations.map((item) => (
          <Card
            key={item.title}
            className="w-60 shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200 rounded-xl cursor-pointer bg-white group"
            bodyStyle={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.5rem",
              padding: "1rem",
            }}
            hoverable
          >
            <div className="mt-1">{item.icon}</div>
            <div>
              <div className="font-semibold text-lg text-gray-800 group-hover:text-blue-600 mb-1">
                {item.title}
              </div>
              <div className="text-gray-500 text-sm">{item.description}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Integrations;
