import React, { useState, useEffect } from "react";
import Loader from "./Loader";

interface WithInitialLoaderProps {
  children: React.ReactNode;
  loadingTime?: number;
  loadingText?: string;
}

const WithInitialLoader: React.FC<WithInitialLoaderProps> = ({
  children,
  loadingTime = 1000, // Default 1 second
  loadingText = "Loading...",
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, loadingTime);

    return () => clearTimeout(timer);
  }, [loadingTime]);

  if (isLoading) {
    return <Loader fullScreen tip={loadingText} />;
  }

  return <>{children}</>;
};

export default WithInitialLoader;
