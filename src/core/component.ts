import EventBus from './event-bus';
import {v4 as makeUUID} from 'uuid';
import { isEqual } from '../utils/utils';
import { TChildren, TProps, TTag } from './types';

class Component {
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
	props: TProps;
	children: {[key:string]: Component};
	eventBus: ()=>EventBus;
	isShow = true;
	state: TProps = {};

	constructor(propsAndChildren: TProps = {}, tagName: TTag = 'div', defaultClass = '') {
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

	private _getChildren(propsAndChildren: TProps): {children: TChildren, props: TProps} {
		const children: {[key:string|symbol]: Component} = {};
		const props: TProps = {};

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

	private _componentDidUpdate(oldProps: TProps, newProps: TProps): void {
		const response = this.componentDidUpdate(oldProps, newProps);
		if(response){
			this._render();
		}
	}

	componentDidUpdate(oldProps: TProps, newProps: TProps): boolean {
		return !this.compareProps(oldProps, newProps);
	}

	compareProps(oldProps: TProps, newProps: TProps): boolean {
		return isEqual(oldProps, newProps);
	}

	setProps = (nextProps: TProps): void => {
		if (!nextProps) {
			return;
		}
		const oldProps: TProps = Object.assign({}, this.props);
		
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

	render(): DocumentFragment {
		return new DocumentFragment();
	}

	getContent(): HTMLElement {
		return this.element;
	}

	private _makePropsProxy(props: TProps): TProps {

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
			deleteProperty(target, prop) {
				if (isPrivateProp(prop)) {
					console.log('Error: isPrivateProp', target, prop);
					throw new Error("Нет доступа");
				} else {
					delete target[prop];
					return true;
				}
			}
		});
	}

	private _createDocumentElement(tagName: string): HTMLElement {
		
		return document.createElement(tagName);
	}

	show(): void {
		this.getContent().style.display = "block";
		this.isShow = true;
	}

	hide(): void {
		this.getContent().style.display = "none";
		this.isShow = false;
	}

	compile(template: (context: any, options?: any)=>string, props?: TProps): DocumentFragment {
		if(props == null){
			props = this.props;
		}
		const propsAndStubs: TProps = { ...props };
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