import usePagination from "@/hooks/use-pagination";
import Client from "@/models/client";
import { useClientResource } from "@/providers/client-provider";
import { useClientTypeResource } from "@/providers/client-type-provider";
import {
  faEdit,
  faFileSignature,
  faTrash,
  faTrashRestore,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Pagination } from "@nextui-org/pagination";
import { Select, SelectItem } from "@nextui-org/select";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import { useCallback, useEffect, useState } from "react";
export const ClientTable = () => {
  const columns = [
    {
      name: "ID",
      key: "id",
      showInMobile: false,
    },
    {
      name: "Nombre completo",
      key: "name",
      showInMobile: true,
    },
    {
      name: "Documento de identidad",
      key: "dni",
      showInMobile: true,
    },
    {
      name: "Tipo de cliente",
      key: "clientType",
      showInMobile: false,
    },
    {
      name: "Acciones",
      key: "actions",
      showInMobile: false,
    },
  ];
  // =================================================================

  const { clientTypes, refreshClientTypes } = useClientTypeResource();
  const {
    clients,
    refreshClients,
    setCurrentClient,
    deleteClient,
    forceDeleteClient,
    restoreClient,
  } = useClientResource();
  const [search, setSearch] = useState<string>("");
  const [clientType, setClientType] = useState<string>("");
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const { items, page, pages, setPage } = usePagination(filteredClients, 10);

  // =================================================================

  const handleFilterClients = () => {
    if (clientType) {
      let filteredClients = clients.filter((client) => {
        return (
          client.clientType.toLowerCase() === clientType.toLowerCase() &&
          (client.name.toLowerCase().includes(search.toLowerCase()) ||
            client.dni.includes(search))
        );
      });
      setFilteredClients(filteredClients);
    } else {
      let filteredClients = clients.filter((client) => {
        return (
          client.name.toLowerCase().includes(search.toLowerCase()) ||
          client.dni.includes(search)
        );
      });
      setFilteredClients(filteredClients);
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setClientType(clientTypes[0]?.name || "");
    setFilteredClients(clients);
  };

  // =================================================================

  useEffect(() => {
    setFilteredClients(clients);
  }, [clients]);

  useEffect(() => {
    refreshClientTypes();
  }, []);

  useEffect(() => {
    refreshClients();
  }, []);

  // =================================================================
  const renderCell = useCallback((item: Client, key: string) => {
    switch (key) {
      case "id":
        return (
          <div className={item.isDeleted ? "text-red-500" : ""}>{item.id}</div>
        );
      case "name":
        return (
          <div className={item.isDeleted ? "text-red-500" : ""}>
            {item.name}
          </div>
        );
      case "dni":
        return (
          <div
            className={`${
              item.isDeleted ? "text-red-500" : ""
            } flex flex-row gap-x-1`}
          >
            <span>C.C</span>
            {item.dni}
          </div>
        );
      case "clientType":
        return item.clientType;
      case "actions":
        return (
          <div className="flex flex-row gap-x-3">
            {!item.isDeleted && (
              <Button
                onClick={() => {
                  setCurrentClient(item);
                }}
                className="flex flex-row justify-center items-center"
              >
                <FontAwesomeIcon icon={faEdit} />
                Editar
              </Button>
            )}
            {item.isDeleted ? (
              <>
                <Button
                  onClick={() => {
                    restoreClient(item.id);
                  }}
                  className="flex flex-row justify-center items-center"
                >
                  <FontAwesomeIcon icon={faTrashRestore} />
                  Restaurar
                </Button>
                <Button
                  onClick={() => {
                    forceDeleteClient(item.id);
                  }}
                  className="flex flex-row justify-center items-center"
                >
                  <FontAwesomeIcon icon={faTrash} />
                  Eliminar completamente
                </Button>
              </>
            ) : (
              <Button
                onClick={() => {
                  deleteClient(item.id);
                }}
                className="flex flex-row justify-center items-center"
              >
                <FontAwesomeIcon icon={faTrash} />
                Eliminar
              </Button>
            )}
          </div>
        );
      default:
        return null;
    }
  }, []);
  // =================================================================
  return (
    <Table
      aria-label="Client Table"
      aria-labelledby="client-table"
      topContent={
        <div className="flex flex-row">
          <div className="flex-1 flex flex-col gap-y-1">
            <div className="flex flex-row justify-between">
              <h2 className="text-xl font-bold">CLIENTES</h2>
            </div>
            <div className="hidden lg:flex flex-row">
              <div className="flex flex-row gap-x-1">
                <span className="text-sm">Mostrando</span>
                <span className="text-sm font-bold">{items.length}</span>
                <span className="text-sm">de</span>
                <span className="text-sm font-bold">{clients.length}</span>
                <span className="text-sm">clientes</span>
              </div>
            </div>
            <div className="hidden lg:flex flex-row">
              <div className="flex flex-row gap-x-1">
                <span className="text-sm">Página</span>
                <span className="text-sm font-bold">{page}</span>
                <span className="text-sm">de</span>
                <span className="text-sm font-bold">{pages}</span>
              </div>
            </div>
          </div>
          <div className="flex-1 hidden  lg:flex flex-row gap-x-3 justify-center items-center">
            <Button onClick={handleClearFilters}>
              <FontAwesomeIcon icon={faFileSignature} />
            </Button>
            <Input
              placeholder="Buscar cliente o documento"
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select
              label=""
              aria-label="Tipo de cliente"
              aria-labelledby="client-type-select"
              placeholder="Tipo de cliente"
              onChange={(e) => setClientType(e.target.value)}
            >
              {clientTypes.map((clientType) => (
                <SelectItem
                  key={clientType.name}
                  value={clientType.id}
                  textValue={clientType.name}
                >
                  {clientType.name}
                </SelectItem>
              ))}
            </Select>
            <Button onClick={handleFilterClients} color="secondary">
              BUSCAR
            </Button>
          </div>
        </div>
      }
      bottomContent={
        <Pagination
          showControls
          showShadow
          color="secondary"
          page={page}
          total={pages}
          onChange={(page) => {
            setPage(page);
          }}
        />
      }
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            className={!column.showInMobile ? "hidden lg:table-cell" : ""}
            key={column.key}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={items}>
        {(item) => {
          return (
            <TableRow key={item.id}>
              {columns.map((column) => (
                <TableCell
                  className={!column.showInMobile ? "hidden lg:table-cell" : ""}
                  key={column.key}
                >
                  {renderCell(item, column.key)}
                </TableCell>
              ))}
            </TableRow>
          );
        }}
      </TableBody>
    </Table>
  );
};
