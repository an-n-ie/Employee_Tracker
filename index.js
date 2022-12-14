const inquirer=require("inquirer")
const db = require("./config/connection")

require("console.table")

db.connect( ()=>{
    menu()
})

const menuQuestion=[
    {
        type:"list",
        name:"menu",
        message:"What would you like to do?",
        choices:["View all departments","View all roles","View all employees","Add a department","Add a role","Add an employee","Update an employee role"]
    }
]





function menu(){
  inquirer.prompt(menuQuestion)
  .then(response=>{
    if(response.menu==="View all employees"){
        viewEmployee()
    }
    else if(response.menu==="View all departments"){
        viewDepartment()
    }
    else if(response.menu==="View all roles"){
        viewRole()
    }
    else if(response.menu==="Add a role"){
        addRole()
    }
    else if(response.menu==="Add an employee"){
        addEmployee()
    }

  })
    
}
function viewDepartment(){
    db.query("select* from department", (err, data)=>{
        console.table(data)
        menu()
    })
}

function viewRole(){
    db.query("select* from role", (err, data)=>{
        console.table(data)
        menu()
    })
}

function addEmployee(){
    db.query("select title as name, id as value from role", (er, roleData)=>{

           db.query(`select CONCAT(first_name, " " , last_name) as name, id as value from employee where manager_id is null `, (err, managerData)=>{
            const employeeAddQuestions=[
                {
                    type:"input",
                    name:"first_name",
                    message:"What is the employee's first name?",
            
                },
                {
                    type:"input",
                    name:"last_name",
                    message:"What is the employee's last name?",
            
                },
                {
                    type:"list",
                    name:"role_id",
                    message:"Choose the role:",
                    choices:roleData
                },{
                    type:"list",
                    name:"manager_id",
                    message:"Choose the manager:",
                    choices:managerData
                }
            
            ]
            inquirer.prompt(employeeAddQuestions).then(response=>{
                const parameters=[response.first_name,response.last_name,response.role_id, response.manager_id]
                db.query("INSERT INTO employee (first_name,last_name,role_id,manager_id)VALUES(?,?,?,?)",parameters,(err, data)=>{

                    viewEmployee()
                })
            })
           })
    })
}
function viewEmployee(){
db.query(`
SELECT 
employee.id,
employee.first_name,
employee.last_name,
role.title,
department.name as department,
role.salary,
CONCAT(mgr.first_name, " " , mgr.last_name) as manager
FROM employee
LEFT JOIN role ON role.id= employee.role_id
LEFT JOIN department ON role.department_id=department.id
LEFT JOIN employee as mgr ON employee.manager_id = mgr.id

`,  (err,data)=>{
    console.table(data)

    menu()
    
} )
}