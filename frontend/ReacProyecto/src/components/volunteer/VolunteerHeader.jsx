import React from 'react';
import DarkModeToggle from '../DarkModeToggle';

const VolunteerHeader = ({ user }) => {
  return (
    <header className="visitante-header volunteer-header" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      {user?.fotoPerfil ? (
        <img 
          src={user.fotoPerfil} 
          alt="Avatar" 
          style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid white' }} 
        />
      ) : (
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#fff', border: '2px solid white' }}>
          {user?.nombre ? user.nombre.charAt(0).toUpperCase() : '?'}
        </div>
      )}
      <div style={{ textAlign: 'left', flex: 1 }}>
        <h1 className="volunteer-header-title" style={{ margin: 0 }}>Centro de Servicio</h1>
        <p className="volunteer-header-subtitle" style={{ margin: 0 }}>¡Hola {user?.nombre}! Gestiona tus actividades y horas trabajadas.</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <DarkModeToggle />
      </div>
    </header>
  );
};

export default VolunteerHeader;
