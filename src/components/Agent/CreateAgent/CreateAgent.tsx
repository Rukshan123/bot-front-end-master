import { useState } from "react";
import {
    FileTextOutlined,
    FileOutlined,
    MessageOutlined,
    RobotOutlined,
    ThunderboltOutlined,
} from "@ant-design/icons";
import { UploadFile } from "antd/es/upload";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../../Auth/msalConfig";
import apiService from "../../../services/api";
import MessageBox from "../../common/MessageBox";
import { useMessage } from "../../../hooks/useMessage";

import TextAgentForm from "./TextAgentForm";
// import QnAAgentForm from "./QnAAgentForm";
// import FileAgentForm from "./FileAgentForm";
import TrainBotSection from "./TrainBotSection";

// Define types for form data
interface TextFormData {
    name: string;
    languageModelId: number;
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
    const [isLoading, setIsLoading] = useState(false);
    const [botId, setBotId] = useState<string | null>(null);
    const { messageState, showError, showSuccess, showInfo, clearMessage } =
        useMessage();

    // Get vendor data from session storage
    const data = JSON.parse(sessionStorage.getItem("userData") || "{}");
    const vendorId = {
        id: data?.vendor?.id || "",
    };

    // Maintain form states
    const [textFormData, setTextFormData] = useState<TextFormData>({
        name: "",
        languageModelId: 1,
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

    const extractErrorMessage = (error: any): string => {
        // Check for validation errors first
        if (error?.response?.data?.errors?.length > 0) {
            const validationError = error.response.data.errors[0];
            if (validationError?.constraints?.matches) {
                return validationError.constraints.matches;
            }
        }
        // Keep existing error message checks
        if (error?.response?.data?.message) {
            return error.response.data.message;
        } else if (error?.response?.data?.error) {
            return error.response.data.error;
        } else if (error?.message) {
            return error.message;
        }
        return "An unexpected error occurred. Please try again.";
    };

    const handleCreateAgent = async () => {
        if (!textFormData.name.trim()) {
            showError("Please enter a bot name");
            return;
        }

        if (!vendorId.id) {
            showError("Vendor ID not found");
            return;
        }

        setIsLoading(true);
        showInfo("Creating bot...");

        try {
            const token = await instance.acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            });

            const response = await apiService.createAgent(
                token.accessToken,
                vendorId.id,
                {
                    language_model_id: textFormData.languageModelId,
                    bot_name: textFormData.name,
                    whatsapp_number: textFormData.whatsappNumber,
                }
            );

            const successMessage =
                response?.data?.message || "Bot created successfully!";
            showSuccess(successMessage);
            setBotId(response.data.data.id);
            setActiveSection("train");
        } catch (error) {
            console.error("Error in create bot flow:", error);
            showError(extractErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    const handleTrainBot = async () => {
        if (activeSection !== "train") return;

        const hasTextData = trainingText.trim();
        const hasQAData = qaFormData.questions.some(
            (q) => q.question.trim() && q.answer.trim()
        );
        const hasFileData = fileFormData.files.some((f) => f.originFileObj);

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

            const formData = new FormData();

            if (hasTextData) {
                formData.append("text", trainingText.trim());
            }

            if (hasQAData) {
                const qa = qaFormData.questions
                    .filter((q) => q.question.trim() && q.answer.trim())
                    .map((q) => ({
                        question: q.question.trim(),
                        answer: q.answer.trim(),
                    }));
                formData.append("qna", JSON.stringify(qa));
            }

            if (hasFileData) {
                fileFormData.files.forEach((file) => {
                    if (file.originFileObj) {
                        formData.append("files", file.originFileObj);
                    }
                });
            }

            const response = await apiService.trainAgent(
                token.accessToken,
                vendorId,
                botId || "",
                formData
            );

            const successMessage =
                response?.data?.message || "Bot training started successfully!";
            showSuccess(successMessage);

            const jobId = response?.data?.data?.jobId;

            // Polling logic
            const startTime = Date.now();
            const timeoutDuration = 10 * 60 * 1000;
            const pollInterval = 5000;

            const checkJobStatus = async () => {
                try {
                    const jobStatus = await apiService.getRetainJobStatus(
                        token.accessToken,
                        vendorId.id,
                        botId || "",
                        String(jobId)
                    );

                    const status = jobStatus?.data?.data?.status;
                    const currentTime = Date.now();

                    if (status === "SUCCESS" || status === "COMPLETED") {
                        showSuccess("Bot training completed successfully!");
                        return true;
                    } else if (status === "FAILED") {
                        showError("Bot training failed. Please try again.");
                        return true;
                    } else if (currentTime - startTime >= timeoutDuration) {
                        showError(
                            "Training timed out. Please check the status later."
                        );
                        return true;
                    }

                    return false;
                } catch (error) {
                    console.error("Error checking job status:", error);
                    showError(extractErrorMessage(error));
                    return true;
                }
            };

            const pollJobStatus = async () => {
                const shouldStop = await checkJobStatus();
                if (!shouldStop) {
                    setTimeout(pollJobStatus, pollInterval);
                }
            };

            await pollJobStatus();
        } catch (error) {
            console.error("Error in train bot flow:", error);
            showError(extractErrorMessage(error));
        } finally {
            setIsLoading(false);
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
                            activeSection === "start"
                                ? "text-blue-600"
                                : "text-gray-500"
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
            }
            ${!botId ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => botId && setActiveSection("train")}
                    disabled={!botId}
                >
                    <ThunderboltOutlined
                        className={`text-2xl ${
                            activeSection === "train"
                                ? "text-blue-600"
                                : "text-gray-500"
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
                    <MessageBox
                        type={messageState.type}
                        message={messageState.message}
                        onClose={clearMessage}
                    />

                    {/* Section Title */}
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                        {activeSection === "start"
                            ? "Create New Bot"
                            : "Train Bot"}
                    </h2>

                    {activeSection === "start" ? (
                        <>
                            <TextAgentForm
                                formData={textFormData}
                                onChange={setTextFormData}
                            />
                            <div className="flex justify-end mt-4 pt-3 border-t">
                                <button
                                    className={`px-8 py-3 rounded-lg flex items-center gap-3 transition-colors
          ${
              isLoading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
                                    onClick={handleCreateAgent}
                                    disabled={isLoading}
                                >
                                    <RobotOutlined className="text-xl" />
                                    <span className="font-medium">
                                        {isLoading
                                            ? "Creating..."
                                            : "Create Bot"}
                                    </span>
                                </button>
                            </div>
                        </>
                    ) : (
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
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateAgent;
