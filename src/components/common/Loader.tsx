import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import "./Loader.css";

interface LoaderProps {
  tip?: string;
  fullScreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({
  tip = "Loading...",
  fullScreen = false,
}) => {
  const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

  if (fullScreen) {
    return (
      <div className="loader-container">
        <div className="loader-content">
          <Spin indicator={antIcon} />
          {tip && <div className="loader-text">{tip}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="loader-inline">
      <Spin indicator={antIcon} />
      {tip && <div className="loader-text">{tip}</div>}
    </div>
  );
};

export default Loader;
