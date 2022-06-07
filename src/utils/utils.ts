export function queryStringify(data: {[key: string]: string|number|boolean}): string {
	const arr: string[] = [];
	for (const key in data) {
		if (Object.prototype.hasOwnProperty.call(data, key)) {
			arr.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
		}
	}
	return arr.length ? '?' + arr.join('&') : '';
}
export function isEqualPath(lhs: string, rhs: string): boolean {
	return lhs === rhs;
}

type Indexed<T = unknown> = {
	[key in string]: T;
};

export function isEqual(a: object, b: object): boolean {
	if(typeof a !== 'object' || typeof b !== 'object') throw new Error('not object');
	for (const key in a as Indexed) {
		if(Object.prototype.hasOwnProperty.call(a, key) && typeof (<Indexed> a)[key] !== 'function') {
			const el = (<Indexed> a)[key];
			if(!Object.prototype.hasOwnProperty.call(b, key) || typeof el !== typeof (<Indexed> b)[key]){
				return false;
			}
			const elb = (<Indexed> b)[key];
			if(typeof el === 'object'){
				if(!isEqual((<object> el), (<object> elb))) return false;
			} else if(el !== elb){
				return false;
			}
		}
	}
	return true;
}