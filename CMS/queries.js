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

    async viewAllEmployeesByManager(resolve) {
        // get the list of managers
        let managers;
        let managerIdList;
        await new Promise((res, rej) => {
            this.connection.query(
                'select id,first_name,last_name from employee where manager_id is null',
                (err, results) => {
                    if (err) throw err;
                    res();
                    managers = results.map(employee => employee.first_name + " " + employee.last_name);
                    managerIdList = results.map(employee => employee.id);
                }
            );
        });
        // prompt the user to select which manager to search
        inquirer.prompt(
            {
                message: 'Which manager?',
                name: 'choice',
                type: 'list',
                choices: managers
            }
        ).then((answer) => {
            this.connection.query(
                'select * from employee inner join role on employee.role_id = role.id left join department on role.department_id = department.id',
                (err, results) => {
                    if (err) throw err;
                    const employees = results.filter(employee => employee.manager_id == (managerIdList[managers.indexOf(answer.choice)]));

                    const values = employees.map(employee => {
                        const arr =
                            [
                                employee.first_name,
                                employee.last_name,
                                employee.title,
                                employee.name,
                                employee.salary,
                            ];
                        return arr;
                    });

                    const header = ['First Name', 'Last Name', 'Title', 'Department', 'Salary'];
                    console.table(header, values);

                    resolve();
                }
            );
        });
    }

    async addEmployee(resolve) {
        // gets departments list from the database
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
        inquirer.prompt([
            {
                name: 'first_name',
                message: 'What is their first name?'
            },
            {
                name: 'last_name',
                message: 'What is their last name?'
            },
            {
                name: 'department',
                message: 'Which department do they work in?',
                type: 'list',
                choices: departments
            }
        ]).then(async (answers) => {
            let roles;
            let rolesIdList;
            await new Promise((res, rej) => {
                this.connection.query(
                    'select * from role where role.department_id = ?',
                    [departments.indexOf(answers.department) + 1],
                    (err, results) => {
                        if (err) throw err;
                        res();
                        roles = results.map(role => role.title);
                        rolesIdList = results.map(role => role.id);
                    }
                );
            });

            inquirer.prompt(
                {
                    message: 'What\'s their role?',
                    name: 'choice',
                    type: 'list',
                    choices: roles
                }
            ).then(async (answer) => {

                let managers;
                let managerIdList;
                await new Promise((res, rej) => {
                    this.connection.query(
                        'select id,first_name,last_name from employee where manager_id is null',
                        (err, results) => {
                            if (err) throw err;
                            res();
                            managers = results.map(employee => employee.first_name + " " + employee.last_name);
                            managerIdList = results.map(employee => employee.id);
                        }
                    );
                });
                // adds null option if the employee is a manager
                managers.push('No Manager');
                managerIdList.push(null);

                inquirer.prompt(
                    {
                        name: 'choice',
                        message: 'Who is their manager?',
                        type: 'list',
                        choices: managers
                    }
                ).then(async (moreAnswers) => {
                    let firstName = answers.first_name;
                    let lastName = answers.last_name;
                    let role_id = rolesIdList[roles.indexOf(answer.choice)];
                    let manager_id = managerIdList[managers.indexOf(moreAnswers.choice)];
                    // finally insert the new employee into the database
                    await new Promise((res, rej) => {
                        this.connection.query(
                            'insert into employee(first_name, last_name, role_id, manager_id) values(?,?,?,?)',
                            [firstName, lastName, role_id, manager_id],
                            (err, results) => {
                                if (err) throw err;
                                res();
                                console.log(`Successfully added ${firstName} ${lastName} to the employee database!`);
                                resolve();
                            }
                        );
                    });
                });


            })
        });
    }

    async removeEmployee(resolve) {
        let employees;
        let employeeIdList;
        await new Promise((res, rej) => {
            this.connection.query(
                'select * from employee',
                (err, results) => {
                    if (err) throw err;
                    res();
                    employees = results.map(employee => employee.first_name + " " + employee.last_name);
                    employeeIdList = results.map(employee => employee.id);
                }
            );
        });

        inquirer.prompt(
            {
                name: 'choice',
                message: 'Which employee do you want to remove?',
                type: 'list',
                choices: employees
            }
        ).then(async (answers) => {
            let idToDelete = employeeIdList[employees.indexOf(answers.choice)];

            await new Promise((res, rej) => {
                this.connection.query(
                    'delete from employee where employee.id = ?',
                    [idToDelete],
                    (err, results) => {
                        if (err) throw err;
                        res();
                        console.log(`Successfully deleted ${answers.choice} from employee database!`);
                        resolve();
                    }
                );
            });

        });
    }

    async updateEmployeeRole(resolve) {
        let employees;
        let employeeIdList;
        await new Promise((res, rej) => {
            this.connection.query(
                'select * from employee',
                (err, results) => {
                    if (err) throw err;
                    res();
                    employees = results.map(employee => employee.first_name + " " + employee.last_name);
                    employeeIdList = results.map(employee => employee.id);
                }
            );
        });

        inquirer.prompt(
            {
                name: 'choice',
                message: 'Which employee do you want to remove?',
                type: 'list',
                choices: employees
            }
        ).then(async (answers) => {
            let idToUpdate = employeeIdList[employees.indexOf(answers.choice)];
            // -------------------------------------------------------------------
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
            inquirer.prompt(
                {
                    name: 'department',
                    message: 'What\'s their new department?',
                    type: 'list',
                    choices: departments
                }
            ).then(async (answers) => {
                let roles;
                let rolesIdList;
                await new Promise((res, rej) => {
                    this.connection.query(
                        'select * from role where role.department_id = ?',
                        [departments.indexOf(answers.department) + 1],
                        (err, results) => {
                            if (err) throw err;
                            res();
                            roles = results.map(role => role.title);
                            rolesIdList = results.map(role => role.id);
                        }
                    );
                });

                inquirer.prompt(
                    {
                        message: 'What\'s their new role?',
                        name: 'choice',
                        type: 'list',
                        choices: roles
                    }
                ).then(async (answer) => {
                    let role_id = rolesIdList[roles.indexOf(answer.choice)];

                    // finally update the employee role
                    await new Promise((res, rej) => {
                        this.connection.query(
                            'update employee set employee.role_id = ? where employee.id = ?',
                            [role_id, idToUpdate],
                            (err, results) => {
                                if (err) throw err;
                                res();
                                console.log('Successfully updated employee role!');
                                resolve();
                            }
                        );
                    });
                });
            });
            // -------------------------------------------------------------------

        });

    }

    async updateEmployeeManager(resolve) {
        let employees;
        let employeeIdList;
        await new Promise((res, rej) => {
            this.connection.query(
                'select * from employee',
                (err, results) => {
                    if (err) throw err;
                    res();
                    employees = results.map(employee => employee.first_name + " " + employee.last_name);
                    employeeIdList = results.map(employee => employee.id);
                }
            );
        });

        inquirer.prompt(
            {
                name: 'choice',
                message: 'Which employee do you want to remove?',
                type: 'list',
                choices: employees
            }
        ).then(async (answers) => {
            let idToUpdate = employeeIdList[employees.indexOf(answers.choice)];
            // -----------------------------------------------
            let managers;
            let managerIdList;
            await new Promise((res, rej) => {
                this.connection.query(
                    'select id,first_name,last_name from employee where manager_id is null',
                    (err, results) => {
                        if (err) throw err;
                        res();
                        managers = results.map(employee => employee.first_name + " " + employee.last_name);
                        managerIdList = results.map(employee => employee.id);
                    }
                );
            });
            // adds null option if the employee is a manager
            managers.push('No Manager');
            managerIdList.push(null);

            inquirer.prompt(
                {
                    name: 'choice',
                    message: 'Who is their manager?',
                    type: 'list',
                    choices: managers
                }
            ).then(async (moreAnswers) => {
                let manager_id = managerIdList[managers.indexOf(moreAnswers.choice)];
                // update employee manager id
                await new Promise((res, rej) => {
                    this.connection.query(
                        'update employee set employee.manager_id = ? where employee.id = ?',
                        [manager_id, idToUpdate],
                        (err, results) => {
                            if (err) throw err;
                            res();
                            console.log('Successfully updated employee manager!');
                            resolve();
                        }
                    );
                });
            });
            // -----------------------------------------------
        });
    }

    async viewAllRoles(resolve) {
        this.connection.query(
            'select * from role',
            (err, results) => {
                if (err) throw err;

                // preparing data for console.table
                const values = results.map(role => {
                    const arr =
                        [
                            role.title,
                            role.salary
                        ];
                    return arr;
                });

                const header = ['Role', 'Salary'];
                console.table(header, values);
                resolve();
            }
        );
    }

    async addRole(resolve) {
        inquirer.prompt([

            {
                name: 'role_name',
                message: 'What is the name of the new role?',
            },
            {
                name: 'role_salary',
                message: 'What is the new role\'s salary?'
            }
        ]).then(async (answers) => {
            let roleName = answers.role_name;
            let roleSalary = answers.role_salary;

            // ----------------------------------------------------------
            let departments;
            let departmentsIdList;
            await new Promise((res, rej) => {
                this.connection.query(
                    'select * from department',
                    (err, results) => {
                        if (err) throw err;
                        res();
                        departments = results.map(title => title.name);
                        departmentsIdList = results.map(department => department.id);
                    }
                );
            });
            // prompts the user to select the database they want to search through
            inquirer.prompt(
                {
                    message: 'Which department is the new role in?',
                    name: 'choice',
                    type: 'list',
                    choices: departments
                }
            ).then(async (answer) => {
                let department_id = departmentsIdList[departments.indexOf(answer.choice)];

                await new Promise((res, rej) => {
                    this.connection.query(
                        'insert into role(title, salary, department_id) values(?,?,?)',
                        [roleName,roleSalary,department_id],
                        (err, results) => {
                            if (err) throw err;
                            res();
                            console.log('Successfully added new role!');
                            resolve();
                        }
                    );
                });

            });

            // ----------------------------------------------------------
        });
    }

    async deleteRole(resolve) {
        let roles;
        let rolesIdList;
        await new Promise((res, rej) => {
            this.connection.query(
                'select * from role',
                (err, results) => {
                    if (err) throw err;
                    res();
                    roles = results.map(role => role.title);
                    rolesIdList = results.map(role => role.id);
                }
            );
        });

        inquirer.prompt(
            {
                message: 'What role do you want to delete?',
                name: 'choice',
                type: 'list',
                choices: roles
            }
        ).then(async (answer) => {
            let idToDelete = rolesIdList[roles.indexOf(answer.choice)];

            await new Promise((res, rej) => {
                this.connection.query(
                    'delete from role where role.id = ?',
                    [idToDelete],
                    (err, results) => {
                        if (err) throw err;
                        res();
                        console.log(`Successfully deleted role from role database!`);
                        resolve();
                    }
                );
            });
        });
    }

    async viewAllDepartments(resolve) {
        this.connection.query(
            'select * from department',
            (err, results) => {
                if (err) throw err;

                // preparing data for console.table
                const values = results.map(department => {
                    const arr =
                        [
                            department.name
                        ];
                    return arr;
                });

                const header = ['Department'];
                console.table(header, values);
                resolve();
            }
        );
    }

    async addDepartment(resolve) {
        inquirer.prompt(
            {
                name: 'department_name',
                message: 'What is the name of the new department?',
            }
        ).then(async (answer) => {
            await new Promise((res, rej) => {
                this.connection.query(
                    'insert into department(name) values (?)',
                    [answer.department_name],
                    (err, results) => {
                        if (err) throw err;
                        res();
                        console.log('Successfully added department!');
                        resolve();
                    }
                );
            });
        });
    }

    async deleteDepartment(resolve) {
        let departments;
        let departmentsIdList;
        await new Promise((res, rej) => {
            this.connection.query(
                'select * from department',
                (err, results) => {
                    if (err) throw err;
                    res();
                    departments = results.map(title => title.name);
                    departmentsIdList = results.map(department => department.id);
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
        ).then(async (answer) => {
            let idToDelete = departmentsIdList[departments.indexOf(answer.choice)];
            // delete department
            await new Promise((res, rej) => {
                this.connection.query(
                    'delete from department where department.id = ?',
                    [idToDelete],
                    (err, results) => {
                        if (err) throw err;
                        res();
                        console.log('Successfully deleted department!');
                        resolve();
                    }
                );
            });
        });
    }
}

module.exports = queries;