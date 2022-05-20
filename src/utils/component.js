import EventBus from './event-bus';
import Handlebars from 'handlebars';
import {v4 as makeUUID} from 'uuid';

class Component {
	static EVENTS = {
		INIT: 'init',
		FLOW_CDM: 'flow:component-did-mount',
		FLOW_CDU: 'flow:component-did-update',
		FLOW_RENDER: 'flow:render',
		SHOW: 'show',
		HIDE: 'hide',
	};

	_element = null;
	_meta = null;
	id = null;
	state = {};

	/** JSDoc
	 * @param {string} tagName
	 * @param {Object} props
	 *
	 * @returns {void}
	 */
	constructor(tagName = "div", propsAndChildren = {}, defaultClass = '') {
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
		this.id = makeUUID();
		this.props = this._makePropsProxy({ ...props, id: this.id });

		this.children = this._makePropsProxy(children);
		this.state = this._makePropsProxy(this.state);

		this.eventBus = () => eventBus;

		this._registerEvents(eventBus);
		eventBus.emit(Component.EVENTS.INIT);
	}

	_getChildren(propsAndChildren) {
		const children = {};
		const props = {};

		Object.entries(propsAndChildren).forEach(([key, value]) => {
			if (value instanceof Component) {
				children[key] = value;
			} else {
				props[key] = value;
			}
		});

		return { children, props };
	}

	_registerEvents(eventBus) {
		eventBus.on(Component.EVENTS.INIT, this.init.bind(this));
		eventBus.on(Component.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
		eventBus.on(Component.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
		eventBus.on(Component.EVENTS.FLOW_RENDER, this._render.bind(this));
		eventBus.on(Component.EVENTS.SHOW, this.show.bind(this));
		eventBus.on(Component.EVENTS.HIDE, this.hide.bind(this));
	}

	_addEvents() {
		const {events = {}} = this.props;
	
		// console.log('_addEvents', events);
		Object.keys(events).forEach(eventName => {
			this._element.addEventListener(eventName, events[eventName]);
		});
	}

	_removeEvents(){
		const {events = {}} = this.props;
		Object.keys(events).forEach(eventName=>{
			this._element.removeEventListener(eventName, events[eventName]);
		})
	}

	addAtribute(){
		const { attr = {} } = this.props;
		
		Object.entries(attr).forEach(([key, value]) => {
			key === 'readonly' && console.log({key, value});
			if(value !== false){
				this._element.setAttribute(key, value);
			}
		});
	}

	_createResources() {
		const { tagName } = this._meta;
		this._element = this._createDocumentElement(tagName);
	}

	init() {
		this._createResources();
		this.eventBus().emit(Component.EVENTS.FLOW_RENDER);
	}

	_componentDidMount() {
		this.componentDidMount();
		Object.values(this.children).forEach(child => {
			child.dispatchComponentDidMount();
		});
	}

	componentDidMount(oldProps) {}

	dispatchComponentDidMount() {
		this.eventBus().emit(Component.EVENTS.FLOW_CDM);
	}

	_componentDidUpdate(oldProps, newProps) {
		const response = this.componentDidUpdate(oldProps, newProps);
		if(response){
			this._render();
		}
	}

	componentDidUpdate(oldProps, newProps) {
		// console.log(JSON.stringify(oldProps), '-', JSON.stringify(newProps));
		const cdu = !this.compareProps(oldProps, newProps);
		console.log('componentDidUpdate', cdu);
		return cdu;
	}

	compareProps(oldProps, newProps){
		if(oldProps === newProps){
			return true;
		} else {
			if(Object.keys(oldProps).length !== Object.keys(newProps).length) return false;
			for (let prop in oldProps) {
				if (oldProps.hasOwnProperty(prop)) {
					if(oldProps[prop] !== newProps[prop]) return false;
				}
			}
			return true;
		}
	}

	setProps = nextProps => {
		if (!nextProps) {
			return;
		}
		const oldProps = {};
		Object.assign(oldProps, this.props);
		Object.assign(this.props, nextProps);
		this._componentDidUpdate(oldProps, this.props);
	};

	get element() {
		return this._element;
	}

	_render() {
		const block = this.render();

		this._removeEvents();

		this._element.innerHTML = ''; // удаляем предыдущее содержимое

		this._element.appendChild(block);

		// Добавим eventListner-ы после изменения DOM-дерева
		this._addEvents();
		this.addAtribute();
	}

	render() {}

	getContent() {
		return this.element;
	}

	_makePropsProxy(props) {

		const self = this;
		const isPrivateProp = prop => prop.startsWith('_');

		return new Proxy(props, {
			get(target, prop) {
				if (isPrivateProp(prop)) {
					console.log('get:', target, prop);
					throw new Error("Нет доступа");
				} else {
					const value = target[prop];
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

	_createDocumentElement(tagName) {
		
		return document.createElement(tagName);
	}

	show() {
		this.getContent().style.display = "block";
	}

	hide() {
		this.getContent().style.display = "none";
	}

	compile(template, props) {
		if(props == null){
			props = this.props;
		}
		const propsAndStubs = { ...props };
		Object.entries(this.children).forEach(([key, child]) => {
			propsAndStubs[key] = `<div data-id="${child.id}"></div>`
		});
		const fragment = this._createDocumentElement('template');
		fragment.innerHTML = template(propsAndStubs);

		Object.values(this.children).forEach(child => {
			const stub = fragment.content.querySelector(`[data-id="${child.id}"]`);
			if(stub){
				stub.replaceWith(child.getContent());
			}
		});
		return fragment.content;
	}
}
export default Component;