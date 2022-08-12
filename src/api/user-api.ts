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
	public changePassword(form: Form){
		const url = '/user/password',
			options: RequestOptions = {method: METHODS.PUT};
		options.data = form;
		return fetchWithRetry(url, options);
	}

	public changeAvatar(form: Form){
		const url = '/user/profile/avatar',
			options: RequestOptions = {method: METHODS.PUT, headers: {'Content-Type': 'multipart/form-data'}}, //
			formData = new FormData();
		/* for (const key in form) {
			console.log('key', key, form[key]);
			formData.append(key, form[key]);
		} */
		console.log('changeAvatar: avatar', form.avatar);
		formData.set('avatar', form.avatar);
		// formData.avatar = form.avatar;
		options.data = formData;
		console.log('options', options);
		
		console.log('FormData: =', formData.get('avatar'));
		
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