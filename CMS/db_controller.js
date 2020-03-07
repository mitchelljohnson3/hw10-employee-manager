const mysql = require('mysql');
const inquirer = require('inquirer');
const queries = require('./queries.js');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password1',
    database: 'cms_database'
});

connection.connect((err) => {
    if (err) throw err;

    console.log('CONNECTION ESTABLISHED');
    const queryHandler = new queries(connection);
    init(queryHandler);
});

function init(queryHandler) {
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
    ).then(async (answer) => {
        await new Promise((resolve, reject) => {
            switch(answer.choice) {
                case 'View All Employees':
                    queryHandler.viewAllEmployees(resolve);
                    break;
                case 'View All Employees By Department':
                    queryHandler.viewAllEmployeesByDepartment(resolve);
                    break;
                case 'View All Employees By Manager':
                    queryHandler.viewAllEmployeesByManager(resolve);
                    break;
                case 'Add Employee':
                    queryHandler.addEmployee(resolve);
                    break;
                case 'Remove Employee':
                    queryHandler.removeEmployee(resolve);
                    break;
                case 'Update Employee Role':
                    queryHandler.updateEmployeeRole(resolve);
                    break;
                case 'Update Employee Manager':
                    queryHandler.updateEmployeeManager(resolve);
                    break;
                case 'View All Roles':
                    queryHandler.viewAllRoles(resolve);
                    break;
                case 'Add Role':
                    queryHandler.addRole(resolve);
                    break;
                case 'Delete Role':
                    queryHandler.deleteRole(resolve);
                    break;
                case 'View Total Utilized Budget By Department':
                    queryHandler.viewTUBByDepartment(resolve);
                    break;
                case 'Exit':
                    console.log('CONNECTION CLOSED');
                    connection.end();
                    break;
                default:
                    console.log('CONNECTION CLOSED');
                    connection.end();
                    break;
            }
        });
        init(queryHandler);
    });
}