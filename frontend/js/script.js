let websocket

const login = document.querySelector(".login")
const loginForm = login.querySelector(".login-form")
const loginInput = login.querySelector(".login-input")

const chat = document.querySelector(".chat")
const chatInput = chat.querySelector(".chat-input")
const messages = chat.querySelector(".messages")

const colors = [
    "aqua",
    "aquamarine",
    "blueviolet",
    "brown",
    "cadetblue",
    "crimson",
    "darkcyan",
    "salmon",
    "seagreen",
]

const randonColor = () => {
    const randonInd = Math.floor(Math.random() * (colors.length - 1) + 1)
    return colors[randonInd]
}

const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}

const getUser = () => localStorage.getItem("@circle_app")
const onUser = JSON.parse(getUser())
const user = { id: "", name: "", color: "" }

const createMessageSelfElement = (content, time) => {
    const div = document.createElement("div")
    const hour = document.createElement("span")

    hour.innerHTML = time
    hour.classList.add("message-hour")

    div.classList.add("message-self")

    div.innerHTML = content
    div.appendChild(hour)

    return div
}

const createMessageFriendElement = (content, sender, color, time) => {
    const div = document.createElement("div")
    const span = document.createElement("span")
    const hour = document.createElement("span")

    span.style.color = color
    span.innerHTML = sender
    span.classList.add("message-sender")

    hour.innerHTML = time
    hour.classList.add("message-hour")

    div.classList.add("message-friend")
    div.appendChild(span)
    
    div.innerText += content

    div.appendChild(hour)
    return div
}

loginForm.addEventListener("submit", handleSubmit)
chat.addEventListener("submit", handleMessage)

function handleSubmit(event) {
    event.preventDefault()

    user.id = crypto.randomUUID()
    user.name = loginInput.value
    user.color = randonColor()


    console.log(user);
    localStorage.setItem("@circle_app", JSON.stringify(user))
    window.location.reload()
}

function processMessage({ data }) {
    const messages = JSON.parse(data)

    if (messages.constructor === Array) {
        const oldMessages = messages
        for (const item of oldMessages) {
            createMessage(item);
        }

    } else {
        createMessage(data)
    }
}

function createMessage(data) {
    const { message, userColor, userId, userName, time } = JSON.parse(data)

    const element = userId == onUser.id ? createMessageSelfElement(message, time) : createMessageFriendElement(message, userName, userColor, time)

    messages.appendChild(element)
    scrollScreen()
}


function handleMessage(event) {
    event.preventDefault()
    const timeStemp = new Date()

    const message = {
        userId: onUser.id,
        userName: onUser.name,
        userColor: onUser.color,
        message: chatInput.value,
        time: `${timeStemp.getHours()}:${timeStemp.getMinutes()}`
    }

    chatInput.value = ""

    websocket.send(JSON.stringify(message))
}


function app() {
    if (!onUser) return

    login.style.display = "none"
    chat.style.display = "flex"

    websocket = new WebSocket("wss://chat-circle-back-room.onrender.com")
    websocket.onmessage = processMessage
    // websocket.onopen = () => websocket.send("load")
    websocket.onopen = () => websocket.send("load")
}
app()
//localStorage.removeItem("@circle_app")
