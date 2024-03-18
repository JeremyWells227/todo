import { makeModal, closeModal } from './modal.js';
import {Project,ProjectList} from "./project.js"




function renderProjects(projectList) {
	let sidebar = document.getElementById("projects")
	sidebar.innerHTML = ""; // Clear everything
	let list = document.createElement("ul")
	list.id = "prj-list";
	let projects = ProjectList.getInstance();
	projects.projects.forEach((prj, i) => {
		let listElem = document.createElement('li')
		listElem.classList.add('prj-list-item')
		listElem.id = `prj_${i}`
		let nameSpan = document.createElement('span')
		nameSpan.appendChild(document.createTextNode(prj.name))
		listElem.appendChild(nameSpan)
		let renameBtn = document.createElement("button")
		renameBtn.classList.add("prj-button")
		renameBtn.appendChild(document.createTextNode("Rename"))
		renameBtn.addEventListener("click", () => {
			makeProjectRenameModal(i)
		});
		listElem.appendChild(renameBtn)
		let removeBtn = document.createElement("button")
		removeBtn.classList.add("prj-button")
		removeBtn.appendChild(document.createTextNode(""))
		removeBtn.addEventListener("click", () => {
			ProjectList.removeProject(i)
			renderProjects()
		});
		listElem.appendChild(removeBtn)
		list.appendChild(listElem)
	}
	)
	sidebar.appendChild(list)
}

function makeProjectRenameModal(i){
	let projectlist = ProjectList.getInstance();
	let prj = projectlist.projects[i]
	let inputs = []
	let nameDiv = document.createElement("div")
	let input = document.createElement('input')
	input.name = "name"
	let label = document.createElement('label')
	label.appendChild(document.createTextNode("New Name"))
	label.setAttribute('for','name')
	nameDiv.appendChild(label);
	nameDiv.appendChild(input);
	inputs.push(nameDiv)
	let form = formBuilder(inputs,()=>{
		console.log(prj)
		prj.renameProject(input.value)
		renderProjects()

	})
	makeModal(form)
}

function makeNewProjectModal(i){
	let inputs = []
	let nameDiv = document.createElement("div")
	let input = document.createElement('input')
	input.name = "name"
	let label = document.createElement('label')
	label.appendChild(document.createTextNode("New Name"))
	label.setAttribute('for','name')
	nameDiv.appendChild(label);
	nameDiv.appendChild(input);
	inputs.push(nameDiv)
	let form = formBuilder(inputs,()=>{
		console.log(input.value)
		let project = new Project(input.value)
		ProjectList.addProject(project)
		renderProjects()
	})
	makeModal(form)
}


function formBuilder(childList,onSubmit) {
	let form = document.createElement('form')

	let button = document.createElement("button");
	let domList = document.createElement('ul')
	childList.forEach((inp) => {
		let li = document.createElement('li')
		li.appendChild(inp)
		domList.appendChild(li)
	})
	button.setAttribute("type", "submit");
	button.appendChild(document.createTextNode('Submit'))
	form.addEventListener("submit",(e) => {
		e.preventDefault();
		onSubmit();
		closeModal();
	});
	form.appendChild(domList)
	form.appendChild(button)
	return form
}


export {
	renderProjects,
	makeNewProjectModal

} 
