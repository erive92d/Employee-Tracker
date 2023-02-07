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

class View {
  constructor(item) {
    this.item = item;
  }
  viewItem() {
    let sql = `SELECT * FROM ${this.item}`;
    db.query(sql, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.table(result);
        init();
      }
    });
  }
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
}

const addEmployee = () => {
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
        message: "Enter role",
        choices: ["Salesperson", "Software Engineer", "Accountant", "Lawyer"],
      },
      {
        type: "input",
        name: "roleid",
        message: "Enter role ID",
      },
      {
        type: "input",
        name: "managerid",
        message: "Enter Manager ID",
      },
    ])
    .then((answer) => {
      const { roleid, firstname, lastname, role, managerid } = answer;
      console.log(answer);
      let sql = `INSERT INTO employee (role_id,first_name,last_name,role,manager_id)
        VALUES (${roleid},"${firstname}","${lastname}","${role}",${managerid});`;
      db.query(sql, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.table(result);
          init();
        }
      });
    });
};

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
  inquirer
    .prompt([
      {
        type: "input",
        name: "role",
        message: "Enter role",
      },
      {
        type: "input",
        name: "rolebelong",
        message: "Which department ID this role belongs to?",
        choices: [1, 2, 3, 4, 5],
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
};


const updateEmployee = () => {
    // continue from here//////////////////////////////////////////////////////////////////////////////////////////////////
}

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
          "Add an Employee"
        ],
      },
    ])
    .then((answer) => {
      let newAnswer = "";
      let answerId = "";
      switch (answer.options) {
        case "View All Departments":
          answer.options = "department";
          newAnswer = answer.options;
          answerId = 1;
          break;
        case "View All Roles":
          answer.options = "roles";
          newAnswer = answer.options;
          answerId = 1;
          break;
        case "View All Employees":
          answer.options = "employee";
          newAnswer = answer.options;
          answerId = 1;
          break;
        case "Add an Employee":
          answerId = 2;
          break;
        case "Add Department":
          answerId = 3;
          break;
        case "Add Role":
          answerId = 4;
          break;

        default:
          console.log("test");
          break;
      }

      if (answerId === 1) {
        const viewDepartment = new View(newAnswer);
        viewDepartment.viewItem();
      } else if (answerId === 2) {
        addEmployee();
      } else if (answerId === 3) {
        addDepartment();
      } else if (answerId === 4) {
        addRole();
      } else if (answerId === 5) {
        updateEmployee();
      }
    });
};

init();
module.exports = init;
