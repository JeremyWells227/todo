import {Todo} from "./todo.js"

function initDefaultProject() {
	// Initialize the singleton
	ProjectList.getInstance()
	let project = new Project('Default');
	let todo = new Todo ( 
		"Learn to webdev",
		"Complete odin project",
		new Date("2024-12-25"),
		0
	)
	project.addTodo(todo);
	ProjectList.addProject(project);
	ProjectList.setCurrentProject(0);
}


let ProjectList = (function() {
	let instance;

	function createProjectList() {
		let list = new Object();
		list.projects = []
		list.curr_project = null
		return list
	}


	return {
		getInstance: function() {
			if (!instance) {
				instance = createProjectList()
			}
			return instance
		},
		clearData: function(){
			instance = null;
		},
		addProject: function(prj) {
			instance.projects.push(prj)
		},
		removeProject: function(i) {
			instance.projects.splice(i, 1)
		},
		getCurrentProject: function(){
			if (this.getInstance().curr_project!==null)
				return this.getInstance().projects[instance.curr_project];
			else
				return false
		},
		setCurrentProject: function(i){
			this.getInstance().curr_project = i
		},
		importFromJson: function(json){
			let data = JSON.parse(json)
			instance = this.getInstance()
			for (let prjObj of data.projects) {
				let prj = new Project(prjObj.name)
				for (let todoObj of prjObj.todos){
					let todo = new Todo(
						todoObj.title,
						todoObj.description,
						new Date(todoObj.dueDate),
						todoObj.priority,
					)
					todo.state = todoObj.state
					todo.expanded = todoObj.expanded
					prj.addTodo(todo)
				}
				this.addProject(prj)
			}
			instance.curr_project = data['curr_project'];


		}

	}
})()



class Project {
	constructor(name) {
		this.name = name
		this.todos = []
	}

	addTodo(todo) {
		this.todos.push(todo)
	}
	removeTodo(i) {
		this.todos.splice(i, 1)
	}
	renameProject(name){
		this.name = name
	}
}


export {
	Project,
	ProjectList,
	initDefaultProject,
}
