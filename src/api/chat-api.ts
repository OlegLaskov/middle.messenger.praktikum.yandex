import {fetchWithRetry, METHODS, RequestOptions} from '../utils/HTTP';
import BaseAPI from './base-api';

type Tcreate = {title: string};

class ChatAPI extends BaseAPI {

	private BASE_URL = '/chats';
	private socket: WebSocket;

	create = (data: Tcreate): Promise<string | Error> =>{
		const url = this.BASE_URL,
			options: RequestOptions = {method: METHODS.POST};
		options.data = data;
		console.log({url, options});
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

	initSocket = (userId: number, chatId: number, token: string) => {
		const url = this.BASE_URL + '/token/' + chatId,
			options: RequestOptions = {method: METHODS.POST};
		fetchWithRetry(url, options)
		this.socket = new WebSocket(`wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`);
	}
	sendPing = () => {
		console.log('sendPing: socket=', this.socket);
		if(this.socket){
			this.socket.send(JSON.stringify({type: 'ping'}));
			console.log('sent Ping!');
		}
	}
	sendMessage = (data: {content: string, type?: string}) => {
		console.log('sendMessage=', data, ', socket=', this.socket);
		if(this.socket){
			data.type = 'message';
			this.socket.send(JSON.stringify(data));
			console.log('SENT !!!');
		}
		
	}
}
export default new ChatAPI;