import { useState, useCallback } from "react";
import { MessageType } from "../components/common/MessageBox";

interface MessageState {
  type: MessageType;
  message: string;
}

export const useMessage = () => {
  const [messageState, setMessageState] = useState<MessageState>({
    type: null,
    message: "",
  });

  const showMessage = useCallback((type: MessageType, message: string) => {
    setMessageState({ type, message });
  }, []);

  const clearMessage = useCallback(() => {
    setMessageState({ type: null, message: "" });
  }, []);

  const showSuccess = useCallback(
    (message: string) => {
      showMessage("success", message);
    },
    [showMessage]
  );

  const showError = useCallback(
    (message: string) => {
      showMessage("error", message);
    },
    [showMessage]
  );

  const showInfo = useCallback(
    (message: string) => {
      showMessage("info", message);
    },
    [showMessage]
  );

  const showWarning = useCallback(
    (message: string) => {
      showMessage("warning", message);
    },
    [showMessage]
  );

  return {
    messageState,
    showMessage,
    clearMessage,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
};
