import tmpl from './inputBlock.hbs';
import Component, { TProps } from '../../utils/component';
import './inputBlock.scss';
import Input from '../input';

export default class InputBlock extends Component{
	constructor(tagName = "div", propsAndChildren: TProps = {}, defaultClass = 'form__group'){

		if(propsAndChildren.input && !(propsAndChildren.input instanceof Component)){
			console.log('InputBlock: createInput');
			propsAndChildren.input = new Input(undefined, propsAndChildren.input);
		}

		if(!propsAndChildren.events){
			propsAndChildren.events = {};
		}
		
		if(!propsAndChildren.events.focusout && propsAndChildren.valid){
			propsAndChildren.events.focusout = (e: FocusEvent)=>{
				const type = (<HTMLInputElement> e.target).type;
				type != 'file' && this.validate(e);
			};
		}
		if(!propsAndChildren.events.change && propsAndChildren.valid){
			propsAndChildren.events.change = (e: FocusEvent)=>{
				this.validate(e);
			};
		}

		super(tagName, propsAndChildren, defaultClass);
	}

	isValid: boolean;

	validate(e:FocusEvent|{target: HTMLElement}={target: this.children.input.element}){
		const {name, value} = <HTMLInputElement> e.target;
		if(name){
			const {valid} = this.props;
			if(valid){
				this.isValid = false;
				if(typeof valid !== 'function'){
					this.isValid = !!value.match(valid);
				} else {
					this.isValid = valid(this);
				}
				if(this.isValid){
					this.setProps({...this.props, classErr: ''});
				} else {
					this.setProps({...this.props, classErr: 'form__errorMsg__show'});
				}
			}
		}
		return this.isValid;
	}

	clearInput(){
		(<HTMLInputElement> this.children.input.element).value = '';
	}

	render(){
		return this.compile(tmpl, this.props);
	}
}