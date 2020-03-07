# hw10-employee-manager

#PROGRAM DESCRIPTION#

    This program will allow you ( a company ) to manage your company database using a simple command line tool
    This program is started using 'node db_controller.js' while inside of the CMS folder
    The UI is very simple to use
	
	Remember to first initialize the local sql server using the initialize.sql file
	Then fill it with sample data using the seed.sql file

#PSEUDO-CODE#

initialize database with tables [x]
    fill with dummy data [x]
    store this dummy data in a seed.sql, include in final submission [x]
install node packages (mysql, inquirer, console.table) [x]
create functions to access data [x]
    view all employees [x]
    view all by department [x]
    view all by manager [x]
    add employee [x]
    remove employee [x]
    update employee role [x]
    update employee manager [x]
    view all roles [x]
    add role [x]
    delete role [x]
all functions work correctly [x]

file-structure:

database>
    seed.sql
    initialize.sql

CMS>
    nodemodules>
    package.json
    package-lock.json
    CMS.js

README.md
