import {fetchWithRetry, RequestOptions} from '../utils/HTTP';
import BaseAPI from './base-api';

type Form = {[key: string]: string};


export class SignupAPI extends BaseAPI {
	
	signup(form: Form){
		const url = '/auth/signup',
			options: RequestOptions = {method: 'post'};
		options.data = form;
		return fetchWithRetry(url, options);
	}
}