const express = require('express')
const router = express.Router()
const {
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployee,
  updateEmployee,
} = require('../../controllers/employees')

router
  .route('/')
  .get(getAllEmployees)
  .post(createEmployee)
  .put(updateEmployee)
  .delete(deleteEmployee)

router.route('/:id').get(getEmployee)

module.exports = router
