import tmpl from './inputBlock.hbs';
import Component from '../../utils/component';
import './inputBlock.scss';

export default class InputBlock extends Component{
	constructor(tagName = "div", propsAndChildren: {[key:string|symbol]: any} = {}, defaultClass = 'form__group'){

		if(!propsAndChildren.events){
			propsAndChildren.events = {};
		}
		if(!propsAndChildren.events.focusout && propsAndChildren.valid){
			propsAndChildren.events.focusout = (e: FocusEvent)=>{
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
	render(){
		console.log('InputBlock render=', this.props);
		return this.compile(tmpl, this.props);
	}
}