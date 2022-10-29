import { fetchWithRetry, METHODS } from "./HTTP";
import store from "./store";
import { RequestOptions, Tmsg, TstoreMsgs } from "./types";

const LIMIT_OF_UNREAD_MESSAGES = 20;

class WebSocketTransport {

	private BASE_URL = '/chats';
	private userId: number;
	private socket: WebSocket|null;
	private pingInterval: number;

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
		this.pingInterval = 0;

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
				this.getMessages(chatId);
			});

			this.socket.addEventListener('close', event => {
				if(!event.wasClean){
					console.log(`Обрыв соединения. Код: ${event.code} | Причина: ${event.reason}`);
					this.initSocket(userId, chatId);
				}
			});

			this.socket.addEventListener('message', event => {
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

			this.pingInterval && clearInterval(this.pingInterval);
			this.pingInterval = setInterval(this.sendPing, 5000);
		})
		.catch((err: Error)=>{
			console.error('err='+typeof err, err);
		})
	}

	closeSocket = () => {
		this.socket && this.socket.close();
		this.socket = null;
		this.pingInterval && clearInterval(this.pingInterval);
		this.pingInterval = 0;
	}

	sendPing = () => {
			this.socket && this.socket.send(JSON.stringify({type: 'ping'}));
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
				const res = JSON.parse(resp);

				let content = 0;
				do{
					this.socket && this.socket.send(JSON.stringify({type: 'get old', content: content.toString()}));
					content+=LIMIT_OF_UNREAD_MESSAGES;
				}while(content < res.unread_count);
			})
			.catch((err: Error)=>{
				console.error('err='+typeof err, err);
			})
		}
	}
}
export default new WebSocketTransport;