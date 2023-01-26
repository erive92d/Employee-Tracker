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
}

// class Manage {
//   constructor(item) {
//     this.item = item;
//   }
//   addEmployee() {
//     inquirer
//       .prompt([
//         {
//           type: "input",
//           name: "firstname",
//           message: "Enter first name",
//         },
//         {
//           type: "input",
//           name: "lastname",
//           message: "Enter last name",
//         },
//         {
//           type: "list",
//           name: "role",
//           message: "Enter role",
//           choices: ["Salesperson", "Software Engineer", "Accountant", "Lawyer"],
//         },
//         {
//           type: "input",
//           name: "roleid",
//           message: "Enter role ID",
//         },
//         {
//           type: "input",
//           name: "managerid",
//           message: "Enter Manager ID",
//         },
//       ])
//       .then((answer) => {
//         const { roleid, firstname, lastname, role, managerid } = answer;
//         let sql = `INSERT INTO employee(role_id,first_name,last_name,role,manager_id)
//         VALUES (${roleid},"${firstname}","${lastname}","${role}",${managerid});`;
//         db.query(sql, (err, result) => {
//           if (err) {
//             console.log(err);
//           } else {
//             console.table(result);
//           }
//         });
//       });
//   }
// }

const addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstname",
        message: "Enter first name"
      },
      {
        type: "input",
        name: "lastname",
        message: "Enter last name"
      },
      {
        type: "list",
        name: "role",
        message: "Enter role",
        choices: ["Salesperson", "Software Engineer", "Accountant", "Lawyer"]
      },
      {
        type: "input",
        name: "roleid",
        message: "Enter role ID"
      },
      {
        type: "input",
        name: "managerid",
        message: "Enter Manager ID"
      }
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
          init()
        }
      });
    });
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
          "Add an Employee",
          "Update an Employee Role",
        ],
      },
    ])
    .then((answer) => {
      let newAnswer = "";
      switch (answer.options) {
        case "View All Departments":
          answer.options = "department";
          newAnswer = answer.options;
          break;
        case "View All Roles":
          answer.options = "roles";
          newAnswer = answer.options;
          break;
        case "View All Employees":
          answer.options = "employee";
          newAnswer = answer.options;
          break;
        case "Add an Employee":
          addEmployee();
          break;
      }

      const viewDepartment = new View(newAnswer);
      viewDepartment.viewItem();
    });
};

init();
module.exports = init;
