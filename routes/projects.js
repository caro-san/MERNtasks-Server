const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

//create projects
// api/projects
router.post('/', 
    auth,
    [
        check('name', 'The name project is required').not().isEmpty()
    ],
    projectController.createProject
);

//Obtener todos los proyectos
router.get('/',
    auth,
    projectController.getProjects
);

//Actualiza proyecto via ID
router.put('/:id',
    auth,
    [
        check('name', 'The project name is required').not().isEmpty()
    ],
    projectController.updateProject

);

//Eliminar proyecto
router.delete('/:id',
    auth,
    projectController.deleteProject
);

module.exports = router;