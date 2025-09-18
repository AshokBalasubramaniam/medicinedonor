import React, { useEffect, useState } from 'react';
import { admingetpatientdetails } from '../../api';
import { PatientsListBase } from './_PatientsListBase';

export default function RejectedPatients() {
  const [patients, setPatients] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const data = await admingetpatientdetails();
        const arr = Array.isArray(data) ? data : [];
        setPatients(arr.filter((p) => p.approved === false).reverse());
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);
  return <PatientsListBase patients={patients} title="Rejected Patients" />;
}
