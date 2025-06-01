import { RobotOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

type Props = {
  agent: { id: number; name: string };
  allAgents: { id: number; name: string }[];
};

const AgentCard = ({ agent, allAgents }: Props) => {
  console.error(agent, "agent");
  console.error(allAgents, "allAgents");
  const navigate = useNavigate();

  return (
    <div
      onClick={() =>
        navigate(`/agent/${agent.id}`, {
          state: { agent, allAgents }, // ✅ pass both agent and agent list
        })
      }
      className="rounded-xl shadow-md bg-white hover:shadow-xl transition transform hover:scale-105 cursor-pointer border p-5"
    >
      <div className="flex items-center space-x-4">
        <div className="bg-blue-100 text-blue-600 rounded-full p-3 text-xl">
          <RobotOutlined />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{agent.name}</h3>
          <p className="text-sm text-gray-500">AI Agent</p>
        </div>
      </div>
    </div>
  );
};

export default AgentCard;
