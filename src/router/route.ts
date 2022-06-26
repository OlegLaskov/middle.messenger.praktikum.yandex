import Component, { TProps } from "../utils/component";
import { isEqualPath } from "../utils/utils";
import {default as renderDOM} from '../utils/render';

export default class Route {
	private _pathname: string;
	private _blockClass: {new(tag: string|undefined, props: object): Component};
	private _block: Component|null;
	private _props;

	constructor(
		pathname: string, 
		view: {new(): Component}, 
		props: TProps
	) {
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
			console.log('route: render props=', this._props);
			this._block = new this._blockClass(undefined, this._props);
			renderDOM(this._props.rootQuery, this._block);
			return;
		}
		this._block.show();
	}
}