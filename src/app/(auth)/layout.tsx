import React from "react";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      {children}
    </div>
  );
};

export default Layout;
