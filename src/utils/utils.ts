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
	// console.log('isEqual 0', typeof a, typeof b);
	
	if(typeof a !== 'object' || typeof b !== 'object') throw new Error('not object');
	if(Array.isArray(b)){
		if(!Array.isArray(a) || a.length !== b.length){
			return false;
		}
	}
	for (const key in a as Indexed) {
		if(Object.prototype.hasOwnProperty.call(a, key) && typeof (<Indexed> a)[key] !== 'function') {
			// console.log('isEqual key=', key, a[key]);
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

export type PlainObject<T = any> = {
    [k in string]: T;
};

function isPlainObject(value: unknown): value is PlainObject {
    return typeof value === 'object'
        && value !== null
        && value.constructor === Object
        && Object.prototype.toString.call(value) === '[object Object]';
}

function isArray(value: unknown): value is [] {
    return Array.isArray(value);
}

function isArrayOrObject(value: unknown): value is [] | PlainObject {
    return isPlainObject(value) || isArray(value);
}

export function cloneDeep<T extends object = object>(obj: T) {
	let res:PlainObject|null = null;
	if(isArray(obj)){
		res = cloneArray(obj);
	} else {
		res = cloneObj(obj);
	}
	return res;
}

function cloneArray(arr: unknown[]): unknown[] {
	const res:unknown[] = [];
	for (let i = 0; i < arr.length; i++) {
		const el = arr[i];
		if(isArrayOrObject(el)){
			res.push(cloneDeep(el));
		} else {
			res.push(el);
		}
	}
	return res;
}
function cloneObj(obj: PlainObject): PlainObject {
	const res: PlainObject = {};
	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			const el = (<PlainObject> obj)[key];
			if(isArrayOrObject(el)){
				res[key] = cloneDeep(el);
			} else {
				res[key] = el;
			}
		}
	}
	return res;
}
