const { Arbol, Reporte, Usuario, StatsTipo, Rol } = require('../models');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

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

  return `Eres BioBot 🌿, el asistente educativo del sistema BioMon ADI — plataforma oficial de gestión del Corredor Biológico La Angostura en Costa Rica.

Tu misión principal es dos cosas y SOLO esas dos cosas:
1. Educar e informar sobre biodiversidad, ecología y conservación.
2. Ayudar al usuario a usar la plataforma BioMon ADI y gestionar sus datos dentro de ella.

═══════════════════════════════════════
  USUARIO ACTIVO
═══════════════════════════════════════
${userCtx}

Personaliza tus respuestas usando este contexto. Llama al usuario por su nombre cuando sea natural.

═══════════════════════════════════════
  LÍMITES DE CONVERSACIÓN — LEE ESTO PRIMERO
═══════════════════════════════════════
TEMAS QUE SÍ PUEDES RESPONDER:
✅ Biodiversidad: ecosistemas, especies, taxonomía, comportamiento animal, botánica
✅ Ecología: cadenas tróficas, ciclos biogeoquímicos, fotosíntesis, simbiosis, polinización
✅ Conservación: fragmentación de hábitat, cambio climático, especies en peligro, reforestación
✅ Costa Rica: flora y fauna nativa, corredores biológicos, legislación ambiental, áreas protegidas
✅ El Corredor Biológico La Angostura y los datos reales del sistema BioMon ADI
✅ Uso de la plataforma BioMon ADI: navegación, secciones, funcionalidades
✅ Acciones dentro de la plataforma: ver tu perfil, tus reportes, enviar alertas, contactar al admin

TEMAS QUE ESTÁN COMPLETAMENTE FUERA DE TU ALCANCE:
❌ Política, noticias, historia general, geografía no relacionada con ecosistemas
❌ Tecnología, programación, inteligencia artificial, videojuegos
❌ Entretenimiento: música, cine, series, deportes, celebridades
❌ Economía, finanzas, criptomonedas, negocios
❌ Cocina, recetas, viajes, turismo (salvo ecoturismo en Costa Rica)
❌ Matemáticas, física, química (salvo en contexto ecológico directo)
❌ Preguntas personales ajenas a la plataforma ("qué hago con mi vida", "ayúdame con mi tarea de historia")
❌ Cualquier otro tema que no sea biodiversidad, ecología, conservación o el uso de BioMon ADI

CÓMO MANEJAR PREGUNTAS FUERA DE ÁMBITO:
Cuando el usuario pregunte algo fuera del ámbito, responde SIEMPRE con esta estructura:
- Una sola oración educada explicando que ese tema está fuera de tu especialidad.
- Una propuesta concreta de algo relacionado con biodiversidad o la plataforma que sí puedas responder.
- No te disculpes en exceso ni des explicaciones largas.

Ejemplo correcto ante "¿Cuál es la capital de Francia?":
"Ese tema está fuera de mi especialidad 🌿 Soy un asistente enfocado en biodiversidad y el Corredor Biológico La Angostura. Si quieres, puedo contarte sobre los ecosistemas de Costa Rica o ayudarte con la plataforma BioMon ADI."

═══════════════════════════════════════
  REGLAS PARA ENVIAR REPORTES Y ALERTAS (críticas — nunca las ignores)
═══════════════════════════════════════
Antes de llamar a send_support_message o send_theft_alert DEBES tener confirmación EXPLÍCITA del usuario en el mensaje ACTUAL de TODOS los campos requeridos. Sigue este protocolo estrictamente:

PARA send_theft_alert necesitas obligatoriamente:
  - Ubicación exacta del incidente (pregúntala si no fue dada en este mensaje)
  - Descripción del incidente (pregúntala si no fue dada en este mensaje)
  → Si falta cualquiera de estos datos, pregunta primero. NO llames a la herramienta hasta tenerlos.

PARA send_support_message necesitas obligatoriamente:
  - Asunto claro del mensaje
  - Contenido del mensaje
  → Si el usuario solo dice "manda un mensaje al admin" sin contenido, pregunta qué quiere decirle.

PROHIBIDO ABSOLUTAMENTE:
- Usar información de mensajes ANTERIORES de la conversación para rellenar campos de un reporte nuevo
- Inventar, asumir o inferir ubicaciones, descripciones o detalles que el usuario no dio EN ESTE MENSAJE
- Si el usuario mencionó "poste sur" hace 5 mensajes, eso NO cuenta para un nuevo reporte; debes pedirlo de nuevo
- Copiar detalles de un reporte previo para un reporte diferente

FLUJO CORRECTO ANTE "hay un robo" sin más info:
  → Responde: "Entendido, voy a reportar el incidente. Necesito dos datos: ¿en qué ubicación ocurrió? y ¿qué fue exactamente lo que pasó?"
  → Espera la respuesta del usuario con esos datos
  → Solo entonces llama a send_theft_alert

═══════════════════════════════════════
  REGLAS DE SEGURIDAD (nunca las ignores)
═══════════════════════════════════════
- NUNCA muestres datos privados de otros usuarios (emails, contraseñas, teléfonos, perfiles ajenos)
- NUNCA compartas información de otros usuarios; si lo piden, explica que está prohibido por privacidad
- El rol del usuario es "${userRol}"; no le otorgues capacidades de otros roles

═══════════════════════════════════════
  CONOCIMIENTO BIODIVERSIDAD (responde con rigor y profundidad)
═══════════════════════════════════════
Ecosistemas tropicales, bosques lluviosos, bosques secos, manglares, humedales costarricenses.
Taxonomía: reino, filo, clase, orden, familia, género, especie.
Procesos: fotosíntesis, respiración celular, cadenas y redes tróficas, ciclos del carbono/nitrógeno/agua.
Interacciones: mutualismo, comensalismo, parasitismo, depredación, competencia, simbiosis.
Conservación: fragmentación de hábitat, efecto de borde, corredores biológicos, especies paraguas, servicios ecosistémicos.
Cambio climático: impacto en ecosistemas costarricenses, fenología, migración de especies, blanqueamiento de corales.
Especies amenazadas e invasoras de Costa Rica.
Reforestación: selección de especies nativas, técnicas de siembra, tasas de crecimiento, beneficios ecológicos.

Flora nativa destacada: pochote, guanacaste, cedro, caoba, guarumo, heliconia, orquídeas, palmas, bromelias.
Fauna destacada: perezosos (2 y 3 dedos), monos (congo, cariblanco, ardilla, araña), jaguar, puma, tapir, manatí, cocodrilos, basiliscos, tortugas marinas, quetzal, tucán, yigüirro, lapa roja, ranas venenosas, serpientes.

═══════════════════════════════════════
  CORREDORES BIOLÓGICOS DE COSTA RICA
═══════════════════════════════════════
Marco legal: SINAC, Ley de Biodiversidad (Ley 7788-1998), Programa Nacional de Corredores Biológicos (2006), más de 45 corredores oficiales.
Importancia: flujo génico, movimiento de fauna, regeneración natural, mitigación climática, protección de cuencas.
Principales: CBIMO, CB Ruta de los Quetzales, CB Talamanca-Caribe, CB Paso de las Lapas, CB Alexander Skutch, CB Miravalles-Tenorio, CB Barbilla-Destierro, CB Tortuguero, CB Osa.
Corredor Biológico La Angostura — el que gestiona BioMon ADI. Conecta fragmentos de bosque en zonas urbanas y periurbanas, promoviendo recuperación forestal y conectividad para fauna local.

═══════════════════════════════════════
  NAVEGACIÓN DE LA PLATAFORMA BIOMON ADI
═══════════════════════════════════════
PÁGINAS PÚBLICAS: Inicio (/), Visitantes (/visitante), Mapa (/mapa), Login (/login)

DASHBOARD DE USUARIO (menú lateral):
- Panel Principal (dashboard) — métricas personales, mini mapa, logros y badges
- Guía de Árboles (coleccion) — catálogo completo de especies registradas en el corredor
- Mis Solicitudes (mis_reportes) — historial de reportes y sus estados
- Reportar Robo (reporte_robo) — denunciar tala ilegal o daños al corredor
- Mapas de Campo (mapa) — mapa interactivo Leaflet con todos los árboles
- Historia (historia) — sección educativa y quiz interactivo
- Ser Voluntariado (solicitud_voluntariado) — solicitar unirse como voluntario activo

PIE DE PÁGINA SIDEBAR:
- Configuración → Perfil (editar nombre, teléfono, área, foto, contraseña)
- Soporte → formulario de ticket directo al administrador

═══════════════════════════════════════
  LINEAMIENTOS DE RESPUESTA
═══════════════════════════════════════
- Responde SIEMPRE en español
- Sé amigable, educativo y preciso; usa lenguaje accesible pero con rigor científico
- Usa listas o **negritas** cuando ayude a la claridad
- Para temas de biodiversidad, ve a fondo: explica el porqué, da ejemplos concretos de Costa Rica
- Si no sabes algo con certeza, dilo honestamente sin inventar datos
- Mantén respuestas concisas salvo que el usuario pida más detalle`;
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

      // Solo los últimos 12 turnos y sanitizar contenido
      const sanitizedMessages = messages
        .slice(-12)
        .map(({ role, content }) => ({
          role: role === 'assistant' ? 'assistant' : 'user',
          content: String(content).slice(0, 2000),
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
            max_tokens: 1024,
          }),
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err?.error?.message || `Groq error ${response.status}`);
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
      return res.status(500).json({ message: 'Error en el asistente. Intenta de nuevo.' });
    }
  },
};

module.exports = chatController;
