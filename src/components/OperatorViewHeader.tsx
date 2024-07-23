import React from "react";
import "../styles/OperatorViewHeader.css";
import useAuth from "@/hooks/use-auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";

const OperatorViewHeader: React.FC = () => {
  const { attendant, logout } = useAuth();
  return (
    <nav className="operator-view-header">
      <div className="section-left">
        <span className="img-logo">
          <img
            title="Logo-ccv"
            src="https://ccvalledupar.org.co/wp-content/uploads/2022/02/cropped-MARCA-CCV-MARCA-PAIS-1.png"
            alt="Logo CCV"
          />
        </span>

        <span className="user-info">
          <p className="user-name">
            <strong>{attendant?.name}</strong>
          </p>
        </span>
      </div>

      <div className="section-right">
        <button
          className="flex flex-row items-center justify-center"
          onClick={logout}
        >
          <FontAwesomeIcon icon={faSignOut} className="mr-2" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </nav>
  );
};

export default OperatorViewHeader;
