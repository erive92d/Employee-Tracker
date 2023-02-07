INSERT INTO department (name)
VALUES ("Sales"),
    ("Engineering"),
    ("Finance"),
    ("Legal");

INSERT INTO roles (department_id,title,salary)
VALUES (001,"Sales Lead",100000),
    (001,"Salesperson",80000),
    (002,"Lead Engineer",150000),
    (002,"Software Engineer",120000),
    (003,"Account Manager",160000),
    (003,"Accountant",100000),
    (004,"Legal Team Lead",250000),
    (004,"Lawyer",200000);
    
INSERT INTO employee(role_id,first_name,last_name,manager_id)
VALUES (007,"John","Doe",1);