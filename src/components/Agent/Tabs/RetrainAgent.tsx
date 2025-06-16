import React, { useEffect, useState } from "react";
import TrainBotSection from "../CreateAgent/TrainBotSection";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../../Auth/msalConfig";
import apiService from "../../../services/api";
import MessageBox from "../../common/MessageBox";
import { useMessage } from "../../../hooks/useMessage";
import { useParams } from "react-router-dom";

import {
  FileTextOutlined,
  FileOutlined,
  MessageOutlined,
} from "@ant-design/icons";

const tabs = [
  { key: "text", label: "Text", icon: <FileTextOutlined /> },
  { key: "file", label: "File", icon: <FileOutlined /> },
  { key: "qa", label: "Q/A", icon: <MessageOutlined /> },
];

function RetrainAgent() {
  const [activeTab, setActiveTab] = useState("text");
  const { instance, accounts } = useMsal();
  const [isLoading, setIsLoading] = useState(false);
  const { messageState, showError, showSuccess, showInfo, clearMessage } =
    useMessage();

  const { id } = useParams();

  const [trainingText, setTrainingText] = useState("");
  const [qaFormData, setQaFormData] = useState({
    questions: [{ question: "", answer: "" }],
  });
  const [fileFormData, setFileFormData] = useState({ files: [] });
  const [knowledgeData, setKnowledgeData] = useState<any[]>([]);

  // You may want to get vendorId from props, context, or location
  const data = JSON.parse(sessionStorage.getItem("userData") || "{}");
  const vendorId = { id: data?.vendor?.id || "" };

  useEffect(() => {
    fetchKnowledgeData();
  }, [id]);

  const fetchKnowledgeData = async () => {
    try {
      const token = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      });

      const response = await apiService.getTrainingData(
        token.accessToken,
        data?.vendor?.id || "",
        id || ""
      );
      setKnowledgeData(response.data.data || []);
    } catch (error) {
      console.error("Error fetching language models:", error);
    } finally {
      // setLoading(false);
      console.log(knowledgeData);
    }
  };

  const handleTrainBot = async () => {
    const hasTextData = trainingText.trim();
    const hasQAData = qaFormData.questions.some(
      (q) => q.question.trim() && q.answer.trim()
    );
    const hasFileData = fileFormData.files.length > 0;

    if (!hasTextData && !hasQAData && !hasFileData) {
      showError("Please provide training data in at least one tab");
      return;
    }

    setIsLoading(true);
    showInfo("Training bot...");

    try {
      const token = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      });

      const trainingData: any = {};

      if (hasQAData) {
        trainingData.qna = JSON.stringify(
          qaFormData.questions.filter(
            (q) => q.question.trim() && q.answer.trim()
          )
        );
      }

      if (hasTextData) {
        trainingData.text = trainingText;
      }

      const response = await apiService.trainAgent(
        token.accessToken,
        vendorId,
        id || "",
        trainingData
      );

      const successMessage =
        response?.data?.message || "Bot training started successfully!";
      showSuccess(successMessage);
    } catch (error: any) {
      console.error("Error in train bot flow:", error);
      showError(error?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-4xl mx-auto flex flex-col pt-10">
      <MessageBox
        type={messageState.type}
        message={messageState.message || ""}
        onClose={clearMessage}
      />
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Train Bot</h2>
      <TrainBotSection
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        trainingText={trainingText}
        setTrainingText={setTrainingText}
        fileFormData={fileFormData}
        setFileFormData={setFileFormData}
        qaFormData={qaFormData}
        setQaFormData={setQaFormData}
        isLoading={isLoading}
        handleTrainBot={handleTrainBot}
      />
    </div>
  );
}

export default RetrainAgent;
