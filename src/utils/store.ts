import EventBus from "./event-bus";

export enum StoreEvents {
	Updated = 'updated',
}

export type Indexed<T = unknown> = {
	[key in string]: T;
};

function set(object: Indexed | unknown, path: string, value: unknown): Indexed | unknown {
	if(typeof object !== 'object') return object;
	if(typeof path !== 'string') throw new Error('path must be string');

	const result = path.split('.').reduceRight<Indexed>((acc, key) => ({
		[key]: acc,
	}), value as any);
	return merge(object as Indexed, result);
}

function merge(lhs: Indexed, rhs: Indexed): Indexed {
	for (const key in rhs) {
		if (Object.prototype.hasOwnProperty.call(rhs, key)) {
			const el = rhs[key];
			if(!Object.prototype.hasOwnProperty.call(lhs, key) || typeof lhs[key] !== 'object' 
				|| typeof rhs[key] !== 'object'){
					lhs[key] = el;
			} else {
				merge((<Indexed> lhs[key]), (<Indexed> el));
			}
		}
	}
	return lhs;
}

class Store extends EventBus {
	private state: Indexed = {};

	public getState() {
		return this.state;
	}

	public set(path: string, value: unknown) {
		set(this.state, path, value);
		this.emit(StoreEvents.Updated);
		// console.log('state=', this.state);
		
	}
}

export default new Store();