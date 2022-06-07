import Component from "../../utils/component";
import tmpl from './form.hbs';
import './form.scss';
import InputBlock from "../inputBlock";

export default class Form extends Component {
	
	constructor(tagName = "div", propsAndChildren: {[key:string|symbol]: any} = {}, defaultClass = 'container-form'){
		
		if(!propsAndChildren.events){
			propsAndChildren.events = {};
		}
		if(!propsAndChildren.events.keyup){
			propsAndChildren.events.keyup = (e: Event)=>{
				const {name, value, tagName} = <HTMLInputElement> e.target;
				
				if(name && tagName === 'INPUT'){
					if(!this.state.form){
						this.state.form = {};
					}
					this.state.form[name] = value;
				}
			};
		}
		if(!propsAndChildren.events.click){
			propsAndChildren.events.click = (e: Event)=>{
				if(e.target && (<HTMLButtonElement> e.target).getAttribute('type') === 'submit'){
					e.preventDefault();
					const isValid = this.validate();
					const {form} = this.state;
					console.log('isValid=' + isValid, form);

					const {f_submit, resolve, reject} = this.props.request;
					if(isValid && f_submit){
						f_submit(form)
						.then(resolve)
						.catch(reject);
					}
					
				}
			};
		}
		
		super(tagName, propsAndChildren, defaultClass);
		this.state.form = {};
	}

	validate(){
		let isValid = true;
		if(this.children?.inputs?.children){
			const children = this.children.inputs.children;
			for (const child in children) {
				if(children[child] instanceof InputBlock && !(<InputBlock> children[child]).validate()){
					isValid = false
				}
			}
		}
		return isValid;
	}

	render(){
		console.log('Form render=', this.props);
		return this.compile(tmpl, this.props);
	}
}