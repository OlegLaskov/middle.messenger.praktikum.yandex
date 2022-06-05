import Error from "../components/error";
import Link from "../components/link";
import { PATH } from "../router/paths";

export default class Error500 extends Error {
	constructor(){
		super(undefined, {
			title: '500',
			content: 'Мы уже фиксим',
			link: new Link('div', {href: PATH.CHAT, class1: '', label: 'Назад к чатам'})
		})
	}
}