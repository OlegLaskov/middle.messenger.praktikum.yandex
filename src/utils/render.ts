import Component from "./component";

export default function render(query: string, component: Component|string): Element|null {
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