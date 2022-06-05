import {fetchWithRetry, RequestOptions} from '../utils/HTTP';
import BaseAPI from './base-api';

type Form = {[key: string]: string};


export class LoginAPI extends BaseAPI {
	
	login(form: Form){
		const url = '/auth/signin',
			options: RequestOptions = {method: 'post'};
		options.data = form;
		return fetchWithRetry(url, options);
	}
	logout(){
		const url = '/auth/logout',
			options: RequestOptions = {method: 'post'};
		return fetchWithRetry(url, options);
	}
}