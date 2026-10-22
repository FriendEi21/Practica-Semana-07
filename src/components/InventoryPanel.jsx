import { useState, useMemo, useCallback, useRef, useEffect, useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { useFetch } from '../hooks/useFetch';

export default function InventoryPanel() {
  //useContext para el tem global
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  //Custom Hook de la API (simular datos técnicos)
  const { data: users, loading, error } = useFetch('https://jsonplaceholder.typicode.com/users');
  
  //useState: Estado simple para el input de búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  
  //useRef para input sin doble render
  const searchInputRef = useRef(null);

  //useEffect para poner el cursor en el buscador
  useEffect(() => {
    //Si ya no está cargando y el input ya existe en el DOM, entonces lo enfocamos
    if (!loading && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [loading]);

  //useMemo para la lista filtrada
  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  //useCallback para no duplicar memoria
  const handleAssignPC = useCallback((userName) => {
    alert(`Se asignó el equipo SFF Corporativo al usuario: ${userName}`);
  }, []);

  //Estilos condicionales basados en el ThemeContext
  const panelStyle = {
    padding: '2rem',
    minHeight: '100vh',
    background: theme === 'light' ? '#f8fafc' : '#1e293b',
    color: theme === 'light' ? '#0f172a' : '#f8fafc',
    fontFamily: 'sans-serif'
  };

  if (loading) return <div style={panelStyle}><h2>Cargando sistema de inventario...</h2></div>;
  if (error) return <div style={panelStyle}><h2 style={{ color: 'red' }}>{error}</h2></div>;

  return (
    <div style={panelStyle}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Panel SFF - Asignación de Equipos</h2>
        <button 
          onClick={toggleTheme} 
          style={{ padding: '0.5rem 1rem', cursor: 'pointer', borderRadius: '5px' }}
        >
          Modo {theme === 'light' ? 'Oscuro 🌙' : 'Claro ☀️'}
        </button>
      </header>

      <div style={{ margin: '2rem 0' }}>
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Buscar técnico o empleado..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '0.8rem', width: '300px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
      </div>

      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {filteredUsers.map(user => (
          <div key={user.id} style={{ padding: '1.5rem', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h3>{user.name}</h3>
            <p><strong>Departamento:</strong> {user.company.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <button 
              onClick={() => handleAssignPC(user.name)}
              style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Asignar PC SFF
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}