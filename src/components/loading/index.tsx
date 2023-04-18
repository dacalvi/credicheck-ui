import React from "react";

interface LoadingProps {
  size: number;
  message: string;
}

export const Loading: React.FC<LoadingProps> = ({size, message}) => {
  return (
    <div className="flex flex-row">
      <div className=" flex-center h-10">
        <div
          style={{width: `${size}px`, height: `${size}px`}}
          className="animate-spin">
          <div
            className="h-full w-full border-4 border-t-blue-500
        border-b-blue-700 rounded-[50%]"></div>
        </div>
      </div>
      <div className="flex-center h-10 pt-2 pl-5">{message}</div>
    </div>
  );
};
