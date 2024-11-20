import { useEffect, useState } from 'react';
import axios from 'axios';

export interface Case {
  id: number;
  clientName: string;
  status: string;
  service: string;
  date: string;
}

const useFetchCases = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        // //
        const response = await axios.get('http://localhost:3000/api/cases');
        setCases(response.data);
      } catch (err) {
        setError('Error al obtener los casos');
        console.error(err); 
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  return { cases, loading, error };
};

export default useFetchCases;
