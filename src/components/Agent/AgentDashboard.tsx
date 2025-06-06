import { useState } from "react";
import { Button, Modal, Input, Form, Space, Select, Typography } from "antd";
import {
  PlusOutlined,
  RobotOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import AgentCard from "./AgentCard";
import TeamMembersTable from "./TeamMembersTable";
import { Link } from "react-router-dom";

const AgentDashboard = () => {
  const [tab, setTab] = useState<"agents" | "team">("agents");

  const [agents] = useState([
    { id: 1, name: "Bot 01" },
    { id: 2, name: "Bot 02" },
    { id: 3, name: "Bot 03" },
  ]);

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
    <div className="p-8 min-h-screen">
      {/* Custom Tabs */}
      <div className="flex border-b border-gray-200 mb-6 space-x-8">
        {["agents", "team"].map((key) => (
          <div
            key={key}
            onClick={() => setTab(key as "agents" | "team")}
            className={`relative pb-2 cursor-pointer font-medium text-lg text-center w-80
        ${tab === key ? "text-blue-600" : "text-gray-500 hover:text-blue-500"}`}
          >
            {key === "agents" ? "Agents" : "Team Members"}
            <span
              className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-60 ${
                tab === key ? "border-b-[4px] border-blue-600" : "border-b-0"
              }`}
            ></span>
          </div>
        ))}
      </div>

      {/* Agents View */}
      {tab === "agents" && (
        <>
          <div className="grid grid-cols-6 gap-4 mb-6 p-10">
            <Link to="/createAgent">
              <div className="border p-4 text-center hover:shadow cursor-pointer default-btn flex flex-col items-center justify-center bg-slate-100 rounded-md">
                <RobotOutlined style={{ fontSize: 40 }} />
                <div className="mt-5">
                  Try the bot
                  <PlusOutlined className="ml-3" style={{ fontSize: 15 }} />
                </div>
              </div>
            </Link>
          </div>

          <Typography.Title
            className="pl-10 pr-10"
            level={3}
            style={{ margin: 0 }}
          >
            Agent List
          </Typography.Title>
          <div className="grid grid-cols-6 gap-4 p-5">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} allAgents={agents} />
            ))}
          </div>
        </>
      )}

      {/* Team Members View */}
      {tab === "team" && (
        <>
          <div className="flex justify-end mb-4">
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => setInviteVisible(true)}
            >
              Invite Members
            </Button>
          </div>
          <TeamMembersTable members={members} onDelete={handleDelete} />
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
