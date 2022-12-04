//yêu cầu server kết nối với client
var socket = io();

document.querySelector("#form-messages").addEventListener("submit", (e) => {
    e.preventDefault()
    const messageText = document.querySelector("#input-messages").value
    const acknowlegements = (error) => {
        if (error) {
            return alert(error)
        }
        console.log("tin nhắn đã gủi thành cống")
    }
    socket.emit("send messages from client to server", messageText, acknowlegements)
})
//Chat
socket.on("send messages from server to client", (message) => {
    console.log(message)
    const { createAt, messageText, username, id } = message
    const htmlContent = document.querySelector(".app__messages").innerHTML

    let comment = ""
    if (id === socket.id) {
        comment = `<div class="message-item text-right">
            <div class="message__row1 justify-content-end">
                <p class="message__name">${username}</p>
                <p class="message__date">${createAt}</p>
            </div>
            <div class="message__row2">
                <p class="message__content">${messageText}</p>
            </div>
        </div>`
    } else {
        comment = `<div class="message-item">
        <div class="message__row1">
          <p class="message__name">${username}</p>
          <p class="message__date">${createAt}</p>
        </div>
        <div class="message__row2">
          <p class="message__content">
            ${messageText}
          </p>
        </div>
        </div>`
    }

    let contentRender = htmlContent + comment
    document.querySelector(".app__messages").innerHTML = contentRender
    //clear input
    document.querySelector("#input-messages").value = ""
})
//gửi vị trí
document.querySelector("#btn-share-location").addEventListener("click", () => {
    if (!navigator.geolocation) {
        return alert("trình duyệt không hỗ trợ")
    }
    navigator.geolocation.getCurrentPosition((position) => {
        // console.log("position :", position)
        const { latitude, longitude } = position.coords
        socket.emit("share location from client to server", {
            latitude, longitude
        })
    })
})

socket.on("share location from server to client", (data) => {
    const { username, createAt, messageText, id } = data
    const htmlContent = document.querySelector(".app__messages").innerHTML
    let comment = ""

    if (id === socket.id) {
        comment = `<div class="message-item text-right">
            <div class="message__row1 justify-content-end">
                <p class="message__name">${username}</p>
                <p class="message__date">${createAt}</p>
            </div>
            <div class="message__row2">
                <p class="message__content">
                <a href="${messageText}" target="_blank"> Vị trí của ${username}</a>
                </p>
            </div>
        </div>`
    } else {
        comment = `<div class="message-item">
        <div class="message__row1">
          <p class="message__name">${username}</p>
          <p class="message__date">${createAt}</p>
        </div>
        <div class="message__row2">
          <p class="message__content">
          <a href="${messageText}" target="_blank"> Vị trí của ${username}</a>
          </p>
        </div>
      </div>`
    }

    let contentRender = htmlContent + comment
    document.querySelector(".app__messages").innerHTML = contentRender
})

//xử lý query string

const queryString = location.search
const params = Qs.parse(queryString, {
    ignoreQueryPrefix: true //loại bỏ dấu ?
})
const { username, room } = params
socket.emit("join room from client to server", { username, room })

//hiển thị tên phòng
document.querySelector(".app__title").innerHTML = room

//xử lý userList
socket.on("send userList from server to client", (userList) => {
    console.log(userList)
    let contentHtml = ""
    userList.map((user) => {
        return contentHtml += `<li class="app__item-user">${user.username}</li>`
    })
    document.querySelector(".app__list-user--content").innerHTML = contentHtml
})