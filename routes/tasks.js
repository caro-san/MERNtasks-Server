const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

//crear tarea
// api/tasks

router.post('/',
    auth,
    [
        check('name', 'Name is required').not().isEmpty(),
        check('project', 'The project is required').not().isEmpty(),
    ],
    taskController.createTask
);

//Obtener las tareas por proyecto
router.get('/',
    auth,
    taskController.getTasks

);

//Actualizar Tarea
router.put('/:id',
    auth,
    taskController.updateTask
);

//Eliminar tarea
router.delete('/:id',
    auth,
    taskController.deleteTask
)

module.exports = router;

