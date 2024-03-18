import "./styles.css"
import {Project,ProjectList} from './project.js';
import {Todo} from './todo.js';
import {renderProjects,makeNewProjectModal } from './domutils.js'


function initDefaultProject() {
	// Initialize the singleton
	ProjectList.getInstance()
	let project = new Project('default');
	let todo = new Todo ( 
		"Learn to webdev",
		"Complete odin project",
		new Date("2024-12-25"),
		0
	)
	project.addTodo(todo)
	ProjectList.addProject(project)
}

function setupAddProject(){
	let addprj = document.getElementById('add-project-button')
	addprj.addEventListener('click',()=>{
		makeNewProjectModal();

	});

}



document.addEventListener("DOMContentLoaded",()=>{
	initDefaultProject()
	setupAddProject();
	renderProjects()


})
