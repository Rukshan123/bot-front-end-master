import axiosInstance from "../utils/axiosConfig";
import { UploadFile } from "antd/es/upload";

// Types
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

interface TrainAgentData {
  textData: TextFormData;
  qaData: QnAFormData;
  fileData: FileFormData;
}

interface CreateAgentData {
  textData: TextFormData;
}

interface UserProfile {
  first_name: string;
  last_name: string;
  email: string;
  contact_number: string;
  address: string;
  roles: string[];
}

interface VendorData {
  name: string;
  email: string;
  contact_number: string;
  address: string;
}

// API Service
const apiService = {
  // User related APIs
  getUserProfile: async (token: string) => {
    return axiosInstance.get(
      `${process.env.REACT_APP_API_URL}/api/v1/users/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  registerUser: async (
    token: string,
    userData: { vendor: VendorData; user: UserProfile }
  ) => {
    return axiosInstance.post(
      `${process.env.REACT_APP_API_URL}/api/v1/users`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
  // Agent related APIs
  createAgent: async (
    token: string,
    vendorId: string,
    agentData: {
      language_model_id: number;
      bot_name: string;
      whatsapp_number?: string;
    }
  ) => {
    return axiosInstance.post(
      `${process.env.REACT_APP_API_URL}/api/v1/vendors/${vendorId}/bots`,
      agentData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  },

  getAgents: async (token: string) => {
    return axiosInstance.get("/api/v1/agents", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getAgentById: async (token: string, agentId: string) => {
    return axiosInstance.get(`/api/v1/agents/${agentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getBotsByVendorId: async (token: string, vendorId: string) => {
    return axiosInstance.get(
      `${process.env.REACT_APP_API_URL}/api/v1/vendors/${vendorId}/bots`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  updateAgent: async (
    token: string,
    agentId: string,
    agentData: Partial<TrainAgentData>
  ) => {
    return axiosInstance.put(`/api/v1/agents/${agentId}`, agentData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  deleteAgent: async (token: string, agentId: string) => {
    return axiosInstance.delete(`/api/v1/agents/${agentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  trainAgent: async (
    token: string,
    vendorId: { id: string },
    botId: string,
    trainingData: {
      qna?: string;
      text?: string;
      "deleted-content"?: string;
    }
  ) => {
    const formData = new FormData();
    if (trainingData.qna) formData.append("qna", trainingData.qna);
    if (trainingData.text) formData.append("text", trainingData.text);
    if (trainingData["deleted-content"])
      formData.append("deleted-content", trainingData["deleted-content"]);

    return axiosInstance.put(
      `/api/v1/vendors/${vendorId.id}/bots/${botId}/retrain`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

  getTrainingData: async (
    token: string,
    vendorId: { id: string },
    botId: string
  ) => {
    return axiosInstance.get(
      `${process.env.REACT_APP_API_URL}/api/v1/vendors/${vendorId}/bots/${botId}/knowledge`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  // Language Models related APIs
  getLanguageModels: async (token: string) => {
    return axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/v1/llms`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  checkUserStatus: async (token: string) => {
    return axiosInstance.get(`${process.env.REACT_APP_API_URL}/user/status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getPlans: async (token: string) => {
    return axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/v1/plans`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export default apiService;
