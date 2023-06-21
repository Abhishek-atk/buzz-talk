const users = []

//join user to chat 

const userJoin = (id, username, room) => {
    const user = { id, username, room }
    users.push(user)
    return user
}

const getcurrentUser = (id) => {
    return users.find(user => user.id === id)
}
const userleave = (id) => {
    const index = users.findIndex(user => user.id === id)

    if(index !== -1){
        return users.splice(index, 1)[0];
    }
}

const getroomUsers = (room) => {
    return users.filter(user => user.room === room)

}
module.exports = {
    userJoin,
    getcurrentUser,
    userleave,
    getroomUsers

}