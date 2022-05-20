const METHODS = {
	GET:	'GET',
	POST:	'POST',
	PUT:	'PUT',
	DELETE:	'DELETE'
};

const BASE_URL = 'https://ya-praktikum.tech/api/v2';

function queryStringify(data) {
	const arr = [];
	for (const key in data) {
		if (data.hasOwnProperty(key)) {
			arr.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
			arr.push(key + '=' + data[key]);
		}
	}
	return arr.length ? '?' + arr.join('&') : '';
}

class HTTPTransport {
	get = (url, options = {}) => {
		if(options.data){
			url += queryStringify(options.data);
			delete options.data;
		}
		return this.request(url, {...options, method: METHODS.GET}, options.timeout);
	};

	// PUT, POST, DELETE
	// options:
	// headers — obj
	// data — obj
	post = (url, options = {}) => {
		return this.request(url, {...options, method: METHODS.POST}, options.timeout);
	};
	put = (url, options = {}) => {
		return this.request(url, {...options, method: METHODS.PUT}, options.timeout);
	};
	delete = (url, options = {}) => {
		return this.request(url, {...options, method: METHODS.DELETE}, options.timeout);
	};


	request = (url, options, timeout ) => {
		const {method, data, headers={}} = options;

		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();

			xhr.open(method, url);

			!headers['Content-Type'] && (headers['content-type'] = 'application/json');

			for (const key in headers) {
				if (headers.hasOwnProperty(key)) {
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

async function oneFetch(httpTran, url, options, retries){
	try{
		const data = await httpTran.request(url, options, options.timeout);
		return data.response;
	} catch (e){
		if(retries === 1){
			return e;
		}
		return oneFetch(httpTran, url, options, retries - 1);
	}
}

let httpTran;

export default function fetchWithRetry(url, options) {
	url = BASE_URL + url;
	let retries = options && typeof options.retries === 'number' && options.retries > 1 ? options.retries : 5;
	httpTran = httpTran || (httpTran = new HTTPTransport());
	
	return oneFetch(httpTran, url, options, retries);
}

