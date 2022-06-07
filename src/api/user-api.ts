import {fetchWithRetry, METHODS, RequestOptions} from '../utils/HTTP';

type Form = {[key: string]: string};


class UserAPI {

	public getUser(){
		const url = '/auth/user',
			options: RequestOptions = {method: METHODS.GET};
		return fetchWithRetry(url, options);
	}
	
	public changeProfile(form: Form){
		const url = '/user/profile',
			options: RequestOptions = {method: METHODS.PUT};
		options.data = form;
		return fetchWithRetry(url, options);
	}
}
export default new UserAPI;