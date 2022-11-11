import {fetchWithRetry, METHODS} from '../core/HTTP';
import { RequestOptions } from '../core/types';

type Form = {[key: string]: string};


class SignupAPI {
	
	public signup(form: Form){
		const url = '/auth/signup',
			options: RequestOptions = {method: METHODS.POST};
		options.data = form;
		return fetchWithRetry(url, options);
	}
}
export default new SignupAPI;