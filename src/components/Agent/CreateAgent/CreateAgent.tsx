import { useState } from "react";
import {
  FileTextOutlined,
  FileOutlined,
  MessageOutlined,
} from "@ant-design/icons";

import TextAgentForm from "./TextAgentForm";
import QnAAgentForm from "./QnAAgentForm";
import FileAgentForm from "./FileAgentForm";

const tabs = [
  { key: "text", label: "Text", icon: <FileTextOutlined /> },
  { key: "file", label: "Files", icon: <FileOutlined /> },
  { key: "qa", label: "Q/A", icon: <MessageOutlined /> },
];

const CreateAgent = () => {
  const [activeTab, setActiveTab] = useState("text");

  const renderForm = () => {
    switch (activeTab) {
      case "text":
        return <TextAgentForm />;
      case "qa":
        return <QnAAgentForm />;
      case "file":
        return <FileAgentForm />;
      case "website":
        return (
          <div>
            <h2 className="text-lg font-semibold mb-2">Website Form</h2>
            <p className="text-gray-500">
              This is the website form placeholder.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex p-20 gap-10">
      {/* Sidebar */}
      <div className="w-64">
        <h1 className="text-3xl font-bold mb-6">Data Sources</h1>
        <div className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-full text-left font-medium transition ${
                activeTab === tab.key
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-blue-50 p-6 rounded-lg shadow relative min-h-[24rem]">
        <h2 className="text-blue-600 font-bold text-lg mb-4 capitalize">
          {tabs.find((t) => t.key === activeTab)?.label}
        </h2>

        <div className="pb-20">{renderForm()}</div>

        <button
          className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2  shadow create-agent-btn"
          onClick={() => {
            console.error("Create Agent clicked");
            // Add your agent creation logic here
          }}
        >
          Create Agent
        </button>
      </div>
    </div>
  );
};

export default CreateAgent;
