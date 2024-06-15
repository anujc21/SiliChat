function notify(message, duration){
	const notificationBox = document.createElement("div");

	notificationBox.classList.add("notificationBox");

	notificationBox.innerText = message;

	notificationBox.onanimationend = (event) => {
		if (event.animationName === "notificationClose"){
			notificationBox.remove();
		}
	}

	document.body.appendChild(notificationBox);

	setTimeout(() => {
		notificationBox.classList.add("notificationBoxClose");
	}, duration);
}

export default notify;