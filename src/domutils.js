import { makeModal, closeModal } from './modal.js';
import { Todo } from "./todo.js";
import { Project, ProjectList } from "./project.js"
import { format } from 'date-fns'
import { saveState,clearStorage } from './storage.js'


function setupAddProject(){
	let addprj = document.getElementById('add-project-button')
	addprj.addEventListener('click',()=>{
		makeNewProjectModal();
	});
}


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
		nameSpan.addEventListener("click", () => {
			ProjectList.setCurrentProject(i);
			renderSelectedProject();
		})
		nameSpan.addEventListener('click', () => {
			ProjectList.setCurrentProject(i)
			renderSelectedProject()
		})
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
	saveState();
}


function renderSelectedProject() {
	let project = ProjectList.getCurrentProject()
	if (!project)
		return;

	let container = document.getElementById('curr_project')
	container.innerHTML = ""; //Clear it
	let todoList = document.createElement('ul')
	todoList.classList.add('todoList')
	let todos = project.todos
	todos.sort((a,b) => a.priority - b.priority)
	todos.forEach((todo, i) => {
		renderTodo(todo, i, todoList);
	})
	let addTodoBtn = document.createElement('button')
	addTodoBtn.appendChild(document.createTextNode('New Todo'))
	addTodoBtn.addEventListener("click", () => {
		makeNewTodoModal()
	})
	addTodoBtn.classList.add('new-todo')
	let clearBtn = document.createElement('button')
	clearBtn.appendChild(document.createTextNode('Reset Data'))
	clearBtn.addEventListener("click", () => {
		clearStorage();
		renderProjects()
		renderSelectedProject()
	})
	clearBtn.classList.add('clear-btn')
	container.appendChild(addTodoBtn)
	container.appendChild(clearBtn);
	container.appendChild(todoList);
	saveState();
}


function renderTodo(todo, i, list) {
	let todoLi = document.createElement('li')
	todoLi.classList.add(`todo-${todo.state.toLowerCase()}`)
	todoLi.classList.add('todoItem')
	todoLi.id = `todo_${i}`
	todoLi.key = `todo_${i}`
	let title = document.createElement('h2')
	title.appendChild(document.createTextNode(todo.title))
	todoLi.appendChild(title)
	let filler = document.createElement('span')
	filler.classList.add('todoFiller')
	todoLi.appendChild(filler);
	let btnContainer = document.createElement('div')
	if (todo.expanded) {
		todoLi.classList.add('expanded');
		let desc = document.createElement('p')
		desc.appendChild(document.createTextNode(todo.description ? "Description: " + todo.description : ""))
		todoLi.appendChild(desc)
		let dueDate = document.createElement('span')
		dueDate.appendChild(document.createTextNode(todo.dueDate ? "Due: " + todo.dueDate : ""))
		todoLi.appendChild(dueDate)
		let priority = document.createElement('span')
		priority.appendChild(document.createTextNode(todo.priority ? "Priority: "+todo.priority : ""))
		todoLi.appendChild(priority)
		let state = document.createElement('span')
		state.appendChild(document.createTextNode("Status: " + todo.state))
		todoLi.appendChild(state)
		btnContainer.classList.add('expanded-btns')
	}
	let editBtn = document.createElement('button')
	editBtn.appendChild(document.createTextNode("Edit"))
	editBtn.addEventListener('click', () => {
		makeTodoEditModal(i)
	})
	let deleteBtn = document.createElement('button')
	deleteBtn.appendChild(document.createTextNode(""))
	deleteBtn.addEventListener('click', () => {
		let prj = ProjectList.getCurrentProject()
		prj.removeTodo(i)
		renderSelectedProject()
	})
	let expandBtn = document.createElement('button')
	expandBtn.appendChild(document.createTextNode(todo.expanded ? "-" : "+"))
	expandBtn.addEventListener('click', () => {
		todo.toggleExpanded()
		renderSelectedProject()
	})
	let statusLabel = document.createElement('label')
	statusLabel.appendChild(document.createTextNode('Status: '))
	let statusInp = document.createElement('select')
	statusInp.id = `status_${i}`
	statusInp.name = `status_${i}`
	statusLabel.for = `status_${i}`
	let options = [Todo.OPEN, Todo.SCHED, Todo.DONE]
	for (let opt of options) {
		let option = document.createElement('option')
		option.value = opt
		if (opt === todo.state)
			option.selected = true;
		option.appendChild(document.createTextNode(opt))
		statusInp.appendChild(option)
	}

	statusInp.addEventListener('change', (e) => {
		todo.state = e.target.value
		renderSelectedProject()
	})
	let statusSpan = document.createElement('span')
	statusSpan.appendChild(statusLabel)
	statusSpan.appendChild(statusInp)


	if (todo.expanded) {
		btnContainer.appendChild(editBtn)
		btnContainer.appendChild(deleteBtn)
		btnContainer.appendChild(expandBtn)
		btnContainer.appendChild(statusSpan)
		todoLi.appendChild(btnContainer)
	} else {
		todoLi.appendChild(editBtn)
		todoLi.appendChild(deleteBtn)
		todoLi.appendChild(expandBtn)
		todoLi.appendChild(statusSpan)
	}
	list.appendChild(todoLi)
}


