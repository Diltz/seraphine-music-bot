// packages

const mariadb = require("mariadb")

//

module.exports = async (guildId) => {
    const connection = await mariadb.createConnection({
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        database: process.env.MYSQL_DATABASE,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD
    })

    var row = await connection.query(`SELECT * FROM servers WHERE guildId = "${guildId}" LIMIT 1;`)
    
    if (!row[0]) {
        await connection.query(`INSERT INTO servers (guildId, isPremium, language) VALUES (${guildId}, 0, "en")`)
    } else {
        console.log("Bot already has record about " + guildId)
    }
}