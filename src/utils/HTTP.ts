import {queryStringify} from './utils';

export const METHODS = {
	GET:	'GET',
	POST:	'POST',
	PUT:	'PUT',
	DELETE:	'DELETE'
};

export type RequestOptions = {
	method?: string,
	data?: {[key: string]: string|number|boolean},
	timeout?: number,
	retries?: number,
	headers?: {[key: string]: string}
}

const BASE_URL = 'https://ya-praktikum.tech/api/v2';

class HTTPTransport {

	private static __instance: HTTPTransport;

	constructor(){
		if (HTTPTransport.__instance) {
			return HTTPTransport.__instance;
		}
		HTTPTransport.__instance = this;
		return this;
	}

	get = (url: string, options: RequestOptions = {}) => {
		if(options.data){
			url += queryStringify(options.data);
			delete options.data;
		}
		options.method = METHODS.GET;
		return this.request(url, options, options.timeout);
	};

	// PUT, POST, DELETE
	// options:
	// headers — obj
	// data — obj
	post = (url: string, options: RequestOptions = {}) => {
		return this.request(url, {...options, method: METHODS.POST}, options.timeout);
	};
	put = (url: string, options: RequestOptions = {}) => {
		return this.request(url, {...options, method: METHODS.PUT}, options.timeout);
	};
	delete = (url: string, options: RequestOptions = {}) => {
		return this.request(url, {...options, method: METHODS.DELETE}, options.timeout);
	};


	request = (url: string, options: RequestOptions, timeout?: number ): Promise<XMLHttpRequest> => {
		const {method = METHODS.GET, data, headers={}} = options;

		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();

			xhr.open(method, url);

			!headers['Content-Type'] && (headers['content-type'] = 'application/json');

			for (const key in headers) {
				if (Object.prototype.hasOwnProperty.call(headers, key)) {
					xhr.setRequestHeader(key, headers[key]);
				}
			}

			timeout && (xhr.timeout = timeout);

			xhr.withCredentials = true;
			
			xhr.onload = function() {
				resolve(xhr);
			};
		
			xhr.onabort = reject;
			xhr.onerror = reject;
			xhr.ontimeout = reject;

			method === METHODS.GET ? xhr.send() : xhr.send(JSON.stringify(data));
			
		});
	};
}

async function oneFetch(httpTran: HTTPTransport, url: string, options: RequestOptions): Promise<string|Error> {
	let {retries=5} = options;
	try{
		const data: XMLHttpRequest = await httpTran.request(url, options, options.timeout);
		return data.response;
	} catch (e){
		if(retries === 1){
			return e;
		}
		options.retries = --retries;
		return oneFetch(httpTran, url, options);
	}
}

let httpTran: HTTPTransport|null;

export function fetchWithRetry(url: string, options: RequestOptions): Promise<string|Error> {
	url = BASE_URL + url;
	const retries = options && typeof options.retries === 'number' && options.retries > 1 ? options.retries : 5;
	httpTran = httpTran || (httpTran = new HTTPTransport());
	options.retries = retries;
	
	return oneFetch(httpTran, url, options);
}

