import React from 'react';
import { HeartHandshake } from 'lucide-react';
import '../styles/History.css'; // Reutilizamos los estilos del modal de historia

const ConocenosTab = () => {
    return (
        <div className="main-section-card" style={{ padding: '2rem', height: '100%', overflowY: 'auto' }}>
            <div className="modal-header-flex">
                <div className="modal-header-icon-box" style={{ background: '#8ac92615', color: '#8ac926', padding: '1rem', borderRadius: '15px' }}>
                    <HeartHandshake size={48} />
                </div>
                <div className="modal-header-text">
                    <h2 style={{ fontSize: '2rem', margin: 0 }}>Conócenos</h2>
                    <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Misión, Visión y el origen de BioMon ADI</p>
                </div>
            </div>
            
            <div className="modal-body-content" style={{ marginTop: '2.5rem' }}>
                <div className="grid-two-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
                    <div className="info-card-colored bg-green-light" style={{ padding: '2rem', borderRadius: '20px', background: '#f0fdf4', border: '1px solid #dcfce7' }}>
                        <h4 className="text-green-dark" style={{ fontSize: '1.4rem', color: '#166534', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            Misión
                        </h4>
                        <p style={{ lineHeight: '1.6', color: '#374151' }}>Restaurar y preservar la conectividad ecológica del Corredor Natural La Angostura mediante la reforestación estratégica con especies nativas, el monitoreo biológico participativo y la educación ambiental integral. Buscamos transformar la matriz urbana de Puntarenas en un paisaje resiliente que genere empleos verdes, empodere a la comunidad local y garantice un refugio seguro para la biodiversidad costera.</p>
                    </div>
                    <div className="info-card-colored bg-blue-light" style={{ padding: '2rem', borderRadius: '20px', background: '#eff6ff', border: '1px solid #dbeafe' }}>
                        <h4 className="text-blue-dark" style={{ fontSize: '1.4rem', color: '#1e40af', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            Visión
                        </h4>
                        <p style={{ lineHeight: '1.6', color: '#374151' }}>Ser la plataforma comunitaria líder en la gestión de corredores biológicos urbanos en Costa Rica, reconocida por integrar tecnología de monitoreo, participación ciudadana y sostenibilidad socioeconómica. Aspiramos a convertir a Puntarenas en un modelo global de convivencia armónica entre el desarrollo humano y la naturaleza, donde la identidad cultural y la salud del ecosistema prosperen de la mano.</p>
                    </div>
                </div>
                
                <h3 className="modal-subsection-title" style={{ color: '#8ac926', fontSize: '1.6rem', marginBottom: '1.5rem', borderBottom: '2px solid #8ac92630', paddingBottom: '0.5rem' }}>¿Por qué se creó BioMon ADI?</h3>
                <p style={{ fontSize: '1.1rem', color: '#4b5563', marginBottom: '2rem', lineHeight: '1.7' }}>La plataforma BioMon ADI nació como una respuesta tecnológica y comunitaria a una crisis ambiental histórica en Puntarenas. Los motivos principales de su creación son:</p>

                <ul className="modal-list-elegant" style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    {[
                        { 
                            title: 'De la Fragmentación a la Conectividad', 
                            desc: 'Históricamente, La Angostura era un tómbolo natural de manglares y arena. La urbanización y la construcción de carreteras convirtieron este paso vital en una "barrera de asfalto" que aisló a las especies. BioMon ADI se crea para gestionar el "renacer" de este ecosistema.',
                            border: '#8ac926' 
                        },
                        { 
                            title: 'Mitigación de la Pérdida de Bosque', 
                            desc: 'Entre 2002 y 2024, Puntarenas perdió más de 4,380 hectáreas de bosque primario. BioMon ADI surge para centralizar los esfuerzos de reforestación (como la siembra de almendros de playa, mangle botoncillo y flor blanca).',
                            border: '#f59e0b' 
                        },
                        { 
                            title: 'Empoderamiento y Empleos Verdes', 
                            desc: 'El proyecto no es solo ambiental, sino social. Se creó para administrar y visibilizar los "Empleos Verdes", dando prioridad a mujeres de la zona y ofreciendo capacitación integral.',
                            border: '#3b82f6' 
                        },
                        { 
                            title: 'Ciencia Ciudadana y Monitoreo', 
                            desc: 'La "Bio" en BioMon se refiere al monitoreo biológico. La página busca que los vecinos dejen de ser espectadores y se conviertan en "Protectores Costeros".',
                            border: '#f59e0b' 
                        },
                        { 
                            title: 'Alianza Interinstitucional', 
                            desc: 'Se creó como el núcleo digital del convenio entre la ADI La Angostura, Coopenae-Wink, FUNBAM, el MOPT y la Municipalidad de Puntarenas.',
                            border: '#ef4444' 
                        }
                    ].map((item, idx) => (
                        <li key={idx} style={{ 
                            padding: '1.2rem', 
                            background: '#f8fafc', 
                            borderRadius: '12px', 
                            borderLeft: `5px solid ${item.border}`,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                        }}>
                            <strong style={{ display: 'block', fontSize: '1.1rem', marginBottom: '0.4rem', color: '#1e293b' }}>{item.title}:</strong>
                            <span style={{ color: '#64748b', lineHeight: '1.5' }}>{item.desc}</span>
                        </li>
                    ))}
                </ul>

                <div className="info-card-colored" style={{ background: '#8ac92610', borderLeft: '4px solid #8ac926', marginTop: '3rem', padding: '1.5rem', borderRadius: '15px' }}>
                    <p style={{ margin: 0, fontWeight: '600', color: '#166534', fontSize: '1.1rem', textAlign: 'center' }}>
                        Esta plataforma representa el compromiso de <strong>"salvar el futuro juntos"</strong>, transformando un punto crítico de vulnerabilidad en un motor de vida y aprendizaje para las nuevas generaciones de puntarenenses.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ConocenosTab;
