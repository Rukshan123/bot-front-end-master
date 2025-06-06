import { useState } from "react";
import {
  FileTextOutlined,
  FileOutlined,
  MessageOutlined,
  RobotOutlined,
  ThunderboltOutlined,
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

interface CreateBotResponse {
  botId: string;
  // add other response fields if needed
}

interface TrainingData {
  botId: string;
  textData?: { trainingText: string } | null;
  qaData?: QnAFormData | null;
  fileData?: FileFormData | null;
}

const tabs = [
  { key: "text", label: "Text", icon: <FileTextOutlined /> },
  { key: "file", label: "File", icon: <FileOutlined /> },
  { key: "qa", label: "Q/A", icon: <MessageOutlined /> },
];

const CreateAgent = () => {
  const [activeSection, setActiveSection] = useState<"start" | "train">(
    "start"
  );
  const [activeTab, setActiveTab] = useState("text");
  const { instance, accounts } = useMsal();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [botId, setBotId] = useState<string | null>(null);

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

  const [trainingText, setTrainingText] = useState("");

  const handleCreateAgent = async () => {
    if (!textFormData.name.trim()) {
      message.error("Please enter a bot name");
      return;
    }

    setIsLoading(true);
    try {
      // Log the data that would be sent to create a bot
      console.log("Creating Bot with data:", {
        textData: textFormData,
        qaData: { questions: [] },
        fileData: { files: [] },
      });

      // Simulate API call success
      setTimeout(() => {
        message.success("Bot created successfully!");
        setBotId("sample-bot-id");
        setActiveSection("train");
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error in create bot flow:", error);
      message.error("Failed to create bot");
      setIsLoading(false);
    }
  };

  const handleTrainBot = async () => {
    if (activeSection === "train") {
      // Check if there's any data in any of the tabs
      const hasTextData = trainingText.trim();
      const hasQAData = qaFormData.questions.some(
        (q) => q.question.trim() || q.answer.trim()
      );
      const hasFileData = fileFormData.files.length > 0;

      if (!hasTextData && !hasQAData && !hasFileData) {
        message.error("Please provide training data in at least one tab");
        return;
      }

      setIsLoading(true);
      try {
        // Log the training data
        console.log("Training Bot with data:", {
          botId: botId || "temp-id",
          textData: hasTextData ? { trainingText } : null,
          qaData: hasQAData
            ? {
                questions: qaFormData.questions.filter(
                  (q) => q.question.trim() && q.answer.trim()
                ),
              }
            : null,
          fileData: hasFileData
            ? {
                files: fileFormData.files.map((file) => ({
                  name: file.name,
                  size: file.size,
                  type: file.type,
                  status: file.status,
                })),
              }
            : null,
        });

        // Simulate API call success
        setTimeout(() => {
          message.success("Bot training started successfully!");
          // navigate("/agents");
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error in train bot flow:", error);
        message.error("Failed to train bot");
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex bg-gray-50 relative min-h-screen">
      {/* Left Sidebar */}
      <div className="w-72 bg-white border-r p-1 flex flex-col gap-4 pt-10">
        <button
          className={`w-full py-4 px-5 flex items-center gap-4 rounded-lg transition-colors
            ${
              activeSection === "start"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          onClick={() => setActiveSection("start")}
        >
          <RobotOutlined
            className={`text-2xl ${
              activeSection === "start" ? "text-blue-600" : "text-gray-500"
            }`}
          />
          <span className="font-medium text-base">Start Bot</span>
        </button>
        <button
          className={`w-full py-4 px-5 flex items-center gap-4 rounded-lg transition-colors
            ${
              activeSection === "train"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          onClick={() => setActiveSection("train")}
        >
          <ThunderboltOutlined
            className={`text-2xl ${
              activeSection === "train" ? "text-blue-600" : "text-gray-500"
            }`}
          />
          <span className="font-medium text-base">Train Bot</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white">
        <div
          style={{ height: "calc(100vh - 300px)" }}
          className="bg-white rounded-xl shadow-sm p-6 max-w-4xl mx-auto h-full flex flex-col pt-10"
        >
          {/* Section Title */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {activeSection === "start" ? "Create New Bot" : "Train Bot"}
          </h2>

          {activeSection === "start" ? (
            // Start Bot Section - Using TextAgentForm
            <TextAgentForm formData={textFormData} onChange={setTextFormData} />
          ) : (
            // Train Bot Section
            <div className="flex flex-col flex-1">
              <div className="flex border-b">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    className={`px-8 py-4 flex items-center gap-3 relative transition-colors
                      ${
                        activeTab === tab.key
                          ? "text-blue-600 border-b-2 border-blue-600 -mb-[2px]"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    <span
                      className={`text-lg ${
                        activeTab === tab.key
                          ? "text-blue-600"
                          : "text-gray-400"
                      }`}
                    >
                      {tab.icon}
                    </span>
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>
              <div className="flex-1 mt-6">
                {activeTab === "text" ? (
                  // Simplified Text Training Tab
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Training Data
                    </label>
                    <textarea
                      className="w-full h-[calc(100vh-600px)] p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                      placeholder="Enter training data for your bot..."
                      value={trainingText}
                      onChange={(e) => setTrainingText(e.target.value)}
                    />
                  </div>
                ) : activeTab === "file" ? (
                  <FileAgentForm
                    formData={fileFormData}
                    onChange={setFileFormData}
                  />
                ) : (
                  <QnAAgentForm
                    formData={qaFormData}
                    onChange={setQaFormData}
                  />
                )}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-end mt-4 pt-3 border-t">
            <button
              className={`px-8 py-3 rounded-lg flex items-center gap-3 transition-colors
                ${
                  isLoading
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              onClick={
                activeSection === "start" ? handleCreateAgent : handleTrainBot
              }
              disabled={isLoading}
            >
              {activeSection === "start" ? (
                <>
                  <RobotOutlined className="text-xl" />
                  <span className="font-medium">
                    {isLoading ? "Creating..." : "Create Bot"}
                  </span>
                </>
              ) : (
                <>
                  <ThunderboltOutlined className="text-xl" />
                  <span className="font-medium">
                    {isLoading ? "Training..." : "Train Bot"}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAgent;
