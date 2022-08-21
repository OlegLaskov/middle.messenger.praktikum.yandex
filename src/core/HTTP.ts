import { queryStringify } from "../utils/utils";
import { RequestOptions } from "./types";

export const METHODS = {
	GET:	'GET',
	POST:	'POST',
	PUT:	'PUT',
	DELETE:	'DELETE'
};

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
		if(options.data && !(options.data instanceof FormData)){
			url += queryStringify(options.data);
			delete options.data;
		}
		options.method = METHODS.GET;
		return this.request(url, options);
	};

	// PUT, POST, DELETE
	// options:
	// headers — obj
	// data — obj
	post = (url: string, options: RequestOptions = {}) => {
		return this.request(url, {...options, method: METHODS.POST});
	};
	put = (url: string, options: RequestOptions = {}) => {
		return this.request(url, {...options, method: METHODS.PUT});
	};
	delete = (url: string, options: RequestOptions = {}) => {
		return this.request(url, {...options, method: METHODS.DELETE});
	};


	request = (url: string, options: RequestOptions ): Promise<XMLHttpRequest> => {
		const {method = METHODS.GET, data, headers={}, timeout} = options;

		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();

			xhr.open(method, url);

			!headers['Content-Type'] && !(data instanceof FormData) && (headers['content-type'] = 'application/json');

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
			const body = data instanceof FormData ? data : JSON.stringify(data);
			method === METHODS.GET ? xhr.send() : xhr.send(body);
			
		});
	};
}

async function oneFetch(httpTran: HTTPTransport, url: string, options: RequestOptions): Promise<string|Error> {
	let {retries=5} = options;
	try{
		const data: XMLHttpRequest = await httpTran.request(url, options);
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

