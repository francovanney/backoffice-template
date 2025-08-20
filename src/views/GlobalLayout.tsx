import { ReactNode } from "react";

interface GlobalLayoutProps {
  children?: ReactNode;
}

const GlobalLayout = ({ children }: GlobalLayoutProps) => {
  return <div className="h-full w-full">{children}</div>;
};

export default GlobalLayout;
