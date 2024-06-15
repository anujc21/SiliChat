import React from "react";
import {ref, onValue, off} from "firebase/database";
import notify from "./notify.jsx";

function Header({db, setMenuOpen, room, setRoom, setMessages}){
	const openMenu = () => {
		setMenuOpen(true);
	};

	const setPublic = () => {
		off(ref(db, `rooms/${room}`));

        onValue(ref(db, "rooms/public"), (data) => {
            const value = data.val();

			setMessages(Object.entries(value).sort((a, b) => a[1].timestamp - b[1].timestamp));
        });

        setRoom("public");

		notify("Switched to default public room!", 2000);
	};

	return (
		<div className="header">
			<h1 className="headerTitle">
				SiliChat
			</h1>

			<div className="headerIcons">
				<div className="material-symbols-outlined publicIcon" onClick={setPublic}>
					group
				</div>

				<div className="material-symbols-outlined menuIcon" onClick={openMenu}>
					menu
				</div>
			</div>
		</div>
	);
}

export default Header;