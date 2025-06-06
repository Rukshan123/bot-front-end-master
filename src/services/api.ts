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

interface CreateAgentData {
  textData: TextFormData;
  qaData: QnAFormData;
  fileData: FileFormData;
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
  createAgent: async (token: string, agentData: CreateAgentData) => {
    return axiosInstance.post("/api/v1/agents", agentData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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

  updateAgent: async (
    token: string,
    agentId: string,
    agentData: Partial<CreateAgentData>
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
};

export default apiService;
