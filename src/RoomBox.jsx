import React, {useRef} from "react";
import {v4 as uuid} from "uuid";
import {ref, get, set, onValue, off} from "firebase/database";
import notify from "./notify.jsx";

function RoomBox({db, room, setRoom, setMessages}){
	const createRoomRef = useRef();

	const joinRoomRef = useRef();

	const createRoom = () => {
		const roomName = createRoomRef.current.value.toLowerCase();

		if (roomName){
			if (roomName.length >= 3 && roomName.length <= 12){
				get(ref(db, `rooms/${roomName}`)).then((data) => {
					const exists = data.exists();

					if (exists){
						notify("Room already exists!", 2000);
					}
					else{
						set(ref(db, `rooms/${roomName}`), {
							id: uuid()
						});

						notify(`Room "${roomName}" created! Join it using the set name.`, 5000);
					}
				});
			}
			else{
				notify("Room name length should be between 3 and 12 characters!", 2000);
			}
		}

		createRoomRef.current.value = "";
	};

	const joinRoom = () => {
		const roomName = joinRoomRef.current.value.toLowerCase();

		if (roomName){
			if (roomName.length >= 3 && roomName.length <= 12){
				get(ref(db, `rooms/${roomName}`)).then((data) => {
					const exists = data.exists();

					if (exists){
						off(ref(db, `rooms/${room}`));

				        onValue(ref(db, `rooms/${roomName}`), (data) => {
				            const value = data.val();

           					setMessages(Object.entries(value).sort((a, b) => a[1].timestamp - b[1].timestamp));
				        });

				        setRoom(roomName);

						notify("Room joined!", 2000);
					}
					else{
						notify("Room doesn't exist!", 2000);
					}
				});
			}
			else{
				notify("Room doesn't exist!", 2000);
			}
		}

		joinRoomRef.current.value = "";
	};

	return (
		<div className="roomBox">
			<div className="nameInputHeader">
				<h2 className="nameInputTitle">
					Room
				</h2>
			</div>

			<div className="nameInputBody">
				<div className="nameInputText">
					Create room:
				</div>

				<div className="nameInputContainer">
					<input className="nameInput" ref={createRoomRef}/>
				</div>

				<div className="nameInputButton" onClick={createRoom}>
					CREATE
				</div>

				<div className="nameInputText roomInputText">
					Join room:
				</div>

				<div className="nameInputContainer">
					<input className="nameInput" ref={joinRoomRef}/>
				</div>

				<div className="nameInputButton" onClick={joinRoom}>
					JOIN
				</div>
			</div>
		</div>
	);
}

export default RoomBox;