const data = {
  employees: require('../data/employees.json'),
  setEmployees: function (data) {
    this.employees = data
  },
}

const getAllEmployees = (req, res) => {
  res.json(data.employees)
}

const createEmployee = (req, res) => {
  const newEmployee = {
    id: data.employees?.length > 0 ? data.employees[data.employees.length - 1].id + 1 : 1,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  }

  if (!req.body.firstname || !req.body.lastname) {
    return res.status(400).json({ Error: 'firstname and lastname field is required' })
  }

  data.setEmployees([...data.employees, newEmployee])
  res.status(201).json(data.employees)
}

const updateEmployee = (req, res) => {
  const employee = data.employees.find((employee) => employee.id === parseInt(req.body.id))

  if (!employee)
    return res.status(404).json({ ERROR: `employee with id: ${req.body.id} not found` })

  if (req.body.firstname) employee.firstname = req.body.firstname
  if (req.body.lastname) employee.lastname = req.body.lastname

  const filteredArray = data.employees.filter((employee) => employee.id !== parseInt(req.body.id))
  const unsortedArray = [...filteredArray, employee]

  data.setEmployees(unsortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0)))
  res.json(data.employees)
}

const deleteEmployee = (req, res) => {
  const employee = data.employees.find((employee) => employee.id === parseInt(req.body.id))

  if (!employee)
    return res.status(404).json({ ERROR: `employee with id: ${req.body.id} not found` })

  const filteredArray = data.employees.filter((employee) => employee.id !== parseInt(req.body.id))
  data.setEmployees([...filteredArray])
  res.json(data.employees)
}

const getEmployee = (req, res) => {
  const employee = data.employees.find((emp) => emp.id === parseInt(req.params.id))
  if (!employee) {
    return res.status(400).json({ message: `Employee ID ${req.params.id} not found` })
  }
  res.json(employee)
}

module.exports = {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
}
