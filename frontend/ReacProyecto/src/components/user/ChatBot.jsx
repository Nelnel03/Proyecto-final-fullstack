import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, X, Send, Leaf, Trash2, Bot } from 'lucide-react';
import { sendMessageToGroq } from '../../services/groq.service';
import '../../styles/user/ChatBot.css';

function getStoredUser() {
  try {
    return JSON.parse(sessionStorage.getItem('user') || '{}');
  } catch {
    return {};
  }
}

function buildWelcome() {
  const user = getStoredUser();
  const name = user?.nombre ? `, ${user.nombre.split(' ')[0]}` : '';
  return {
    role: 'assistant',
    content: `¡Hola${name}! 🌿 Soy **BioBot**, tu asistente del Corredor Biológico La Angostura.\n\nPuedo ayudarte con:\n• **Datos reales del corredor** — árboles recientes, estadísticas\n• **Tu perfil y reportes** — consulta tu historial\n• **Enviar alertas** — soporte o reportes de robo al admin\n• **Navegar la plataforma** — te llevo a donde necesites\n• **Biología y ecología** — flora, fauna, ecosistemas\n\n¿En qué te ayudo hoy?`,
  };
}

const SUGGESTIONS = [
  '¿Cuáles son los árboles más recientes?',
  'Muéstrame las estadísticas del corredor',
  'Quiero contactar al administrador',
  'Llévame a la sección de árboles',
];

function renderBubbleText(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

const STORAGE_KEY = 'biobotMessages';

const ChatBot = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return [buildWelcome()];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasNew, setHasNew] = useState(true);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Persiste el historial en sessionStorage ante cualquier cambio
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (_) {}
  }, [messages]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (open) {
      scrollToBottom();
      setHasNew(false);
      setTimeout(() => textareaRef.current?.focus(), 150);
    }
  }, [open, messages, scrollToBottom]);

  const sendMessage = useCallback(async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setError(null);
    const userMsg = { role: 'user', content: trimmed };
    const history = [...messages, userMsg];

    setMessages(history);
    setInput('');
    setLoading(true);

    const contextWindow = history.slice(-12).map(({ role, content }) => ({
      role: role === 'assistant' ? 'assistant' : 'user',
      content,
    }));

    try {
      const { reply, action } = await sendMessageToGroq(contextWindow);

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);

      if (action?.type === 'navigate' && action.path) {
        // Navega sin cerrar el chat para que el historial quede visible
        setTimeout(() => navigate(action.path), 1200);
      }
    } catch (err) {
      const msg = err?.customMessage || err?.message || 'No se pudo conectar con el asistente.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [messages, loading, navigate]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleClear = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setMessages([buildWelcome()]);
    setError(null);
  };

  const showSuggestions = messages.length <= 1 && !loading;

  return (
    <>
      {/* Floating Action Button */}
      <button
        className="chatbot-fab"
        onClick={() => setOpen((v) => !v)}
        title="Asistente BioBot"
        aria-label="Abrir chat de asistencia"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
        {!open && hasNew && <span className="chatbot-fab-badge">1</span>}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="chatbot-window" role="dialog" aria-label="Chat BioBot">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-avatar">
              <Leaf size={18} />
            </div>
            <div className="chatbot-header-info">
              <h4>BioBot</h4>
              <span>Asistente del Corredor Biológico · En línea</span>
            </div>
            <button
              className="chatbot-clear-btn"
              onClick={handleClear}
              title="Limpiar conversación"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              <Trash2 size={15} />
            </button>
            <button
              className="chatbot-close-btn"
              onClick={() => setOpen(false)}
              aria-label="Cerrar chat"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chatbot-msg ${msg.role === 'user' ? 'user' : 'bot'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="chatbot-msg-avatar">
                    <Bot size={14} />
                  </div>
                )}
                <div className="chatbot-bubble">
                  {renderBubbleText(msg.content)}
                </div>
              </div>
            ))}

            {loading && (
              <div className="chatbot-typing">
                <div className="chatbot-msg-avatar">
                  <Bot size={14} />
                </div>
                <div className="chatbot-typing-dots">
                  <span /><span /><span />
                </div>
              </div>
            )}

            {error && (
              <div className="chatbot-error-bubble">
                ⚠️ {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {showSuggestions && (
            <div className="chatbot-suggestions">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  className="chatbot-suggestion-chip"
                  onClick={() => sendMessage(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="chatbot-input-area">
            <textarea
              ref={textareaRef}
              className="chatbot-textarea"
              rows={1}
              placeholder="Escribe tu pregunta..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              className="chatbot-send-btn"
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              aria-label="Enviar mensaje"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
