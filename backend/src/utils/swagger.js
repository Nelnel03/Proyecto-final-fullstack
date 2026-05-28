const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API BioMon - Reforestación',
            version: '1.0.0',
            description: 'Documentación de la API del proyecto de monitoreo y reforestación de manglares.',
            contact: {
                name: 'Soporte BioMon'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor Local (Desarrollo)'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ['./src/routes/*.js'], // Lee los comentarios JSDoc de todos los archivos de rutas
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: "BioMon API Docs"
    }));
    console.log('📄 Swagger docs disponibles en http://localhost:3000/api-docs');
};

module.exports = swaggerDocs;
