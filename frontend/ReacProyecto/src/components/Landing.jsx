import React from 'react';
import { Leaf, ArrowRight, Shield, Map as MapIcon, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/Landing.css';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-container">
            {/* Cabecera / Sección Hero */}

            <div className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Descubre y Protege La Angostura
                    </h1>
                    <p className="hero-description">

                        Explora la asombrosa variedad de flora y fauna en Puntarenas. Únete a nuestra comunidad de voluntarios para registrar, monitorear y asegurar la conservación de nuestro ecosistema forestal.
                    </p>
                    <button 
                        onClick={() => navigate('/login')}


                        className="hero-button"


                    >
                        Comenzar Ahora <ArrowRight size={22} />
                    </button>
                </div>
            </div>

            {/* Sección: Sobre BioMon */}
            <div className="about-section">
                <div className="about-container">
                    <div className="about-text">
                        <h2 className="section-tag">Nuestra Misión</h2>
                        <h3 className="section-title">Protegiendo el Corredor Biológico La Angostura</h3>
                        <p className="section-description">
                            BioMon ADI nace como una iniciativa comunitaria para monitorear y proteger la biodiversidad en el tómbolo de Puntarenas. Nuestro objetivo es crear un puente entre la ciencia y la comunidad, permitiendo que cada ciudadano se convierta en un guardián de nuestro ecosistema.
                        </p>
                        <div className="about-stats">
                            <div className="stat-item">
                                <span className="stat-number">3</span>
                                <span className="stat-label">Zonas de Impacto</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">+100</span>
                                <span className="stat-label">Voluntarios Activos</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">24/7</span>
                                <span className="stat-label">Monitoreo Digital</span>
                            </div>
                        </div>
                    </div>
                    <div className="about-image">
                        <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80" alt="Conservación" />
                    </div>
                </div>
            </div>

            {/* Sección: Qué buscamos hacer */}
            <div className="mission-section">
                <div className="mission-header">
                    <h2 className="section-tag">Nuestras Líneas de Acción</h2>
                    <h3 className="section-title">Lo que buscamos lograr</h3>
                </div>

                <div className="mission-grid">
                    <div className="mission-card">
                        <div className="mission-icon">
                            <Leaf size={32} />
                        </div>
                        <h4>Restauración Ecológica</h4>
                        <p>Recuperamos áreas degradadas mediante la siembra de especies nativas y el control de especies invasoras en el corredor.</p>
                    </div>

                    <div className="mission-card">
                        <div className="mission-icon">
                            <Shield size={32} />
                        </div>
                        <h4>Protección de Hábitats</h4>
                        <p>Vigilamos y reportamos amenazas a los manglares y playas, asegurando un refugio seguro para la fauna local.</p>
                    </div>

                    <div className="mission-card">
                        <div className="mission-icon">
                            <BookOpen size={32} />
                        </div>
                        <h4>Educación Ambiental</h4>
                        <p>Empoderamos a la comunidad con conocimientos sobre biodiversidad y la importancia de la conservación forestal.</p>
                    </div>

                    <div className="mission-card">
                        <div className="mission-icon">
                            <MapIcon size={32} />
                        </div>
                        <h4>Ciencia Participativa</h4>
                        <p>Utilizamos tecnología para que cualquier persona pueda registrar datos valiosos para la toma de decisiones ecológicas.</p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Landing;
