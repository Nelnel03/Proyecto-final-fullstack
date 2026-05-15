const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'BioMon ADI API',
            version: '1.0.0',
            description: 'API para el sistema de monitoreo de reforestación BioMon ADI',
            contact: {
                name: 'Equipo de Desarrollo',
            },
            servers: [
                {
                    url: 'http://localhost:3000',
                    description: 'Servidor Local'
                }
            ],
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{
            bearerAuth: []
        }],
    },
    apis: ['./src/routes/*.js', './src/models/*.js'], // Rutas donde Swagger buscará anotaciones JSDoc
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
