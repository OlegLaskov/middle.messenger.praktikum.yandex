import Component, { TProps } from "../../utils/component";
import tmpl from './form.hbs';
import './form.scss';
import InputBlock from "../inputBlock";

export default class Form extends Component {
	
	constructor(tagName = "div", propsAndChildren: TProps = {}, defaultClass = 'container-form'){
		
		if(!propsAndChildren.events){
			propsAndChildren.events = {};
		}
		if(!propsAndChildren.events.submit){
			propsAndChildren.events.submit = (e: Event)=>{
				e.preventDefault();

				const isValid = this.validate();
				const {form} = this.state;
				console.log('form: isValid=' + isValid, form);

				const {f_submit, resolve, reject} = this.props.request;
				if(isValid && f_submit){
					f_submit(form)
					.then(resolve)
					.catch(reject);
				}
			}
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
		
		super(tagName, propsAndChildren, defaultClass);
		this.state.form = {};
	}

	validate(){
		let isValid = true;
		if(this.children?.inputs?.children){
			const children = this.children.inputs.children;
			for (const child in children) {
				if(children[child] instanceof InputBlock && !(<InputBlock> children[child]).validate()){
					isValid = false;
				}
			}
		}
		return isValid;
	}

	clearForm(){
		const inputs = this.children.inputs.children;
		for(const i in inputs){
			if(inputs[i] instanceof InputBlock){
				(<InputBlock> inputs[i]).clearInput();
			}
		}
	}

	render(){
		console.log('Form render=', this.props, 'children=', this.children);
		return this.compile(tmpl, this.props);
	}
}