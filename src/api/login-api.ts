import {fetchWithRetry, METHODS} from '../core/HTTP';
import { RequestOptions } from '../core/types';

type Form = {[key: string]: string};

class LoginAPI {
	
	public login(form: Form){
		const url = '/auth/signin',
			options: RequestOptions = {method: METHODS.POST};
		options.data = form;
		return fetchWithRetry(url, options);
	}
	public logout(){
		const url = '/auth/logout',
			options: RequestOptions = {method: METHODS.POST};
		return fetchWithRetry(url, options);
	}
}
export default new LoginAPI;