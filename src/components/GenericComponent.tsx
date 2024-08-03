import { Divider } from "@nextui-org/react";
import React, { ReactNode } from "react";

interface GenericComponentProps {
  title?: string;
  rightComponent?: ReactNode;
  children: React.ReactNode;
  textColor?: string;
}

const GenericComponent: React.FC<GenericComponentProps> = ({
  title,
  rightComponent,
  children,
  textColor = "text-inherit",
}) => {
  return (
    <div className="flex flex-col p-3 h-full">
      <div className="flex flex-row items-center">
        <h1 className={`text-2xl font-bold ${textColor}`}>{title}</h1>
        <div className="flex-grow"></div>
        <div className={textColor}>{rightComponent}</div>
      </div>
      <Divider className={`${textColor} my-2`} />
      <main className="h-full overflow-y-auto">{children}</main>
    </div>
  );
};

export default GenericComponent;
