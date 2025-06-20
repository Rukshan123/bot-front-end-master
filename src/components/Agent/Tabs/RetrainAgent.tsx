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
import { UploadFile } from "antd";

interface KnowledgeItem {
    vector_db_id: string;
    type: "text" | "qna" | "file";
    content?: string;
    question?: string;
    answer?: string;
    url?: string;
    charactersCount?: number | null;
}

interface FileFormData {
    files: UploadFile[];
}

const tabs = [
    { key: "text", label: "Text", icon: <FileTextOutlined /> },
    { key: "file", label: "File", icon: <FileOutlined /> },
    { key: "qna", label: "Q/A", icon: <MessageOutlined /> },
];

function RetrainAgent() {
    const [activeTab, setActiveTab] = useState("text");
    const { instance, accounts } = useMsal();
    const [isLoading, setIsLoading] = useState(false);
    const { messageState, showError, showSuccess, showInfo, clearMessage } =
        useMessage();
    const { id } = useParams();

    const [trainingText, setTrainingText] = useState("");
    const [originalText, setOriginalText] = useState("");
    const [qaFormData, setQaFormData] = useState({
        questions: [{ question: "", answer: "" }],
    });
    const [fileFormData, setFileFormData] = useState<FileFormData>({
        files: [],
    });
    const [knowledgeData, setKnowledgeData] = useState<KnowledgeItem[]>([]);

    const [isTextChanged, setIsTextChanged] = useState(false);
    const [isQnaChanged, setIsQnaChanged] = useState(false);
    const [isFilesChanged, setIsFilesChanged] = useState(false);

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
                vendorId.id,
                id || ""
            );

            const fetchedData: KnowledgeItem[] = response.data.data || [];
            setKnowledgeData(fetchedData);

            const qaData = fetchedData.filter((item) => item.type === "qna");
            if (qaData.length > 0) {
                setQaFormData({
                    questions: qaData.map((item) => ({
                        question: item.question || "",
                        answer: item.answer || "",
                        vector_db_id: item.vector_db_id,
                    })),
                });
            } else {
                setQaFormData({ questions: [{ question: "", answer: "" }] });
            }

            const fileData = fetchedData.filter((item) => item.type === "file");
            console.log(fileData, "fileData");
            if (fileData.length > 0) {
                setFileFormData({
                    files: fileData.map((fileItem, index) => ({
                        uid:
                            fileItem.vector_db_id ||
                            fileItem.url ||
                            "file_" + index,
                        name: fileItem.url?.split("/").pop() || "uploaded_file",
                        url: fileItem.url,
                        status: "done",
                    })),
                });
            } else {
                console.log("setFileFormData({ files: [] });");
                setFileFormData({ files: [] });
            }
        } catch (error) {
            console.error("Error fetching training data:", error);
            showError("Failed to fetch training data");
        }
    };

    // 🟡 Set initial text from content or file
    useEffect(() => {
        const fetchInitialText = async () => {
            const directText = knowledgeData.find(
                (item) => item.type === "text" && item.content
            );
            if (directText?.content) {
                setTrainingText(directText.content);
                setOriginalText(directText.content);
                return;
            }

            const textFiles = knowledgeData.filter(
                (item) => item.type === "text" && item.url
            );

            const fileMap = new Map<string, KnowledgeItem>();
            textFiles.forEach((file) => {
                const filename = file.url!.split("/").pop()!;
                fileMap.set(filename, file);
            });

            for (const file of Array.from(fileMap.values())) {
                try {
                    const response = await fetch(file.url!);
                    const content = await response.text();
                    setTrainingText(content);
                    setOriginalText(content);
                    return;
                } catch (error) {
                    console.error(
                        `Failed to fetch content from ${file.url}`,
                        error
                    );
                }
            }
        };

        if (knowledgeData.length > 0) {
            fetchInitialText();
        }
    }, [knowledgeData]);

    // 🟡 Change tracking
    useEffect(() => {
        setIsTextChanged(trainingText.trim() !== originalText.trim());
    }, [trainingText, originalText]);

    useEffect(() => {
        const originalQna = knowledgeData
            .filter((k) => k.type === "qna")
            .map((item) => ({
                question: item.question?.trim() || "",
                answer: item.answer?.trim() || "",
            }));

        const newQna = qaFormData.questions
            .filter((q) => q.question.trim() && q.answer.trim())
            .map((q) => ({
                question: q.question.trim(),
                answer: q.answer.trim(),
            }));

        const changed =
            originalQna.length !== newQna.length ||
            originalQna.some(
                (q, i) =>
                    q.question !== newQna[i]?.question ||
                    q.answer !== newQna[i]?.answer
            );

        setIsQnaChanged(changed);
    }, [qaFormData, knowledgeData]);

    useEffect(() => {
        const originalFiles = knowledgeData
            .filter((k) => k.type === "file")
            .map((k) => k.url?.trim())
            .filter(Boolean)
            .sort();

        const newFiles = fileFormData.files
            .map((f) => f.url?.trim())
            .filter(Boolean)
            .sort();

        const changed = originalFiles.join(",") !== newFiles.join(",");
        setIsFilesChanged(changed);
    }, [fileFormData, knowledgeData]);

    const extractErrorMessage = (error: any): string => {
        if (error?.response?.data?.errors?.length > 0) {
            const validationError = error.response.data.errors[0];
            if (validationError?.constraints?.matches) {
                return validationError.constraints.matches;
            }
        }
        if (error?.response?.data?.message) return error.response.data.message;
        if (error?.response?.data?.error) return error.response.data.error;
        if (error?.message) return error.message;
        return "An unexpected error occurred. Please try again.";
    };

    const handleTrainBot = async () => {
        const trimmedText = trainingText.trim();

        const cleanedNewQnAs = qaFormData.questions
            .filter((q) => q.question.trim() && q.answer.trim())
            .map((q) => ({
                question: q.question.trim(),
                answer: q.answer.trim(),
            }));

        const newFiles = fileFormData.files.filter((f) => f.originFileObj);

        const originalQnAs = knowledgeData
            .filter((k) => k.type === "qna")
            .map((item) => ({
                question: item.question?.trim() || "",
                answer: item.answer?.trim() || "",
            }));

        const originalFiles = knowledgeData
            .filter((k) => k.type === "file")
            .map((k) => k.url?.trim())
            .filter(Boolean)
            .sort();

        const hasTextChanged = trimmedText !== originalText.trim();
        const hasQnaChanged =
            JSON.stringify(cleanedNewQnAs) !== JSON.stringify(originalQnAs);
        const hasFilesChanged = newFiles.length > 0;

        if (!hasTextChanged && !hasQnaChanged && !hasFilesChanged) {
            showError(
                "No changes detected. Please update at least one section before retraining."
            );
            return;
        }

        setIsLoading(true);
        showInfo("Training bot...");

        try {
            const token = await instance.acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            });

            const trainingData: {
                qna?: string;
                text?: string;
                files?: UploadFile[];
                "deleted-content"?: string;
            } = {};

            const deletedContent: Array<{
                type: string;
                vector_db_id: string;
            }> = [];

            if (hasTextChanged) {
                trainingData.text = trimmedText;
                const entries = knowledgeData.filter((k) => k.type === "text");
                entries.forEach((entry) => {
                    if (entry.vector_db_id) {
                        deletedContent.push({
                            type: "text",
                            vector_db_id: entry.vector_db_id,
                        });
                    }
                });
            }

            if (hasQnaChanged) {
                trainingData.qna = JSON.stringify(cleanedNewQnAs);
                const entries = knowledgeData.filter((k) => k.type === "qna");
                entries.forEach((entry) => {
                    if (entry.vector_db_id) {
                        deletedContent.push({
                            type: "qna",
                            vector_db_id: entry.vector_db_id,
                        });
                    }
                });
            }

            if (hasFilesChanged) {
                trainingData.files = newFiles as UploadFile[];

                const entries = knowledgeData.filter((k) => k.type === "file");
                entries.forEach((entry) => {
                    if (entry.vector_db_id) {
                        deletedContent.push({
                            type: "file",
                            vector_db_id: entry.vector_db_id,
                        });
                    }
                });
            }

            // ✅ Set deleted-content
            if (deletedContent.length > 0) {
                trainingData["deleted-content"] =
                    JSON.stringify(deletedContent);
            }

            // ✅ Log debug info
            console.log("Submitting training data:", {
                ...trainingData,
                files: trainingData.files?.map((f) => f.name),
            });

            // ✅ Submit to API
            const response = await apiService.trainAgent(
                token.accessToken,
                vendorId,
                id || "",
                trainingData
            );

            await fetchKnowledgeData();

            const jobId = response?.data?.data?.jobId;
            const startTime = Date.now();
            const timeoutDuration = 10 * 60 * 1000;
            const pollInterval = 5000;

            const checkJobStatus = async (): Promise<boolean> => {
                try {
                    const jobStatus = await apiService.getRetainJobStatus(
                        token.accessToken,
                        vendorId.id,
                        id || "",
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
                            "Training timeout after 10 minutes. Please check status later."
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
        } catch (error: any) {
            console.error("Error training bot:", error);
            showError(error?.message || "Training failed");
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
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Train Bot
            </h2>
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
