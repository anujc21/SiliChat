import React, {useState, useEffect, useRef} from "react";
import {v4 as uuid} from "uuid";
import {initializeApp} from "firebase/app";
import {getDatabase, ref, get, set, onValue} from "firebase/database";
import Menu from "./Menu.jsx";
import Header from "./Header.jsx";
import NameBox from "./NameBox.jsx";
import ChatBox from "./ChatBox.jsx";
import RoomBox from "./RoomBox.jsx";
import alertify from "./alertify.jsx";
import "./App.css";

const app = initializeApp({
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_DATABASE_URL,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID
});

const db = getDatabase(app);

function App(){
    const [menuOpen, setMenuOpen] = useState(false);

    const [username, setUsername] = useState("");

    const [userID, setUserID] = useState("");

    const [room, setRoom] = useState("public");

    const [messages, setMessages] = useState([]);

    const chatContainerRef = useRef();

    const randomID = () => {
        return (Math.random().toString(36).substr(2, 10));
    };

    const randomUser = () => {
        const id = Math.floor((Math.random() * (9999) - (1000)) + (1000));

        return (`User${id}`);
    };

    useEffect(() => {
        const container = chatContainerRef.current;
        const startPosition = container.scrollTop - 100;
        const targetPosition = container.scrollHeight;
        const distance = targetPosition - startPosition;
        const duration = 500;
        
        let startTime = null;

        const animateScroll = (currentTime) => {
            if (!startTime) startTime = currentTime;
            
            const timeElapsed = currentTime - startTime;
            const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
            
            container.scrollTop = run;

            if (timeElapsed < duration) requestAnimationFrame(animateScroll);
        };

        const easeInOutQuad = (time, start, change, duration) => {
            time /= duration / 2;

            if (time < 1) return change / 2 * time * time + start;

            --time;

            return -change / 2 * (time * (time - 2) - 1) + start;
        };

        requestAnimationFrame(animateScroll);

        if (messages.length > 50){
            set(ref(db, `rooms/${room}/${messages[0][0]}`), null);
        }
    }, [messages]);

    useEffect(() => {
        setUsername(randomUser());

        setUserID(randomID());

        onValue(ref(db, `rooms/${room}`), (data) => {
            const value = data.val();

            setMessages(Object.entries(value).sort((a, b) => a[1].timestamp - b[1].timestamp));
        });

        alertify("Start chatting! Explore more more options like changing username and creating/joining rooms from the menu on the top-right.");
    }, []);

    return (
        <div className="app">
            {(menuOpen) &&
                <Menu db={db} setMenuOpen={setMenuOpen} setUsername={setUsername} messages={messages} setMessages={setMessages} room={room} setRoom={setRoom}/>
            }

            <Header db={db} setMenuOpen={setMenuOpen} room={room} setRoom={setRoom} setMessages={setMessages}/>

            <div className="content">
                <NameBox setUsername={setUsername} messages={messages}/>
                <ChatBox db={db} room={room} messages={messages} username={username} userID={userID} chatContainerRef={chatContainerRef}/>
                <RoomBox db={db} room={room} setRoom={setRoom} setMessages={setMessages}/>
            </div>
        </div>
    );
}

export default App;