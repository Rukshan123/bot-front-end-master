import { Upload, Button } from "antd";
import { CloudUploadOutlined, UploadOutlined } from "@ant-design/icons";

const FileUploadForm = () => {
  return (
    <div>
      <div className="pt-10 flex flex-col items-center space-y-6">
        <CloudUploadOutlined style={{ fontSize: "80px" }} />
        <Upload>
          <Button className="text-lg p-5" icon={<UploadOutlined />}>
            Upload File
          </Button>
        </Upload>

        <p className="text-lg text-gray-500 text-center">
          Only *.pdf, *.txt, *.csv, *.docx files are accepted
        </p>
      </div>
    </div>
  );
};

export default FileUploadForm;
