const { Arbol, Reporte, Usuario, StatsTipo, Rol } = require('../models');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
// llama-3.1-8b-instant: 500k tokens/día en el plan gratuito (5× más que el 70b)
// soporta tool calling y es suficiente para este chatbot
const MODEL = 'llama-3.1-8b-instant';

// ──────────────────────────────────────────────
//  Mapa de secciones de la plataforma
// ──────────────────────────────────────────────
const NAV_MAP = {
  dashboard:               '/dashboard-user',
  coleccion:               '/dashboard-user?tab=coleccion',
  mis_reportes:            '/dashboard-user?tab=mis_reportes',
  reporte_robo:            '/dashboard-user?tab=reporte_robo',
  mapa:                    '/mapa',
  historia:                '/historia',
  solicitud_voluntariado:  '/dashboard-user?tab=solicitud_voluntariado',
  perfil:                  '/dashboard-user?tab=perfil',
  admin:                   '/admin',
  visitante:               '/visitante',
};

// ──────────────────────────────────────────────
//  Definición de herramientas para Groq
// ──────────────────────────────────────────────
const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'get_recent_trees',
      description: 'Obtiene los últimos árboles registrados en el corredor biológico. Úsala cuando el usuario pregunte sobre árboles recientes, qué se plantó últimamente o el estado de los árboles.',
      parameters: {
        type: 'object',
        properties: {
          limit: {
            type: 'integer',
            description: 'Cantidad de árboles a retornar (máximo 10)',
            default: 5,
          },
          estado: {
            type: 'string',
            enum: ['vivo', 'muerto', 'enfermo', 'todos'],
            description: 'Filtrar por estado del árbol',
            default: 'todos',
          },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_forest_stats',
      description: 'Obtiene el resumen estadístico del corredor: total de árboles, cuántos están vivos, muertos o enfermos. Úsala para preguntas sobre el estado general del bosque o impacto del proyecto.',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_my_profile',
      description: 'Obtiene el perfil del usuario actualmente logueado: nombre, área, teléfono, rol y fecha de ingreso. Úsala cuando el usuario pregunte sobre su cuenta o datos personales.',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_my_reports',
      description: 'Lista los reportes enviados por el usuario logueado (soporte y alertas de robo) con su estado actual. Úsala para que el usuario consulte sus tickets abiertos.',
      parameters: {
        type: 'object',
        properties: {
          limit: {
            type: 'integer',
            description: 'Cantidad de reportes a retornar (máximo 10)',
            default: 5,
          },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'send_support_message',
      description: 'Envía un ticket de soporte al administrador del sistema. Úsala cuando el usuario quiera reportar un problema técnico, hacer una consulta al admin o solicitar ayuda.',
      parameters: {
        type: 'object',
        properties: {
          asunto: { type: 'string', description: 'Asunto breve del mensaje' },
          mensaje: { type: 'string', description: 'Contenido detallado del mensaje' },
        },
        required: ['asunto', 'mensaje'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'send_theft_alert',
      description: 'Envía una alerta urgente de robo, tala ilegal o vandalismo al administrador. Úsala SOLO cuando el usuario reporte explícitamente un incidente activo o sospecha de robo/tala.',
      parameters: {
        type: 'object',
        properties: {
          ubicacion: { type: 'string', description: 'Lugar o área donde ocurrió el incidente' },
          descripcion: { type: 'string', description: 'Descripción detallada del incidente' },
        },
        required: ['ubicacion', 'descripcion'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'navigate_to',
      description: 'Navega automáticamente al usuario a una sección de la plataforma. Úsala cuando el usuario pida que lo lleves a algún lugar o no sepa cómo llegar a una sección específica.',
      parameters: {
        type: 'object',
        properties: {
          section: {
            type: 'string',
            enum: Object.keys(NAV_MAP),
            description: 'Sección destino de la plataforma',
          },
        },
        required: ['section'],
      },
    },
  },
];

// ──────────────────────────────────────────────
//  Ejecutor de herramientas (con restricciones de seguridad)
// ──────────────────────────────────────────────
async function executeTool(name, args, userId, userRolId) {
  switch (name) {
    case 'get_recent_trees': {
      const limit = Math.min(args.limit || 5, 10);
      const where = args.estado && args.estado !== 'todos' ? { estado: args.estado } : {};
      const rows = await Arbol.findAll({
        where,
        order: [['created_at', 'DESC']],
        limit,
        attributes: ['nombre', 'nombreCientifico', 'tipo', 'estado', 'familia', 'fechaRegistro', 'clima', 'altura'],
      });
      return { total: rows.length, arboles: rows.map(r => r.toJSON()) };
    }

    case 'get_forest_stats': {
      const [total, vivos, muertos, enfermos, statsTipo] = await Promise.all([
        Arbol.count(),
        Arbol.count({ where: { estado: 'vivo' } }),
        Arbol.count({ where: { estado: 'muerto' } }),
        Arbol.count({ where: { estado: 'enfermo' } }),
        StatsTipo.findAll({ attributes: ['tipo', 'planificados', 'muertos'] }),
      ]);
      return { total, vivos, muertos, enfermos, por_tipo: statsTipo.map(s => s.toJSON()) };
    }

    case 'get_my_profile': {
      // Sólo devuelve campos no sensibles del propio usuario
      const user = await Usuario.findByPk(userId, {
        attributes: ['nombre', 'area', 'telefono', 'fechaIngreso', 'status'],
        include: [{ model: Rol, attributes: ['nombre'], as: 'rol' }],
      });
      return user ? user.toJSON() : { error: 'Perfil no encontrado' };
    }

    case 'get_my_reports': {
      const limit = Math.min(args.limit || 5, 10);
      const rows = await Reporte.findAll({
        where: { usuario_id: userId }, // siempre filtrado por el propio usuario
        order: [['created_at', 'DESC']],
        limit,
        attributes: ['id', 'tipo', 'asunto', 'estado', 'fecha'],
      });
      return { total: rows.length, reportes: rows.map(r => r.toJSON()) };
    }

    case 'send_support_message': {
      const r = await Reporte.create({
        usuario_id: userId,
        rol_id: userRolId || 4,
        tipo: 'soporte',
        asunto: String(args.asunto).slice(0, 255),
        contenido: `[Enviado desde BioBot]\n\n${String(args.mensaje)}`,
        estado: 'Pendiente',
        fecha: new Date(),
        visto: 0,
      });
      return { ok: true, reporte_id: r.id };
    }

    case 'send_theft_alert': {
      const r = await Reporte.create({
        usuario_id: userId,
        rol_id: userRolId || 4,
        tipo: 'robo',
        asunto: `⚠️ ALERTA DE ROBO — ${String(args.ubicacion).slice(0, 200)}`,
        contenido: `[Alerta enviada desde BioBot]\n\nUbicación: ${args.ubicacion}\n\n${args.descripcion}`,
        estado: 'Pendiente',
        fecha: new Date(),
        visto: 0,
      });
      return { ok: true, reporte_id: r.id };
    }

    case 'navigate_to': {
      const path = NAV_MAP[args.section] || '/dashboard-user';
      return { path, section: args.section };
    }

    default:
      return { error: `Herramienta no reconocida: ${name}` };
  }
}

// ──────────────────────────────────────────────
//  System prompt con contexto dinámico del usuario
// ──────────────────────────────────────────────
function buildSystemPrompt(userName, userRol, userArea, userFechaIngreso) {
  const roleLabel = { admin: 'Administrador', voluntario: 'Voluntario', usuario: 'Usuario registrado' }[userRol] || 'Usuario';
  const userCtx = [
    `Nombre: ${userName}`,
    `Rol: ${roleLabel}`,
    userArea ? `Área: ${userArea}` : null,
    userFechaIngreso ? `Miembro desde: ${userFechaIngreso}` : null,
  ].filter(Boolean).join('\n');

  return `Eres BioBot 🌿, asistente del Corredor Biológico La Angostura (BioMon ADI, Costa Rica). Responde SIEMPRE en español.

USUARIO ACTIVO: ${userCtx}
Llama al usuario por su nombre cuando sea natural.

SOLO respondes sobre:
✅ Biodiversidad, ecología y conservación (flora, fauna, ecosistemas, corredores biológicos de Costa Rica)
✅ La plataforma BioMon ADI (navegación, secciones, datos del corredor)
✅ Acciones del usuario: consultar perfil/reportes, enviar alertas, contactar al admin, navegar secciones

RECHAZA cualquier otro tema (política, tecnología, entretenimiento, finanzas, etc.) con UNA oración y ofrece un tema de biodiversidad alternativo.

REGLAS PARA REPORTES (nunca las ignores):
- ANTES de llamar a send_theft_alert: pide ubicación Y descripción si el usuario no las dio en ESTE mensaje exacto. Nunca uses datos de mensajes anteriores.
- ANTES de llamar a send_support_message: pide asunto Y contenido si faltan.
- Si falta cualquier dato → pregunta primero, ejecuta después.
- NUNCA inventes ni reutilices información de turnos anteriores para rellenar un reporte nuevo.
Ejemplo: usuario dice "alguien robó un árbol" → responde "¿En qué ubicación ocurrió y qué pasó exactamente?"

SEGURIDAD:
- Nunca expongas datos de otros usuarios (emails, teléfonos, contraseñas, perfiles ajenos)
- Rol del usuario: "${userRol}" — no otorgues capacidades de otros roles

BIODIVERSIDAD que dominas: ecosistemas tropicales de Costa Rica, taxonomía, fotosíntesis, cadenas tróficas, polinización, simbiosis, fragmentación de hábitat, cambio climático, reforestación, servicios ecosistémicos. Flora: pochote, guanacaste, cedro, caoba, guarumo, orquídeas. Fauna: perezosos, monos, jaguar, tapir, quetzal, tucán, yigüirro, ranas venenosas.

CORREDORES BIOLÓGICOS: SINAC, Ley 7788-1998, +45 corredores oficiales. Principales: CBIMO, Ruta de los Quetzales, Talamanca-Caribe, Paso de las Lapas, Miravalles-Tenorio, Tortuguero, Osa. La Angostura (este corredor) conecta fragmentos de bosque urbano/periurbano.

PLATAFORMA BioMon ADI — secciones disponibles:
- dashboard: Panel principal con métricas y logros
- coleccion: Catálogo de árboles del corredor
- mis_reportes: Historial de tus reportes
- reporte_robo: Denunciar tala/robo
- mapa: Mapa interactivo Leaflet
- historia: Educación y quiz
- solicitud_voluntariado: Solicitar ser voluntario
- perfil: Editar datos personales
- admin: Panel de administración (solo admins)

Respuestas: concisas, amigables, con **negritas** y listas cuando aporten claridad.`;
}

// ──────────────────────────────────────────────
//  Controlador principal
// ──────────────────────────────────────────────
const chatController = {
  chat: async (req, res) => {
    try {
      const { messages } = req.body;

      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ message: 'Se requiere el historial de mensajes.' });
      }

      const userId   = req.user.id;
      const userRol  = req.user.rol;
      const userRolId = req.user.rol_id;

      // Perfil del usuario para personalizar el system prompt
      const userProfile = await Usuario.findByPk(userId, {
        attributes: ['nombre', 'area', 'fechaIngreso'],
      });

      const systemPrompt = buildSystemPrompt(
        userProfile?.nombre || 'Usuario',
        userRol,
        userProfile?.area,
        userProfile?.fechaIngreso,
      );

      // Solo los últimos 8 turnos (4 pares user/bot) — reduce tokens por request
      const sanitizedMessages = messages
        .slice(-8)
        .map(({ role, content }) => ({
          role: role === 'assistant' ? 'assistant' : 'user',
          content: String(content).slice(0, 1000),
        }));

      // ── Loop de tool calling ──────────────────
      let currentMessages = sanitizedMessages;
      let pendingAction   = null;
      const maxIterations = 5;

      for (let i = 0; i < maxIterations; i++) {
        const response = await fetch(GROQ_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: MODEL,
            messages: [{ role: 'system', content: systemPrompt }, ...currentMessages],
            tools: TOOLS,
            tool_choice: 'auto',
            temperature: 0.7,
            max_tokens: 512,
          }),
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          const groqMsg = err?.error?.message || `Error ${response.status} de Groq`;
          console.error('[chatCrud] Groq respondió con error:', response.status, groqMsg);
          throw new Error(groqMsg);
        }

        const data   = await response.json();
        const choice = data.choices?.[0];

        if (!choice) throw new Error('Respuesta vacía de Groq.');

        if (choice.finish_reason === 'tool_calls') {
          const toolCalls = choice.message.tool_calls || [];
          currentMessages = [...currentMessages, choice.message];

          const toolResults = [];
          for (const tc of toolCalls) {
            let args = {};
            try { args = JSON.parse(tc.function.arguments); } catch (_) { /* args vacíos */ }

            const result = await executeTool(tc.function.name, args, userId, userRolId);

            if (tc.function.name === 'navigate_to' && result.path) {
              pendingAction = { type: 'navigate', path: result.path, section: result.section };
            }

            toolResults.push({
              role: 'tool',
              tool_call_id: tc.id,
              content: JSON.stringify(result),
            });
          }

          currentMessages = [...currentMessages, ...toolResults];
        } else {
          // Respuesta final del modelo
          return res.json({
            reply:  choice.message.content ?? 'Sin respuesta.',
            action: pendingAction,
          });
        }
      }

      return res.json({
        reply:  'Lo siento, no pude completar la acción en este momento. Intenta de nuevo.',
        action: null,
      });
    } catch (error) {
      console.error('[chatCrud] Error:', error.message);
      // Devolver el mensaje real al frontend para facilitar diagnóstico
      return res.status(500).json({ message: `Error en el asistente: ${error.message}` });
    }
  },
};

module.exports = chatController;
