import { WebSocketServer } from "ws"
import { config } from "dotenv"

config()

const messages = []

const wss = new WebSocketServer({ port: process.env.PORT || 8080 })

wss.on("connection", (ws) => {
    ws.on("error", console.error)

    // ws.send("Seja bem vindo!")

    ws.on("open", function () {
       ws.emit("old", JSON.parse("sim"))
    })

    ws.on("message", (data) => {
        if(data.toString() === "load"){
            const dataMessages = JSON.stringify(messages)
            ws.send(dataMessages)
            return
        }

        messages.push(data.toString())
        console.log(data.toString());

        // messages.forEach((data) => {
        //     wss.clients.forEach((client) => {
        //         client.send(data.toString())
        //     })
        // })

        wss.clients.forEach((client) => {
            client.send(data.toString())
        })
    })


    console.log("client loged!");
})