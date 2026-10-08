const express = require("express");

const app = express();

app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

// Authentication middleware
function checkAuth(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            message: "Authentication required"
        });
    }

    next();
};

let employees = [
    {
        id: 1,
        name: "Rahul",
        department: "IT",
        salary: 40000
    },
    {
        id: 2,
        name: "Priya",
        department: "HR",
        salary: 35000
    }
];

// GET all employees
app.get("/employees", checkAuth, (req, res) => {
    res.status(200).json(employees);
});

// GET employee by ID
app.get("/employees/:id", (req, res) => {
    const id = Number(req.params.id);

    const employee = employees.find(e => e.id === id);

    if (!employee) {
        return res.status(404).json({
            message: "Employee not found"
        });
    }

    res.status(200).json(employee);
});

// POST create employee
app.post("/employees", (req, res) => {
    const employee = {
        id: employees.length + 1,
        ...req.body
    };

    employees.push(employee);

    res.status(201).json(employee);
});

app.put("/employees/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = employees.findIndex(e => e.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Employee not found"
        });
    }

    employees[index] = {
        id,
        ...req.body
    };

    res.status(200).json(employees[index]);
});

app.delete("/employees/:id", (req, res) => {
    const id = Number(req.params.id);

    const oldLength = employees.length;

    employees = employees.filter(e => e.id !== id);

    if (employees.length === oldLength) {
        return res.status(404).json({
            message: "Employee not found"
        });
    }

    res.status(200).json({
        message: "Employee deleted"
    });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});