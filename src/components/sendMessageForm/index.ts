import { REG_EXP } from "../../utils/validationConst";
import webSocketTransport from "../../core/webSocketTransport";
import Button from "../button";
import Form from "../form";
import Input from "../input";
import InputBlock from "../inputBlock";
import tmpl from './sendMessageForm.hbs';
import './sendMessageForm.scss';

export default class SendMessageForm extends Form {

	constructor(){
		const attachFile = new Button(
			{attr: {type: 'button'}, icon: 'fa-solid fa-paperclip'},
			undefined, 
			'send-message__attach_btn'
		)
		const sendMessageInput = new Input(
			{
				attr: {type: 'text', name: 'content', placeholder: 'Введите сообщение', autocomplete: 'off'}
			},
			undefined,
			'send-message__input'
		);
		const sendMessageInputBlock = new InputBlock(
			{name: 'add_chat_input', input: sendMessageInput, valid: REG_EXP.NO_EMPTY, 
			fieldErrorMsg: ''},
			'div',
			'send-message__block'
		);
		const sendMessageBtn = new Button(
			{attr: {type: 'submit'}, icon: 'fa-solid fa-circle-arrow-right'},
			undefined,
			'send-message__button'
		);
		super(
			{
				attachFile,
				inputs: sendMessageInputBlock,
				button: sendMessageBtn,
				events: {submit: (e: Event)=>{
					e.preventDefault();
	
					const isValid = this.validate();
					const {form} = this.state;
	
					if(isValid){
						webSocketTransport.sendMessage(form);
						this.clearForm();
					}
				}}
			},
			'form',
			'send-message'
		)
	}

	validate(){
		let isValid = true;
		if(this.children){
			const children = this.children;
			for (const child in children) {
				if(children[child] instanceof InputBlock && !(<InputBlock> children[child]).validate()){
					isValid = false;
				}
			}
		}
		return isValid;
	}

	clearForm(){
		(<InputBlock> this.children.inputs).clearInput();
	}

	render(){
		return this.compile(tmpl, this.props);
	}
}