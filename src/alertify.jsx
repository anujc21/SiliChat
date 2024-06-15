function alertify(message){
	const alertBoxContainer = document.createElement("div");

	alertBoxContainer.classList.add("alertBoxContainer");

	const alertBox = document.createElement("div");

	alertBox.classList.add("alertBox");

	alertBox.innerHTML = `
		<h2 class="alertTitle">
			Welcome User!
		</h2>

		<p class="alertText">
			${message}
		</p>
	`;

	const alertButton = document.createElement("div");

	alertButton.classList.add("alertButton");

	alertButton.innerText = "Okay";

	alertButton.onclick = () => {
		alertBox.classList.add("alertBoxClose");
	};

	alertBox.onanimationend = (event) => {
		if (event.animationName === "alertClose"){
			alertBoxContainer.remove();
		}
	};

	alertBox.appendChild(alertButton);

	alertBoxContainer.appendChild(alertBox);

	document.body.appendChild(alertBoxContainer);
}

export default alertify;