import { WebSocketServer } from "ws"
import { config } from "dotenv"

config()

const messages = []

const wss = new WebSocketServer({port: process.env.PORT || 8080 })

wss.on("connection", (ws) => {
    ws.on("error", console.error)

    // ws.send("Seja bem vindo!")
    
    ws.on("message", (data) => {
        // console.log(data.toString())
        messages.push(data.toString())
        console.log(messages)

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