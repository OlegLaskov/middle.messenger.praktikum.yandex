import tmpl from './inputBlock.hbs';
import Component from '../../core/component';
import './inputBlock.scss';
import Input from '../input';
import { TProps, TTag } from '../../core/types';

export default class InputBlock extends Component{
	constructor(propsAndChildren: TProps = {}, tagName: TTag = "div", defaultClass = 'form__group'){

		if(propsAndChildren.input && !(propsAndChildren.input instanceof Component)){
			propsAndChildren.input = new Input(propsAndChildren.input);
		}

		if(!propsAndChildren.events){
			propsAndChildren.events = {};
		}
		
		if(!propsAndChildren.events.focusout && propsAndChildren.validationRegexpOrFunc){
			propsAndChildren.events.focusout = (e: FocusEvent)=>{
				const type = (<HTMLInputElement> e.target).type;
				type != 'file' && this.validate(e);
			};
		}
		if(!propsAndChildren.events.change && propsAndChildren.validationRegexpOrFunc){
			propsAndChildren.events.change = (e: FocusEvent)=>{
				this.validate(e);
			};
		}

		super(propsAndChildren, tagName, defaultClass);
	}

	isValid: boolean;

	validate(e:FocusEvent|{target: HTMLElement}={target: this.children.input.element}){
		const {name, value} = <HTMLInputElement> e.target;
		if(name){
			const {validationRegexpOrFunc} = this.props;
			if(validationRegexpOrFunc){
				this.isValid = false;
				if(typeof validationRegexpOrFunc !== 'function'){
					this.isValid = !!value.match(validationRegexpOrFunc);
				} else {
					this.isValid = validationRegexpOrFunc(this);
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