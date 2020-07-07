const Project = require('../models/Project');
const { validationResult } = require('express-validator')

exports.createProject = async (req, res) => {

    // Revisar si hay errores
    const errores = validationResult(req);
    if( !errores.isEmpty() ) {
        return res.status(400).json({errores: errores.array() })
    }


    try {
        // Crear un nuevo proyecto
        const project = new Project(req.body);

        // Guardar el creador via JWT
        project.creator = req.user.id;

        // guardamos el proyecto
        project.save();
        res.json(project);
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Server error');
    }
}

//*** Obtiene todos los proyectos del usuario actual ***
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ creator: req.user.id }).sort({ created: -1 });
        res.json({ projects });
    } catch (error) {
        console.log(error);
        res.status(500).send('500. That’s an error');
        
    }
}

//*** Actualiza un proyecto ***
exports.updateProject = async (req, res) => {

    //Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty() ){
        return res.status(400).json({errores: errores.array() })
    }

    //Extraer la informacion del proyecto
    const { name } = req.body;
    const newProject = {};

    if(name){
        newProject.name = name;
    }

    try {

        //Revisar el ID
        let project = await Project.findById(req.params.id);

        //Revisar si el proyecto existe o no
        if(!project){
            return res.status(400).json({msg: 'Project not Found'});
        }

        //Verificar el creador del proyecto
        if(project.creator.toString() !== req.user.id){
            return res.status(401).json({msg: 'No Authorized'});
        }

        //Actualizar
        project = await Project.findOneAndUpdate({ _id: req.params.id}, { $set: newProject}, { new: true});

        res.json({project})
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
        
    }
}

//*** Elimina un proyecto por su id ***
exports.deleteProject = async (req, res) => {
    try {
        //Revisar el ID
        let project = await Project.findById(req.params.id);

        //Revisar si el proyecto existe o no
        if(!project){
            return res.status(400).json({msg: 'Project not Found'});
        }

        //Verificar el creador del proyecto
        if(project.creator.toString() !== req.user.id){
            return res.status(401).json({msg: 'No Authorized'});
        }

        //Eliminar proyecto
        await Project.findOneAndRemove({ _id: req.params.id})
        res.json({msg: 'Project Removed'})

    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error')
        
    }
}
