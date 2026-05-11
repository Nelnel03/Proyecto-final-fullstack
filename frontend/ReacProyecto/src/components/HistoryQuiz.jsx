import React, { useState } from 'react';
import { Gamepad2, Trophy, Star, ChevronRight, CheckCircle, Brain } from 'lucide-react';
import '../styles/History.css';

const HistoryQuiz = () => {
    // 16 Preguntas generadas a partir del contenido
    const quizQuestions = [
        {
            question: '¿Cuál es la función principal de las raíces del Mangle Rojo en el estero?',
            options: ['Producir sombra', 'Atrapar sedimentos y prevenir erosión', 'Filtrar agua dulce'],
            correctIndex: 1,
            feedback: 'El Mangle Rojo atrapa sedimentos vitales para evitar la erosión costera.'
        },
        {
            question: '¿Cuántas hectáreas de bosque primario perdió Puntarenas entre 2002 y 2024?',
            options: ['Menos de 1,000 hectáreas', 'Cerca de 10,000 hectáreas', 'Más de 4,380 hectáreas'],
            correctIndex: 2,
            feedback: 'Puntarenas perdió más de 4,380 hectáreas, por eso la deforestación es crítica.'
        },
        {
            question: '¿Qué especie de manglar es conocida por tener raíces que salen del suelo (pneumatóforos)?',
            options: ['Mangle Blanco', 'Mangle Negro', 'Mangle Botoncillo'],
            correctIndex: 1,
            feedback: 'El Mangle Negro es dominante por su alta tolerancia a la salinidad y sus peculiares raíces.'
        },
        {
            question: '¿Qué reptil es conocido como "lagartija Jesucristo" por correr sobre el agua?',
            options: ['Garrobo', 'Basilisco', 'Iguana verde'],
            correctIndex: 1,
            feedback: 'El basilisco gana este apodo gracias a su increíble habilidad para desplazarse sobre el agua.'
        },
        {
            question: '¿En qué año se declaró el Humedal Estero Puntarenas como Área Silvestre Protegida?',
            options: ['1985', '2015', '2001'],
            correctIndex: 2,
            feedback: 'Fue declarado ASP en el año 2001 (HEPyMA).'
        },
        {
            question: '¿Cuál fundación lidera proyectos masivos de restauración de manglares en el Estero?',
            options: ['NATUWA', 'Fundación Tierra Pura', 'FUNBAM'],
            correctIndex: 1,
            feedback: 'Fundación Tierra Pura lidera la restauración específica dentro del Estero.'
        },
        {
            question: '¿A quiénes se da prioridad para los "Empleos Verdes" en BioMon ADI?',
            options: ['A estudiantes extranjeros', 'A pescadores industriales', 'A mujeres de la zona'],
            correctIndex: 2,
            feedback: 'El proyecto empodera socialmente dando prioridad a mujeres locales y brindando capacitaciones.'
        },
        {
            question: '¿Qué evento histórico sucedió en La Angostura en el año 1860?',
            options: ['Batalla de La Angostura', 'Batalla de Rivas', 'Tragedia del bus'],
            correctIndex: 0,
            feedback: 'Las fuerzas del gobierno derrotaron a los seguidores de Juan Rafael Mora Porras en esta batalla.'
        },
        {
            question: '¿Cuál de estas es una planta arrastrada y suculenta adaptada a las dunas y arena?',
            options: ['Lengua de Suegra', 'Verdolaga de Playa', 'Uva de Playa'],
            correctIndex: 1,
            feedback: 'La Verdolaga de Playa coloniza áreas arenosas cerquitas de la marea alta.'
        },
        {
            question: '¿Qué mamífero visitante es muy habitual en Porto Bello, atraído por alimentos?',
            options: ['El Oso Hormiguero', 'El Mapache', 'El Jaguar'],
            correctIndex: 1,
            feedback: 'Los mapaches y los pizotes son visitantes extremadamente habituales por la actividad humana.'
        },
        {
            question: '¿Qué invertebrados de barro son fundamentales en la base alimenticia del manglar?',
            options: ['Cangrejos rojos y violinistas', 'Langostas y camarones', 'Erizos de mar y anémonas'],
            correctIndex: 0,
            feedback: 'Ambos tipos de cangrejos habitan entre las raíces del manglar alimentando el ecosistema.'
        },
        {
            question: '¿Qué entidad pública protege las zonas verdes y derechos de vía en La Angostura?',
            options: ['SINAC', 'MOPT', 'Incofer'],
            correctIndex: 1,
            feedback: 'La Dirección de Seguridad y Embellecimiento de Carreteras del MOPT tiene esta función.'
        },
        {
            question: '¿Cuál tecnología precisa se usa para detectar tala ilegal en los manglares actualmente?',
            options: ['Monitoreo con Drones', 'Satélites meteorológicos', 'Radares submarinos'],
            correctIndex: 0,
            feedback: 'Los drones de precisión ayudan activamente a vigilar la deforestación y los rellenos.'
        },
        {
            question: '¿A qué animales se les ayuda preparando sus dietas en el voluntariado de NATUWA?',
            options: ['Mamíferos marinos', 'Aves de corral', 'Animales rescatados como perezosos y jaguares'],
            correctIndex: 2,
            feedback: 'Voluntarios ayudan en la dieta de monos, jaguares, dantas y perezosos en NATUWA.'
        },
        {
            question: '¿Cuál recurso hídrico sirve como sitio de "crianza" para peces como corvina y robalo?',
            options: ['El Golfo de Nicoya', 'El Estero de Puntarenas', 'Río Barranca'],
            correctIndex: 1,
            feedback: 'Los alevines crecen seguros en el Estero debido a la protección de las raíces de mangle.'
        },
        {
            question: 'Este esfuerzo digital y tecnológico transforma observadores en "Protectores Costeros":',
            options: ['Redes locales de comercio', 'La Plataforma BioMon ADI', 'Juntas vecinales'],
            correctIndex: 1,
            feedback: 'BioMon ADI busca el monitoreo participativo para salvar el futuro de la biodiversidad.'
        }
    ];

    const [quizState, setQuizState] = useState({ current: 0, score: 0, answered: false, correct: false, selectedOption: null, completed: false });

    const handleAnswer = (idx) => {
        if (quizState.answered) return;
        const isCorrect = idx === quizQuestions[quizState.current].correctIndex;
        setQuizState(prev => ({
            ...prev,
            answered: true,
            selectedOption: idx,
            correct: isCorrect,
            score: isCorrect ? prev.score + 1 : prev.score
        }));
    };

    const nextQuestion = () => {
        if (quizState.current < quizQuestions.length - 1) {
            setQuizState(prev => ({
                ...prev,
                current: prev.current + 1,
                answered: false,
                selectedOption: null,
                correct: false
            }));
        } else {
            setQuizState(prev => ({ ...prev, completed: true }));
        }
    };

    const restartQuiz = () => {
        setQuizState({ current: 0, score: 0, answered: false, correct: false, selectedOption: null, completed: false });
    };

    return (
        <div className="history-section history-quiz-section">
            <div className="section-icon-box quiz-bg">
                <Gamepad2 size={32} />
            </div>
            <h2 className="section-title">¡Pon a prueba tu conocimiento!</h2>
            <p className="section-subtitle">Completa este desafío para ganar medallas de honor.</p>

            {!quizState.completed ? (
                <div className="quiz-card">
                    <div className="quiz-header">
                        <div className="quiz-progress-text">
                            <span>Pregunta {quizState.current + 1} de {quizQuestions.length}</span>
                        </div>
                        <div className="quiz-medals">
                            <Trophy size={16} />
                            <span>{quizState.score}</span>
                        </div>
                    </div>

                    <h3 className="quiz-question">
                        {quizQuestions[quizState.current].question}
                    </h3>

                    <div className="quiz-options">
                        {quizQuestions[quizState.current].options.map((opt, idx) => (
                            <button
                                key={idx}
                                className={`quiz-option-btn ${quizState.answered ? (idx === quizQuestions[quizState.current].correctIndex ? 'correct' : (idx === quizState.selectedOption ? 'wrong' : '')) : ''}`}
                                onClick={() => handleAnswer(idx)}
                                disabled={quizState.answered}
                            >
                                {opt}
                                {quizState.answered && idx === quizQuestions[quizState.current].correctIndex && (
                                    <CheckCircle size={20} className="correct-icon" />
                                )}
                            </button>
                        ))}
                    </div>

                    {quizState.answered && (
                        <div className={`quiz-feedback-box ${quizState.correct ? 'success' : 'info'}`}>
                            <div className="feedback-content">
                                <Star size={20} className="feedback-icon" />
                                <p>
                                    {quizQuestions[quizState.current].feedback}
                                </p>
                            </div>
                            <button className="btn-next-question" onClick={nextQuestion}>
                                {quizState.current === quizQuestions.length - 1 ? 'Ver Resultado' : 'Siguiente Pregunta'}
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="quiz-result-card">
                    <div className="result-icon-box">
                        <Trophy size={40} />
                    </div>
                    <h3>¡Misión cumplida!</h3>
                    <p>Has finalizado el desafío del Corredor Biológico.</p>
                    
                    <div className="result-stats">
                        <div className="result-stat-item">
                            <span className="stat-label-quiz">Preguntas</span>
                            <span className="stat-value-quiz">{quizQuestions.length}</span>
                        </div>
                        <div className="result-stat-item">
                            <span className="stat-label-quiz">Medallas</span>
                            <span className="stat-value-quiz medal">{quizState.score}</span>
                        </div>
                    </div>

                    <div className="result-actions">
                        <button onClick={restartQuiz} className="btn-restart">Reintentar</button>
                        <button className="btn-certify">Certificar Puntos</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HistoryQuiz;
