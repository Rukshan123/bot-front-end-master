import { Button, Input } from "antd";

const TextAgentForm = () => {
  const handleCreateAgent = () => {
    console.log("Text Agent Created!");
  };

  return (
    <div className="space-y-4">
      <Input className="h-12" placeholder="Chatbot Name" />
      <Input.TextArea rows={6} placeholder="Enter text to train the bot" />

      <div className="text-right"></div>
    </div>
  );
};

export default TextAgentForm;
