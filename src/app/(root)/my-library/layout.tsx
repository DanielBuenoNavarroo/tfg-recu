import MyLibraryHeader from "@/components/my-library/MyLibraryHeader";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex gap-4 w-full justify-center">
        <MyLibraryHeader />
      </div>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
