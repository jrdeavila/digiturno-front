import ClientInfo from "@/components/ClientInfo";
import ModuleDistracted from "@/components/ModuleDistracted";
import ModuleInfo from "@/components/ModuleInfo";
import ServiceList from "@/components/ServiceList";
import WaitingClients from "@/components/WaitingClients";
import useShifts from "@/hooks/operator/use-shifts";
import DefaultLayout from "@/layouts/default";
import styled from "styled-components";

const OperatorPage: React.FC = () => {
  const { currentShift } = useShifts();
  return (
    <DefaultLayout className="">
      <GridContainer>
        <div className="grid grid-cols-1 lg:grid-cols-3 grid-rows-4 gap-3 w-full h-full">
          <div className="col-span-1 row-span-2">
            <ModuleInfo />
          </div>
          {currentShift ? (
            <div className="col-span-1 row-span-4">
              <ClientInfo />
            </div>
          ) : (
            <div className="col-span-1 row-span-4">
              <WaitingClients />
            </div>
          )}
          <div className="col-span-1 row-span-4">
            <ServiceList />
          </div>
          <div className="col-span-1 row-span-2">
            <ModuleDistracted />
          </div>
        </div>
      </GridContainer>

    </DefaultLayout>
  );
};

const GridContainer = styled.div`
  height: calc(100vh);
  padding: 20px;
  .col-span-1 {
    border-radius: 10px;

  }
  
`;

export default OperatorPage;
