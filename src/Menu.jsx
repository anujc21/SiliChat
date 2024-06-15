import React, {useEffect, useRef} from "react";
import Filter from "bad-words";
import {v4 as uuid} from "uuid";
import {ref, get, set, onValue, off} from "firebase/database";
import notify from "./notify.jsx";

function Menu({db, setMenuOpen, setUsername, messages, setMessages, room, setRoom}){
	const filter = new Filter();

	const menuRef = useRef();

	const nameInputRef = useRef();

	const createRoomRef = useRef();

	const joinRoomRef = useRef();

	const changeUsername = () => {
		const username = nameInputRef.current.value;

		const duplicate = messages.findIndex((message) => message[1].user === username);

		if (username){
			if (username.length >= 3 && username.length <= 12){
				if (duplicate === -1){
					try {
						setUsername(filter.clean(username));
					}
					catch (error){
						return false;
					}

					notify("Username set!", 2000);
				}
				else{
					notify("Username already taken in chat!", 2000);
				}
			}
			else{
				notify("Username length should be between 3 and 12 characters!", 2000);
			}
		}

		nameInputRef.current.value = "";
	};

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

	const closeMenu = () => {
		menuRef.current.classList.add("menuClose");
	};

	useEffect(() => {
		menuRef.current.onanimationend = (event) => {
			if (event.animationName === "menuClose"){
				setMenuOpen(false);

				menuRef.current.classList.remove("menuClose");
			}
		};
	}, []);

	return (
		<div className="menuContainer">
			<div className="menu" ref={menuRef}>
				<div className="material-symbols-outlined closeButton" onClick={closeMenu}>
					close
				</div>

				<div className="menuOptionsContainer">
					<h2 className="menuInputTitle">
						Username
					</h2>

					<div className="menuInputText">
						Enter your name:
					</div>

					<div className="menuInputContainer">
						<input className="menuInput" ref={nameInputRef}/>
					</div>

					<div className="menuInputButton" onClick={changeUsername}>
						SET
					</div>

					<h2 className="menuInputTitle">
						Room
					</h2>

					<div className="menuInputText">
						Create room:
					</div>

					<div className="menuInputContainer">
						<input className="menuInput" ref={createRoomRef}/>
					</div>

					<div className="menuInputButton" onClick={createRoom}>
						CREATE
					</div>

					<div className="menuInputText">
						Join room:
					</div>

					<div className="menuInputContainer">
						<input className="menuInput" ref={joinRoomRef}/>
					</div>

					<div className="menuInputButton" onClick={joinRoom}>
						JOIN
					</div>
				</div>
			</div>
		</div>
	);
}

export default Menu;