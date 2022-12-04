const express = require("express")
const app = express()

const path = require("path")
const http = require("http")
const socketio = require("socket.io")
const Filter = require("bad-words")
// const formatTime = require("date-format")
const { createMessages } = require("./App/src/utils/create-messages")
const { getUserList, addUser, removeUser, findUser } = require("./App/src/utils/users")

const publicPathDirectory = path.join(__dirname, "../public")
app.use(express.static(publicPathDirectory))

const server = http.createServer(app)
const io = socketio(server)

let count = 1
const messages = "notification"
//lắng nghe sự kiện kết nối từ client
io.on("connection", (socket) => {


    socket.on("join room from client to server", ({ username, room }) => {
        socket.join(room)
        //gửi cho client mới kết nối vào
        socket.emit("send messages from server to client", createMessages(`Chào mừng bạn đến với phòng ${room}`, "Admin", "Admin"))
        //gửi cho các client còn lại
        socket.broadcast.to(room).emit("send messages from server to client", createMessages(`${username} mới tham gia vào phòng Chat`, "Admin", "Admin"))
        //Chat
        socket.on("send messages from client to server", (messageText, callback) => {
            const filter = new Filter()
            if (filter.isProfane(messageText)) {
                return callback("messageText không hợp lệ")
            }
            const id = socket.id
            const user = findUser(id)
            io.to(room).emit("send messages from server to client", createMessages(messageText, user.username, user.id))
        })


        //lắng nghe xử lý chia sẻ vị trí
        socket.on("share location from client to server", ({ latitude, longitude }) => {
            const linkLocation = `https://www.google.com/maps?q=${latitude},${longitude}`
            const id = socket.id
            const user = findUser(id)
            io.to(room).emit("share location from server to client", createMessages(linkLocation, user.username, user.id))
        })

        //xử lý userList
        const newUser = {
            id: socket.id,
            username,
            room
        }
        addUser(newUser)
        io.to(room).emit("send userList from server to client", getUserList(room))

        //ngắt kết nối
        socket.on("disconnect", () => {
            removeUser(socket.id)
            io.to(room).emit("send userList from server to client", getUserList(room))
            console.log("client left server")
        })
    })
})




const port = process.env.PORT || 4444
server.listen(port, () => {
    console.log(`app run on http://localhost:${port}`)
})