import React, {useEffect, useRef} from "react";
import Filter from "bad-words";
import {v4 as uuid} from "uuid";
import {ref, set} from "firebase/database";
import notify from "./notify.jsx";

function ChatBox({db, room, messages, username, userID, chatContainerRef}){
	const filter = new Filter();

	const inputRef = useRef();

	let currentChats = useRef(0);

	let chatTimeout = useRef(null);

	let chatExtraTimeout = useRef(null);

	const chats = messages.map((message, index) => {
		if (message[1].timestamp){
			const chatClass = (message[1].id === userID ? "chatMessage chatMe" : "chatMessage");

			const titleClass = (message[1].id === userID ? "chatMessageTitle chatMeTitle" : "chatMessageTitle");

			return (
				<div key={uuid()} className={chatClass}>
					<h3 className={titleClass}>
						{message[1].id === userID ? `${message[1].user} (You)` : message[1].user}
					</h3>

					<p className="chatMessageText">
						{message[1].value}
					</p>
				</div>
			);
		}
	});

	const sendMessage = () => {
		const chat = inputRef.current.value;

		if (chat){
			let messageValue = "";

			try {
				messageValue = filter.clean(chat.slice(0, 500));
			}
			catch (error){
				return false;
			}

			inputRef.current.value = "";

			const message = {
				id: userID,
				user: username,
				value: messageValue,
				timestamp: Date.now()
			};
			
			if (currentChats.current < 5){
				set(ref(db, `rooms/${room}/${uuid()}`), message);

				if (chatTimeout.current){
					clearTimeout(chatTimeout.current);
				}

				chatTimeout.current = setTimeout(() => {
					currentChats.current = 0;
				}, 3000);

				currentChats.current += 1;
			}
			else{
				if (chatTimeout.current){
					clearTimeout(chatTimeout.current);
				}

				if (!chatExtraTimeout.current){
					chatExtraTimeout.current = setTimeout(() => {
						currentChats.current = 0;
					}, 10000);
				}

				notify("Wait a moment, send only a few messages at once!", 2000);
			}
		}
	};

	useEffect(() => {
		window.onkeydown = (event) => {
			if (event.keyCode === 13){
				sendMessage();
			}
		};
	}, []);

	return (
		<div className="chatBox">
			<div className="chatHeader">
				<h2 className="chatHeaderTitle">
					ChatRoom - {room}
				</h2>
			</div>

			<div className="chatBody">
				<div className="chatContainer" ref={chatContainerRef}>
					{chats}
				</div>
			</div>

			<div className="chatInputBox">
				<input className="chatInput" placeholder="Enter message here..." ref={inputRef}/>

				<div className="chatSendButton" onClick={sendMessage}>
					<span className="material-symbols-outlined chatSendIcon">
						send
					</span>
				</div>
			</div>
		</div>
	);
}

export default ChatBox;