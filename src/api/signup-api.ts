import {fetchWithRetry, RequestOptions} from '../utils/HTTP';

type Form = {[key: string]: string};


export default class SignupAPI {
	
	public signup(form: Form){
		const url = '/auth/signup',
			options: RequestOptions = {method: 'post'};
		options.data = form;
		return fetchWithRetry(url, options);
	}
}