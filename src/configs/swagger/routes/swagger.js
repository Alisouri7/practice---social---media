const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./../swagger.json');     //swagger json file

const router = express.Router();

const swaggerOptions = {
    customCss: '.swagger-ui .topbar {display: none};'
};

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDocument, swaggerOptions));

// const configSwagger = (app) => {
//     const swaggerDocument = swaggerJsDoc({
//         swaggerDefinition: {
//             openapi: '3.0.1',
//             info: {
//                 title: 'TEST SWAGGER',
//                 description: "SWAGGER TEST DESCRIPTION",
//                 version: '1.0.0'
//             },
//             servers: [
//                 {
//                     url: 'http://localhost:3000'
//                 }
//             ]
//         },
//         apis: ['./app.js']        //به روت پروژه وصل است
//     })

//     const swagger = swaggerUi.setup(swaggerDocument, {});
//     app.use('/api-docs', swaggerUi.serve, swagger)
// }

module.exports = router;