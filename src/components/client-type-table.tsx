import ClientType from "@/models/client-type";
import { useClientTypeResource } from "@/providers/client-type-provider";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import { useCallback } from "react";

export const ClientTypeTable = () => {
  const columns = [
    {
      name: "ID",
      key: "id",
    },
    {
      name: "Nombre",
      key: "name",
    },
  ];

  // =================================================================

  const { clientTypes } = useClientTypeResource();

  // =================================================================

  const renderCell = useCallback((item: ClientType, key: string) => {
    switch (key) {
      case "id":
        return item.id;
      case "name":
        return item.name;
      default:
        return null;
    }
  }, []);

  // =================================================================

  return (
    <Table
      aria-label="Client Type Table"
      aria-labelledby="client-type-table"
      topContent={
        <div className="flex flex-row justify-between">
          <h2 className="text-xl font-bold">TIPOS DE CLIENTE</h2>
        </div>
      }
    >
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.name}</TableColumn>}
      </TableHeader>
      <TableBody items={clientTypes}>
        {(item) => {
          return (
            <TableRow key={item.id}>
              {columns.map((column) => (
                <TableCell key={column.key}>
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
