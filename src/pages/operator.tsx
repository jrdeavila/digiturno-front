import ClientInfo from "@/components/ClientInfo";
import ModuleDistracted from "@/components/ModuleDistracted";
import ModuleInfo from "@/components/ModuleInfo";
import ModuleStatus from "@/components/ModuleStatus";
import OperatorViewHeader from "@/components/OperatorViewHeader";
import ServiceList from "@/components/ServiceList";
import WaitingClients from "@/components/WaitingClients";
import useShifts from "@/hooks/operator/use-shifts";
import styled from "styled-components";

const OperatorPage: React.FC = () => {
  const { currentShift } = useShifts();
  return (
    <>
      <OperatorViewHeader />
      <GridContainer>
        <div className="grid grid-cols-1 lg:grid-cols-3 grid-rows-4 gap-5 w-full h-full">
          <div className="col-span-1 row-span-1 bg-orange-300 text-white">
            <ModuleInfo />
          </div>
          {currentShift ? (
            <div className="col-span-1 row-span-4 bg-white text-black">
              <ClientInfo />
            </div>
          ) : (
            <div className="col-span-1 row-span-4 bg-white text-black">
              <WaitingClients />
            </div>
          )}
          <div className="col-span-1 row-span-1 bg-white text-black">
            <ModuleStatus />
          </div>

          <div className="col-span-1 row-span-3 bg-white text-black">
            <ServiceList />
          </div>
          <div className="col-span-1 row-span-3 bg-white text-black">
            <ModuleDistracted />
          </div>
        </div>
      </GridContainer>
    </>
  );
};

const GridContainer = styled.div`
  height: calc(100vh - 65pt);
  padding: 10px;
  background: linear-gradient(90deg, var(--bg-blue-400), var(--bg-blue-700));
`;

export default OperatorPage;
