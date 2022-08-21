import Component from "./component";

export type TProps = {[key:string|symbol]: any};
export type TChildren = {[key:string|symbol]: Component};
export type TTag = 'div' | 'input' | 'a' | 'input' | 'nav' | 'main' | 'form' | 'button' | 'p';
export type PlainObject<T = any> = {
    [k in string]: T;
};
export type FormWithFile = {avatar: File};
export type User = {
	"id": number,
	"first_name": string,
	"second_name": string,
	"display_name": string|null,
	"login": string,
	"email": string,
	"phone": string,
	"avatar": string|null
};
export type InputAttributes = {
	type: string,
	id?: string,
	name?: string,
	placeholder?: string,
	autocomplete?: string|null,
	autofocus?: boolean,
	value?: string|number,
	readonly?: boolean
}
export type InputType = {
	attr?: InputAttributes
};
export type RequestOptions = {
	method?: string,
	data?: {[key: string]: string|number|boolean|number[]} | FormData,
	timeout?: number,
	retries?: number,
	headers?: {[key: string]: string}
};
export type Indexed<T = unknown> = {
	[key in string]: T;
};
type Tfile = {
	id: number,
	user_id: number,
	path: string,
	filename: string,
	content_type: string,
	content_size: number,
	upload_date: string,
};
export type Tmsg = {
	type: string,
	id: number,
	content?: string,
	user_id?: number,
	chat_id: number,
	time?: string,
	file?: Tfile,

	msgClass?: string,
	formatedTime?: string,
	theTime: Date,
	timestamp: number
};

type TchatMsgs = {
	[key in string]: Tmsg
};

export type TstoreMsgs = {
	[key in string]: TchatMsgs
};
export type ValidFunction = () => boolean;
