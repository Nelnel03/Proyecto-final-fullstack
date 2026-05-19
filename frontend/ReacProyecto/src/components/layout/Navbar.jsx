import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import DarkModeToggle from '../common/DarkModeToggle';
import '../../styles/Navbar.css';
import { Trees } from 'lucide-react';
import logoImg from '../../assets/logo_no_bg.png';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [auth, setAuth] = useState(sessionStorage.getItem('isAuthenticated') === 'true');
    const userJson = sessionStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;

    useEffect(() => {
        setAuth(sessionStorage.getItem('isAuthenticated') === 'true');
    }, [location]);

    const handleLogout = () => {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        Swal.fire({
            title: '¿Cerrar sesión?',
            text: "¿Estás seguro de que quieres salir?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#344e41',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, Salir',
            cancelButtonText: 'Cancelar',
            background: isDark ? '#1e1e1e' : '#fff',
            color: isDark ? '#fff' : '#545454'
        }).then((result) => {
            if (result.isConfirmed) {
                sessionStorage.clear(); // Limpiamos todo para estar seguros
                setAuth(false);
                navigate('/');
            }
        });
    };


    return (
        <nav className="navbar-main">
            <div onClick={() => navigate(auth && user ? (user.rol === 'voluntario' ? '/dashboard-voluntario' : '/dashboard-user') : '/')} className="navbar-logo-container">
                <div className="navbar-logo-icon">
                    <Trees size={32} strokeWidth={2} className="text-[#0A3323] drop-shadow-sm" />
                </div>
                <div className="navbar-logo-text-wrapper">
                    <h2 className="navbar-logo-title">BIOMON ADI</h2>
                    <span className="navbar-logo-subtitle">BIOMON ADI | LA ANGOSTURA</span>
                </div>
            </div>
            
            <div className="navbar-links-container">
                <DarkModeToggle />
                {/* Si no es admin y no está logueado, mostrar inicio. Si está logueado, el logo ya lo lleva a su panel. */}
                {!location.pathname.startsWith('/admin') && !auth && (
                    <button onClick={() => navigate('/')} className="navbar-btn-link">
                        Inicio
                    </button>
                )}

                {!location.pathname.startsWith('/admin') && 
                 !location.pathname.startsWith('/user') && 
                 !location.pathname.startsWith('/dashboard-user') && (
                    <button onClick={() => navigate('/mapa')} className="navbar-btn-link">
                        Mapa
                    </button>
                )}


                {!location.pathname.startsWith('/admin') && 
                 !location.pathname.startsWith('/user') && 
                 !location.pathname.startsWith('/dashboard-user') && (
                    <button onClick={() => navigate('/historia')} className="navbar-btn-link">
                        Historia
                    </button>
                )}



                {!auth ? (
                    <button 
                        onClick={() => navigate('/login')} 
                        className="navbar-btn-acceder"
                    >
                        Acceder
                    </button>
                ) : (
                    <div className="navbar-auth-actions">

                        <button 
                            onClick={handleLogout} 
                            className="navbar-btn-logout"
                        >
                            Salir
                        </button>
                    </div>
                )}

            </div>
        </nav>
    );
};

export default Navbar;

