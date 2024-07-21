import Service from "@/models/service";
import { useCreateShift } from "@/providers/create-shift-provider";
import { useServiceResource } from "@/providers/service-provider";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import styled from "styled-components";

const ServiceList = () => {
  const { services, loading } = useServiceResource();
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<Set<string>>(
    new Set<string>()
  );
  const [selectedServicesArray, setSelectedServicesArray] = useState<Service[]>(
    []
  );

  const { setServices } = useCreateShift();

  // ==============================================================================

  useEffect(() => {
    setFilteredServices(services);
  }, [services]);

  useEffect(() => {
    const selectedServicesArray = services.filter((service) =>
      selectedServices.has(service.id.toString())
    );

    setSelectedServicesArray(selectedServicesArray);
  }, [selectedServices, services]);

  useEffect(() => {
    setServices(selectedServicesArray);
  }, [selectedServicesArray, setServices]);

  // ==============================================================================

  const handleSearch = (value: string) => {
    const filteredServices = services.filter((service) =>
      service.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredServices(filteredServices);
  };

  // ==============================================================================

  return (
    <div>
      {
        <ServiceListBox>
          <CardHeader>
            <div className="flex flex-row items-center w-full">
              <div className="flex flex-col w-full">
                <span className="text-xl font-bold">SERVICIOS DISPONIBLES</span>
                <span className="text-sm text-gray-500">
                  Seleccione los servicios que desea reservar
                </span>
              </div>
              <Input
                placeholder="Buscar servicios"
                icon="search"
                size="small"
                width="100%"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardBody>
            {loading ? (
              <div className="flex justify-center items-center w-full h-full">
                <Spinner label="Cargando servicios..." />
              </div>
            ) : (
              <Listbox
                aria-label="Select a service"
                variant="flat"
                selectionMode="multiple"
                selectedKeys={selectedServices}
                onSelectionChange={setSelectedServices}
              >
                {filteredServices.map((service) => (
                  <ListboxItem key={service.id} value={service.id}>
                    {service.name}
                  </ListboxItem>
                ))}
              </Listbox>
            )}
          </CardBody>
          <CardFooter>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">
                {selectedServices.size} servicios seleccionados
              </span>
              <span className="text-xs text-gray-400">
                {selectedServicesArray
                  .map((service) => service.name)
                  .join(", ")}
              </span>
            </div>
          </CardFooter>
        </ServiceListBox>
      }
    </div>
  );
};

const ServiceListBox = styled(Card)`
  padding: 1rem;
  height: 500px;
  overflow-y: auto;
`;
export default ServiceList;
