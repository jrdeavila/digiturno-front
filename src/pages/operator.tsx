import ClientInfo from "@/components/ClientInfo";
import ModuleDistracted from "@/components/ModuleDistracted";
import ModuleInfo from "@/components/ModuleInfo";
import ServiceList from "@/components/ServiceList";
import WaitingClients from "@/components/WaitingClients";
import useModuleShifts from "@/hooks/operator/use-module-shifts";
import DefaultLayout from "@/layouts/default";
import AbsenceProvider from "@/providers/absence-provider";
import styled from "styled-components";

const OperatorPage: React.FC = () => {
  const { currentShift } = useModuleShifts();
  return (
    <DefaultLayout className="">
      <AbsenceProvider>
        <GridContainer>
          <div className="grid grid-cols-1 lg:grid-cols-3 grid-rows-4 gap-3 w-full h-full">
            <div className="col-span-1 row-span-2">
              <ModuleInfo />
            </div>
            <div className="col-span-1 row-span-4 flex flex-col gap-y-1">
              {currentShift && (
                <div className="h-full">
                  <ClientInfo />
                </div>
              )}
              <div className="h-full">
                <WaitingClients />
              </div>
            </div>

            <div className="col-span-1 row-span-4">
              <ServiceList />
            </div>

            <div className="col-span-1 row-span-2">
              <ModuleDistracted />
            </div>
            {/* <div className="col-span-1 row-span-3">
              <WaitingClients />
            </div> */}
          </div>
        </GridContainer>
      </AbsenceProvider>
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
