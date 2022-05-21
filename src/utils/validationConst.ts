import Component from "./component";

export const regExp = {
	name: /^[A-ZА-Я]{1}[A-ZА-Яa-zа-я-]{2,}$/,
	login: /^(?=.*?[A-Za-z_-])([A-Za-z0-9_-]){3,20}$/,
	email: /^[A-Za-z0-9_-]+[A-Za-z0-9._-]*@[A-Za-z0-9_-]+\.[A-Za-z0-9._-]*$/,
	phone: /^\+*(?!(?:.* ){4})(?!.*  )(?:[ ]*\d){10,15}[-]*$/,
	password: /^(?=.*?[A-ZА-Я])(?=.*?[0-9])(.){8,40}$/,
	display_name: /^[A-ZА-Я]{1}[A-ZА-Яa-zа-я-]{2,}( ["|(]?[A-ZА-Я]{1}[A-ZА-Яa-zа-я-]{2,}["|)]?){0,2}$/,
};

export const errorMsg = {
	name: 'первая буква должна быть заглавной, без пробелов и без цифр',
	login: 'от 3 до 20 символов, латиница, может содержать цифры, но не состоять из них, без пробелов, без спецсимволов',
	email: 'Неверный email',
	phone: 'от 10 до 15 символов, состоит из цифр, может начинается с плюса, не более 3 пробелов',
	password: 'от 8 до 40 символов, обязательно хотя бы одна заглавная буква и цифра',
	confirm_password: 'Не совпадает с паролем',
	display_name: 'Допустимы 3 имени через пробел (Имя Отчество Фамилия)'
};

export interface Field {
	type: string,
	name: string,
	value?: string,
	label?: string|null,
	valid?: Function|RegExp,
	errorMsg?: string|null,
	autocomplete?: string|null,
};

export interface FieldBlock {
	input: Component,
	label?: string|null,
	valid?: Function|RegExp,
	fieldErrorMsg?: string|null,
}