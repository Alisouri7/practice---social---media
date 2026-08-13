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


module.exports = router;