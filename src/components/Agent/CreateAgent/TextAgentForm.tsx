import { Input, Switch, Form } from "antd";
import { FC, useEffect } from "react";

interface TextFormData {
  name: string;
  trainingText: string;
  whatsappNumber?: string;
  enableWhatsApp: boolean;
}

interface Props {
  formData: TextFormData;
  onChange: (data: TextFormData) => void;
}

const TextAgentForm: FC<Props> = ({ formData, onChange }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(formData);
  }, [form, formData]);

  const handleFormChange = () => {
    const values = form.getFieldsValue();
    onChange({
      ...values,
      enableWhatsApp: formData.enableWhatsApp,
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      className="space-y-4"
      onValuesChange={handleFormChange}
    >
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
        <Switch
          checked={formData.enableWhatsApp}
          onChange={(checked) =>
            onChange({ ...formData, enableWhatsApp: checked })
          }
        />
        <span className="text-gray-600">Enable WhatsApp Number</span>
      </div>

      {formData.enableWhatsApp && (
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
