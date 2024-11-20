import React from 'react';

interface Case {
  id: number;
  title: string;
  description: string;
  status: string;
}

interface CasesTableProps {
  cases: Case[];
}

const CasesTable: React.FC<CasesTableProps> = ({ cases }) => {
  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          <th className="py-2 px-4 border-b">ID</th>
          <th className="py-2 px-4 border-b">Título</th>
          <th className="py-2 px-4 border-b">Descripción</th>
          <th className="py-2 px-4 border-b">Estado</th>
          <th className="py-2 px-4 border-b">Estado</th>
          <th className="py-2 px-4 border-b">Estado</th>
          <th className="py-2 px-4 border-b">Estado</th>
        </tr>
      </thead>
      <tbody>
        {cases.map((caseItem) => (
          <tr key={caseItem.id}>
            <td className="py-2 px-4 border-b">{caseItem.id}</td>
            <td className="py-2 px-4 border-b">{caseItem.title}</td>
            <td className="py-2 px-4 border-b">{caseItem.description}</td>
            <td className="py-2 px-4 border-b">{caseItem.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CasesTable;
