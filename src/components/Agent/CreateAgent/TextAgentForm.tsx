import { Button, Input, Switch, Form } from "antd";
import { useState } from "react";

const TextAgentForm = () => {
  const [enableWhatsApp, setEnableWhatsApp] = useState(false);
  const [form] = Form.useForm();

  const handleCreateAgent = () => {
    const values = form.getFieldsValue();
    console.log("Text Agent Created!", values);
  };

  return (
    <Form form={form} layout="vertical" className="space-y-4">
      <Form.Item
        name="name"
        rules={[{ required: true, message: "Please enter a chatbot name" }]}
      >
        <Input className="h-12" placeholder="Chatbot Name" />
      </Form.Item>

      <Form.Item
        name="trainingText"
        rules={[{ required: true, message: "Please enter training text" }]}
      >
        <Input.TextArea rows={6} placeholder="Enter text to train the bot" />
      </Form.Item>

      <div className="flex items-center gap-2 mb-4">
        <Switch checked={enableWhatsApp} onChange={setEnableWhatsApp} />
        <span className="text-gray-600">Enable WhatsApp Number</span>
      </div>

      {enableWhatsApp && (
        <Form.Item
          name="whatsappNumber"
          rules={[
            {
              pattern: /^\+?[1-9]\d{1,14}$/,
              message: "Please enter a valid phone number",
            },
          ]}
        >
          <Input
            className="h-12"
            placeholder="WhatsApp Number (e.g., +1234567890)"
            type="tel"
          />
        </Form.Item>
      )}
    </Form>
  );
};

export default TextAgentForm;
