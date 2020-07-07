const Task = require('../models/Task');
const Project = require('../models/Project');
const { validationResult } = require('express-validator');

//Crea una nueva tarea
exports.createTask = async (req, res) => {

    //Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty() ){
        return res.status(400).json({errores: errores.array() })
    }

    try {
        //Extraer el proyecto y comprobar si existe
        const { project } = req.body;

        const existProject = await Project.findById(project);
        if(!existProject){
            return res.status(404).json({msg: 'Project not found'});
        }

        //Revisar si el proyecto actual pertenece al usuario autenticado
        if(existProject.creator.toString() !== req.user.id) {
            return res.status(401).json({msg:'No Authorized'});
        }

        //Creamos la tarea
        const task = new Task(req.body);
        await task.save();
        res.json({task});

    } catch (error) {
        console.log(error)
        res.status(500).send('error 500')
    }
}

//***Obtiene las tareas del proyecto ***
exports.getTasks = async (req, res) => {

    try {
        //Extraer el proyecto y comprobar si existe
        const { project } = req.query;

        const existProject = await Project.findById(project);
        if(!existProject){
            return res.status(404).json({msg: 'Task not found'})
        }

        //Revisar si el proyecto actual pertenece al usuario autenticado
        if(existProject.creator.toString() !== req.user.id ){
            return res.status(401).json({msg:'No Autorized'});
        }

        //Obtener las tareas por proyecto
        const tasks = await Task.find({ project }).sort({ created: -1});
        res.json({ tasks });


    } catch (error) {
        console.log(error);
        res.status(500).send('Error 500');
        
    }
}

// Actualizar una tarea
exports.updateTask = async (req, res) => {
    try {
         //Extraer el proyecto y comprobar si existe
        const { project, name, state } = req.body;

        //Revisar si la tarea existe o no
        let taskExist = await Task.findById(req.params.id);

        if(!taskExist){
            return res.status(404).json({msg: 'Task does not exist'});
        }

        //Extraer proyecto
        const existProject = await Project.findById(project);

         //Revisar si el proyecto actual pertenece al usuario autenticado
        if(existProject.creator.toString() !== req.user.id ){
            return res.status(401).json({msg:'No Autorized'});
        }

        //Crear un objeto con la nueva informacion
        const newTask ={};

        newTask.name = name
        newTask.state = state

        //Guardar la tarea
        taskExist = await Task.findOneAndUpdate({ _id: req.params.id }, newTask, { new: true});

        res.json({ taskExist })

    } catch (error) {
        console.log(error);
        res.status(500).send('Error 500');
        
    }
}

//Eliminar una tarea
exports.deleteTask = async (req, res) => {
    try {
        //Extraer el proyecto y comprobar si existe
    const { project } = req.query;

    console.log(req.body);

       //Revisar si la tarea existe o no
    let taskExist = await Task.findById(req.params.id);

    if(!taskExist){
        return res.status(404).json({msg: 'Task does not exist'});
    }

       //Extraer proyecto
    const existProject = await Project.findById(project);

        //Revisar si el proyecto actual pertenece al usuario autenticado
    if(existProject.creator.toString() !== req.user.id ){
        return res.status(401).json({msg:'No Autorized'});
    }

    //Eliminar

    await Task.findOneAndRemove({ _id: req.params.id });
    res.json({msg: 'Task Removed'})

} catch (error) {
    console.log(error);
    res.status(500).send('Error 500');

}
}