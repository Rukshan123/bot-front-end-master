import { Upload, Button } from "antd";
import { CloudUploadOutlined, UploadOutlined } from "@ant-design/icons";
import { FC } from "react";
import { UploadChangeParam, UploadFile } from "antd/es/upload";

interface FileFormData {
    files: UploadFile[];
}

interface Props {
    formData: FileFormData;
    onChange: (data: FileFormData) => void;
}

const FileAgentForm: FC<Props> = ({ formData, onChange }) => {
    console.log(formData, "file form data");
    const handleChange = (info: UploadChangeParam<UploadFile>) => {
        onChange({ files: info.fileList });
    };

    return (
        <div>
            <div className="pt-10 flex flex-col items-center space-y-6">
                <CloudUploadOutlined style={{ fontSize: "80px" }} />
                <Upload
                    fileList={formData.files}
                    onChange={handleChange}
                    accept=".pdf,.txt,.csv,.docx"
                    beforeUpload={() => false} // Prevent automatic upload
                    customRequest={({ onSuccess }) =>
                        setTimeout(() => onSuccess?.("ok"), 0)
                    } // Dummy request to prevent errors
                >
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

export default FileAgentForm;
