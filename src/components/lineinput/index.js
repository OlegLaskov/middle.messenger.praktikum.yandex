/* import Handlebars from 'handlebars';
import tmpl from './lineinput.hbs';
import './lineinput.scss';

Handlebars.registerPartial('lineinput', tmpl);

export default ({field, value, type, name, placeholder, class1, class2, class3}) => 
	{return tmpl({field, value, type, name, placeholder, class1, class2, class3})}; */

import tmpl from './lineinput.hbs';
import Component from '../../utils/component';
import './lineinput.scss';

export default class LineInput extends Component{
	constructor(tagName = "div", propsAndChildren = {}, defaultClass = 'form__group'){

		if(!propsAndChildren.events){
			propsAndChildren.events = {};
		}
		if(!propsAndChildren.events.focusout && propsAndChildren.valid){
			propsAndChildren.events.focusout = (e)=>{
				this.eventBus().emit('validation', e);
			};
		}

		super(tagName, propsAndChildren, defaultClass);
		this.eventBus().on('validation', this.validation.bind(this));
	}
	validation(e={target: this.children.input._element}){
		const {name, value} = e.target;
		if(name){
			const {valid} = this.props;
			this.isValid = null;
			
			if(valid){
				
				if(typeof valid !== 'function'){
					this.isValid = !!value.match(valid);
				} else {
					this.isValid = valid(this);
				}
				if(this.isValid){
					this.props.classErr = '';
				} else {
					this.props.classErr = 'form__errorMsg__show';
				}
			}
		}
		return this.isValid;
	}
	render(){
		console.log('InputBlock render');
		return this.compile(tmpl, this.props);
	}
}