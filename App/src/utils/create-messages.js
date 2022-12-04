const formatTime = require("date-format")

const createMessages = (messageText, username, id) => {
    return {
        messageText,
        createAt: formatTime("dd/MM/yyyy - hh:mm:ss ", new Date()),
        username,
        id
    }
}

module.exports = {
    createMessages
}