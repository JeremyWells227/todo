


class Todo {
	constructor(
		title,
		description,
		dueDate,
		priority
	) {
		this.title = title;
		this.description = description;
		this.dueDate = dueDate;
		this.priority = priority;
		this.state = Todo.OPEN
	}


	setPriority(i){
		this.priority = i
	}

	setTitle(s){
		this.title = s
	}



	static {
		const OPEN = "OPEN";
		const SCHED = "SCHEDULED"
		const DONE = "DONE"
	}


}

export {
	Todo
}
