export function queryStringify(data: {[key: string]: string|number|boolean}): string {
	const arr: string[] = [];
	for (const key in data) {
		if (Object.prototype.hasOwnProperty.call(data, key)) {
			arr.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
		}
	}
	return arr.length ? '?' + arr.join('&') : '';
}