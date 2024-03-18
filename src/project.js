


let ProjectList = (function() {
	let instance;

	function createProjectList() {
		let list = new Object();
		list.projects = []
		return list
	}

	return {
		getInstance: function() {
			if (!instance) {
				instance = createProjectList()
			}
			return instance
		},
		addProject: function(prj) {
			instance.projects.push(prj)
		},
		removeProject: function(i) {
			instance.projects.splice(i, 1)
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
}
