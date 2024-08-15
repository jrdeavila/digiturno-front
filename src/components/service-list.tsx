import Service from "@/models/service";
import { useCreateShift } from "@/providers/create-shift-provider";
import { useServiceResource } from "@/providers/service-provider";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";

const ServiceList = () => {
  const { services, loading } = useServiceResource();
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);



  const [selectedServices, setSelectedServices] = useState<Service[]>([]);

  const { setServices, services: savedSelectedServices } = useCreateShift();

  // ==============================================================================

  useEffect(() => {
    setFilteredServices(services);
  }, [services]);

  useEffect(() => {
    if (selectedServices.length > 0) {
      setServices(selectedServices);
    }
  }, [selectedServices, setServices]);

  useEffect(() => {
    console.log(savedSelectedServices);
    if ((savedSelectedServices?.length ?? 0) <= 0) {
      setSelectedServices([]);
    }
  }, [savedSelectedServices]);

  // ==============================================================================

  const handleSearch = (value: string) => {
    const filteredServices = services.filter((service) =>
      service.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredServices(filteredServices);
  };

  // ==============================================================================

  return (
    <Card classNames={{
      base: 'w-full h-full bg-transparent rounded-none shadow-none',
      body: "h-full",
    }}>
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
            width="100%"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardBody className="overflow-y-scroll" >
        {loading ? (
          <div className="flex justify-center items-center w-full h-full">
            <Spinner label="Cargando servicios..." />
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-2">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className={`flex flex-row items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-primary-200 ${selectedServices.includes(service) && "bg-primary-400 text-white"
                  }`}
                onClick={() => {
                  if (selectedServices.includes(service)) {
                    setSelectedServices((prev) =>
                      prev.filter((prevService) => prevService !== service)
                    );
                  } else {
                    setSelectedServices((prev) => [...prev, service]);
                  }
                }}
              >
                <span>{service.name}</span>
              </div>
            ))}
          </div>
        )}
      </CardBody>
      <CardFooter>
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">
            {selectedServices.length} servicios seleccionados
          </span>
          <span className="text-xs text-gray-400">
            {selectedServices
              .map((service) => service.name)
              .join(", ")}
          </span>
        </div>
      </CardFooter>
    </Card>


  );
};


export default ServiceList;
