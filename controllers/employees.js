const Employee = require('../models/Employee')

const getAllEmployees = async (req, res) => {
  const employees = await Employee.find()

  if (!employees) return res.json({ message: 'Sorry, no employees found' })
  return res.json(employees)
}

const createEmployee = async (req, res) => {
  if (!req?.body?.firstname || !req?.body?.lastname) {
    return res.status(400).json({ message: 'First and last names are required' })
  }

  try {
    const result = await Employee.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    })

    res.status(201).json(result)
  } catch (err) {
    console.error(err)
  }
}

const updateEmployee = async (req, res) => {
  if (!req?.body?.id) return res.status(400).json({ message: 'Ids field is required' })
  const employee = await Employee.findOne({ _id: req.body.id }).exec()

  if (!employee)
    return res.status(404).json({ ERROR: `employee with id: ${req.body.id} not found` })

  if (req.body?.firstname) employee.firstname = req.body.firstname
  if (req.body?.lastname) employee.lastname = req.body.lastname

  employee.save()
  res.json(employee)
}

const deleteEmployee = async (req, res) => {
  if (!req.body.id) return res.status(400).json({ message: 'Field id is required' })

  const employee = await Employee.findOne({ _id: req.body.id }).exec()

  if (!employee)
    return res.status(404).json({ ERROR: `employee with id: ${req.body.id} not found` })

  const result = await employee.deleteOne({ _id: req.body.id })
  res.json(result)
}

const getEmployee = async (req, res) => {
  if (!req?.params?.id) return res.status(400).json({ message: 'Sorry, params ID is required.' })
  const employee = await Employee.findOne({ _id: req.params.id }).exec()
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
