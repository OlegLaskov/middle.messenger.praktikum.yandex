type ListnerFunction = (...args: object[]) => never;

class EventBus {
	listeners: {[key: string]: ListnerFunction[]};
	constructor() {
		this.listeners = {};
	}

	on(event: string, callback: ListnerFunction) {
		if (!Object.prototype.hasOwnProperty.call(this.listeners, event)) {
			this.listeners[event] = [];
		}

		this.listeners[event].push(callback);
	}

	off(event: string, callback: ListnerFunction) {
		if (!this.listeners[event]) {
			throw new Error(`Нет события: ${event}`);
		}

		this.listeners[event] = this.listeners[event].filter(
			listener => listener !== callback
		);
	}

	emit(event: string, ...args: object[]) {
		if (!this.listeners[event]) {
			throw new Error(`Нет события: ${event}`);
		}
		
		this.listeners[event].forEach(function(listener) {
			listener(...args);
		});
	}
}

export default EventBus;