import Component from "./component";

export const REG_EXP = {
	NAME: /^[A-ZА-Я]{1}[A-ZА-Яa-zа-я-]{2,}$/,
	LOGIN: /^(?=.*?[A-Za-z_-])([A-Za-z0-9_-]){3,20}$/,
	EMAIL: /^[A-Za-z0-9_-]+[A-Za-z0-9._-]*@[A-Za-z0-9_-]+\.[A-Za-z0-9._-]*$/,
	PHONE: /^\+*(?!(?:.* ){4})(?!.* {2})(?:[ ]*\d){10,15}[-]*$/,
	PASSWORD: /^(?=.*?[A-ZА-Я])(?=.*?[0-9])(.){8,40}$/,
	DISPLAY_NAME: /^[A-ZА-Я]{1}[A-ZА-Яa-zа-я-]{2,}( ["|(]?[A-ZА-Я]{1}[A-ZА-Яa-zа-я-]{2,}["|)]?){0,2}$/,
};

export const ERROR_MSG = {
	NAME: 'первая буква должна быть заглавной, без пробелов и без цифр',
	LOGIN: 'от 3 до 20 символов, латиница, может содержать цифры, но не состоять из них'
		+', без пробелов, без спецсимволов',
	EMAIL: 'Неверный email',
	PHONE: 'от 10 до 15 символов, состоит из цифр, может начинается с плюса, не более 3 пробелов',
	PASSWORD: 'от 8 до 40 символов, обязательно хотя бы одна заглавная буква и цифра',
	CONFIRM_PASSWORD: 'Не совпадает с паролем',
	CONFIRM_NEW_PASSWORD: 'Не совпадает с новым паролем',
	DISPLAY_NAME: 'Допустимы 3 имени через пробел (Имя Отчество Фамилия)'
};

type ValidFunction = () => boolean;

export interface Field {
	type: string,
	name: string,
	value?: string,
	label?: string|null,
	valid?: ValidFunction|RegExp,
	errorMsg?: string|null,
	autocomplete?: string|null,
}

export interface FieldBlock {
	input: Component,
	label?: string|null,
	valid?: ValidFunction|RegExp,
	fieldErrorMsg?: string|null,
}