import React, { ReactNode } from "react";
import "../styles/GenericComponent.css";

interface GenericComponentProps {
  title?: string;
  rightComponent?: ReactNode;
  children: React.ReactNode;
  customClass?: string;
}

const GenericComponent: React.FC<GenericComponentProps> = ({
  title,
  rightComponent,
  children,
  customClass,
}) => {
  return (
    <div className={`generic-component ${customClass}`}>
      {" "}
      {/*el customClass es la clase para modificar las dimencionesde forma espesifica de los componentes*/}
      <header className="generic-header">
        <h1>{title}</h1>
        <div className="right-component">{rightComponent}</div>{" "}
        {/*Mirar para quitar div*/}
      </header>
      <main className="generic-content">{children}</main>
    </div>
  );
};

export default GenericComponent;
