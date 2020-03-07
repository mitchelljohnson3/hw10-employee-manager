INSERT INTO department(name)
VALUES('Production'), ('Research and Development'), ('Marketing'), ('Human Resources'), ('Accounting and Finance');

-- production roles
INSERT INTO role(title, salary, department_id)
VALUES('Production Manager', 130550, 1), ('Quality Control', 95000, 1), ('Planning & Scheduling', 110500, 1), ('Inventory Control', 70000, 1), ('Production Intern', 25000, 1);
-- R&D roles
INSERT INTO role(title, salary, department_id)
VALUES('R&D Manager', 135400, 2), ('Product Design Engineer', 100000, 2), ('Product Tester', 98000, 2), ('Researcher', 95000, 2), ('Engineering Intern', 25000, 2);
-- Merketing roles
INSERT INTO role(title, salary, department_id)
VALUES('Marketing Manager', 120000, 3), ('Content Creator', 95000, 3), ('Creative Assistant', 75800, 3), ('Social Media Coordinator', 92000, 3), ('Marketing Intern', 25000, 3);
-- HR roles
INSERT INTO role(title, salary, department_id)
VALUES('HR Manager', 110900, 4), ('Recruiter', 98000, 4), ('Employee Trainer', 100000, 4), ('Employee Benefits Director', 95000, 4), ('HR Intern', 25000, 4);
-- Acc. & Fin. roles
INSERT INTO role(title, salary, department_id)
VALUES('Acc. & Fin. Manager', 130700, 5), ('Payroll Specialist', 105000, 5), ('Internal Auditor', 110500, 5), ('Financial Analyst', 95000, 5), ('Acc. & Fin. Intern', 25000, 5);

-- production employees
INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES('Alison', 'Sandovel', 1, null), ('Malcolm', 'Alexander', 2, 1), ('Tommie', 'Brock', 3, 1), ('Shirley', 'Stewart', 4, 1), ('Robert', 'Bailey', 5, 1);
-- R&D employees
INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES('Clyde', 'Rodriguez', 6, null), ('Lilia', 'Underwood', 7, 6), ('Kayla', 'Watkins', 8, 6), ('Lora', 'Cross', 9, 6), ('Martha', 'Payne', 10, 6);
-- Marketinghg employees
INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES('Eleanor', 'Kelly', 11, null), ('Jenny', 'Schmidt', 12, 11), ('Shannon', 'Mann', 13, 11), ('Elizabeth', 'Boone', 14, 11), ('Candice', 'Norris', 15, 11);
-- HR employees
INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES('Lorraine', 'Hawkins', 16, null), ('Jaime', 'Holt', 17, 16), ('Glen', 'Kelly', 18, 16), ('Sandra', 'Patton', 19, 16), ('Edmund', 'Holland', 20, 16);
-- Acc. & Fin. employees
INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES('Doris', 'Mitchell', 21, null), ('Jesse', 'Young', 22, 21), ('Brandon', 'Campbell', 23, 21), ('Catherine', 'Hill', 24, 21), ('Jennifer', 'Carter', 25, 21);