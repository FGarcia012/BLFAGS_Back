import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const option = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'BLFAGS API',
            version: '1.0.0',
            description: 'Api documentation for the BLFAGS application',
            contact: {
                name: 'Fredy Alexander García Sicajau',
                email: 'alexander.garcia.sicajau@gmail.com'
            }
        },
        servers: [
            {
                url: 'http://127.0.0.1:3020/BLFAGS/v1',
            },
        ],
    },
    apis: [
        './src/auth/auth.routes.js'
    ]
};

const swaggerDocs = swaggerJSDoc(option);

export { swaggerDocs, swaggerUi };