function makeTodoEditModal(i) {
	let todoLi = document.getElementById(`todo_${i}`)
	let currPrj = ProjectList.getCurrentProject()
	let currTodo = currPrj.todos[i]
	let inputs = []
	let [titleLabel, titleInput] = makeInput("Todo: ", "title", [], { minLength: 1, value: currTodo.title, type: "text" })
	let titleSpan = document.createElement('span')
	titleSpan.appendChild(titleLabel)
	titleSpan.appendChild(titleInput)
	inputs.push(titleSpan)
	let [descriptionLabel, descriptionInput] = makeInput("Description: ", "description", [], { type: "textarea" })
	descriptionInput.appendChild(document.createTextNode(currTodo.description))
	let descriptionSpan = document.createElement('span')
	descriptionSpan.appendChild(descriptionLabel)
	descriptionSpan.appendChild(descriptionInput)
	descriptionSpan.classList.add('description-span')
	let currDate = new Date()
	let [dueDateLabel, dueDateInput] = makeInput("Due Date: ", "dueDate", [], { value: formatDateValue(currTodo.dueDate), min: formatDateValue(currDate), type: "datetime-local" })
	let dueDateSpan = document.createElement('span')
	dueDateSpan.appendChild(dueDateLabel)
	dueDateSpan.appendChild(dueDateInput)
	inputs.push(dueDateSpan)
	let [priorityLabel, priorityInput] = makeInput("Priority: ", "priority", [], { value: currTodo.priority, type: "number", default: 0, value: currTodo.priority })
	let prioritySpan = document.createElement('span')
	prioritySpan.appendChild(priorityLabel)
	prioritySpan.appendChild(priorityInput)
	inputs.push(prioritySpan)

	inputs.push(descriptionSpan)

	let form = formBuilder(inputs, () => {
		let prj = ProjectList.getCurrentProject()
		let currTodo = prj.todos[i]
		currTodo.title = titleInput.value
		currTodo.description = descriptionInput.value
		currTodo.dueDate = new Date(dueDateInput.value)
		currTodo.priority = priorityInput.value
		renderSelectedProject()
	})
	makeModal(form, "Edit Todo")
}

function makeInput(label, id, classList = [], config = {}) {
	let inpType = "input"
	if (config.type === "textarea") {
		inpType = "textarea"
		delete config.type
	}
	let input = document.createElement(inpType);
	let labelElem = document.createElement('label');
	input.id = id
	input.classList.add(id)
	input.classList.add(`${id}-input`)
	labelElem.for = id
	labelElem.classList.add(id)
	labelElem.classList.add(`${id}-label`)
	labelElem.appendChild(document.createTextNode(label))
	for (let [key, val] of Object.entries(config)) {
		input.setAttribute(key, val)
	}



	return [labelElem, input]
}

