import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, Eye, Shield, Moon, Sun, Trees, Droplets, MapPin, Beaker, Hexagon, Fingerprint, Zap, ChevronRight, Leaf, Bird, ShieldCheck, BookOpen, Users, HeartHandshake } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import logoImg from '../../assets/logo_no_bg.png';
import mangroveVector from '../../assets/mangrove_ecosystem_vector.png';
import missionVector from '../../assets/mission_vector.png';
import '../../styles/visitante/History.css';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const Landing = () => {
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();
    const [selectedTopic, setSelectedTopic] = useState(null);

    const exploreTopics = [
        { title: 'Flora Costera', icon: <Leaf size={32} />, color: '#2a9d8f' },
        { title: 'Fauna Costera', icon: <Bird size={32} />, color: '#f4a261' },
        { title: 'Protección', icon: <ShieldCheck size={32} />, color: '#1a73e8' },
        { title: 'Educación', icon: <BookOpen size={32} />, color: '#9b5de5' },
        { title: 'Voluntariado', icon: <Users size={32} />, color: '#e63946' },
        { title: 'Historia', icon: <HeartHandshake size={32} />, color: '#8ac926' },
    ];

    return (
        <div className={`min-h-screen font-sans antialiased overflow-x-hidden ${isDark ? 'bg-[#05080a] text-gray-200 selection:bg-secondary/30 selection:text-white' : 'bg-sand text-primary selection:bg-secondary/30 selection:text-primary'}`}>
            
            {/* AMBIENT GLOWS (Only in Dark Mode) */}
            {isDark && (
                <>
                    <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/10 blur-[120px] pointer-events-none z-0"></div>
                    <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/10 blur-[120px] pointer-events-none z-0"></div>
                </>
            )}

            {/* TOP APP BAR */}
            <header className="fixed top-0 left-0 w-full z-[100] transition-all duration-500">
                <nav className={`mx-auto px-6 lg:px-12 py-4 flex items-center justify-between backdrop-blur-2xl border-b shadow-sm transition-colors duration-500 ${isDark ? 'bg-[#0a0f14]/80 border-white/5' : 'bg-surface/80 border-primary/10'}`}>
                    {/* LOGO */}
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                        <div className="relative">
                            <img src={logoImg} alt="Logo BioMon ADI" className={`h-10 w-10 object-contain transition-transform duration-500 group-hover:scale-110 ${isDark ? 'drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]' : 'drop-shadow-md'}`} />
                            {isDark && <div className="absolute inset-0 bg-secondary blur-md opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>}
                        </div>
                        <span className={`text-xl font-bold tracking-tight ${isDark ? 'text-white drop-shadow-[0_0_2px_rgba(255,255,255,0.3)]' : 'text-primary'}`}>BioMon <span className={`font-light ${isDark ? 'text-gray-400' : 'text-primary/70'}`}>ADI</span></span>
                    </div>

                    {/* MENU DESKTOP */}
                    <div className={`hidden md:flex items-center gap-8 text-sm font-medium ${isDark ? 'text-gray-400' : 'text-primary/80'}`}>
                        <a href="#mission" className={`transition-all ${isDark ? 'hover:text-white hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]' : 'hover:text-secondary'}`}>Nuestra Misión</a>
                        <a href="#ecosystems" className={`transition-all ${isDark ? 'hover:text-white hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]' : 'hover:text-secondary'}`}>Especies</a>
                        <a href="#community" className={`transition-all ${isDark ? 'hover:text-white hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]' : 'hover:text-secondary'}`}>Red de Guardianes</a>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className={`p-2.5 rounded-full transition-colors ${isDark ? 'text-gray-300 hover:text-white hover:bg-white/5' : 'text-primary hover:bg-primary/5'}`}
                            title="Alternar Tema"
                        >
                            {isDark ? <Sun size={20} strokeWidth={1.5} /> : <Moon size={20} strokeWidth={1.5} />}
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className={`relative group text-sm font-semibold px-6 py-2.5 rounded-full transition-all overflow-hidden ${isDark ? 'bg-transparent text-white border border-secondary/30 hover:border-secondary' : 'bg-primary text-surface hover:bg-primary/90 shadow-md hover:shadow-lg'}`}
                        >
                            <span className={`relative z-10 ${isDark ? 'drop-shadow-[0_0_2px_rgba(0,240,255,0.8)]' : ''}`}>Comenzar</span>
                            {isDark && (
                                <>
                                    <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute inset-0 shadow-[0_0_15px_rgba(0,240,255,0.3)_inset] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </>
                            )}
                        </button>
                    </div>
                </nav>
            </header>

            {/* HERO SECTION */}
            <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
                <div className={`absolute inset-0 z-0 ${isDark ? 'bg-[#05080a]' : 'bg-primary'}`}>
                    {isDark ? (
                        <>
                            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f14]/80 via-transparent to-[#05080a] z-10"></div>
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.15)_0%,rgba(5,8,10,1)_70%)] z-10"></div>
                            <img 
                                src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=2000" 
                                alt="Ecosistema Cinemático" 
                                className="w-full h-full object-cover filter brightness-[0.4] contrast-125 saturate-50 blur-[1px] scale-105"
                            />
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] z-10 opacity-30"></div>
                        </>
                    ) : (
                        <>
                            <div className="absolute inset-0 bg-black/10 z-10"></div>
                            <img 
                                src={mangroveVector} 
                                alt="Ecosistema Costero Vector" 
                                className="w-full h-full object-cover scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#F9FAFB] z-10"></div>
                        </>
                    )}
                </div>

                <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="container mx-auto px-6 relative z-20 text-center max-w-5xl"
                >
                    <motion.div variants={fadeIn} className={`inline-flex items-center gap-2 backdrop-blur-xl px-4 py-1.5 rounded-full text-xs font-semibold tracking-[0.2em] uppercase mb-8 ${isDark ? 'bg-[#0a0f14]/60 border border-secondary/20 text-secondary shadow-[0_0_15px_rgba(0,240,255,0.15)]' : 'bg-white/40 border border-[#002359]/20 text-[#002359] shadow-sm'}`}>
                        <span className={`w-2 h-2 rounded-full animate-pulse ${isDark ? 'bg-secondary shadow-[0_0_8px_rgba(0,240,255,0.8)]' : 'bg-secondary'}`}></span>
                        Inteligencia Ambiental
                    </motion.div>
                    
                    <motion.h1 variants={fadeIn} className={`text-6xl md:text-8xl font-black leading-tight mb-8 tracking-tighter ${isDark ? 'text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]' : 'text-[#002359] drop-shadow-md'}`}>
                        Restaurando Ecosistemas <br/> 
                        <span className={`italic font-light ${isDark ? 'text-transparent bg-clip-text bg-gradient-to-r from-secondary via-accent to-olive filter drop-shadow-[0_0_15px_rgba(0,240,255,0.3)]' : 'text-[#002359]'}`}>Costeros</span>
                    </motion.h1>
                    
                    <motion.p variants={fadeIn} className={`text-xl md:text-2xl mb-12 max-w-3xl mx-auto font-light leading-relaxed break-normal ${isDark ? 'text-gray-400' : 'text-[#002359]/80'}`}>
                        Monitoreo biológico avanzado impulsado por IA. Empoderando a las comunidades para proteger <span className="whitespace-nowrap">nuestra</span> naturaleza mediante <span className={`font-medium ${isDark ? 'text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]' : 'text-[#002359] font-semibold'}`}>acciones basadas en datos</span>.
                    </motion.p>
                    
 
                </motion.div>
                
                {/* Scroll Indicator */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
                >
                    <div className={`w-[1px] h-12 bg-gradient-to-b ${isDark ? 'from-gray-500' : 'from-[#002359]/70'} to-transparent`}></div>
                </motion.div>
            </section>

            {/* MISSION SECTION */}
            <section id="mission" className={`py-32 relative z-20 ${isDark ? '' : 'bg-sand'}`}>
                <div className="container mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-20 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -30, filter: 'blur(10px)' }}
                        whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="relative group"
                    >
                        <div className={`absolute inset-0 rounded-[2rem] -rotate-3 scale-105 transition-transform duration-700 group-hover:-rotate-1 ${isDark ? 'bg-accent/20 blur-xl' : 'bg-secondary/20'}`}></div>
                        {isDark && <div className="absolute inset-0 border border-white/10 rounded-[2rem] z-20 pointer-events-none"></div>}
                        <img 
                            src={missionVector} 
                            alt="Estación de Monitoreo" 
                            className={`relative z-10 w-full h-[700px] object-cover rounded-[2rem] ${isDark ? 'shadow-[0_20px_50px_rgba(0,0,0,0.8)] filter contrast-125 brightness-75 group-hover:brightness-90 transition-all duration-700' : 'shadow-2xl'}`}
                        />
                    </motion.div>

                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="space-y-12"
                    >
                        <div>
                            <motion.h2 variants={fadeIn} className={`text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight ${isDark ? 'text-white' : 'text-primary'}`}>
                                Cerrando la <br/> <span className={`italic font-light ${isDark ? 'text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent' : 'text-olive'}`}>Brecha Biológica</span>
                            </motion.h2>
                            <motion.p variants={fadeIn} className={`text-lg leading-relaxed max-w-lg ${isDark ? 'text-gray-400' : 'text-primary/80'}`}>
                                Nuestra plataforma conecta de forma fluida los datos ecológicos de campo con modelos predictivos avanzados, permitiendo a los conservacionistas anticipar el estrés ambiental antes de que el daño sea irreversible.
                            </motion.p>
                        </div>

                        <motion.div variants={fadeIn} className={`pl-6 border-l-2 relative ${isDark ? 'border-secondary/50' : 'border-secondary'}`}>
                            {isDark && <div className="absolute left-[-2px] top-0 bottom-0 w-[2px] bg-secondary shadow-[0_0_10px_rgba(0,240,255,0.8)]"></div>}
                            <p className={`text-xl font-medium italic mb-4 ${isDark ? 'text-gray-300 drop-shadow-[0_0_2px_rgba(255,255,255,0.2)]' : 'text-primary/90'}`}>
                                "La tecnología solo es tan poderosa como los sistemas naturales que busca comprender."
                            </p>
                            <p className={`text-sm font-bold tracking-wider uppercase ${isDark ? 'text-secondary' : 'text-primary'}`}>Dra. Elena Vance — Investigadora Principal</p>
                        </motion.div>

                        <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                            {[
                                { icon: <Activity size={20} className={isDark ? "text-secondary" : "text-olive"} />, title: "IA Predictiva", desc: "Pronosticando tendencias." },
                                { icon: <Fingerprint size={20} className={isDark ? "text-accent" : "text-olive"} />, title: "No Invasivo", desc: "Monitoreo sin perturbar." },
                                { icon: <Hexagon size={20} className={isDark ? "text-secondary" : "text-olive"} />, title: "Basado en Datos", desc: "Precisión en cada métrica." },
                                { icon: <Shield size={20} className={isDark ? "text-accent" : "text-olive"} />, title: "Defensa Costera", desc: "Protegiendo zonas frágiles." }
                            ].map((feature, idx) => (
                                <motion.div key={idx} variants={fadeIn} className={`p-6 rounded-2xl transition-all duration-300 group ${isDark ? 'bg-[#0a0f14]/80 backdrop-blur-md border border-white/5 hover:border-secondary/40 hover:shadow-[0_0_20px_rgba(0,240,255,0.1)]' : 'bg-surface/60 border border-primary/5 hover:border-secondary/30'}`}>
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors ${isDark ? 'bg-[#111827] border border-white/5 shadow-inner group-hover:bg-secondary/10' : 'bg-sand shadow-sm'}`}>
                                        {feature.icon}
                                    </div>
                                    <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-primary'}`}>{feature.title}</h4>
                                    <p className={`text-sm transition-colors ${isDark ? 'text-gray-500 group-hover:text-gray-400' : 'text-primary/70'}`}>{feature.desc}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* STATS SECTION */}
            <section className={`py-24 relative overflow-hidden ${isDark ? '' : 'bg-surface border-y border-primary/5'}`}>
                {isDark && (
                    <>
                        <div className="absolute inset-0 bg-[#0a0f14] border-y border-white/5"></div>
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-secondary/30 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
                    </>
                )}
                
                <div className="container mx-auto px-6 lg:px-12 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { value: "14,200+", label: "Árboles Monitoreados", icon: <Trees size={24} />, color: "from-secondary to-blue-500" },
                            { value: "1,240+", label: "Guardianes Activos", icon: <Shield size={24} />, color: "from-accent to-secondary" },
                            { value: "850K+", label: "Litros Filtrados", icon: <Droplets size={24} />, color: "from-olive to-accent" }
                        ].map((stat, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className={`flex flex-col items-center text-center p-8 rounded-3xl transition-all relative overflow-hidden group ${isDark ? 'bg-[#05080a]/50 backdrop-blur-xl border border-white/5 hover:border-white/10 hover:bg-[#111827]/50 shadow-[0_10px_30px_rgba(0,0,0,0.5)]' : 'hover:bg-sand/50 border border-transparent hover:border-primary/5'}`}
                            >
                                {isDark && <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-gradient-to-b ${stat.color} rounded-full blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity`}></div>}
                                
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 relative z-10 ${isDark ? `bg-gradient-to-br ${stat.color} bg-opacity-10 text-white shadow-lg` : 'bg-secondary/10 text-secondary'}`}>
                                    {isDark && <div className="absolute inset-[1px] bg-[#0a0f14] rounded-[15px]"></div>}
                                    <div className={`relative z-10 ${isDark ? `text-transparent bg-clip-text bg-gradient-to-br ${stat.color}` : ''}`}>
                                        {React.cloneElement(stat.icon, { color: 'currentColor' })}
                                    </div>
                                </div>
                                <h3 className={`text-5xl md:text-6xl font-black mb-4 tracking-tighter relative z-10 ${isDark ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]' : 'text-primary'}`}>{stat.value}</h3>
                                <p className={`text-sm font-semibold uppercase tracking-[0.2em] relative z-10 ${isDark ? 'text-gray-400' : 'text-primary/60'}`}>{stat.label}</p>
                                
                                <div className={`w-full h-1.5 mt-8 rounded-full overflow-hidden relative z-10 ${isDark ? 'bg-black/50 border border-white/5' : 'bg-primary/10'}`}>
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        whileInView={{ width: "75%" }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
                                        className={`h-full rounded-full ${isDark ? `bg-gradient-to-r ${stat.color} shadow-[0_0_10px_currentColor]` : 'bg-secondary'}`}
                                    ></motion.div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* HISTORIA / EDUCAR SECTION */}
            <section id="ecosystems" className={`py-32 relative ${isDark ? '' : 'bg-sand'}`}>
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div>
                            <h2 className={`text-4xl md:text-5xl font-bold tracking-tight ${isDark ? 'text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'text-primary'}`}>Historia</h2>
                            <p className={`text-lg mt-2 font-light ${isDark ? 'text-gray-400' : 'text-primary/70'}`}>¿Qué descubriremos hoy? Explora los secretos ecológicos y sociales de La Angostura.</p>
                        </div>
                    </div>

                    <div className="hover-cards-grid">
                        {exploreTopics.map((topic, i) => (
                            <div key={i} className="hover-card" style={{ '--card-color': topic.color }} onClick={() => setSelectedTopic(i)}>
                                <div className="hover-card-icon-container" style={{ background: `${topic.color}15`, color: topic.color }}>
                                    {topic.icon}
                                </div>
                                <h3>{topic.title}</h3>
                                <div className="hover-card-footer-icon">
                                    <ChevronRight size={18} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* COMMUNITY / CTA SECTION */}
            <section id="community" className="py-24 relative overflow-hidden pb-40">
                {isDark ? (
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f14] to-[#05080a] z-0"></div>
                ) : (
                    <div className="absolute inset-0 bg-surface z-0"></div>
                )}
                
                <div className="container mx-auto px-6 lg:px-12 relative z-10">
                    <div className={`grid lg:grid-cols-2 gap-0 rounded-[2rem] overflow-hidden ${isDark ? 'border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)]' : 'shadow-2xl'}`}>
                        <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className={`p-12 md:p-16 flex flex-col justify-center relative overflow-hidden ${isDark ? 'bg-[#0d1b2a]' : 'bg-primary'}`}
                        >
                            {isDark ? (
                                <>
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px] z-0"></div>
                                    <div className="absolute top-[-50%] right-[-50%] w-[100%] h-[100%] rounded-full bg-secondary/10 blur-[100px] z-0 pointer-events-none"></div>
                                </>
                            ) : (
                                <div className="absolute top-0 right-0 w-64 h-64 bg-olive/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                            )}
                            
                            <div className="relative z-10">
                                <span className={`font-bold tracking-[0.2em] text-xs mb-4 block uppercase flex items-center gap-2 ${isDark ? 'text-secondary' : 'text-secondary'}`}>
                                    <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
                                    La Iniciativa
                                </span>
                                <h2 className={`text-4xl md:text-5xl font-black mb-8 leading-tight tracking-tighter ${isDark ? 'text-white' : 'text-[#D3968C]'}`}>
                                    Conviértete en Guardián de la Costa
                                </h2>
                                
                                <ul className="space-y-6 mb-12">
                                    {[
                                        'Acceso a modelos predictivos',
                                        'Coordinación en campo',
                                        'Participación ecológica directa'
                                    ].map((benefit, idx) => (
                                        <li key={idx} className={`flex items-center gap-4 ${isDark ? 'text-gray-300' : 'text-[#D3968C]'}`}>
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${isDark ? 'bg-secondary/10 border border-secondary/30' : 'bg-secondary/20'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full bg-secondary ${isDark ? 'shadow-[0_0_5px_rgba(0,240,255,0.8)]' : ''}`}></span>
                                            </div>
                                            <span className="text-base font-medium">{benefit}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button onClick={() => navigate('/login')} className={`relative group px-8 py-4 rounded-full font-bold transition-all active:scale-95 inline-flex items-center gap-2 overflow-hidden ${isDark ? 'bg-white text-[#05080a] hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'bg-sand text-primary hover:bg-white shadow-xl hover:shadow-2xl'}`}>
                                    <span className="relative z-10">Regístrate como Voluntario</span>
                                    <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className={`relative h-[400px] lg:h-auto overflow-hidden ${isDark ? 'bg-[#0a0f14]' : ''}`}
                        >
                            <img 
                                src={missionVector} 
                                alt="Científicos trabajando" 
                                className={`absolute inset-0 w-full h-full object-cover ${isDark ? 'filter brightness-[0.5] contrast-125 saturate-50 scale-105' : ''}`}
                            />
                            {isDark ? (
                                <>
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#0d1b2a] via-transparent to-transparent opacity-80"></div>

                                </>
                            ) : null}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* MODALES INTERACTIVOS DE HISTORIA */}
            {selectedTopic === 0 && (
                <div className="history-modal-overlay">
                    <div className="history-modal-container">
                        <button className="btn-modal-close" onClick={() => setSelectedTopic(null)}>
                            <span className="modal-close-icon">&times;</span>
                        </button>
                        <div className="modal-header-flex">
                            <div className="modal-header-icon-box" style={{ background: '#2a9d8f15', color: '#2a9d8f' }}>
                                <Leaf size={40} />
                            </div>
                            <div className="modal-header-text">
                                <h2>Flora Costera</h2>
                                <p>Vegetación de transición y ecosistema urbano</p>
                            </div>
                        </div>
                        
                        <div className="modal-body-scrollable">
                            <p>La zona de Chacarita, que se extiende desde su playa principal hasta el sector de Porto Bello (cerca del Yacht Club), se caracteriza por una vegetación de transición que combina el bosque seco tropical, el ecosistema de manglar y especies ornamentales urbanas. Las plantas más comunes que se pueden observar en este recorrido son:</p>
                            
                            <h3 className="modal-subsection-title" style={{ color: '#2a9d8f' }}>Vegetación de Playa y Litoral</h3>
                            <p style={{ fontSize: '0.9rem', color: '#666' }}>Son las especies que bordean directamente la costa y están adaptadas a suelos arenosos y salinidad.</p>
                            <ul className="modal-list-elegant">
                                <li className="modal-list-item border-green"><strong>Almendro de Playa (Terminalia catappa):</strong> Es uno de los árboles más emblemáticos de la zona. Recientemente se sembraron 300 unidades adicionales como parte de BioMon ADI para mitigar la deforestación y proveer sombra en la ruta principal.</li>
                                <li className="modal-list-item border-orange"><strong>Uva de Playa (Coccoloba uvifera):</strong> Un arbusto de hojas redondeadas y coriáceas muy común en la línea de costa de Chacarita y Playa Pochote. Sus frutos son comestibles y atraen a aves y monos.</li>
                                <li className="modal-list-item border-blue"><strong>Palma de Coco (Cocos nucifera):</strong> Aunque es una especie introducida, es omnipresente en los jardines de los hoteles y casas frente al mar en todo el sector de Porto Bello.</li>
                                <li className="modal-list-item border-amber"><strong>Verdolaga de Playa (Sesuvium portulacastrum):</strong> Una planta rastrera suculenta que coloniza las dunas y zonas arenosas cercanas a la marea alta.</li>
                            </ul>

                            <h3 className="modal-subsection-title" style={{ color: '#2a9d8f', marginTop: '1.5rem' }}>Flora del Manglar (Sector Estero y Cocal)</h3>
                            <p style={{ fontSize: '0.9rem', color: '#666' }}>Dado que Porto Bello y gran parte de Chacarita colindan con el Estero de Puntarenas, la vegetación de manglar es fundamental.</p>
                            <ul className="modal-list-elegant">
                                <li className="modal-list-item border-green"><strong>Mangle Negro (Avicennia germinans):</strong> Es la especie dominante en las partes internas del manglar de esta zona por su alta tolerancia a la salinidad. Se reconoce por sus raíces que salen del suelo (pneumatóforos).</li>
                                <li className="modal-list-item border-blue"><strong>Mangle Blanco (Laguncularia racemosa):</strong> Muy común por su rápido crecimiento y capacidad de repoblar áreas perturbadas.</li>
                                <li className="modal-list-item border-red"><strong>Mangle Rojo (Rhizophora mangle):</strong> Ubicado en la orilla de los canales del estero, visible desde los puentes y embarcaderos.</li>
                                <li className="modal-list-item border-orange"><strong>Mangle Botoncillo (Conocarpus erectus):</strong> Se encuentra en las partes más secas de la transición entre el manglar y la zona urbana.</li>
                            </ul>

                            <h3 className="modal-subsection-title" style={{ color: '#2a9d8f', marginTop: '1.5rem' }}>Árboles Urbanos y Frutales</h3>
                            <p style={{ fontSize: '0.9rem', color: '#666' }}>En los barrios de Chacarita y las avenidas principales, predominan especies que brindan sombra y frutos.</p>
                            <ul className="modal-list-elegant">
                                <li className="modal-list-item border-green"><strong>Árboles de Sombra:</strong> El Guanacaste (Enterolobium cyclocarpum), el Roble de Sabana (Tabebuia rosea) and el Malinche (Delonix regia) son comunes en los parques y aceras de la comunidad.</li>
                                <li className="modal-list-item border-amber"><strong>Frutales:</strong> En los patios y zonas residenciales abundan los árboles de Mango, Jocote, Nance, Cítricos (limón, naranja) y Papaturro.</li>
                                <li className="modal-list-item border-blue"><strong>Plantas de Jardín:</strong> La Lengua de Suegra (Sansevieria trifasciata) y diversos tipos de Cactus y Suculentas son populares en las viviendas por su resistencia al calor extremo de la zona.</li>
                            </ul>
                            
                            <div className="grid-two-cards" style={{ marginTop: '1.5rem' }}>
                                <div className="info-card-colored bg-green-light grid-full">
                                    <h4 className="text-green-dark">Esfuerzos de Restauración</h4>
                                    <p>Como parte de los esfuerzos de restauración de BioMon ADI, también se están introduciendo especies nativas como la Flor Blanca, el Poró y el Vainillo, seleccionadas técnicamente por su capacidad de atraer polinizadores y adaptarse a los suelos salinos del sector.</p>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer-center">
                            <button className="btn-modal-action" onClick={() => setSelectedTopic(null)}>
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {selectedTopic === 1 && (
                <div className="history-modal-overlay">
                    <div className="history-modal-container">
                        <button className="btn-modal-close" onClick={() => setSelectedTopic(null)}>
                            <span className="modal-close-icon">&times;</span>
                        </button>
                        <div className="modal-header-flex">
                            <div className="modal-header-icon-box" style={{ background: '#f4a26115', color: '#f4a261' }}>
                                <Bird size={40} />
                            </div>
                            <div className="modal-header-text">
                                <h2>Fauna Costera</h2>
                                <p>Reptiles, mamíferos, aves y vida acuática</p>
                            </div>
                        </div>
                        
                        <div className="modal-body-scrollable">
                            <p>Los animales más comunes que se pueden observar en esta zona específica incluyen:</p>
                            
                            <h3 className="modal-subsection-title" style={{ color: '#f4a261' }}>Reptiles y Anfibios</h3>
                            <p style={{ fontSize: '0.9rem', color: '#666' }}>Es el grupo más visible para los visitantes y residentes de la zona.</p>
                            <ul className="modal-list-elegant">
                                <li className="modal-list-item border-green"><strong>Garrobos e Iguanas:</strong> El garrobo (Ctenosaura similis) es extremadamente común en las áreas secas, tapias y jardines de los hoteles, mientras que la iguana verde (Iguana iguana) suele preferir las ramas de los árboles cerca del agua.</li>
                                <li className="modal-list-item border-amber"><strong>Cocodrilos:</strong> En el Estero de Puntarenas y los canales que bordean Chacarita (barrios San Luis, Bellavista y Fraicaciano) es muy frecuente el avistamiento de cocodrilos americanos (Crocodylus acutus), algunos de gran tamaño (4 a 5 metros), especialmente después de lluvias fuertes cuando pueden aparecer en vías públicas.</li>
                                <li className="modal-list-item border-blue"><strong>Basiliscos:</strong> Conocidos como "lagartijas Jesucristo" por su capacidad de correr sobre el agua, habitan en las orillas de los manglares y el estero.</li>
                                <li className="modal-list-item border-orange"><strong>Tortugas Marinas:</strong> Aunque el desove es limitado por la actividad urbana, se reportan tortugas verdes y carey en las aguas cercanas al muelle y el sector de El Inglés.</li>
                            </ul>

                            <h3 className="modal-subsection-title" style={{ color: '#f4a261', marginTop: '1.5rem' }}>Mamíferos</h3>
                            <ul className="modal-list-elegant">
                                <li className="modal-list-item border-orange"><strong>Mapaches y Pizotes:</strong> El mapache (Procyon lotor) y el pizote (Nasua narica) son visitantes habituales en las zonas residenciales y turísticas de Porto Bello, atraídos por la disponibilidad de alimentos.</li>
                                <li className="modal-list-item border-amber"><strong>Monos Carablanca:</strong> En los parches de manglar y árboles altos cerca del Yacht Club y la Angostura, es común ver tropas de monos carablanca (Cebus imitator).</li>
                                <li className="modal-list-item border-green"><strong>Perezosos:</strong> Tanto el perezoso de dos dedos como el de tres dedos habitan en la vegetación costera y de transición de la zona.</li>
                                <li className="modal-list-item border-blue"><strong>Ardillas y Murciélagos:</strong> La ardilla gris es muy común en los árboles de las avenidas, mientras que diversas especies de murciélagos son fundamentales para el control de insectos en la ciudad.</li>
                            </ul>

                            <h3 className="modal-subsection-title" style={{ color: '#f4a261', marginTop: '1.5rem' }}>Aves</h3>
                            <p style={{ fontSize: '0.9rem', color: '#666' }}>La zona es un punto estratégico para la observación de aves marinas y terrestres.</p>
                            <ul className="modal-list-elegant">
                                <li className="modal-list-item border-blue"><strong>Aves Marinas y Playeras:</strong> Pelícanos pardos, fragatas (tijeretas de mar), gaviotas y diversos tipos de charranes son constantes en la línea de playa.</li>
                                <li className="modal-list-item border-green"><strong>Garzas y aves de Estero:</strong> En las zonas bajas y de manglar abundan la garza real, la garceta azul, el ibis blanco y el martín pescador.</li>
                                <li className="modal-list-item border-red"><strong>Psitácidos:</strong> Es muy común ver y escuchar bandadas de pericos frentirrojos (Psittacara finschi) y loras que cruzan la ciudad al amanecer y atardecer.</li>
                                <li className="modal-list-item border-orange"><strong>Aves Urbanas:</strong> El zanate grande, palomas de Castilla y el yigüirro son omnipresentes en los parques y jardines de Chacarita.</li>
                            </ul>
                            
                            <h3 className="modal-subsection-title" style={{ color: '#f4a261', marginTop: '1.5rem' }}>Fauna Marina e Invertebrados</h3>
                            <ul className="modal-list-elegant">
                                <li className="modal-list-item border-orange"><strong>Cangrejos:</strong> En las zonas de barro del estero y las raíces de los manglares de Chacarita, los cangrejos rojos y los cangrejos violinistas (Uca spp.) son fundamentales en la base de la cadena alimenticia.</li>
                                <li className="modal-list-item border-blue"><strong>Peces del Estero:</strong> Especies como el robalo, el pargo y la corvina son comunes en las aguas del estero, las cuales sirven como sitios de crianza para estos juveniles antes de salir al mar abierto.</li>
                            </ul>
                        </div>
                        <div className="modal-footer-center">
                            <button className="btn-modal-action" onClick={() => setSelectedTopic(null)}>
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {selectedTopic === 2 && (
                <div className="history-modal-overlay">
                    <div className="history-modal-container">
                        <button className="btn-modal-close" onClick={() => setSelectedTopic(null)}>
                            <span className="modal-close-icon">&times;</span>
                        </button>
                        <div className="modal-header-flex">
                            <div className="modal-header-icon-box" style={{ background: '#1a73e815', color: '#1a73e8' }}>
                                <ShieldCheck size={40} />
                            </div>
                            <div className="modal-header-text">
                                <h2>Protección y Seguridad</h2>
                                <p>Marco legal, instituciones y vigilancia</p>
                            </div>
                        </div>
                        
                        <div className="modal-body-scrollable">
                            <h3 className="modal-subsection-title" style={{ color: '#1a73e8' }}>¿Qué los protege?</h3>
                            <p>La zona está bajo la protección legal del <strong>Humedal Estero Puntarenas y Manglares Asociados (HEPyMA)</strong>, declarado Área Silvestre Protegida (ASP) desde el año 2001. Además, existe BioMon ADI, una estrategia de conectividad para regenerar el bosque costero y mitigar la deforestación urbana.</p>

                            <h3 className="modal-subsection-title" style={{ color: '#1a73e8', marginTop: '1.5rem' }}>¿Qué instituciones los protegen?</h3>
                            <ul className="modal-list-elegant">
                                <li className="modal-list-item border-green"><strong>SINAC y MINAE:</strong> (Sistema Nacional de Áreas de Conservación y Ministerio de Ambiente y Energía) Son los entes rectores de la administración y vigilancia de los recursos naturales.</li>
                                <li className="modal-list-item border-blue"><strong>Municipalidad de Puntarenas:</strong> Participa activamente en la gestión de corredores biológicos urbanos.</li>
                                <li className="modal-list-item border-orange"><strong>MOPT:</strong> (Dirección de Seguridad y Embellecimiento de Carreteras) Encargado de proteger las zonas verdes y derechos de vía en la ruta de la Angostura.</li>
                            </ul>

                            <h3 className="modal-subsection-title" style={{ color: '#1a73e8', marginTop: '1.5rem' }}>¿Qué medidas de seguridad poseen?</h3>
                            <ul className="modal-list-elegant">
                                <li className="modal-list-item border-amber"><strong>Guardaparques:</strong> Realizan labores fundamentales de control, protección y educación ambiental en el sitio.</li>
                                <li className="modal-list-item border-red"><strong>Monitoreo con Drones:</strong> Se utiliza tecnología de alta precisión para detectar cambios en el terreno, tala ilegal o rellenos en los manglares.</li>
                                <li className="modal-list-item border-blue"><strong>Leyes y Vedas:</strong> Existen prohibiciones permanentes (vedas) para la extracción de especies vulnerables, como la chucheca, y leyes estrictas contra el tráfico de vida silvestre.</li>
                            </ul>
                        </div>
                        <div className="modal-footer-center">
                            <button className="btn-modal-action" onClick={() => setSelectedTopic(null)}>
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {selectedTopic === 3 && (
                <div className="history-modal-overlay">
                    <div className="history-modal-container">
                        <button className="btn-modal-close" onClick={() => setSelectedTopic(null)}>
                            <span className="modal-close-icon">&times;</span>
                        </button>
                        <div className="modal-header-flex">
                            <div className="modal-header-icon-box" style={{ background: '#9b5de515', color: '#9b5de5' }}>
                                <BookOpen size={40} />
                            </div>
                            <div className="modal-header-text">
                                <h2 className="modal-h2">La Angostura</h2>
                                <p>Punto geográfico e histórico clave</p>
                            </div>
                        </div>
                        
                        <div className="modal-body-scrollable">
                            <p>La Angostura es una franja de tierra estrecha que conecta el distrito de Chacarita con el centro de la ciudad de Puntarenas. Es un punto geográfico e histórico clave para la región, conocido tanto por su formación natural como por los eventos que han marcado la identidad del "Puerto".</p>
                            
                            <h3 className="modal-subsection-title">Historia y Formación</h3>
                            <p>La formación de esta zona es de origen geomorfológico. Se trata de una "flecha de arena" o lengüeta que se fue creando poco a poco por la acumulación de sedimentos (arena y lodo) arrastrados por las corrientes del río Barranca, la acción de las mareas y los vientos alisios.</p>
                            <p><strong>Instituto Costarricense de Puertos del Pacífico.</strong></p>

                            <ul className="modal-list-elegant">
                                <li className="modal-list-item border-blue"><strong>Nombre:</strong> El término "Angostura" describe literalmente el paso estrecho de tierra flanqueado por el Estero de Puntarenas a un lado y el Golfo de Nicoya al otro.</li>
                                <li className="modal-list-item border-orange"><strong>Hito histórico:</strong> Fue el escenario de la Batalla de La Angostura en 1860, donde las fuerzas del gobierno derrotaron a los seguidores del expresidente Juan Rafael Mora Porras, quien posteriormente fue fusilado en Puntarenas.</li>
                                <li className="modal-list-item border-red"><strong>Tragedia:</strong> Un evento doloroso en su historia moderna fue el accidente de un autobús en 1975, conocido como la Tragedia de la Angostura, donde fallecieron 52 personas al caer el vehículo al estero.</li>
                            </ul>

                            <div className="modal-tag-container">
                                <span className="modal-tag">Facebook +4</span>
                            </div>

                            <h3 className="modal-subsection-title">Conservación del Manglar</h3>
                            <p>La idea de conservar el manglar de esta zona nace de la necesidad de proteger un ecosistema que estaba siendo severamente impactado por la actividad humana (96% de pérdida de bosque costero en áreas intervenidas).</p>
                            
                            <div className="grid-two-cards">
                                <div className="info-card-colored bg-green-light">
                                    <h4 className="text-green-dark">Origen de la iniciativa</h4>
                                    <p>Proviene de una alianza entre instituciones públicas y privadas como el MOPT, la Municipalidad de Puntarenas, el SINAC, y fundaciones como FUNBAM y Coopenae-Wink.</p>
                                </div>
                                <div className="info-card-colored bg-blue-light">
                                    <h4 className="text-blue-dark">BioMon ADI</h4>
                                    <p>Recientemente se creó la plataforma BioMon ADI para combatir la pérdida de bosque costero y mitigar los efectos del cambio climático.</p>
                                </div>
                                <div className="info-card-colored bg-amber-light grid-full">
                                    <h4 className="text-amber-dark">Importancia ecológica</h4>
                                    <p>Se busca conservar el manglar porque actúa como un filtro biológico, protege contra la erosión y tormentas, y sirve como criadero de especies marinas esenciales para la economía local.</p>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer-center">
                            <button className="btn-modal-action" onClick={() => setSelectedTopic(null)}>
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {selectedTopic === 4 && (
                <div className="history-modal-overlay">
                    <div className="history-modal-container">
                        <button className="btn-modal-close" onClick={() => setSelectedTopic(null)}>
                            <span className="modal-close-icon">&times;</span>
                        </button>
                        <div className="modal-header-flex">
                            <div className="modal-header-icon-box" style={{ background: '#e6394615', color: '#e63946' }}>
                                <Users size={40} />
                            </div>
                            <div className="modal-header-text">
                                <h2>Voluntariados Activos</h2>
                                <p>Organizaciones y actividades en la zona</p>
                            </div>
                        </div>
                        
                        <div className="modal-body-scrollable">
                            <h3 className="modal-subsection-title" style={{ color: '#e63946' }}>¿Dónde se organizan los voluntariados?</h3>
                            <ul className="modal-list-elegant">
                                <li className="modal-list-item border-green"><strong>Fundación Tierra Pura:</strong> Lidera proyectos masivos de restauración de manglares en el Estero.</li>
                                <li className="modal-list-item border-orange"><strong>NATUWA (Santuario de Vida Silvestre):</strong> Ubicado cerca de Aranjuez, ofrece programas de voluntariado para el rescate y cuidado de fauna neotropical.</li>
                                <li className="modal-list-item border-blue"><strong>FUNBAM (Fundación Banco Ambiental):</strong> Organiza jornadas de reforestación en la zona de la Angostura junto a empresas privadas y el gobierno.</li>
                                <li className="modal-list-item border-amber"><strong>Universidades (UNED y UCR):</strong> Estudiantes y voluntarios realizan jornadas periódicas de limpieza y educación ambiental en las playas de Puntarenas y Chacarita.</li>
                            </ul>

                            <h3 className="modal-subsection-title" style={{ color: '#e63946', marginTop: '1.5rem' }}>¿Qué actividades se realizan?</h3>
                            <ul className="modal-list-elegant">
                                <li className="modal-list-item border-green"><strong>Reforestación Costera:</strong> Siembra de árboles nativos como el almendro de playa, flor blanca y mangle botoncillo para crear bosques urbanos.</li>
                                <li className="modal-list-item border-blue"><strong>Limpieza de Playas y Manglares:</strong> Recolección de residuos sólidos y plásticos para evitar daños ecológicos y mejorar el atractivo turístico.</li>
                                <li className="modal-list-item border-amber"><strong>Restauración Hidrológica:</strong> Participación en cuadrillas locales para abrir y limpiar canales que permitan el flujo natural del agua en los manglares.</li>
                                <li className="modal-list-item border-orange"><strong>Apoyo en el Cuidado de Fauna:</strong> En santuarios como NATUWA, los voluntarios ayudan en la preparación de dietas para animales rescatados (monos, perezosos, jaguares) y el mantenimiento de sus recintos.</li>
                                <li className="modal-list-item border-red"><strong>Educación Ambiental:</strong> Colaboración en charlas y talleres para concientizar a la comunidad sobre el valor de los ecosistemas locales.</li>
                            </ul>
                        </div>
                        <div className="modal-footer-center">
                            <button className="btn-modal-action" onClick={() => setSelectedTopic(null)}>
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {selectedTopic === 5 && (
                <div className="history-modal-overlay">
                    <div className="history-modal-container">
                        <button className="btn-modal-close" onClick={() => setSelectedTopic(null)}>
                            <span className="modal-close-icon">&times;</span>
                        </button>
                        <div className="modal-header-flex">
                            <div className="modal-header-icon-box" style={{ background: '#8ac92615', color: '#8ac926' }}>
                                <HeartHandshake size={40} />
                            </div>
                            <div className="modal-header-text">
                                <h2>Conócenos</h2>
                                <p>Misión, Visión y el origen de BioMon ADI</p>
                            </div>
                        </div>
                        
                        <div className="modal-body-scrollable">
                            <div className="grid-two-cards" style={{ marginBottom: '1.5rem' }}>
                                <div className="info-card-colored bg-green-light">
                                    <h4 className="text-green-dark" style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Misión</h4>
                                    <p>Restaurar y preservar la conectividad ecológica del Corredor Natural La Angostura mediante la reforestación estratégica con especies nativas, el monitoreo biológico participativo y la educación ambiental integral. Buscamos transformar la matriz urbana de Puntarenas en un paisaje resiliente que genere empleos verdes, empodere a la comunidad local y garantice un refugio seguro para la biodiversidad costera.</p>
                                </div>
                                <div className="info-card-colored bg-blue-light">
                                    <h4 className="text-blue-dark" style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Visión</h4>
                                    <p>Ser la plataforma comunitaria líder en la gestión de corredores biológicos urbanos en Costa Rica, reconocida por integrar tecnología de monitoreo, participación ciudadana y sostenibilidad socioeconómica. Aspiramos a convertir a Puntarenas en un modelo global de convivencia armónica entre el desarrollo humano y la naturaleza, donde la identidad cultural y la salud del ecosistema prosperen de la mano.</p>
                                </div>
                            </div>
                            
                            <h3 className="modal-subsection-title" style={{ color: '#8ac926' }}>¿Por qué se creó BioMon ADI?</h3>
                            <p style={{ fontSize: '0.95rem', color: '#555', marginBottom: '1rem' }}>La plataforma BioMon ADI nació como una respuesta tecnológica y comunitaria a una crisis ambiental histórica en Puntarenas. Los motivos principales de su creación son:</p>

                            <ul className="modal-list-elegant">
                                <li className="modal-list-item border-green"><strong>De la Fragmentación a la Conectividad:</strong> Históricamente, La Angostura era un tómbolo natural de manglares y arena. La urbanización y la construcción de carreteras convirtieron este paso vital en una "barrera de asfalto" que aisló a las especies. BioMon ADI se crea para gestionar el "renacer" de este ecosistema, reconstruyendo el puente biológico necesario para la fauna.</li>
                                <li className="modal-list-item border-orange"><strong>Mitigación de la Pérdida de Bosque:</strong> Entre 2002 y 2024, Puntarenas perdió más de 4,380 hectáreas de bosque primario. BioMon ADI surge para centralizar los esfuerzos de reforestación (como la siembra de almendros de playa, mangle botoncillo y flor blanca) y asegurar que cada árbol plantado contribuya a la captura de carbono y a la resiliencia climática.</li>
                                <li className="modal-list-item border-blue"><strong>Empoderamiento y Empleos Verdes:</strong> El proyecto no es solo ambiental, sino social. Se creó para administrar y visibilizar los "Empleos Verdes", dando prioridad a mujeres de la zona y ofreciendo capacitación integral en áreas que van desde la educación financiera hasta la ciberhigiene.</li>
                                <li className="modal-list-item border-amber"><strong>Ciencia Ciudadana y Monitoreo:</strong> La "Bio" en BioMon se refiere al monitoreo biológico. La página busca que los vecinos de Chacarita, El Carmen y La Angostura dejen de ser espectadores y se conviertan en "Protectores Costeros", utilizando herramientas digitales para registrar avistamientos de fauna y el estado de la flora sembrada.</li>
                                <li className="modal-list-item border-red"><strong>Alianza Interinstitucional:</strong> Se creó como el núcleo digital del convenio entre la ADI La Angostura, Coopenae-Wink, FUNBAM, el MOPT y la Municipalidad de Puntarenas, facilitando la transparencia y la participación comunitaria en el desarrollo sostenible de la región.</li>
                            </ul>

                            <div className="info-card-colored" style={{ background: '#8ac92620', borderLeft: '4px solid #8ac926', marginTop: '1.5rem', padding: '1rem' }}>
                                <p style={{ margin: 0, fontWeight: '500', color: '#333' }}>
                                    Esta plataforma representa el compromiso de <strong>"salvar el futuro juntos"</strong>, transformando un punto crítico de vulnerabilidad en un motor de vida y aprendizaje para las nuevas generaciones de puntarenenses.
                                </p>
                            </div>
                        </div>
                        <div className="modal-footer-center">
                            <button className="btn-modal-action" onClick={() => setSelectedTopic(null)}>
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Landing;
