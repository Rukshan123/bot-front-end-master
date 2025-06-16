import { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Input,
  Form,
  Space,
  Select,
  Typography,
  message,
} from "antd";
import {
  PlusOutlined,
  RobotOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import AgentCard from "./AgentCard";
import TeamMembersTable from "./TeamMembersTable";
import { Link } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../Auth/msalConfig";
import apiService from "../../services/api";

interface Agent {
  id: string;
  bot_name: string;
  [key: string]: any;
}

const AgentDashboard = () => {
  const [tab, setTab] = useState<"agents" | "team">("agents");
  const { instance, accounts } = useMsal();
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    const fetchBots = async () => {
      try {
        const user = accounts[0];
        const token = await instance.acquireTokenSilent({
          ...loginRequest,
          account: user,
        });

        const data = JSON.parse(sessionStorage.getItem("userData") || "{}");
        const vendorId = data?.vendor?.id;

        if (!vendorId) {
          messageApi.error("Vendor ID not found");
          return;
        }

        const response = await apiService.getBotsByVendorId(
          token.accessToken,
          vendorId
        );
        setAgents(response.data.data || []);
      } catch (error) {
        console.error("Error fetching bots:", error);
        messageApi.error("Failed to fetch bots");
      }
    };

    fetchBots();
  }, [instance, accounts, messageApi]);

  const [members, setMembers] = useState([
    {
      key: "1",
      name: "Peter",
      email: "peter@gmail.com",
      role: "Admin",
      status: "Active",
    },
  ]);

  const [inviteVisible, setInviteVisible] = useState(false);
  const [form] = Form.useForm();

  const handleInvite = (values: any) => {
    const newMember = {
      key: Date.now().toString(),
      ...values,
      status: "Pending",
    };
    setMembers([...members, newMember]);
    setInviteVisible(false);
    form.resetFields();
  };

  const handleDelete = (key: string) => {
    setMembers(members.filter((m) => m.key !== key));
  };

  return (
    <div className="p-4 md:p-8 min-h-screen">
      {contextHolder}
      {/* Custom Tabs */}
      <div className="flex border-b border-gray-200 mb-6 space-x-4 md:space-x-8">
        {["agents", "team"].map((key) => (
          <div
            key={key}
            onClick={() => setTab(key as "agents" | "team")}
            className={`relative pb-2 cursor-pointer font-medium text-base md:text-lg text-center w-40 md:w-80
        ${tab === key ? "text-blue-600" : "text-gray-500 hover:text-blue-500"}`}
          >
            {key === "agents" ? "Agents" : "Team Members"}
            <span
              className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 md:w-60 ${
                tab === key ? "border-b-[4px] border-blue-600" : "border-b-0"
              }`}
            ></span>
          </div>
        ))}
      </div>

      {/* Agents View */}
      {tab === "agents" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-6 p-2 md:p-6 mt-6 md:mt-12">
            <Link to="/createAgent">
              <Button
                type="primary"
                className="border p-4 md:p-6 text-center hover:shadow cursor-pointer default-btn flex flex-col items-center justify-center rounded-md w-full"
              >
                <RobotOutlined style={{ fontSize: 32 }} />
                <div className="mt-3 md:mt-5 text-base md:text-lg font-semibold">
                  Create a new agent
                  <PlusOutlined
                    className="ml-2 md:ml-3"
                    style={{ fontSize: 15 }}
                  />
                </div>
              </Button>
            </Link>
          </div>

          <Typography.Title
            className="px-4 md:px-10"
            level={3}
            style={{ margin: 0 }}
          >
            Agent List
          </Typography.Title>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-2 md:p-5">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} allAgents={agents} />
            ))}
          </div>
        </>
      )}

      {/* Team Members View */}
      {tab === "team" && (
        <>
          <div className="flex justify-end mb-4 px-2 md:px-0">
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => setInviteVisible(true)}
            >
              Invite Members
            </Button>
          </div>
          <div className="px-2 md:px-0">
            <TeamMembersTable members={members} onDelete={handleDelete} />
          </div>
        </>
      )}

      {/* Invite Modal */}
      <Modal
        title="Invite Member"
        open={inviteVisible}
        onCancel={() => setInviteVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleInvite}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select placeholder="Select role">
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="member">Member</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space className="flex justify-end">
              <Button onClick={() => setInviteVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                Invite
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AgentDashboard;
