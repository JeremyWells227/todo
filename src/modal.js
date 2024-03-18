
function makeModal(modalChild) {
	let wrapper = document.createElement("div")
	wrapper.id= "modal-wrapper"

	let overlay = document.createElement("div")
	overlay.classList.add('overlay')
	wrapper.appendChild(overlay)
	let modal = document.createElement("div") 
	modal.classList.add('modal')
	modal.appendChild(modalChild)
	wrapper.appendChild(modal)
	document.body.appendChild(wrapper)
}

function closeModal(){
	let modalcontainer = document.getElementById("modal-wrapper")
	document.body.removeChild(modalcontainer)
}


export {
	makeModal,
	closeModal
}
