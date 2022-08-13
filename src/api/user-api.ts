import {fetchWithRetry, METHODS, RequestOptions} from '../utils/HTTP';

type Form = {[key: string]: string};
type FormWithFile = {avatar: File};

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
			options: RequestOptions = {method: METHODS.PUT}, //, headers: {'Content-Type': 'multipart/form-data'}
			avatarData = new FormData();
		/* for (const key in form) {
			console.log('key', key, form[key]);
			avatarData.append(key, form[key]);
		} */
		const {avatar} = form;
		const fileName = avatar.name;
		console.log('changeAvatar: avatar=', form, 'avatar', avatar, 'fileName', fileName);
		avatarData.append('avatar', avatar, fileName);
		// avatarData.avatar = form.avatar;
		options.data = avatarData;
		console.log('options', options);
		
		console.log('avatarData: =', avatarData.get('avatar'));
		
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