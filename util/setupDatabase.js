// packages

const mariadb = require("mariadb")

//

module.exports = async () => {
    const connection = await mariadb.createConnection({
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        database: process.env.MYSQL_DATABASE,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD
    })

    await connection.query("CREATE TABLE IF NOT EXISTS `servers` (guildId TEXT, isPremium BOOLEAN, language VARCHAR(2))")
    await connection.end()
}