import * as Handlebars from 'handlebars';
import List from '.';
import { TProps } from '../../utils/component';
import { connect } from '../../utils/HOC';
import { Field, FieldBlock } from '../../utils/validationConst';
import Input from '../input';
import LineInput from '../lineinput';


class InputList extends List{
	componentDidMount(){
		console.log('componentDidMount=', JSON.stringify(this.props), Object.keys(this.children));
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
		console.log('InputList DidUpdate', newFieldList && JSON.stringify((newFieldList)), newProps && newProps.user);
		
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
		console.log('InputList render=', (this.props), ', children=', this.children);
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

export default connect(InputList);