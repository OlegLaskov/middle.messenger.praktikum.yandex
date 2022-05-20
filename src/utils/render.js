export default function render(query, component) {
	const root = document.querySelector(query);
	if(root){
		if(typeof component === 'string'){
			root.innerHTML = component;
		} else {
			root.appendChild(component.getContent());
			component.dispatchComponentDidMount();
		}
	}
	
	return root;
}