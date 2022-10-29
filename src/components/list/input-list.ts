import * as Handlebars from 'handlebars';
import List from '.';
import { connect } from '../../core/HOC';
import { Field, FieldBlock, TProps } from '../../core/types';
import Input from '../input';
import LineInput from '../lineinput';


class InputList extends List{
	componentDidMount(){
		if(this.props.children && Object.keys(this.props.children).length){
			const {children, readonly} = this.props;
			const newChildren: TProps = {};
			for (const key in children) {
				if (Object.prototype.hasOwnProperty.call(children, key)) {
					const field = children[key];
					newChildren[key] = createInputElement(field, readonly);
				}
			}
			this.setProps({...this.props, ...newChildren});
		}
	}

	componentDidUpdate(oldProps: TProps, newProps: TProps): boolean {
		let res = false;
		const oldFieldList = oldProps.children;
		const newFieldList = newProps.children;
		
		res = !this.compareProps(oldProps, newProps);
		!res && (res = !this.compareProps(oldFieldList, newFieldList));
		if(res){
			const newChildren: TProps = {};
			for (const key in newFieldList) {
				if (Object.prototype.hasOwnProperty.call(newFieldList, key)) {
					
					const field = newFieldList[key];
					if(newProps && newProps.user && newProps.user[key]){
						field.value = newProps.user[key];
					}
					newChildren[key] = createInputElement(field, newProps.readonly);
				}
			}
			this.children = newChildren;
		}
		return res;
	}
	render(){
		let tmpl = '';
		if(this.children && Object.keys(this.children).length){
			Object.keys(this.children).forEach(key => {
				tmpl += `{{{ ${key} }}}`;
			});
		}
		return this.compile(Handlebars.compile(tmpl), this.props);
	}
}

function createInputElement({type, label, name, validationRegexpOrFunc, errorMsg, 
	value, autocomplete, autofocus}: Field, readonly: boolean){

	const input = new Input(
		{attr: {type, id: name, name, value, readonly, autocomplete, autofocus}},
		'input', 
		'form__input form__input__right'
		);
	const lineInput: FieldBlock = {label, input};
	
	if(!readonly){
		lineInput.validationRegexpOrFunc = validationRegexpOrFunc; 
		lineInput.fieldErrorMsg =  errorMsg;
	}
	return new LineInput(lineInput, 'div');
}

export default connect(InputList);