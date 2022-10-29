import {fetchWithRetry, METHODS, RequestOptions} from '../core/HTTP';
import { FormWithFile } from '../core/types';

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
	public changePassword(form: Form){
		const url = '/user/password',
			options: RequestOptions = {method: METHODS.PUT};
		options.data = form;
		return fetchWithRetry(url, options);
	}

	public changeAvatar(form: FormWithFile){
		const url = '/user/profile/avatar',
			options: RequestOptions = {method: METHODS.PUT},
			avatarData = new FormData();
		const {avatar} = form;
		avatarData.append('avatar', avatar);
		options.data = avatarData;
		return fetchWithRetry(url, options);
	}

	public searchUsersByLogin(form: Form){
		const url = '/user/search',
			options: RequestOptions = {method: METHODS.POST};
		options.data = form;
		return fetchWithRetry(url, options);
	}
}
export default new UserAPI;