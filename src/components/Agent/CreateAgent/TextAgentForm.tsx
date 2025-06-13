import { Input, Switch, Form, Select } from "antd";
import { FC, useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../../Auth/msalConfig";
import apiService from "../../../services/api";

interface LanguageModel {
  id: number;
  llm_name: string;
}

interface TextFormData {
  name: string;
  languageModelId: number;
  whatsappNumber?: string;
  enableWhatsApp: boolean;
}

interface Props {
  formData: TextFormData;
  onChange: (data: TextFormData) => void;
}

const TextAgentForm: FC<Props> = ({ formData, onChange }) => {
  const [form] = Form.useForm();
  const { instance, accounts } = useMsal();
  const [languageModels, setLanguageModels] = useState<LanguageModel[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLanguageModels();
  }, []);

  useEffect(() => {
    form.setFieldsValue(formData);
  }, [form, formData]);

  const fetchLanguageModels = async () => {
    setLoading(true);
    try {
      const token = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      });

      const response = await apiService.getLanguageModels(token.accessToken);
      setLanguageModels(response.data.data || []);
    } catch (error) {
      console.error("Error fetching language models:", error);
    } finally {
      setLoading(false);
    }
  };

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
        name="languageModelId"
        rules={[{ required: true, message: "Please select a language model" }]}
      >
        <Select
          className="h-12"
          placeholder="Select Language Model"
          loading={loading}
          options={languageModels.map((model) => ({
            value: model.id,
            label: model.llm_name,
          }))}
        />
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
