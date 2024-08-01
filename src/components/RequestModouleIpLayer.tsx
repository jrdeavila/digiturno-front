import useMyModule from "@/hooks/use-my-module";
import React from "react";

const RequestModuleIpLayer: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { configureModuleInfo, shouldRequestIp } = useMyModule();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSaveIp = () => {
    const ip = inputRef.current?.value;
    if (ip) {
      configureModuleInfo({ ip });
    }
  };
  return (
    <>
      {shouldRequestIp ? (
        <div className="w-full min-h-screen flex justify-center items-center">
          <div className="rounded-lg shadow-lg p-3 w-96 h-96 bg-white">
            <div className="flex flex-col h-full">
              <span className="text-xl">CONFIGURACIÓN DE MÓDULO</span>
              <span className="text-sm">
                Por favor, ingrese la dirección IP del módulo en la
                configuración
              </span>
              <div className="flex-grow"></div>
              <label htmlFor="ip">Dirección IP del módulo</label>
              <input
                ref={inputRef}
                name="ip"
                type="text"
                id="ip"
                className="border border-gray-300 rounded-lg p-2 mt-2"
                placeholder="0.0.0.0"
              />
              <div className="flex-grow"></div>
              <button
                onClick={handleSaveIp}
                className="bg-blue-500 text-white rounded-lg p-2 mt-2"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default RequestModuleIpLayer;
