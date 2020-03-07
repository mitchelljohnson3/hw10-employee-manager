const inquirer = require('inquirer');
const cTable = require('console.table');

class queries {
    constructor(connection) {
        this.connection = connection;
    }

    viewAllEmployees(resolve) {
        this.connection.query(
            'select * from employee inner join role on employee.role_id = role.id left join department on role.department_id = department.id',
            (err, results) => {
                if (err) throw err;
                // filters out non-managers
                const employees = results.map(employee => employee.first_name + ' ' + employee.last_name);

                // preparing data for console.table
                const values = results.map(employee => {
                    const arr =
                        [
                            employee.first_name,
                            employee.last_name,
                            employee.title,
                            employee.name,
                            employee.salary,
                            employees[employee.manager_id - 1]
                        ];
                    return arr;
                });

                const header = ['First Name', 'Last Name', 'Title', 'Department', 'Salary', 'Manager'];
                console.table(header, values);
                resolve();
            }
        );
    }

    async viewAllEmployeesByDepartment(resolve) {
        // gets the list of departments from the database
        let departments;
        await new Promise((res, rej) => {
            this.connection.query(
                'select name from department',
                (err, results) => {
                    if (err) throw err;
                    res();
                    departments = results.map(title => title.name);
                }
            );
        });
        // prompts the user to select the database they want to search through
        inquirer.prompt(
            {
                message: 'Which department?',
                name: 'choice',
                type: 'list',
                choices: departments
            }
        ).then((answer) => {
            this.connection.query(
                'select * from employee inner join role on employee.role_id = role.id left join department on role.department_id = department.id',
                (err, results) => {
                    if (err) throw err;
                    // gets filters out employees that arent in the selected department
                    const employees = results.filter(employee => employee.department_id == (departments.indexOf(answer.choice) + 1));
                    // filters out non-managers
                    const managers = results.filter(employee => employee.manager_id == null);

                    // preparing data for console.table
                    const values = employees.map(employee => {
                        const arr =
                            [
                                employee.first_name,
                                employee.last_name,
                                employee.title,
                                employee.name,
                                employee.salary,
                                managers[departments.indexOf(answer.choice)].first_name + " " + managers[departments.indexOf(answer.choice)].last_name
                            ];
                        return arr;
                    });
                    values[0][5] = ' ';

                    const header = ['First Name', 'Last Name', 'Title', 'Department', 'Salary', 'Manager'];
                    console.table(header, values);
                    resolve();
                }
            );
        });
    }
}

module.exports = queries;