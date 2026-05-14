import React from 'react';
import { Camera, Loader2, Search, UserPlus, Shield, User, Mail, Hash, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { ImageUploadField } from '../common';
import services, { uploadImage } from '../../services/services';
import Swal from 'sweetalert2';
import { usePagination } from '../../hooks/usePagination';
import { Pagination } from '../ui';
import '../../styles/admin/MainPagesInicoAdmin.css';

function UsuariosTab({
  modoEdicionUsuario,
  handleUserSubmit,
  formUsuario,
  setFormUsuario,
  resetFormUsuario,
  usuarios,
  handleEditarUsuario,
  handleBanUsuario,
  handleActivarUsuario,
  handleConvertirUsuarioAVoluntariado,
  subTab,
  setSubTab,
  refrescarUsuarios
}) {
  const [busqueda, setBusqueda] = React.useState('');
  const [actualizandoAvatarId, setActualizandoAvatarId] = React.useState(null);

  const getRol = (user) => user.Rol?.nombre || user.rol || 'usuario';
  const isBanned = (user) => user.status === 'baneado' || user.status === 'banned';

  const handleAvatarClick = (userId) => {
    document.getElementById(`avatar-input-${userId}`).click();
  };

  const handleAvatarChange = async (e, user) => {
    const file = e.target.files[0];
    if (!file) return;

    setActualizandoAvatarId(user.id);
    try {
      const url = await uploadImage(file);
      await services.putUsuarios({ ...user, fotoPerfil: url }, user.id);

      if (refrescarUsuarios) await refrescarUsuarios();

      Swal.fire({
        title: '¡Actualizado!',
        text: 'Foto de perfil cambiada con éxito',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo actualizar la foto de perfil', 'error');
    } finally {
      setActualizandoAvatarId(null);
    }
  };

  const usuariosFiltrados = usuarios
    .filter(user => getRol(user) !== 'voluntario')
    .filter(user => {
      if (subTab === 'activos') return !isBanned(user);
      return isBanned(user);
    })
    .filter(user =>
      user.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      user.email.toLowerCase().includes(busqueda.toLowerCase())
    );

  const {
    currentPage,
    currentItems,
    totalPages,
    paginate,
    totalItems,
    itemsPerPage
  } = usePagination(usuariosFiltrados, 8);

  return (
    <div className="admin-tab-content-wrapper fade-in">
      <div className="admin-section-header premium-card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <h2 className="text-gradient" style={{ fontSize: '1.6rem', margin: 0 }}>Gestión de Usuarios</h2>
            <p className="text-muted">Control de accesos y perfiles del sistema administrativo</p>
          </div>
          
          <div className="admin-controls-row" style={{ display: 'flex', gap: '1rem' }}>
            <div className="admin-search-container" style={{ position: 'relative', width: '300px' }}>
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="ui-input"
                style={{ paddingLeft: '45px', width: '100%', borderRadius: '12px' }}
              />
            </div>
          </div>
        </div>

        <div className="admin-tabs-navigation" style={{ marginTop: '2.5rem', display: 'flex', gap: '2rem', borderBottom: '1px solid var(--glass-border)' }}>
          <button
            onClick={() => setSubTab('activos')}
            className={`tab-link ${subTab === 'activos' ? 'active' : ''}`}
            style={{ padding: '12px 0', background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer', position: 'relative', color: subTab === 'activos' ? 'var(--ui-primary)' : 'var(--admin-text-muted)' }}
          >
            Usuarios Activos
            {subTab === 'activos' && <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '3px', background: 'var(--ui-primary)', borderRadius: '3px' }}></div>}
          </button>
          <button
            onClick={() => setSubTab('cancelados')}
            className={`tab-link ${subTab === 'cancelados' ? 'active' : ''}`}
            style={{ padding: '12px 0', background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer', position: 'relative', color: subTab === 'cancelados' ? 'var(--ui-error)' : 'var(--admin-text-muted)' }}
          >
            Cuentas Restringidas
            {subTab === 'cancelados' && <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '3px', background: 'var(--ui-error)', borderRadius: '3px' }}></div>}
          </button>
        </div>
      </div>

      <div className="admin-user-grid grid-auto" style={{ marginBottom: '3rem' }}>
        {currentItems.map((user, idx) => (
          <div 
            key={user.id} 
            className={`premium-card user-card fade-in ${isBanned(user) ? 'banned-border' : ''}`}
            style={{ animationDelay: `${idx * 0.05}s`, padding: '1.5rem' }}
          >
            <div className="user-card-top flex-between" style={{ marginBottom: '1.5rem' }}>
              <div 
                className="avatar-container interactive-avatar" 
                onClick={() => handleAvatarClick(user.id)}
                style={{ position: 'relative', width: '64px', height: '64px' }}
              >
                {actualizandoAvatarId === user.id ? (
                  <div className="flex-center" style={{ width: '100%', height: '100%', background: 'rgba(0,0,0,0.1)', borderRadius: '16px' }}>
                    <Loader2 className="animate-spin" size={24} />
                  </div>
                ) : user.fotoPerfil ? (
                  <img src={user.fotoPerfil} alt={user.nombre} style={{ width: '100%', height: '100%', borderRadius: '16px', objectFit: 'cover' }} />
                ) : (
                  <div className="flex-center" style={{ width: '100%', height: '100%', background: 'var(--ui-primary)', color: '#fff', borderRadius: '16px', fontWeight: 800, fontSize: '1.5rem' }}>
                    {user.nombre?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="avatar-hover-overlay flex-center" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', borderRadius: '16px', opacity: 0, transition: '0.3s' }}>
                  <Camera size={20} color="#fff" />
                </div>
                <input
                  type="file"
                  id={`avatar-input-${user.id}`}
                  accept="image/*"
                  onChange={(e) => handleAvatarChange(e, user)}
                  style={{ display: 'none' }}
                />
              </div>

              <div className="role-tag-container">
                <div className={`role-badge ${getRol(user)}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800, background: getRol(user) === 'admin' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)', color: getRol(user) === 'admin' ? 'var(--ui-error)' : 'var(--ui-info)' }}>
                  {getRol(user) === 'admin' ? <Shield size={12} /> : <User size={12} />}
                  {getRol(user).toUpperCase()}
                </div>
              </div>
            </div>

            <div className="user-details" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 800 }}>{user.nombre}</h3>
              <div className="flex-between" style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> {user.email}</span>
              </div>
              <div style={{ marginTop: '8px', fontSize: '0.75rem', fontWeight: 700, opacity: 0.5, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Hash size={12} /> ID: {user.id}
              </div>
            </div>

            {isBanned(user) && (
              <div className="ban-reason-box" style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.1)', marginBottom: '1.5rem' }}>
                <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 800, color: 'var(--ui-error)' }}>MOTIVO DE RESTRICCIÓN:</p>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', fontStyle: 'italic', opacity: 0.8 }}>"{user.motivoBan}"</p>
              </div>
            )}

            <div className="user-actions-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {!isBanned(user) ? (
                <>
                  <button onClick={() => handleEditarUsuario(user)} className="ui-btn ui-btn--ghost" style={{ fontSize: '0.8rem', padding: '10px' }}>
                    Editar Perfil
                  </button>
                  <button 
                    onClick={() => handleBanUsuario(user.id, user.nombre)} 
                    disabled={getRol(user) === 'admin'} 
                    className="ui-btn ui-btn--danger-outline" 
                    style={{ fontSize: '0.8rem', padding: '10px' }}
                  >
                    Restringir
                  </button>
                  {getRol(user) !== 'admin' && (
                    <button onClick={() => handleConvertirUsuarioAVoluntariado(user)} className="ui-btn ui-btn--secondary" style={{ gridColumn: 'span 2', fontSize: '0.8rem', padding: '10px' }}>
                      Promover a Voluntario
                    </button>
                  )}
                </>
              ) : (
                <button onClick={() => handleActivarUsuario(user.id, user.nombre)} className="ui-btn ui-btn--primary" style={{ gridColumn: 'span 2', fontSize: '0.8rem', padding: '12px' }}>
                  <CheckCircle size={16} style={{ marginRight: '8px' }} /> Rehabilitar Cuenta
                </button>
              )}
            </div>
          </div>
        ))}

        {usuariosFiltrados.length === 0 && (
          <div className="empty-state-large flex-center" style={{ gridColumn: '1 / -1', padding: '5rem', background: 'var(--glass-bg)', borderRadius: '24px', opacity: 0.5 }}>
            <XCircle size={48} strokeWidth={1} style={{ marginBottom: '1rem' }} />
            <p>No se encontraron usuarios bajo este criterio.</p>
          </div>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={paginate}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
      />

      {/* Formulario de Creación/Edición Premium */}
      {subTab === 'activos' && (
        <div id="user-form-container" className="premium-card fade-in" style={{ marginTop: '4rem', padding: '2.5rem' }}>
          <div className="form-header flex-between" style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div className="flex-center" style={{ width: '48px', height: '48px', background: 'var(--ui-primary)', color: '#fff', borderRadius: '14px' }}>
                <UserPlus size={24} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>{modoEdicionUsuario ? 'Actualizar Usuario' : 'Crear Nuevo Usuario'}</h3>
                <p className="text-muted" style={{ margin: 0, fontSize: '0.85rem' }}>Define los parámetros de acceso y perfil</p>
              </div>
            </div>
            {modoEdicionUsuario && (
              <button onClick={resetFormUsuario} className="ui-btn ui-btn--ghost" style={{ padding: '8px 16px' }}>
                Descartar cambios
              </button>
            )}
          </div>

          <form onSubmit={handleUserSubmit} className="grid-auto" style={{ gap: '2rem' }}>
            <div className="input-group">
              <label className="ui-label">Nombre Completo</label>
              <input
                type="text"
                required
                value={formUsuario.nombre}
                onChange={(e) => setFormUsuario({...formUsuario, nombre: e.target.value})}
                placeholder="Ej: Juan Pérez"
                className="ui-input"
                style={{ width: '100%', borderRadius: '12px' }}
              />
            </div>

            <div className="input-group">
              <label className="ui-label">Correo Electrónico</label>
              <input
                type="email"
                required
                value={formUsuario.email}
                onChange={(e) => setFormUsuario({...formUsuario, email: e.target.value})}
                placeholder="usuario@ejemplo.com"
                className="ui-input"
                style={{ width: '100%', borderRadius: '12px' }}
              />
            </div>

            <div className="input-group">
              <label className="ui-label">Contraseña</label>
              <input
                type="password"
                required={!modoEdicionUsuario}
                value={formUsuario.password}
                onChange={(e) => setFormUsuario({...formUsuario, password: e.target.value})}
                placeholder={modoEdicionUsuario ? "•••••••• (Sin cambios)" : "••••••••"}
                className="ui-input"
                style={{ width: '100%', borderRadius: '12px' }}
                maxLength="15"
              />
            </div>

            <div className="input-group">
              <label className="ui-label">Rol de Acceso</label>
              <select
                value={formUsuario.rol}
                onChange={(e) => setFormUsuario({...formUsuario, rol: e.target.value})}
                disabled={formUsuario.rol === 'admin'}
                className="ui-input"
                style={{ width: '100%', borderRadius: '12px' }}
              >
                <option value="usuario">Usuario Estándar</option>
                {formUsuario.rol === 'admin' && (
                  <option value="admin">Administrador del Sistema</option>
                )}
              </select>
            </div>

            <div className="input-group" style={{ gridColumn: 'span 2' }}>
              <ImageUploadField
                label="Imagen de Perfil"
                value={formUsuario.fotoPerfil || ''}
                onChange={(url) => setFormUsuario({...formUsuario, fotoPerfil: url})}
                placeholder="Seleccionar imagen..."
                circular={true}
              />
            </div>

            <div className="form-submit-area" style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
              <button type="submit" className="ui-btn ui-btn--primary" style={{ width: '100%', padding: '14px', borderRadius: '14px', fontWeight: 800 }}>
                {modoEdicionUsuario ? 'Aplicar Cambios en Perfil' : 'Finalizar Registro de Usuario'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default UsuariosTab;
