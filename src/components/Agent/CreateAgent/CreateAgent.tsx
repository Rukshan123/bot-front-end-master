import { useState } from "react";
import {
  FileTextOutlined,
  FileOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { UploadFile } from "antd/es/upload";
import { message } from "antd";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../../Auth/msalConfig";
import { useNavigate } from "react-router-dom";
import apiService from "../../../services/api";

import TextAgentForm from "./TextAgentForm";
import QnAAgentForm from "./QnAAgentForm";
import FileAgentForm from "./FileAgentForm";

// Define types for form data
interface TextFormData {
  name: string;
  trainingText: string;
  whatsappNumber?: string;
  enableWhatsApp: boolean;
}

interface QnAFormData {
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

interface FileFormData {
  files: UploadFile[];
}

const tabs = [
  { key: "text", label: "Info", icon: <FileTextOutlined /> },
  { key: "file", label: "Files", icon: <FileOutlined /> },
  { key: "qa", label: "Q/A", icon: <MessageOutlined /> },
];

const CreateAgent = () => {
  const [activeTab, setActiveTab] = useState("text");
  const { instance, accounts } = useMsal();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Maintain form states
  const [textFormData, setTextFormData] = useState<TextFormData>({
    name: "",
    trainingText: "",
    enableWhatsApp: false,
    whatsappNumber: "",
  });

  const [qaFormData, setQaFormData] = useState<QnAFormData>({
    questions: [{ question: "", answer: "" }],
  });

  const [fileFormData, setFileFormData] = useState<FileFormData>({
    files: [],
  });

  const handleTabChange = (tabKey: string) => {
    if (tabKey !== "text" && !textFormData.name.trim()) {
      message.error("Please enter a chatbot name first");
      return;
    }
    setActiveTab(tabKey);
  };

  const renderForm = () => {
    switch (activeTab) {
      case "text":
        return (
          <TextAgentForm formData={textFormData} onChange={setTextFormData} />
        );
      case "qa":
        return <QnAAgentForm formData={qaFormData} onChange={setQaFormData} />;
      case "file":
        return (
          <FileAgentForm formData={fileFormData} onChange={setFileFormData} />
        );
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

  const handleCreateAgent = async () => {
    if (!textFormData.name.trim()) {
      message.error("Please enter a chatbot name");
      setActiveTab("text");
      return;
    }

    setIsLoading(true);
    try {
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      });

      const allData = {
        textData: textFormData,
        qaData: qaFormData,
        fileData: fileFormData,
      };

      const result = await apiService.createAgent(
        response.accessToken,
        allData
      );
      message.success("Agent created successfully!");
      navigate("/agents");
    } catch (error: any) {
      console.error("Error creating agent:", error);
      if (error.code === "ERR_NETWORK") {
        message.error("Network error. Please try again later.");
      } else {
        message.error(
          error.response?.data?.message || "Failed to create agent"
        );
      }
    } finally {
      setIsLoading(false);
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
                  : tab.key !== "text" && !textFormData.name.trim()
                  ? "opacity-50 cursor-not-allowed hover:bg-gray-100 text-gray-600"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
              onClick={() => handleTabChange(tab.key)}
              disabled={tab.key !== "text" && !textFormData.name.trim()}
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
          className={`absolute bottom-4 right-4 text-white px-6 py-2.5 rounded-md text-sm font-medium shadow-sm transition-colors duration-200 create-agent-btn ${
            !textFormData.name.trim()
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          onClick={handleCreateAgent}
          disabled={!textFormData.name.trim()}
        >
          Create Agent
        </button>
      </div>
    </div>
  );
};

export default CreateAgent;
