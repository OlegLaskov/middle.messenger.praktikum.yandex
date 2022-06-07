import {fetchWithRetry, RequestOptions} from '../utils/HTTP';

type Form = {[key: string]: string};

export default class LoginAPI {
	
	public login(form: Form){
		const url = '/auth/signin',
			options: RequestOptions = {method: 'post'};
		options.data = form;
		return fetchWithRetry(url, options);
	}
	public logout(){
		const url = '/auth/logout',
			options: RequestOptions = {method: 'post'};
		return fetchWithRetry(url, options);
	}
}