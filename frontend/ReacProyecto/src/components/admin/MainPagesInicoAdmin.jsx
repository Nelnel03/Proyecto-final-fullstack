import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import services from '../../services/services';

import '../../styles/visitante/Arboles.css';
import '../../styles/admin/MainPagesInicoAdmin.css';
import '../../styles/user/PremiumDashboard.css';
import '../../styles/admin/AdminControlCenter.css';

import ResumenTab from './ResumenTab';
import ListaTab from './ListaTab';
import BajasTab from './BajasTab';
import UsuariosTab from './UsuariosTab';
import VoluntariadosTab from './VoluntariadosTab';
import { AdminSidebar, AdminTopbar, Footer } from '../layout';
import { DarkModeToggle } from '../common';
import ArbolFormTab from './ArbolFormTab';
import BuzonTab from './BuzonTab';
import AyudaTab from './AyudaTab';
import AbonosTab from './AbonosTab';

const FORM_INICIAL = {
  nombre: '',
  nombreCientifico: '',
  tipo: '',
  progreso: 0,
  familia: '',
  altura: '',
  crecimiento: '',
  clima: 'tropical',
  descripcion: '',
  cuidados: '',
  imagenUrl: '',
  estado: 'vivo',
  fechaRegistro: new Date().toISOString().split('T')[0],
};

const USER_FORM_INICIAL = {
  nombre: '',
  email: '',
  password: '',
  rol: 'user',
  fotoPerfil: ''
};

const VOLUNTARIADO_FORM_INICIAL = {
  nombre: '',
  area: '', 
  email: '',
  telefono: '',
  fechaIngreso: new Date().toISOString().split('T')[0],
  fotoPerfil: ''
};

const ABONO_FORM_INICIAL = {
  nombre: '',
  stock: '',
  unidad: 'kg',
  imagenUrl: ''
};

