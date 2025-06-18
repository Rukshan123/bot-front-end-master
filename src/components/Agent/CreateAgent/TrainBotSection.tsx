import React from "react";
import FileAgentForm from "./FileAgentForm";
import QnAAgentForm from "./QnAAgentForm";
import { ThunderboltOutlined } from "@ant-design/icons";

interface TrainBotSectionProps {
    tabs: { key: string; label: string; icon: React.ReactNode }[];
    activeTab: string;
    setActiveTab: (tab: string) => void;
    trainingText: string;
    setTrainingText: (text: string) => void;
    fileFormData: any;
    setFileFormData: (data: any) => void;
    qaFormData: any;
    setQaFormData: (data: any) => void;
    isLoading: boolean;
    handleTrainBot: () => void;
}

const TrainBotSection: React.FC<TrainBotSectionProps> = ({
    tabs,
    activeTab,
    setActiveTab,
    trainingText,
    setTrainingText,
    fileFormData,
    setFileFormData,
    qaFormData,
    setQaFormData,
    isLoading,
    handleTrainBot,
}) => {
    return (
        <>
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
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Training Data
                            </label>
                            <textarea
                                className="w-full h-[calc(100vh-600px)] p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                                placeholder="Enter training data for your bot..."
                                value={trainingText}
                                onChange={(e) =>
                                    setTrainingText(e.target.value)
                                }
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
            {/* Action Button */}
            <div className="flex justify-end mt-4 pt-3 border-t">
                <button
                    className={`px-8 py-3 rounded-lg flex items-center gap-3 transition-colors
            ${
                isLoading
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
                    onClick={handleTrainBot}
                    disabled={isLoading}
                >
                    <ThunderboltOutlined className="text-xl" />
                    <span className="font-medium">
                        {isLoading ? "Training..." : "Train Bot"}
                    </span>
                </button>
            </div>
        </>
    );
};

export default TrainBotSection;
