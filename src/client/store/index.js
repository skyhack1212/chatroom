import { action,useStrict,computed , observable } from "mobx";
import io from 'socket.io-client';
const socket = io(process.env.NODE_ENV === 'production' ? 'http://112.74.63.84/' : '');

class List {
	@observable message
	@observable time
	@observable userName
	@observable avatorUrl
	
	constructor(e){
		this.message = e.message
		this.time = e.time
		this.userName = e.userName
		this.avatorUrl = e.avatorUrl
	}
}
class User {
	@observable userName
	@observable avatorUrl
	constructor(e){
		this.userName = e.userName
		this.avatorUrl = e.avatorUrl
	}
}
// useStrict(true)
class TodoStore {
	@observable userId = ''
	@observable myName = ''
	@observable showRoomDetail = false
	@observable showEmoji = false
	@observable showCodeEdit = false
	@observable nowRoom = ''
	@observable nowRoomAdministratorList = []
	@observable myAvatorUrl = ''
	@observable code = ''
	@observable members = []
	@observable messageImageUrl = ''
	@observable messageType = 'text'
	@observable messagesList = []
	@observable roomsList = []
	@observable users = []
	@observable doing = false
	@observable tip = '请登录'
	@observable callBack = {}
	@action socket = (state) => {
		socket.emit(state.url , state)
	}
	@action tipFunc = (state) => {
		this.tip = state
	}
	@action nowRoomFunc = (state) => {
		this.nowRoom = state
	}
	@action showRoomDetailFunc = (state) => {
		this.showRoomDetail = state
	}
	@action showCodeEditFunc = (state) => {
		this.showCodeEdit = state
	}
	@action showEmojiFunc = (state) => {
		this.showEmoji = state
	}
	constructor(){
		socket.on('user joined', json => {
			this.doing = false
			this.callBack = json
			this.tip = json.message
			this.userId = json.userId
			this.myName = json.userName
			this.myAvatorUrl = json.avatorUrl
			// console.log('user joined',json)
		})
		socket.on('get users', json => {
			// console.log('this.users',json)
			this.users = json
		})
		socket.on('get roomsList', json => {
			// console.log('this.roomList',json)
			this.roomsList = json
		})

		socket.on('get messagesList', json => {
			console.log('get messagesList',json)
			this.messagesList = json.messagesList
			this.members = json.members
			this.nowRoom = json.nowRoom
			this.nowRoomAdministratorList = json.administratorList
		})

		socket.on('send message', json => {
			console.log('send message',json)
			this.messagesList.push(json)
		})

		socket.on('add room', json => {
			if(json.code==0){
				console.log(json.message)
			}else{
				this.roomsList.push(json)
			}
		})
	}
}



window.store = new TodoStore
var store = window.store

export default store