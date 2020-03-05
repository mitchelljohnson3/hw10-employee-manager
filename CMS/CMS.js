const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password1',
    database: 'cms_database'
});

connection.connect((err) => {
    if (err) throw err;
    console.log(`CONNECTION ESTABLISHED WITH ${connection.database}`);
    init();
})

function init() {
    inquirer.prompt(
        {
            message: 'What would you like to do?',
            name: 'choice',
            type: 'list',
            choices: 
            [
                'View All Employees',
                'View All Employees By Department',
                'View All Employees By Manager',
                'Add Employee',
                'Remove Employee',
                'Update Employee Role',
                'Update Employee Manager',
                'View All Roles',
                'Add Role',
                'Delete Role',
                'View Total Utilized Budget By Department',
                'Exit'
            ]
        }
    ).then((answer) => {
        switch(answer.choice) {
            case 'View All Employees':
                break
            case 'View All Employees By Department':
                break
            case 'View All Employees By Manager':
                break
            case 'Add Employee':
                break
            case 'Remove Employee':
                break
            case 'Update Employee Role':
                break
            case 'Update Employee Manager':
                break
            case 'View All Roles':
                break
            case 'Add Role':
                break
            case 'Delete Role':
                break
            case 'View Total Utilized Budget By Department':
                break
            case 'Exit':
                connection.end();
                console.log(`CONNECTION CLOSED WITH ${connection.database}`);
            default:
                connection.end();
                console.log(`CONNECTION CLOSED WITH ${connection.database}`);
        }
    })
}