function MainPagesInicoAdmin() {
  const [adminName, setAdminName] = useState('Administrador');
  const [arboles, setArboles] = useState([]);
  const [form, setForm] = useState(FORM_INICIAL);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditando, setIdEditando] = useState(null);
  const [tab, setTab] = useState('resumen'); 
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [modoNuevoTipo, setModoNuevoTipo] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [statsTipos, setStatsTipos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [formUsuario, setFormUsuario] = useState(USER_FORM_INICIAL);
  const [modoEdicionUsuario, setModoEdicionUsuario] = useState(false);
  const [idEditandoUsuario, setIdEditandoUsuario] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [voluntariados, setVoluntariados] = useState([]);
  const [formVoluntariado, setFormVoluntariado] = useState(VOLUNTARIADO_FORM_INICIAL);
  const [modoEdicionVoluntariado, setModoEdicionVoluntariado] = useState(false);
  const [idEditandoVoluntariado, setIdEditandoVoluntariado] = useState(null);

  const [abonos, setAbonos] = useState([]);
  const [formAbono, setFormAbono] = useState(ABONO_FORM_INICIAL);
  const [modoEdicionAbono, setModoEdicionAbono] = useState(false);
  const [idEditandoAbono, setIdEditandoAbono] = useState(null);
  const [userSubTab, setUserSubTab] = useState('activos'); 
  const [totalNotificaciones, setTotalNotificaciones] = useState(0);

  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [busqueda, setBusqueda] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState('Satellite'); // For the map toggle

  const tiposDisponibles = Array.from(new Set([
    ...arboles.map(a => a.tipo).filter(Boolean).map(t => t.toLowerCase()),
    ...statsTipos.map(s => s.tipo).filter(Boolean).map(t => t.toLowerCase())
  ]));

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated');
    const userData = sessionStorage.getItem('user');

    if (!isAuthenticated || !userData) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(userData);
    if (user.rol !== 'admin') {
      navigate('/user');
      return;
    }

    setAdminName(user.nombre);
    cargarArboles();

    // POLLEO EN TIEMPO REAL (Simulación con Intervalo de 30s)
    const intervalId = setInterval(() => {
      cargarArboles();
    }, 30000); 

    return () => clearInterval(intervalId);
  }, [navigate]);

  const cargarArboles = async () => {
    setCargando(true);
    try {
      const [datosArboles, datosStats, datosUsuarios, datosVol, datosAbonos, datosSoporte, datosRobos, datosSolicitudes, datosLabores] = await Promise.all([
        services.getArboles(),
        services.getStatsTipos(),
        services.getUsuarios(),
        services.getVoluntariados(),
        services.getAbonos(),
        services.getReportes(),
        services.getReportesRobados(),
        services.getSolicitudesVoluntariado(),
        services.getReportesVoluntariado()
      ]);
      setArboles(datosArboles || []);
      setStatsTipos(datosStats || []);
      setUsuarios(datosUsuarios || []);
      setVoluntariados(datosVol || []);
      setAbonos(datosAbonos || []);
      
      const unreadSoporte = (datosSoporte || []).filter(r => !r.visto).length;
      const unreadRobos = (datosRobos || []).filter(r => !r.visto).length;
      const unreadSolicitudes = (datosSolicitudes || []).filter(r => !r.visto).length;
      const unreadLabores = (datosLabores || []).filter(r => !r.visto).length;
      setTotalNotificaciones(unreadSoporte + unreadRobos + unreadSolicitudes + unreadLabores);
    } catch (err) {
      mostrarMensaje('Error al cargar la información.', 'error');
    } finally {
      setCargando(false);
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: "¿Estás seguro de que deseas salir del panel de administración?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Sí, Salir',
      cancelButtonText: 'Cancelar',
      background: document.body.getAttribute('data-theme') === 'dark' ? '#161b22' : '#fff',
      color: document.body.getAttribute('data-theme') === 'dark' ? '#fff' : '#000'
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.clear();
        navigate('/login');
      }
    });
  };

  useEffect(() => {
    if (tab === 'seguimiento' && !tipoFiltro && tiposDisponibles.length > 0) {
      setTipoFiltro(tiposDisponibles[0]);
    }
  }, [tab, tiposDisponibles, tipoFiltro]);

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    const trimmedNombre = formUsuario.nombre.trim();
    const trimmedEmail = formUsuario.email.trim();
    const trimmedPassword = formUsuario.password.trim();

    if (!trimmedNombre || !trimmedEmail || (!modoEdicionUsuario && !trimmedPassword)) {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
      return;
    }

    if (trimmedNombre.length < 3) {
      Swal.fire('Error', 'El nombre es demasiado corto', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      Swal.fire('Error', 'El formato del correo es incorrecto', 'error');
      return;
    }
    
    try {
      if (modoEdicionUsuario) {
        await services.putUsuarios({ ...formUsuario, nombre: trimmedNombre, email: trimmedEmail }, idEditandoUsuario);
        setUsuarios(prev => prev.map(u => u.id === idEditandoUsuario ? { ...u, ...formUsuario, nombre: trimmedNombre, email: trimmedEmail } : u));
        Swal.fire('Éxito', 'Usuario actualizado', 'success');
      } else {
        const nuevoUser = await services.postUsuarios({ ...formUsuario, nombre: trimmedNombre, email: trimmedEmail, status: 'activo' });
        setUsuarios(prev => [...prev, nuevoUser]);
        Swal.fire('Éxito', 'Usuario creado', 'success');
      }
      resetFormUsuario();
    } catch (err) {
      Swal.fire('Error', 'No se pudo guardar el usuario', 'error');
    }
  };

  const handleEditarUsuario = (user) => {
    setFormUsuario(user);
    setModoEdicionUsuario(true);
    setIdEditandoUsuario(user.id);
    setTab('usuarios');
    setTimeout(() => {
      document.getElementById('user-form-container')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleBanUsuario = async (id, nombre) => {
    const { value: motivo } = await Swal.fire({
      title: '¿Confirmar cancelación?',
      text: `Ingresa el motivo para cancelar la cuenta de "${nombre}":`,
      input: 'textarea',
      inputPlaceholder: 'Indica por qué se cancela...',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Volver',
      inputValidator: (value) => {
        if (!value) return 'Debes proporcionar un motivo';
      }
    });

    if (motivo) {
      try {
        const user = usuarios.find(u => u.id === id);
        await services.putUsuarios({ ...user, status: 'baneado', motivoBan: motivo }, id);
        setUsuarios(prev => prev.map(u => u.id === id ? { ...u, status: 'baneado', motivoBan: motivo } : u));
        Swal.fire('Cancelado', 'La cuenta ha sido cancelada', 'success');
      } catch (err) {
        Swal.fire('Error', 'No se pudo cancelar la cuenta', 'error');
      }
    }
  };

  const handleActivarUsuario = async (id, nombre) => {
    const confirm = await Swal.fire({
      title: '¿Reactivar usuario?',
      text: `¿Deseas reactivar la cuenta de "${nombre}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, reactivar'
    });

    if (confirm.isConfirmed) {
      try {
        const user = usuarios.find(u => u.id === id);
        const userActivo = { ...user, status: 'activo', motivoBan: null };
        await services.putUsuarios(userActivo, id);
        setUsuarios(prev => prev.map(u => u.id === id ? { ...u, status: 'activo', motivoBan: null } : u));
        Swal.fire('Reactivado', 'Usuario activado', 'success');
      } catch (err) {
        Swal.fire('Error', 'No se pudo reactivar la cuenta', 'error');
      }
    }
  };

  const resetFormUsuario = () => {
    setFormUsuario(USER_FORM_INICIAL);
    setModoEdicionUsuario(false);
    setIdEditandoUsuario(null);
  };

  const handleVoluntariadoSubmit = async (e) => {
    e.preventDefault();
    
    if (!formVoluntariado.nombre.trim() || !formVoluntariado.email.trim() || !formVoluntariado.telefono.trim()) {
      Swal.fire('Validación', 'Por favor completa los campos obligatorios', 'warning');
      return;
    }

    if (formVoluntariado.telefono.length < 8) {
      Swal.fire('Error', 'El número de teléfono debe tener al menos 8 dígitos', 'error');
      return;
    }

    try {
      if (modoEdicionVoluntariado) {
        await services.putVoluntariados(formVoluntariado, idEditandoVoluntariado);
        setVoluntariados(prev => prev.map(v => v.id === idEditandoVoluntariado ? { ...v, ...formVoluntariado } : v));
        Swal.fire('Éxito', 'Voluntario actualizado', 'success');
      } else {
        const nuevoVol = await services.postVoluntariados({ ...formVoluntariado, rol: 'voluntario', password: 'Voluntario123', debeCambiarPassword: true });
        setVoluntariados(prev => [...prev, nuevoVol]);
        Swal.fire('Registrado', 'Voluntario creado. Pwd temporal: Voluntario123', 'success');
      }
      resetFormVoluntariado();
    } catch (err) {
      Swal.fire('Error', 'No se pudo gestionar el voluntariado', 'error');
    }
  };

  const handleEditarVoluntariado = (vol) => {
    setFormVoluntariado(vol);
    setModoEdicionVoluntariado(true);
    setIdEditandoVoluntariado(vol.id);
    setTab('voluntariados');
    setTimeout(() => {
      document.getElementById('voluntariado-form-container')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleEliminarVoluntariado = async (id, nombre) => {
    const confirm = await Swal.fire({
      title: '¿Dar de baja?',
      text: `¿Eliminar a "${nombre}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33'
    });

    if (confirm.isConfirmed) {
      try {
        await services.deleteVoluntariados(id);
        setVoluntariados(prev => prev.filter(v => v.id !== id));
        Swal.fire('Eliminado', 'Voluntario eliminado', 'success');
      } catch (err) {
        Swal.fire('Error', 'No se pudo eliminar', 'error');
      }
    }
  };

  const resetFormVoluntariado = () => {
    setFormVoluntariado(VOLUNTARIADO_FORM_INICIAL);
    setModoEdicionVoluntariado(false);
    setIdEditandoVoluntariado(null);
  };

  const handleConvertirUsuarioAVoluntariado = async (user) => {
    const { value: formValues } = await Swal.fire({
      title: 'Convertir a Voluntario',
      html: `<input id="swal-input1" class="swal2-input" placeholder="Área">
             <input id="swal-input2" class="swal2-input" placeholder="Teléfono" maxlength="8">`,
      preConfirm: () => ({ 
        area: document.getElementById('swal-input1').value, 
        telefono: document.getElementById('swal-input2').value 
      })
    });

    if (formValues && formValues.area && formValues.telefono) {
      try {
        await services.putUsuarios({ 
          ...user, 
          rol: 'voluntario', 
          area: formValues.area, 
          telefono: formValues.telefono, 
          fechaIngreso: new Date().toISOString().split('T')[0] 
        }, user.id);
        Swal.fire('Éxito', `${user.nombre} ahora es voluntario`, 'success');
        setTab('voluntariados');
        await cargarArboles();
      } catch (error) {
        Swal.fire('Error', 'Conversión fallida', 'error');
      }
    }
  };

  const handleConvertirVoluntariadoAUsuario = async (vol) => {
    const { value: password } = await Swal.fire({
      title: 'Convertir a Usuario',
      input: 'password',
      inputPlaceholder: 'Contraseña nueva',
      inputValidator: (v) => !v && 'Debes ingresar una contraseña'
    });

    if (password) {
      try {
        const updated = { ...vol, password, rol: 'user' };
        delete updated.area; delete updated.telefono; delete updated.fechaIngreso;
        await services.putUsuarios(updated, vol.id);
        Swal.fire('Éxito', `${vol.nombre} ahora es usuario normal`, 'success');
        setTab('usuarios');
        await cargarArboles();
      } catch (error) {
        Swal.fire('Error', 'Conversión fallida', 'error');
      }
    }
  };

  const handleUpdateStatTipo = async (tipo, field, value) => {
    try {
      const tipoLower = tipo.toLowerCase();
      const existingStat = statsTipos.find(s => s.tipo.toLowerCase() === tipoLower);
      if (existingStat) {
        await services.putStatsTipos({ ...existingStat, [field]: parseInt(value) || 0 }, existingStat.id);
      } else {
        await services.postStatsTipos({ tipo: tipoLower, planificados: field === 'planificados' ? parseInt(value) : 0, muertos: field === 'muertos' ? parseInt(value) : 0 });
      }
      const nuevosStats = await services.getStatsTipos();
      setStatsTipos(nuevosStats);
    } catch (e) {
      mostrarMensaje('Error al actualizar estadísticas.', 'error');
    }
  };

  const mostrarMensaje = (texto, tipo = 'success') => {
    Swal.fire({ title: texto, icon: tipo, timer: 3000, showConfirmButton: false, toast: true, position: 'top-end' });
  };

  const resetFormAbono = () => { setFormAbono(ABONO_FORM_INICIAL); setModoEdicionAbono(false); setIdEditandoAbono(null); };

  const handleLimpiarHistorialAbono = async (arbol) => {
    if ((await Swal.fire({ title: '¿Limpiar historial?', showCancelButton: true })).isConfirmed) {
      try {
        await services.putArboles({ ...arbol, historialAbono: [] }, arbol.id);
        await cargarArboles();
      } catch (e) { Swal.fire('Error', 'No se pudo limpiar historial', 'error'); }
    }
  };

  const handleAbonoSubmit = async (e) => {
    e.preventDefault();
    if (!formAbono.nombre.trim() || !formAbono.stock) {
      Swal.fire('Error', 'Nombre y Stock son requeridos', 'error');
      return;
    }
    try {
      if (modoEdicionAbono) {
        await services.putAbonos(formAbono, idEditandoAbono);
        setAbonos(prev => prev.map(a => a.id === idEditandoAbono ? { ...a, ...formAbono } : a));
      } else {
        const nuevoAbono = await services.postAbonos(formAbono);
        setAbonos(prev => [...prev, nuevoAbono]);
      }
      resetFormAbono();
      Swal.fire('Éxito', 'Abono gestionado correctamente', 'success');
    } catch (err) { 
      Swal.fire('Error', 'No se pudo guardar abono', 'error'); 
    }
  };

  const handleEditarAbono = (abono) => { setFormAbono(abono); setModoEdicionAbono(true); setIdEditandoAbono(abono.id); setTab('abonos'); };

  const handleEliminarAbono = async (id, nombre) => {
    if ((await Swal.fire({ title: `¿Eliminar "${nombre}"?`, showCancelButton: true })).isConfirmed) {
      try { 
        await services.deleteAbonos(id); 
        setAbonos(prev => prev.filter(a => a.id !== id));
        Swal.fire('Eliminado', 'Abono eliminado', 'success');
      } catch (err) { 
        Swal.fire('Error', 'Error al eliminar', 'error'); 
      }
    }
  };

  const handleAbonarArbol = async (arbol) => {
    if (abonos.length === 0) return;
    const { value: abonoId } = await Swal.fire({
      title: 'Aplicar Abono',
      input: 'select',
      inputOptions: abonos.reduce((a, c) => { a[c.id] = `${c.nombre} (${c.stock} ${c.unidad})`; return a; }, {}),
      showCancelButton: true
    });
    if (abonoId) {
      try {
        const abonoIdNum = parseInt(abonoId, 10);
        const abono = abonos.find(a => a.id === abonoIdNum);
        if (!abono) return;
        await services.putAbonos({ ...abono, stock: abono.stock - 1 }, abonoIdNum);
        const nuevoHist = { abono: abono.nombre, fecha: new Date().toISOString().split('T')[0], idAbono: abonoIdNum };
        await services.putArboles({ ...arbol, historialAbono: [...(arbol.historialAbono || []), nuevoHist] }, arbol.id);
        await cargarArboles();
      } catch (e) { Swal.fire('Error', 'Error al abonar', 'error'); }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'tipoSelector') {
      if (value === '___nuevo___') {
        setModoNuevoTipo(true);
        setForm({ ...form, tipo: '' });
      } else {
        setModoNuevoTipo(false);
        setForm({ ...form, tipo: value });
      }
      return;
    }
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.tipo) {
      Swal.fire('Atención', 'Nombre y Tipo son obligatorios', 'warning');
      return;
    }
    setIsSubmitting(true);
    try {
      const formNormalizado = { 
        ...form, 
        tipo: form.tipo ? form.tipo.toLowerCase().trim() : '' 
      };

      if (modoEdicion) {
        await services.putArboles(formNormalizado, idEditando);
        // ACTUALIZACIÓN LOCAL: Modificamos el elemento en el estado
        setArboles(prev => prev.map(a => a.id === idEditando ? { ...a, ...formNormalizado } : a));
        Swal.fire('Éxito', 'Especie actualizada correctamente', 'success');
      } else {
        const nuevoArbol = await services.postArboles(formNormalizado);
        // ACTUALIZACIÓN LOCAL: Agregamos el nuevo elemento al inicio
        setArboles(prev => [nuevoArbol, ...prev]);
        Swal.fire('Éxito', 'Especie guardada correctamente', 'success');
      }
      
      resetForm(); 
      setTab('lista'); 
      // Ya no es necesario llamar a cargarArboles() para ver el cambio
    } catch (err) { 
      Swal.fire('Error', 'No se pudo guardar la especie.', 'error'); 
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditar = (arbol) => { 
    setForm({ ...FORM_INICIAL, ...arbol }); 
    setModoEdicion(true); 
    setIdEditando(arbol.id); 
    if (tab !== 'lista') setTab('lista'); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEliminar = async (arbol) => {
    const result = await Swal.fire({ 
      title: `¿Eliminar "${arbol.nombre}"?`, 
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#344e41',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try { 
        await services.deleteArboles(arbol.id); 
        // ACTUALIZACIÓN OPTIMISTA/LOCAL: Removemos el elemento del estado
        setArboles(prev => prev.filter(a => a.id !== arbol.id));
        Swal.fire('Eliminado', 'El registro ha sido borrado.', 'success');
      } catch (err) { 
        Swal.fire('Error', 'No se pudo eliminar el registro.', 'error'); 
      }
    }
  };

  const handleEliminarTipo = async (tipoDelete) => {
    if ((await Swal.fire({ title: `¿Eliminar tipo "${tipoDelete}"?`, showCancelButton: true })).isConfirmed) {
      try {
        const aBorrar = arboles.filter(a => (a.tipo || '').toLowerCase() === tipoDelete.toLowerCase());
        await Promise.all(aBorrar.map(a => services.deleteArboles(a.id)));
        const stat = statsTipos.find(s => s.tipo.toLowerCase() === tipoDelete.toLowerCase());
        if (stat) await services.deleteStatsTipos(stat.id);
        await cargarArboles(); setTab('lista');
      } catch(e) { Swal.fire('Error', 'Error al eliminar registros', 'error'); }
    }
  };

  const resetForm = () => { 
    setForm({ 
      ...FORM_INICIAL, 
      tipo: tiposDisponibles[0] || '', 
      fechaRegistro: new Date().toISOString().split('T')[0] 
    }); 
    setModoEdicion(false); 
    setIdEditando(null); 
    setModoNuevoTipo(false); 
  };





  const handleTabChange = (newTab) => {
    setTab(newTab);
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div className={`admin-layout ${isMobile ? 'is-mobile' : ''}`}>
      <AdminSidebar 
        tab={tab} 
        setTab={handleTabChange} 
        resetForm={resetForm} 
        resetFormUsuario={resetFormUsuario} 
        handleLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
      />

      {isMobile && sidebarOpen && (
        <div className="admin-sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}

      <div className="admin-main-wrapper">
        <AdminTopbar 
          totalNotificaciones={totalNotificaciones} 
          setTab={setTab}
          isMobile={isMobile}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        <section className="admin-content-view">
          <div className="tab-render-area">
            {tab === 'resumen' && (
              <ResumenTab 
                usuarios={usuarios} 
                arboles={arboles} 
                setTab={setTab} 
                setUserSubTab={setUserSubTab} 
              />
            )}
            {tab === 'lista' && <ListaTab busqueda={busqueda} setBusqueda={setBusqueda} tipoFiltro={tipoFiltro} setTipoFiltro={setTipoFiltro} tiposDisponibles={tiposDisponibles} setTab={setTab} handleEliminarTipo={handleEliminarTipo} statsTipos={statsTipos} handleUpdateStatTipo={handleUpdateStatTipo} arboles={arboles} cargando={cargando} handleEditar={handleEditar} handleAbonarArbol={handleAbonarArbol} handleEliminar={handleEliminar} handleLimpiarHistorialAbono={handleLimpiarHistorialAbono} modoEdicion={modoEdicion} handleSubmit={handleSubmit} form={form} handleChange={handleChange} modoNuevoTipo={modoNuevoTipo} setModoNuevoTipo={setModoNuevoTipo} setForm={setForm} resetForm={resetForm} isSubmitting={isSubmitting} />}
            {tab === 'bajas' && <BajasTab arboles={arboles} handleEditar={handleEditar} />}
            {tab === 'usuarios' && <UsuariosTab refrescarUsuarios={cargarArboles} modoEdicionUsuario={modoEdicionUsuario} handleUserSubmit={handleUserSubmit} formUsuario={formUsuario} setFormUsuario={setFormUsuario} resetFormUsuario={resetFormUsuario} usuarios={usuarios} handleEditarUsuario={handleEditarUsuario} handleBanUsuario={handleBanUsuario} handleActivarUsuario={handleActivarUsuario} handleConvertirUsuarioAVoluntariado={handleConvertirUsuarioAVoluntariado} subTab={userSubTab} setSubTab={setUserSubTab} />}
            {tab === 'voluntariados' && <VoluntariadosTab refrescarVoluntarios={cargarArboles} refrescarNotificaciones={cargarArboles} modoEdicionVoluntariado={modoEdicionVoluntariado} handleVoluntariadoSubmit={handleVoluntariadoSubmit} formVoluntariado={formVoluntariado} setFormVoluntariado={setFormVoluntariado} resetFormVoluntariado={resetFormVoluntariado} voluntariados={voluntariados} handleEditarVoluntariado={handleEditarVoluntariado} handleEliminarVoluntariado={handleEliminarVoluntariado} handleConvertirVoluntariadoAUsuario={handleConvertirVoluntariadoAUsuario} />}
            {tab === 'abonos' && <AbonosTab modoEdicionAbono={modoEdicionAbono} handleAbonoSubmit={handleAbonoSubmit} formAbono={formAbono} setFormAbono={setFormAbono} resetFormAbono={resetFormAbono} abonos={abonos} handleEditarAbono={handleEditarAbono} handleEliminarAbono={handleEliminarAbono} />}
            {tab === 'buzon' && <BuzonTab refrescarNotificaciones={cargarArboles} /> }

            {tab === 'ayuda' && <AyudaTab /> }
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}


export default MainPagesInicoAdmin;