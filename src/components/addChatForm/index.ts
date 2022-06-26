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
			undefined,
			{
				attr: {type: 'text', name: 'title', placeholder: 'Добавить новый чат'}
			},
			'nav__add_chat_input'
		);
		const addChatInputBlock = new InputBlock(
			'div',
			{name: 'add_chat_input', input: addChatInput, valid: REG_EXP.NO_EMPTY, 
			fieldErrorMsg: 'Введите название чата'},
			'nav__add_chat_input_block'
		);
		const addChatBtn = new Button(
			undefined,
			{label: '+', attr: {type: 'submit'}},
			'nav__add_chat_btn'
		);
		super(
			'form',
			{
				inputs: addChatInputBlock,
				button: addChatBtn,
				request: {
					f_submit: chatApi.create,
					resolve: (resp: string)=>{
						console.log('resp='+typeof resp, resp);
						updateChatList();
					},
					reject: (err: Error)=>{
						console.log('err='+typeof err, err);
					}
				}
			},
			'nav__block nav__add_chat'
		)
	}

	render(){
		// console.log('AddChatForm render=', this.props);
		return this.compile(tmpl, this.props);
	}
}