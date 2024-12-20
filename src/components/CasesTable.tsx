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

const CasesTable: React.FC<{ cases: Case[] }> = ({ cases }) => {
  return (
    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Case Number</th>
            <th>Subject</th>
            <th>Attended By</th>
            <th>Username</th>
            <th>Identification</th>
            <th>Record Type</th>
            <th>Document Type</th>
            <th>Creation Date</th>
            <th>Modification Date</th>
            <th>Observation</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((caseItem) => (
            <tr key={caseItem.id}>
              <td>{caseItem.id}</td>
              <td>{caseItem.caseNumber}</td>
              <td>{caseItem.subject}</td>
              <td>{caseItem.attendedBy}</td>
              <td>{caseItem.username}</td>
              <td>{caseItem.identification}</td>
              <td>{caseItem.recordType}</td>
              <td>{caseItem.documentType}</td>
              <td>{caseItem.creationDate}</td>
              <td>{caseItem.modificationDate}</td>
              <td>{caseItem.observation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CasesTable;