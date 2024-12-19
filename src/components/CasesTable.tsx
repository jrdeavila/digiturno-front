import React from 'react';

interface Case {
  id: number;
  caseNumber: string;
  subject: string;
  attendedBy: string;
  username: string;
  identification: string;
  recordType: string;
  documentType: string;
  creationDate: string;
  modificationDate: string;
  observation: string;
}

interface CasesTableProps {
  cases: Case[];
  onEdit: (caseItem: Case) => void;
  onDelete: (id: number) => void;
}

const CasesTable: React.FC<CasesTableProps> = ({ cases, onEdit, onDelete }) => {
  return (
    <table className="min-w-full bg-white border rounded shadow-lg mt-4">
      <thead>
        <tr className="bg-gray-200 text-left">
          <th className="py-2 px-4 border-b">Número de Caso</th>
          <th className="py-2 px-4 border-b">Asunto</th>
          <th className="py-2 px-4 border-b">Cliente</th>
          <th className="py-2 px-4 border-b">Atendido Por</th>
          <th className="py-2 px-4 border-b">Tipo de Registro</th>
          <th className="py-2 px-4 border-b">Fecha de Creación</th>
          <th className="py-2 px-4 border-b">Fecha de Modificación</th>
          <th className="py-2 px-4 border-b">Observación</th>
          <th className="py-2 px-4 border-b">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {cases.map((caseItem) => (
          <tr key={caseItem.id}>
            <td className="py-2 px-4 border-b">{caseItem.caseNumber}</td>
            <td className="py-2 px-4 border-b">{caseItem.subject}</td>
            <td className="py-2 px-4 border-b">
              {caseItem.username}
              <br />
              <span className="text-gray-500 text-sm">{caseItem.identification}</span>
            </td>
            <td className="py-2 px-4 border-b">{caseItem.attendedBy}</td>
            <td className="py-2 px-4 border-b">{caseItem.recordType}</td>
            <td className="py-2 px-4 border-b">{caseItem.creationDate}</td>
            <td className="py-2 px-4 border-b">{caseItem.modificationDate}</td>
            <td className="py-2 px-4 border-b">{caseItem.observation}</td>
            <td className="py-2 px-4 border-b flex gap-2">
              <button
                onClick={() => onEdit(caseItem)}
                className="bg-blue-500 text-white px-2 py-1 rounded"
              >
                Editar
              </button>
              <button
                onClick={() => onDelete(caseItem.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CasesTable;
