import {fetchWithRetry, METHODS, RequestOptions} from '../utils/HTTP';
import store from '../utils/store';
import BaseAPI from './base-api';

type Tcreate = {title: string};
type Tfile = {
	id: number,
	user_id: number,
	path: string,
	filename: string,
	content_type: string,
	content_size: number,
	upload_date: string,
};
export type Tmsg = {
	type: string,
	id: number,
	content?: string,
	user_id?: number,
	chat_id: number,
	time?: string,
	file?: Tfile,

	msgClass?: string,
	formatedTime?: string,
	theTime: Date,
	timestamp: number
};

type TchatMsgs = {
	[key in string]: Tmsg
}

export type TstoreMsgs = {
	[key in string]: TchatMsgs
}

class ChatAPI extends BaseAPI {

	private BASE_URL = '/chats';
	private userId: number;
	private socket: WebSocket;
	private pingInterval: number;

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

	transformMsg = (msg:Tmsg)=>{
		msg.msgClass = msg.user_id === this.userId ? 'message__right' : 'message__left';
		msg.theTime = new Date(msg.time || new Date());
		msg.formatedTime = msg.theTime.toLocaleTimeString(undefined, {hour: '2-digit', minute: '2-digit'});
		msg.timestamp = msg.theTime.getTime();
		return msg;
	};

	messagesFromArrayToObj = (msgs: Tmsg[]) => {
		return msgs.reduceRight((acc, msg):TstoreMsgs=>{
			const {id, chat_id} = msg;
			!acc[chat_id] && (acc[chat_id]={});
			acc[chat_id][id] = msg;
			return acc;
		}, {} as TstoreMsgs);
	}

	initSocket = (userId: number, chatId: number) => {

		this.pingInterval && clearInterval(this.pingInterval);

		this.socket && this.socket.close();

		this.userId = userId;
		const url = this.BASE_URL + '/token/' + chatId,
			options = {method: METHODS.POST};

		fetchWithRetry(url, options)
		.then((resp: string)=>{
			const res = JSON.parse(resp);
			const {token} = res;
			this.socket = new WebSocket(`wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`);

			this.socket.addEventListener('open', ()=>{
				console.log('Соединение установлено');
				this.getMessages(chatId);
			});

			this.socket.addEventListener('close', event => {
				if(event.wasClean){
					console.log('Соединение закрыто чисто');
				} else {
					console.log('Обрыв соединения');
					this.initSocket(userId, chatId);
				}
				console.log(`Код: ${event.code} | Причина: ${event.reason}`);
			});

			this.socket.addEventListener('message', event => {
				console.log('Получены данные='+typeof event.data, event.data);
				const parsedData: Tmsg = JSON.parse(event.data);
				
				if(Array.isArray(parsedData)){
					const messages = parsedData.map(this.transformMsg);
					const storeMsg = this.messagesFromArrayToObj(messages);
					store.set('messages', storeMsg);
				} else {
					const {type, id} = parsedData;
					if(type === 'message'){
						parsedData.chat_id = chatId;
						store.set(`messages.${chatId}.${id}`, this.transformMsg(parsedData));
					}
				}
			});

			this.socket.addEventListener('error', (event: ErrorEvent) => {
				console.log('Ошибка', event.message);
			}); 

			this.pingInterval = setInterval(this.sendPing, 5000);
		})
		.catch((err: Error)=>{
			console.log('err='+typeof err, err);
		})
	}

	closeSocket = () => {
		this.socket.close();
	}

	sendPing = () => {
		if(this.socket){
			this.socket.send(JSON.stringify({type: 'ping'}));
		} else {
			console.log('sendPing: NO SOCKET');
		}
	}
	sendMessage = (data: {content: string, type?: string}) => {
		if(this.socket){
			data.type = 'message';
			this.socket.send(JSON.stringify(data));
		} else {
			console.log('sendMessage: NO SOCKET');
		}
		
	}

	getMessages = (chatId: number) => {
		if(this.socket){
			const url = this.BASE_URL + '/new/' + chatId, // get new message count
				options: RequestOptions = {method: METHODS.GET};
			fetchWithRetry(url, options)
			.then((resp: string)=>{
				console.log('getNewMsgCount: resp=', resp);
				const res = JSON.parse(resp);

				let content = 0;
				do{
					this.socket.send(JSON.stringify({type: 'get old', content: content.toString()}));
					content+=20;
				}while(content < res.unread_count); // 100
			})
			.catch((err: Error)=>{
				console.log('err='+typeof err, err);
			})
		}
	}
}
export default new ChatAPI;