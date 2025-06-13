import {
  SettingOutlined,
  RobotOutlined,
  ApiOutlined,
  DashboardOutlined,
  GlobalOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import AgentMain from "./Tabs/AgentMain";
import Integrations from "./Tabs/Integrations";
import AgentInterface from "./Tabs/AgentInterface";
import RetrainAgent from "./Tabs/RetrainAgent";
import Conversations from "./Tabs/Conversations";

const navItems = [
  { key: "agent", label: "Agent", icon: <RobotOutlined /> },
  { key: "integrations", label: "Integrations", icon: <ApiOutlined /> },
  { key: "interface", label: "Agent Interface", icon: <SettingOutlined /> },
  { key: "retrain", label: "Retrain Agent", icon: <ReloadOutlined /> },
  { key: "conversations", label: "Conversations", icon: <DashboardOutlined /> },
];

const AgentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [active, setActive] = useState("agent");

  const location = useLocation();
  const agent = location.state?.agent;
  const allAgents = location.state?.allAgents;

  console.error(agent, "agent");
  console.error(allAgents, "allAgents");

  const renderContent = () => {
    switch (active) {
      case "agent":
        return <AgentMain />;
      case "integrations":
        return <Integrations />;
      case "interface":
        return <AgentInterface />;
      case "retrain":
        return <RetrainAgent />;
      case "conversations":
        return <Conversations />;
      default:
        return <AgentMain />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f9fc]">
      {/* Sidebar */}
      <div className="w-[280px] bg-white border-r p-4 space-y-10 shadow-sm">
        <div className="mb-4">
          <select
            className="w-full p-2 border rounded bg-gray-50 text-gray-800"
            value={agent?.id || ""}
            onChange={(e) => {
              const selectedId = e.target.value;
              const selectedAgent = allAgents.find(
                (a: any) => String(a.id) === String(selectedId)
              );
              if (selectedAgent) {
                navigate(`/agent/${selectedAgent.id}`, {
                  state: { agent: selectedAgent, allAgents },
                });
              }
            }}
          >
            {allAgents.map((a: any) => (
              <option key={a.id} value={a.id}>
                {a.bot_name}
              </option>
            ))}
          </select>
        </div>

        <button
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          onClick={() => navigate(-1)}
        >
          <span className="text-lg">←</span>
          <span>Back</span>
        </button>

        {navItems.map((item) => (
          <div
            key={item.key}
            onClick={() => setActive(item.key)}
            className={`flex items-center group cursor-pointer px-4 py-3 rounded-lg ${
              active === item.key
                ? "bg-blue-100 text-blue-600 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center space-x-4 text-[18px] w-full font-bold">
              <div className="text-3xl"> {item.icon}</div>
              <span>{item.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 capitalize">
          {active.replace(/([A-Z])/g, " $1")}
        </h1>
        {renderContent()}
      </div>
    </div>
  );
};

export default AgentDetailPage;
