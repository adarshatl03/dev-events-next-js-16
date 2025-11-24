import React from "react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  message?: string;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ message, className }) => {
  return (
    <div className={cn("flex-center flex-col gap-4 py-10", className)}>
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-light-200 border-t-primary" />
      {message && <p className="text-light-100 text-sm">{message}</p>}
    </div>
  );
};

export default Loader;
