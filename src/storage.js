
import {ProjectList, Project,initDefaultProject} from './project.js';
import {Todo} from './todo.js';

function saveState(){
	let projlist = ProjectList.getInstance()
	localStorage.setItem("projects",JSON.stringify(projlist))
}

function loadState(){
	let prjlist = localStorage.getItem('projects')
	ProjectList.importFromJson(prjlist)

}

function clearStorage(){
	localStorage.clear()
	ProjectList.clearData()
	initDefaultProject()
}

export {saveState, loadState,clearStorage}
