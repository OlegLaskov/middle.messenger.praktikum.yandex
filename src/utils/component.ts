import EventBus from './event-bus';
import {v4 as makeUUID} from 'uuid';
import { isEqual } from './utils';

abstract class Component {
	static EVENTS = {
		INIT: 'init',
		FLOW_CDM: 'flow:component-did-mount',
		FLOW_CDU: 'flow:component-did-update',
		FLOW_RENDER: 'flow:render',
		SHOW: 'show',
		HIDE: 'hide',
	};

	private _element: HTMLElement;
	private _meta: {tagName: string, props: object};
	uid: string;
	props: {[key:string|symbol]: any};
	children: {[key:string]: Component};
	eventBus: ()=>EventBus;
	state: {[key:string|symbol]: any} = {};

	constructor(tagName = 'div', propsAndChildren: {[key:string|symbol]: any} = {}, defaultClass = '') {
		const { children, props } = this._getChildren(propsAndChildren);
		
		const { attr = {} } = props;
		if(defaultClass){
			if(!attr.class){
				attr.class = defaultClass;
			} else if(!attr.class.includes(defaultClass)) {
				attr.class += ` ${defaultClass}`;
			}
			props.attr = attr;
		}
		
		const eventBus = new EventBus();

		this._meta = {
			tagName,
			props
		};

		// Генерируем уникальный UUID V4
		this.uid = makeUUID();
		this.props = this._makePropsProxy({ ...props, uid: this.uid });

		this.children = this._makePropsProxy(children);
		this.state = this._makePropsProxy(this.state);

		this.eventBus = () => eventBus;

		this._registerEvents(eventBus);
		eventBus.emit(Component.EVENTS.INIT);
	}

	private _getChildren(propsAndChildren: {[key:string|symbol]: any}): {
		children: {[key: string|symbol]: Component}, props: {[key: string|symbol]: any}
	} {
		const children: {[key:string|symbol]: Component} = {};
		const props: {[key:string|symbol]: any} = {};

		Object.entries(propsAndChildren).forEach(([key, value]: [string, any]) => {
			if (value instanceof Component) {
				children[key] = value;
			} else {
				props[key] = value;
			}
		});

		return { children, props };
	}

	private _registerEvents(eventBus: EventBus): void {
		eventBus.on(Component.EVENTS.INIT, this.init.bind(this));
		eventBus.on(Component.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
		eventBus.on(Component.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
		eventBus.on(Component.EVENTS.FLOW_RENDER, this._render.bind(this));
		eventBus.on(Component.EVENTS.SHOW, this.show.bind(this));
		eventBus.on(Component.EVENTS.HIDE, this.hide.bind(this));
	}

	private _addEvents(): void {
		const {events = {}} = this.props;
	
		Object.keys(events).forEach(eventName => {
			this._element.addEventListener(eventName, events[eventName]);
		});
	}

	private _removeEvents(): void {
		const {events = {}} = this.props;
		Object.keys(events).forEach(eventName=>{
			this._element.removeEventListener(eventName, events[eventName]);
		})
	}

	addAtribute():void {
		const { attr = {} } = this.props;
		
		Object.entries(attr).forEach(([key, value]: [string, any]) => {
			if(value !== false){
				this._element.setAttribute(key, value);
			}
		});
	}

	private _createResources(): void {
		const { tagName } = this._meta;
		this._element = this._createDocumentElement(tagName);
	}

	init(): void {
		this._createResources();
		this.eventBus().emit(Component.EVENTS.FLOW_RENDER);
	}

	private _componentDidMount(): void {
		this.componentDidMount();
		Object.values(this.children).forEach(child => {
			child.dispatchComponentDidMount();
		});
	}

	componentDidMount(): void {} // eslint-disable-line

	dispatchComponentDidMount(): void {
		this.eventBus().emit(Component.EVENTS.FLOW_CDM);
	}

	private _componentDidUpdate(oldProps: {[key:string|symbol]: any}, newProps: {[key:string|symbol]: any}): void {
		const response = this.componentDidUpdate(oldProps, newProps);
		console.log('_componentDidUpdate', response, oldProps, newProps);
		if(response){
			this._render();
		}
	}

	componentDidUpdate(oldProps: {[key:string|symbol]: any}, newProps: {[key:string|symbol]: any}): boolean {
		return !this.compareProps(oldProps, newProps);
	}

	compareProps(oldProps: any, newProps: any): boolean {
		if(oldProps === newProps){
			return true;
		} else {
			if(!oldProps || !newProps || typeof oldProps !== 'object' || typeof newProps !== 'object') return false;
			if(Object.keys(oldProps).length !== Object.keys(newProps).length) return false;
			for (const prop in oldProps) {
				if (Object.prototype.hasOwnProperty.call(oldProps, prop)) {
					if(oldProps[prop] !== newProps[prop]) return false;
				}
			}
			return true;
		}
		// return isEqual(oldProps, newProps);
	}

	setProps = (nextProps: object): void => {
		if (!nextProps) {
			return;
		}
		const oldProps: {[key:string|symbol]: any} = {};

		Object.assign(oldProps, this.props);
		
		this.props = this._makePropsProxy({ ...nextProps, uid: this.uid });
		this._componentDidUpdate(oldProps, this.props);
	};

	get element() {
		return this._element;
	}

	private _render(): void {
		const block = this.render();

		this._removeEvents();

		this._element.innerHTML = ''; // удаляем предыдущее содержимое

		this._element.appendChild(block);

		// Добавим eventListner-ы после изменения DOM-дерева
		this._addEvents();
		this.addAtribute();
	}

	abstract render(): DocumentFragment;

	getContent(): HTMLElement {
		return this.element;
	}

	private _makePropsProxy(props: {[key:string|symbol]: any}): {[key:string|symbol]: any} {

		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const self = this;
		const isPrivateProp = (prop: string|symbol) => (typeof prop === 'string' && prop.startsWith('_'));

		return new Proxy(props, {
			get(target, prop) {
				if (isPrivateProp(prop)) {
					console.log('Error: isPrivateProp', target, prop);
					throw new Error("Нет доступа");
				} else {
					const value: any = target[prop];
					return typeof value === 'function' ? value.bind(target) : value;
				}
			},
			set(target, prop, value){
				if(isPrivateProp(prop)){
					throw new Error('Нет доступа');
				}
				const oldTarget = {...target};
				target[prop] = value;
				
				// Запускаем обновление компонента
				self.eventBus().emit(Component.EVENTS.FLOW_CDU, oldTarget, target);
				return true;
			},
			deleteProperty() {
				throw new Error("Нет доступа");
			}
		});
	}

	private _createDocumentElement(tagName: string): HTMLElement {
		
		return document.createElement(tagName);
	}

	show(): void {
		this.getContent().style.display = "block";
	}

	hide(): void {
		this.getContent().style.display = "none";
	}

	compile(template: (context: any, options?: any)=>string, props?: {[key:string|symbol]: any}): DocumentFragment {
		if(props == null){
			props = this.props;
		}
		const propsAndStubs: {[key:string|symbol]: any} = { ...props };
		Object.entries(this.children).forEach(([key, child]) => {
			propsAndStubs[key] = `<div data-id="${child.uid}"></div>`
		});
		const fragment: HTMLTemplateElement = <HTMLTemplateElement> this._createDocumentElement('template');
		fragment.innerHTML = template(propsAndStubs);

		Object.values(this.children).forEach(child => {
			const stub = fragment.content.querySelector(`[data-id="${child.uid}"]`);
			if(stub){
				stub.replaceWith(child.getContent());
			}
		});
		return fragment.content;
	}
}
export default Component;