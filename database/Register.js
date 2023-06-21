const Sequelize = require("sequelize")
const connection = require("./database")

const Register = connection.define("registers", {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }

})
//Register.sync({force: true})
module.exports = Register;