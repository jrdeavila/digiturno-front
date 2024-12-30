import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

type Case = {
  id: number;
  caseNumber: string; // back-end
  subject: string;
  attendedBy: string;
  username: string;
  identification: string;
  recordType: string;
  documentType: string;
  creationDate: string;
  modificationDate: string;
  observation: string;
};

type CasesModalProps = {
  isOpen: boolean;
  onClose: () => void;
  cases: Case[];
  loading: boolean;
  error: string | null;
  onSave: (caseData: Case) => void;
  onDelete: (id: number) => void;
};

const CasesModal: React.FC<CasesModalProps> = ({
  isOpen,
  onClose,
  cases,
  loading,
  error,
  onSave,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCases, setFilteredCases] = useState<Case[]>(cases);

  const currentDate = new Date().toISOString().slice(0, 10);

  const handleEdit = (caseData: Case) => {
    setSelectedCase({
      ...caseData,
      modificationDate: currentDate,
    });
    setIsEditing(true);
  };

  const handleCreate = () => {
    setSelectedCase({
      id: Date.now(),
      caseNumber: `${Math.floor(Math.random() * 10000)}`,
      subject: '',
      attendedBy: 'Usuario Actual',
      username: '',
      identification: '',
      recordType: '',
      documentType: '',
      creationDate: currentDate,
      modificationDate: currentDate,
      observation: '',
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (selectedCase) {
      onSave(selectedCase);
      setIsEditing(false);
      setSelectedCase(null);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      setFilteredCases(cases);
    } else {
      setFilteredCases(
        cases.filter((c) =>
          c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  };

  const handleResetSearch = () => {
    setSearchQuery('');
    setFilteredCases(cases);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (selectedCase) {
      setSelectedCase({
        ...selectedCase,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleObservationChange = (value: string) => {
    if (selectedCase) {
      setSelectedCase({
        ...selectedCase,
        observation: value,
      });
    }
  };

  const handleBackToTable = () => {
    setIsEditing(false);
    setSelectedCase(null);
  };

  return (
    <div
      className={`${
        isOpen ? 'fixed' : 'hidden'
      } inset-0 bg-black/50 flex justify-center items-center z-50`}
    >
      <div className="bg-white w-5/6 max-w-7xl rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {isEditing ? 'Editar Caso' : 'Lista de Casos'}
          </h2>
          <button onClick={onClose} className="text-red-500 font-bold">
            Cerrar
          </button>
        </div>

        {!isEditing && (
          <>
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={handleCreate}
                className="bg-blue-600 text-white py-2 px-4 rounded"
              >
                Crear Nuevo Caso
              </button>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por Número de Caso"
                  className="border rounded px-3 py-2"
                />
                <button
                  onClick={handleSearch}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Buscar
                </button>
                <button
                  onClick={handleResetSearch}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Reiniciar
                </button>
              </div>
            </div>

            {loading && <p className="text-gray-500">Cargando casos...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <table className="min-w-full bg-white border rounded shadow-lg mt-4">
              <thead>
                <tr className="bg-gray-200 text-left">
                  {[
                    'Número de Caso',
                    'Asunto',
                    'Atendido Por',
                    'Cliente',
                    'Tipo Registro',
                    'Fecha Creación',
                    'Fecha Modificación',
                    'Observación',
                    'Acciones',
                  ].map((header) => (
                    <th key={header} className="py-2 px-4 border-b">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCases.map((c) => (
                  <tr key={c.id} className="border-t">
                    <td className="py-2 px-4">{c.caseNumber}</td>
                    <td className="py-2 px-4">{c.subject}</td>
                    <td className="py-2 px-4">{c.attendedBy}</td>
                    <td className="py-2 px-4">
                      {c.username}
                      <br />
                      <small>{c.identification}</small>
                    </td>
                    <td className="py-2 px-4">{c.recordType}</td>
                    <td className="py-2 px-4">{c.creationDate}</td>
                    <td className="py-2 px-4">{c.modificationDate}</td>
                    <td className="py-2 px-4">{c.observation}</td>
                    <td className="py-2 px-4 flex gap-3">
                      <button
                        onClick={() => handleEdit(c)}
                        className="text-blue-500"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => onDelete(c.id)}
                        className="text-red-500"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {isEditing && selectedCase && (
          <form className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="font-semibold">Número de Caso</label>
              <input
                type="text"
                name="caseNumber"
                value={selectedCase.caseNumber}
                readOnly
                className="border rounded px-3 py-2 bg-gray-100"
              />
            </div>

            <div>
              <label className="font-semibold">Asunto</label>
              <input
                type="text"
                name="subject"
                value={selectedCase.subject}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
              />
            </div>

            <div className="col-span-2">
              <label className="font-semibold">Observación</label>
              <ReactQuill
                value={selectedCase.observation}
                onChange={handleObservationChange}
                className="rounded h-60" 
              />
            </div>

            <div className="col-span-2 flex justify-between mt-6">
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Guardar
              </button>
              <button
                onClick={handleBackToTable}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Volver
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CasesModal;
