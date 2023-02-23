const inquirer = require("inquirer");
require("dotenv").config();
const cTable = require("console.table");

const mysql = require("mysql");
const { query } = require("express");
const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: process.env.DB_USER,
    // MySQL password
    password: process.env.DB_PASSWORD,
    // MySQL password,
    database: process.env.DB_NAME,
    // MySQL password
  },
  console.log(`Connected to the team_db database.`)
);

// class View {
//   constructor(item) {
//     this.item = item;
//   }
//   viewItem() {
//     let sql = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
//     FROM ${this.item}`;
//     db.query(sql, (err, result) => {
//       if (err) {
//         console.log(err);
//       } else {
//         console.table(result);
//         init();
//       }
//     });
// }
// viewEmployees() {
//   let sql = `SELECT * FROM ${this.item} WHERE role_id IS role.id `;
//   db.query(sql, (err, result) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.table(result);
//       init();
//     }
//   });
// }
// }

const viewDepartments = () => {
  let sql = `SELECT d.name AS Department FROM department d`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table(result);
    init();
  });
};

const viewEmployees = () => {
  // let sql = `SELECT * FROM employee`;
  let sql = `SELECT CONCAT(e.first_name,  ' ' , e.last_name) AS Fullname, r.title AS Role, d.name AS Department, r.salary AS Salary FROM employee e
    LEFT JOIN roles r ON e.role_id = r.id
    LEFT JOIN department d ON d.id = r.department_id
  `;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table(result);
    init();
  });
};

const viewRoles = () => {
  let sql = `SELECT r.title AS Role, r.id AS RoleID FROM roles r`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table(result);
    init();
  });
};

const addEmployee = () => {
  let sql = `SELECT * FROM roles`
  db.query(sql,(err,result)=> {
    if(err) {
      console.log(err)
    }
    const roleNames = result.map(({ id, title, salary }) => ({
      value: id, title: `${title}`, salary: `${salary}`
    }));
    console.log(roleNames,'@@@@@')

    promptInfos(roleNames)

    
  })
 
};

const promptInfos = (roles) => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstname",
        message: "Enter first name",
      },
      {
        type: "input",
        name: "lastname",
        message: "Enter last name",
      },
      {
        type: "list",
        name: "role",
        message: "Enter role ID",
        choices: roles,
      },
      {
        type:"input",
        name:'managerid',
        message:'Enter Manager ID'
      }
      
    ])
    .then((answer) => {
      console.log(answer, 'ROLE IDDD');
      const { firstname, lastname, role, managerid } = answer;
      let sql = `INSERT INTO employee (role_id,first_name,last_name,manager_id)
        VALUES (00${role},"${firstname}","${lastname}",${managerid})`;
      db.query(sql, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.table(result);
          init();
        }
      });
    });
}

const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "department",
        message: "Enter Department name",
      },
    ])
    .then((answer) => {
      let sql = `INSERT INTO department (name) 
    VALUES ("${answer.department}")
    `;
      db.query(sql, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully added ", answer.department);
          init();
        }
      });
    });
};

const addRole = () => {
  let sql = `SELECT * FROM department`
  db.query(sql,(err,result)=> {
    if(err){
      console.log(err)
    }
    console.table(result)
    let response = result.map((res)=> {
      return res.id
    })

    console.log(response)
    inquirer
    .prompt([
      {
        type: "input",
        name: "role",
        message: "Enter role",
      },
      {
        type: "list",
        name: "rolebelong",
        message: "Which department ID this role belongs to?",
        choices: response,
      },
      {
        type: "input",
        name: "salary",
        message: "Enter the salary",
      },
    ])
    .then((answer) => {
      const { role, rolebelong, salary } = answer;
      let sql = `INSERT INTO roles (department_id,title,salary)
    VALUES (${rolebelong},"${role}","${salary}")`;
      db.query(sql, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully added", role);
          init();
        }
      });
    });
  })

  
};

const updateEmployee = () => {
  // continue from here//////////////////////////////////////////////////////////////////////////////////////////////////
};

const init = () => {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "options",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add Department",
          "Add Role",
          "Add an Employee",
        ],
      },
    ])
    .then((answer) => {
      switch (answer.options) {
        case "View All Departments":
          viewDepartments();
          break;
        case "View All Roles":
          viewRoles();
          break;
        case "View All Employees":
          viewEmployees();
          break;
        case "Add an Employee":
          addEmployee()
          break;
        case "Add Department":
          addDepartment()
          break;
        case "Add Role":
          addRole()
          break;

        default:
          console.log("test");
          break;
      }
    });
};

init();
module.exports = init;
