


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
		this.state = this.constructor.OPEN;
		this.expanded = false;
	}


	setPriority(i){
		this.priority = i
	}

	setTitle(s){
		this.title = s
	}

	toggleExpanded() {
		this.expanded=!this.expanded;
	}



	static OPEN = "OPEN";
	static SCHED = "SCHEDULED";
	static DONE = "DONE";


}

export {
	Todo
}
