import chatApi from "../../api/chat-api";
import { REG_EXP } from "../../utils/validationConst";
import Button from "../button";
import Form from "../form";
import Input from "../input";
import InputBlock from "../inputBlock";
import tmpl from './addChatForm.hbs';
import './addChatForm.scss';

export default class AddChatForm extends Form {

	constructor(updateChatList: ()=>void){
		const addChatInput = new Input(
			{
				attr: {type: 'text', name: 'title', placeholder: 'Добавить новый чат'}
			},
			undefined,
			'nav__add_chat_input'
		);
		const addChatInputBlock = new InputBlock(
			{name: 'add_chat_input', input: addChatInput, valid: REG_EXP.NO_EMPTY, 
			fieldErrorMsg: 'Введите название чата'},
			'div',
			'nav__add_chat_input_block'
		);
		const addChatBtn = new Button(
			{label: '+', attr: {type: 'submit'}},
			undefined,
			'nav__add_chat_btn'
		);
		super(
			{
				inputs: addChatInputBlock,
				button: addChatBtn,
				request: {
					f_submit: chatApi.create,
					resolve: ()=>{
						updateChatList();
					},
					reject: (err: Error)=>{
						console.log('err='+typeof err, err);
					}
				}
			},
			'form',
			'nav__block nav__add_chat'
		)
	}

	render(){
		return this.compile(tmpl, this.props);
	}
}