import chatApi from "../../api/chat-api";
import { REG_EXP } from "../../utils/validationConst";
import Button from "../button";
import Form from "../form";
import Input from "../input";
import InputBlock from "../inputBlock";
import tmpl from './sendMessageForm.hbs';
import './sendMessageForm.scss';

export default class SendMessageForm extends Form {

	constructor(){
		const attachFile = new Button(
			undefined, 
			{attr: {type: 'button'}, icon: 'fa-solid fa-paperclip'},
			'send_message__attach_btn'
		)
		const sendMessageInput = new Input(
			undefined,
			{
				attr: {type: 'text', name: 'content', placeholder: 'Введите сообщение', autocomplete: 'off'}
			},
			'send_message__input'
		);
		const sendMessageInputBlock = new InputBlock(
			'div',
			{name: 'add_chat_input', input: sendMessageInput, valid: REG_EXP.NO_EMPTY, 
			fieldErrorMsg: ''},
			'send_message__block'
		);
		const sendMessageBtn = new Button(
			undefined,
			{attr: {type: 'submit'}, icon: 'fa-solid fa-circle-arrow-right'},
			'send_message__button'
		);
		super(
			'form',
			{
				attachFile,
				inputs: sendMessageInputBlock,
				button: sendMessageBtn,
				events: {submit: (e: Event)=>{
					e.preventDefault();
	
					const isValid = this.validate();
					const {form} = this.state;
					console.log('SendMessageForm: isValid=' + isValid, form);
	
					if(isValid){
						chatApi.sendMessage(form);
						this.clearForm();
					}
				}}
			},
			'send_message'
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
		console.log('SendMessageForm render=', this.props, 'children=', this.children);
		return this.compile(tmpl, this.props);
	}
}