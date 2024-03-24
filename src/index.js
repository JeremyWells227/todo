import "./styles.css"
import {Project,ProjectList,initDefaultProject} from './project.js';
import {Todo} from './todo.js';
import {renderProjects,makeNewProjectModal,renderSelectedProject,setupAddProject } from './domutils.js'
import {loadState} from "./storage.js"





document.addEventListener("DOMContentLoaded",()=>{
	if (localStorage.getItem('projects')){
		loadState()
	} else {
		initDefaultProject()
	}
	setupAddProject();
	renderProjects();
	renderSelectedProject();
})
