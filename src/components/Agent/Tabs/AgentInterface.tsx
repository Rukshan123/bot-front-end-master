import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, message, Spin, Card, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import apiService from "../../../services/api";
import { loginRequest } from "../../../Auth/msalConfig";
import MessageBox from "../../common/MessageBox";

const { Option } = Select;

const defaultValues = {
    init_msg: "",
    display_name: "",
    chat_icon: "",
    profile_pic: "",
    chat_icon_position: "bottom-left",
};

const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
};

function AgentInterface() {
    const location = useLocation();
    const agent = location.state?.agent;
    const allAgents = location.state?.allAgents;
    const vendorId = allAgents?.[0]?.vendor_id || agent?.vendor_id;
    const botId = agent?.id;

    const { instance, accounts } = useMsal();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [customization, setCustomization] = useState(defaultValues);
    const [chatIconPreview, setChatIconPreview] = useState<string>("");
    const [profilePicPreview, setProfilePicPreview] = useState<string>("");
    const [messageBox, setMessageBox] = useState<{
        type: "success" | "error" | "info" | "warning" | null;
        message: string;
    }>({ type: null, message: "" });

    useEffect(() => {
        const fetchCustomization = async () => {
            if (!vendorId || !botId) return;
            setLoading(true);
            try {
                const user = accounts[0];
                const token = await instance.acquireTokenSilent({
                    ...loginRequest,
                    account: user,
                });
                const res = await apiService.getBotCustomization(
                    token.accessToken,
                    vendorId,
                    botId
                );

                if (res?.data?.data) {
                    const data = res.data.data;
                    setCustomization(data);
                    form.setFieldsValue(data);

                    // 🔥 Set previews from existing Base64
                    setChatIconPreview(data.chat_icon || "");
                    setProfilePicPreview(data.profile_pic || "");
                } else {
                    form.setFieldsValue(defaultValues);
                    setCustomization(defaultValues);
                    setChatIconPreview("");
                    setProfilePicPreview("");
                }
            } catch (err) {
                form.setFieldsValue(defaultValues);
                setCustomization(defaultValues);
                setChatIconPreview("");
                setProfilePicPreview("");
            } finally {
                setLoading(false);
            }
        };
        fetchCustomization();
    }, [vendorId, botId, instance, accounts, form]);

    const handleChatIconUpload = async (info: any) => {
        const file = info.file;
        if (file) {
            if (file.size > 100 * 1024) {
                setMessageBox({
                    type: "error",
                    message: "Chat icon must be less than 100KB.",
                });
                return;
            }
            const base64 = await getBase64(file);
            setChatIconPreview(base64);
            form.setFieldsValue({ chat_icon: base64 });
        }
    };

    const handleProfilePicUpload = async (info: any) => {
        const file = info.file;
        if (file) {
            if (file.size > 100 * 1024) {
                setMessageBox({
                    type: "error",
                    message: "Profile picture must be less than 100KB.",
                });
                return;
            }
            const base64 = await getBase64(file);
            setProfilePicPreview(base64);
            form.setFieldsValue({ profile_pic: base64 });
        }
    };

    const handleFinish = async (values: any) => {
        if (!vendorId || !botId) {
            setMessageBox({
                type: "error",
                message: "Missing vendor or bot ID",
            });
            return;
        }
        setSaving(true);
        try {
            const user = accounts[0];
            const token = await instance.acquireTokenSilent({
                ...loginRequest,
                account: user,
            });
            await apiService.upsertBotCustomization(
                token.accessToken,
                vendorId,
                botId,
                values
            );
            setMessageBox({
                type: "success",
                message: "Customization updated successfully!",
            });
            setCustomization(values);
        } catch (err: any) {
            setMessageBox({
                type: "error",
                message:
                    err?.response?.data?.message ||
                    "Failed to update customization.",
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-xl mt-6">
            <Card
                title="Agent Interface Customization"
                bordered
                style={{ textAlign: "left" }}
            >
                {messageBox.type && (
                    <MessageBox
                        type={messageBox.type}
                        message={messageBox.message}
                        onClose={() =>
                            setMessageBox({ type: null, message: "" })
                        }
                    />
                )}
                <Spin spinning={loading}>
                    <Form form={form} layout="vertical" onFinish={handleFinish}>
                        <Form.Item
                            label="Initial Message"
                            name="init_msg"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter an initial message",
                                },
                            ]}
                        >
                            <Input.TextArea
                                rows={2}
                                placeholder="Hello! How can I help you today?"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Display Name"
                            name="display_name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter a display name",
                                },
                            ]}
                        >
                            <Input placeholder="SupportBot" />
                        </Form.Item>

                        <Form.Item
                            label="Chat Icon"
                            name="chat_icon"
                            rules={[
                                {
                                    required: true,
                                    message: "Please upload a chat icon",
                                },
                            ]}
                        >
                            <Upload
                                showUploadList={false}
                                beforeUpload={() => false}
                                onChange={handleChatIconUpload}
                                accept="image/*"
                            >
                                <Button icon={<UploadOutlined />}>
                                    Upload Chat Icon
                                </Button>
                            </Upload>
                            {chatIconPreview && (
                                <div style={{ marginTop: 8 }}>
                                    <img
                                        src={chatIconPreview}
                                        alt="Chat Icon"
                                        style={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: 8,
                                            border: "1px solid #eee",
                                        }}
                                    />
                                </div>
                            )}
                        </Form.Item>

                        <Form.Item
                            label="Profile Picture"
                            name="profile_pic"
                            rules={[
                                {
                                    required: true,
                                    message: "Please upload a profile picture",
                                },
                            ]}
                        >
                            <Upload
                                showUploadList={false}
                                beforeUpload={() => false}
                                onChange={handleProfilePicUpload}
                                accept="image/*"
                            >
                                <Button icon={<UploadOutlined />}>
                                    Upload Profile Picture
                                </Button>
                            </Upload>
                            {profilePicPreview && (
                                <div style={{ marginTop: 8 }}>
                                    <img
                                        src={profilePicPreview}
                                        alt="Profile Pic"
                                        style={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: 8,
                                            border: "1px solid #eee",
                                        }}
                                    />
                                </div>
                            )}
                        </Form.Item>

                        <Form.Item
                            label="Chat Icon Position"
                            name="chat_icon_position"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select a position",
                                },
                            ]}
                        >
                            <Select>
                                <Option value="bottom-left">Bottom Left</Option>
                                <Option value="bottom-right">
                                    Bottom Right
                                </Option>
                                <Option value="top-left">Top Left</Option>
                                <Option value="top-right">Top Right</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item>
                            <Button
                                className="x-8 p-5 mt-5 rounded-lg flex items-center gap-3 transition-colors text-lg"
                                type="primary"
                                htmlType="submit"
                                loading={saving}
                                block
                            >
                                Save Customization
                            </Button>
                        </Form.Item>
                    </Form>
                </Spin>
            </Card>
        </div>
    );
}

export default AgentInterface;
