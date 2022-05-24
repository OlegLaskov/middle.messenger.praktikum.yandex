import Component from "../utils/component";
import { isEqualPath } from "../utils/utils";
import {default as renderDOM} from '../utils/render';

export default class Route {
	private _pathname: string;
	private _blockClass: {new(): Component};
	private _block: Component|null;
	private _props;

	constructor(pathname: string, view: {new(): Component}, props: {[key:string|symbol]: any}) {
		this._pathname = pathname;
		this._blockClass = view;
		this._block = null;
		this._props = props;
	}

	navigate(pathname: string): void {
		if (this.match(pathname)) {
			this._pathname = pathname;
			this.render();
		}
	}

	leave(): void {
		if(this._block){
			this._block.hide();
		}
	}

	match(pathname: string): boolean {
		return isEqualPath(pathname, this._pathname);
	}

	render(): void {
		if(!this._block){
			this._block = new this._blockClass();
			renderDOM(this._props.rootQuery, this._block);
			return;
		}
		this._block.show();
	}
}