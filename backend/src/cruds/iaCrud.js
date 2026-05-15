const { GoogleGenerativeAI } = require("@google/generative-ai");

const analyzeTreeState = async (req, res) => {
    try {
        const { descripcion } = req.body;

        if (!descripcion) {
            return res.status(400).json({ message: "La descripción es requerida" });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ message: "GEMINI_API_KEY no configurada en el servidor" });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Eres un experto en botánica y reforestación. Analiza la siguiente descripción de un árbol y sugiere cuidados específicos o identifica posibles plagas. 
        Descripción del usuario: "${descripcion}"
        Responde de forma profesional, concisa y estructurada en formato JSON con los campos: "analisis", "sugerencias", "posible_plaga" (boolean) y "severidad" (baja, media, alta).`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Intentar limpiar el texto si viene con markdown
        const cleanJson = text.replace(/```json|```/g, "").trim();
        const iaResponse = JSON.parse(cleanJson);

        res.json({
            status: "success",
            data: iaResponse
        });
    } catch (error) {
        console.error("Error en IA Analysis:", error);
        res.status(500).json({ message: "Error al procesar el análisis con IA", error: error.message });
    }
};

module.exports = {
    analyzeTreeState
};
