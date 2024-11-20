import React, { useState } from 'react';
import CasesModal from './CasesModal'; // Asegúrate de que este es el archivo correcto

const App = () => {
  const [modalOpen, setModalOpen] = useState(true); // Controla la visibilidad del modal
  const [cases, setCases] = useState([
    {
      id: 1,
      caseNumber: 'CASO001',
      subject: 'Consulta médica',
      attendedBy: 'Dr. López',
      username: 'Juan Pérez',
      identification: '12345678',
      recordType: 'Urgente',
      documentType: 'DNI',
      creationDate: '2024-11-01',
      modificationDate: '2024-11-01',
      observation: 'Primera consulta de seguimiento.',
    },
    {
      id: 2,
      caseNumber: 'CASO002',
      subject: 'Atención jurídica',
      attendedBy: 'Lic. Ramírez',
      username: 'Ana Gómez',
      identification: '87654321',
      recordType: 'Normal',
      documentType: 'Pasaporte',
      creationDate: '2024-10-15',
      modificationDate: '2024-10-20',
      observation: 'Revisión de contrato laboral.',
    },
    {
      id: 3,
      caseNumber: 'CASO003',
      subject: 'Soporte técnico',
      attendedBy: 'Ing. Castillo',
      username: 'Carlos Mendoza',
      identification: '11223344',
      recordType: 'Normal',
      documentType: 'Cédula',
      creationDate: '2024-11-10',
      modificationDate: '2024-11-15',
      observation: 'Resolución de problema de conectividad.',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = (updatedCase: any) => {
    setCases((prevCases) =>
      prevCases.map((c) => (c.id === updatedCase.id ? updatedCase : c))
    );
  };

  const handleDelete = (id: number) => {
    setCases((prevCases) => prevCases.filter((c) => c.id !== id));
  };

  return (
    <div className="App">
      <button
        onClick={() => setModalOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Abrir Modal
      </button>
      <CasesModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        cases={cases}
        loading={loading}
        error={error}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default App;
