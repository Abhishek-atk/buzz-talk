const moment = require('moment')
const formatMessage = (id,userName, chat) => {
    return {
        id,
        userName,
        chat,
        time: moment().format('h:mm a')
    }
}

module.exports = formatMessage