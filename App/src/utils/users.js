let userList = [
    {
        id: 1,
        username: "Nguyễn Thanh Phong",
        room: "fe01"
    },
    {
        id: 2,
        username: "Nguyễn Trọng Hiếu",
        room: "fe02"
    },
    {
        id: 3,
        username: "Trần Phong Hào",
        room: "fe01"
    },
]
const addUser = (newUser) => (userList = [...userList, newUser])

const removeUser = (id) => userList = userList.filter((user) => user.id !== id)

const getUserList = (room) => userList.filter((user) => user.room === room)

const findUser = (id) => userList.find((user) => user.id === id)

module.exports = {
    getUserList,
    addUser,
    removeUser,
    findUser
}