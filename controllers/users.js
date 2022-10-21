const bcrypt = require('bcrypt')
const User = require('../models/User')

const handleNewUser = async (req, res) => {
  const { username, password } = req.body
  if (!username || !password)
    return res.status(400).json({ message: 'ERROR: the username or password field is required' })

  const duplicate = await User.findOne({ username }).exec()

  if (duplicate) return res.status(409).json({ message: 'ERROR: Duplicate username' })

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = { username, password: hashedPassword }

    const result = await User.create(newUser) 
    res.status(201).json(result)
  } catch (error) {
    return res.status(500).json({ message: 'ERROR: Could not create new user' })
  }
}

module.exports = { handleNewUser }
