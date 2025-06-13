import React, { useEffect } from "react";
import { Alert } from "antd";

export type MessageType = "success" | "error" | "info" | "warning" | null;

interface MessageBoxProps {
  type: MessageType;
  message: string;
  onClose: () => void;
  duration?: number;
}

const MessageBox: React.FC<MessageBoxProps> = ({
  type,
  message,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (type) {
      timeoutId = setTimeout(() => {
        onClose();
      }, duration);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [type, message, duration, onClose]);

  if (!type || !message) return null;

  return (
    <div className="mb-4">
      <Alert
        message={message}
        type={type}
        showIcon
        closable
        onClose={onClose}
        className="w-full transition-opacity duration-300"
      />
    </div>
  );
};

export default MessageBox;
