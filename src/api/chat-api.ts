import {fetchWithRetry, METHODS} from '../core/HTTP';
import { RequestOptions } from '../core/types';
import BaseAPI from './base-api';


type Tcreate = {title: string};

class ChatAPI implements BaseAPI {
	private BASE_URL = '/chats';

	create = (data: Tcreate): Promise<string | Error> =>{
		const url = this.BASE_URL,
			options: RequestOptions = {method: METHODS.POST};
		options.data = data;
		return fetchWithRetry(url, options);
	}
	request = (query?: string): Promise<string | Error> => {
		const url = this.BASE_URL + (query || ''),
			options: RequestOptions = {method: METHODS.GET};
		return fetchWithRetry(url, options);
	}

	addUser = (users: number[], chatId: number): Promise<string | Error> =>{
		const url = this.BASE_URL + '/users',
			options: RequestOptions = {method: METHODS.PUT};
		options.data = {users, chatId};
		return fetchWithRetry(url, options);
	}
	deleteUser = (users: number[], chatId: number): Promise<string | Error> =>{
		const url = this.BASE_URL + '/users',
			options: RequestOptions = {method: METHODS.DELETE};
		options.data = {users, chatId};
		return fetchWithRetry(url, options);
	}

	update(): Promise<string | Error> {
		throw new Error('Method not implemented.');
	}
	delete(): Promise<string | Error> {
		throw new Error('Method not implemented.');
	}

}
export default new ChatAPI;