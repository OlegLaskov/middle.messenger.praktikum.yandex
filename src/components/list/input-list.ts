import * as Handlebars from 'handlebars';
import List from '.';
import { isEqual } from '../../utils/utils';
import { Field, FieldBlock } from '../../utils/validationConst';
import Input from '../input';
import LineInput from '../lineinput';

export default class InputList extends List{
	componentDidMount(){
		console.log('componentDidMount=', JSON.stringify(this.props), Object.keys(this.children));
		if(this.props.children && Object.keys(this.props.children).length){
			const {children, readonly} = this.props;
			const newChildren: {[key:string|symbol]: any} = {};
			for (const key in children) {
				if (Object.prototype.hasOwnProperty.call(children, key)) {
					const field = children[key];
					newChildren[key] = createInputElement(field, readonly);
				}
			}
			this.setProps({...this.props, ...newChildren});
			// this.render();
		}
	}

	componentDidUpdate(oldProps: {[key:string|symbol]: any}, newProps: {[key:string|symbol]: any}): boolean {
		let res = false;
		const oldFieldList = oldProps.children;
		const newFieldList = newProps.children;
		// console.log('InputList componentDidUpdate', newFieldList && JSON.stringify(Object.keys(newFieldList)));
		console.log('InputList DidUpdate', newFieldList && JSON.stringify((newFieldList)), newProps && newProps.user);
		
		res = !this.compareProps(oldProps, newProps);
		!res && (res = !this.compareProps(oldFieldList, newFieldList));
		if(res){
			const newChildren: {[key:string|symbol]: any} = {};
			for (const key in newFieldList) {
				if (Object.prototype.hasOwnProperty.call(newFieldList, key)) {
					const field = newFieldList[key];
					if(!this.children[key] || !isEqual(field, oldFieldList[key])){
						res = true;
						newChildren[key] = createInputElement(field, newProps.readonly);
					} else {
						newChildren[key] = this.children[key];
					}
				}
			}
			this.children = newChildren;
		}
		console.log('InputList componentDidUpdate=', res);
		return res;
	}
	render(){
		console.log('InputList render=', Object.keys(this.props), ', children=', this.children);
		let tmpl = '';
		if(this.children && Object.keys(this.children).length){
			Object.keys(this.children).forEach(key => {
				tmpl += `{{{ ${key} }}}`;
			});
		}
		return this.compile(Handlebars.compile(tmpl), this.props);
	}
}

function createInputElement({type, label, name, valid, errorMsg, value, autocomplete, autofocus}: Field, 
	readonly: boolean){

	const input = new Input(
		'input', 
		{attr: {type, id: name, name, value, readonly, autocomplete, autofocus}},
		'form__input input__right'
		);
	const lineinput: FieldBlock = {label, input};
	
	if(!readonly){
		lineinput.valid = valid; 
		lineinput.fieldErrorMsg =  errorMsg;
	}
	return new LineInput('div', lineinput);
}