import Component from "../../utils/component";
import fetchWithRetry from "../../services/httpService";
import tmpl from './form.hbs';
import './form.scss';

export default class Form extends Component {
	
	constructor(tagName = "div", propsAndChildren = {}, defaultClass = 'container-form'){
		
		if(!propsAndChildren.events){
			propsAndChildren.events = {};
		}
		if(!propsAndChildren.events.keyup){
			propsAndChildren.events.keyup = (e)=>{
				const {name, value, tagName} = e.target;
				// console.log(e.target.name, e.target.value);
				if(name && tagName === 'INPUT'){
					if(!this.state.form){
						this.state.form = {};
					}
					this.state.form[name] = value;
				}
			};
		}
		if(!propsAndChildren.events.click){
			propsAndChildren.events.click = (e)=>{
				// console.log('click', e.target.name);
				if(e.target && e.target.getAttribute('type')==='submit'){
					e.preventDefault();
					const isValid = this.validation();
					const {form} = this.state;
					console.log('isValid=' + isValid, form);
					const {url, options, resolve, reject} = this.props.request;
					console.log({url, options});
					options.data = form;
					if(isValid){
						fetchWithRetry(url, options).then(resolve).catch(reject);
					}
					
				}
			};
		}
		
		super(tagName, propsAndChildren, defaultClass);
		this.state.form = {};
	}

	validation(){
		let isValid = true;
		if(this.children?.inputs?.children){
			const children = this.children.inputs.children;
			for (const child in children) {
				!children[child].validation() && (isValid = false);
			}
		}
		return isValid;
	}

	render(){
		console.log('Form render');
		return this.compile(tmpl, this.props);
	}
}