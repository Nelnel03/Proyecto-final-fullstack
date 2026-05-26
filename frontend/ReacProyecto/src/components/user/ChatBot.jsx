import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Leaf, Trash2, Bot } from 'lucide-react';
import { sendMessageToGroq } from '../../services/groq.service';
import '../../styles/user/ChatBot.css';

const WELCOME_MSG = {
  role: 'assistant',
  content: '¡Hola! 🌿 Soy **BioBot**, tu asistente del Corredor Biológico La Angostura.\n\nPuedo ayudarte con:\n• **Biología y ecología** — flora, fauna, ecosistemas\n• **Corredores biológicos** de Costa Rica\n• **Navegar la plataforma** — dónde está cada sección\n\n¿En qué te ayudo hoy?',
};

const SUGGESTIONS = [
  '¿Dónde veo los árboles del corredor?',
  '¿Cómo me hago voluntario?',
  '¿Qué son los corredores biológicos?',
  '¿Cómo reporto una tala ilegal?',
];

function renderBubbleText(text) {
  // Bold **text** → <strong>
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

const ChatBot = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MSG]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasNew, setHasNew] = useState(true);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

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

    // Build only the last N turns to avoid token bloat
    const contextWindow = history.slice(-12).map(({ role, content }) => ({
      role: role === 'assistant' ? 'assistant' : 'user',
      content,
    }));

    try {
      const reply = await sendMessageToGroq(contextWindow);
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setError(err.message || 'No se pudo conectar con el asistente.');
    } finally {
      setLoading(false);
    }
  }, [messages, loading]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleClear = () => {
    setMessages([WELCOME_MSG]);
    setError(null);
  };

  const handleSuggestion = (text) => {
    sendMessage(text);
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
                  onClick={() => handleSuggestion(s)}
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
