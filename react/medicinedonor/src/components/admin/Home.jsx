import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { admingetpatientdetails } from '../../api';

function Home() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const style = {
    container: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "20px",
      padding: "20px",
    },
    card: {
      width: "280px",
      backgroundColor: "#fdfdfd",
      borderRadius: "12px",
      boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
      padding: "20px",
      transition: "transform 0.2s ease",
      cursor: "pointer",
    },
    title: {
      fontSize: "20px",
      fontWeight: "bold",
      marginBottom: "10px",
      color: "#2c3e50",
    },
    text: {
      fontSize: "15px",
      color: "#444",
      margin: "6px 0",
    },
    header: {
      textAlign: "center",
      fontSize: "28px",
      color: "#1a5276",
      margin: "20px 0",
    },
    searchBox: {
      display: "flex",
      justifyContent: "center",
      marginBottom: "20px",
    },
    input: {
      width: "300px",
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #ccc",
      fontSize: "15px",
      marginRight: "10px",
    },
    button: {
      padding: "10px 18px",
      backgroundColor: "#3498db",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "0.3s",
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await admingetpatientdetails();
        setPatients(Array.isArray(data) ? data.reverse() : []); // reverse order
      } catch (e) {
        setErr('Failed to load patients');
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div>Loading…</div>;
  if (err) return <div style={{color:'red'}}>{err}</div>;

  const filtered = patients.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 style={style.header}>ALL PATIENT DETAILS</h1>

      <div style={style.searchBox}>
        <input
          type="text"
          placeholder="Search patient by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={style.input}
        />
      </div>

      <div style={style.container}>
        {filtered.map((p, i) => (
          <div key={i} style={style.card}>
            <div style={style.title}>{p.name}</div>
            <div style={style.text}>Age: {p.age}</div>
            <div style={style.text}>Gender: {p.gender}</div>
            <div style={style.text}>Date: {p.date}</div>
            <div style={style.text}>Time: {p.time}</div>
            <div style={style.text}>Hospital: {p.hospital}</div>
            <div style={style.text}>
              Approved: {p.approved ? "✅ Yes" : "❌ No"}
            </div>
            <div style={style.text}>id: {p.id}</div>
            <button
              style={style.button}
              onClick={() => navigate(`/AdminPatientDetails/${p.id}`)}
             
            >
              View
            </button>
         
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