function formatDateValue(date) {

	// Add leading zeros if necessary
	const pad = (number) => {
		if (number < 10) {
			return '0' + number;
		}
		return number;
	};

	const year = date.getFullYear();
	const month = pad(date.getMonth() + 1); // Months are zero indexed
	const day = pad(date.getDate());
	const hours = pad(date.getHours());
	const minutes = pad(date.getMinutes());

	// Format: "YYYY-MM-DDTHH:MM"
	return `${year}-${month}-${day}T${hours}:${minutes}`;



}

function makeNewTodoModal() {
	let inputs = []
	let [titleLabel, titleInput] = makeInput("Todo: ", "title", [], { minLength: 1, value: "New Todo", type: "text" })
	let titleSpan = document.createElement('span')
	titleSpan.appendChild(titleLabel)
	titleSpan.appendChild(titleInput)
	inputs.push(titleSpan)
	let [descriptionLabel, descriptionInput] = makeInput("Description: ", "description", [], { type: "textarea" })
	let descriptionSpan = document.createElement('span')
	descriptionSpan.appendChild(descriptionLabel)
	descriptionSpan.appendChild(descriptionInput)
	inputs.push(descriptionSpan)
	let currDate = new Date()
	let [dueDateLabel, dueDateInput] = makeInput("Due Date: ", "dueDate", [], { value: formatDateValue(currDate), min: formatDateValue(currDate), type: "datetime-local" });
	let dueDateSpan = document.createElement('span');
	dueDateSpan.appendChild(dueDateLabel);
	dueDateSpan.appendChild(dueDateInput);
	inputs.push(dueDateSpan);
	let [priorityLabel, priorityInput] = makeInput("Priority: ", "priority", [], { value: 0, type: "number", default: 0 });
	let prioritySpan = document.createElement('span')
	prioritySpan.appendChild(priorityLabel)
	prioritySpan.appendChild(priorityInput)
	inputs.push(prioritySpan)

	let form = formBuilder(inputs, () => {
		let prj = ProjectList.getCurrentProject()
		let todo = new Todo(
			titleInput.value,
			descriptionInput.value,
			new Date(dueDateInput.value),
			priorityInput.value
		)
		prj.addTodo(todo)
		renderSelectedProject()
	})
	makeModal(form, "New Todo")
}

function makeProjectRenameModal(i) {
	let projectlist = ProjectList.getInstance();
	let prj = projectlist.projects[i]
	let inputs = []
	let nameDiv = document.createElement("div")
	let input = document.createElement('input')
	input.name = "name"
	input.autocomplete = 'off';
	input.minLength = 1
	let label = document.createElement('label')
	label.appendChild(document.createTextNode("New Name"))
	label.setAttribute('for', 'name')
	nameDiv.appendChild(label);
	nameDiv.appendChild(input);
	inputs.push(nameDiv)
	let form = formBuilder(inputs, () => {
		prj.renameProject(input.value)
		renderProjects()

	})
	makeModal(form, "Rename Project")
}

function makeNewProjectModal(i) {
	let inputs = []
	let title = "New Project";

	let nameDiv = document.createElement("div")
	let input = document.createElement('input')
	input.id = "name"
	input.minLength = 1
	input.autocomplete = 'off';
	let label = document.createElement('label')
	label.appendChild(document.createTextNode("New Name:"))
	label.setAttribute('for', 'name')
	nameDiv.appendChild(label);
	nameDiv.appendChild(input);
	inputs.push(nameDiv)
	let form = formBuilder(inputs, () => {
		let project = new Project(input.value)
		ProjectList.addProject(project)
		renderProjects()
	})
	makeModal(form, title)
}


function formBuilder(childList, onSubmit) {
	let form = document.createElement('form')
	form.classList.add('modalChild');

	let button = document.createElement("button");
	let domList = document.createElement('ul')
	childList.forEach((inp) => {
		let li = document.createElement('li')
		li.appendChild(inp)
		domList.appendChild(li)
	})
	button.setAttribute("type", "submit");
	button.appendChild(document.createTextNode('Submit'))
	form.addEventListener("submit", (e) => {
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
	makeNewProjectModal,
	renderSelectedProject,
	setupAddProject
} 
