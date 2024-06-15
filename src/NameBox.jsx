import React, {useRef} from "react";
import Filter from "bad-words";
import notify from "./notify.jsx";

function NameBox({setUsername, messages}){
	const filter = new Filter();

	const inputRef = useRef();

	const changeUsername = () => {
		const username = inputRef.current.value;

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

		inputRef.current.value = "";
	};

	return (
		<div className="nameBox">
			<div className="nameInputHeader">
				<h2 className="nameInputTitle">
					Username
				</h2>
			</div>

			<div className="nameInputBody">
				<div className="nameInputText">
					Enter your name:
				</div>

				<div className="nameInputContainer">
					<input className="nameInput" ref={inputRef}/>
				</div>

				<div className="nameInputButton" onClick={changeUsername}>
					SET
				</div>
			</div>
		</div>
	);
}

export default NameBox;