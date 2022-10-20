const path = require('path')
const bcrypt = require('bcrypt')
const { writeFile } = require('fs').promises

const usersDB = {
  users: require('../data/users.json'),
  setUsers: function (data) {
    this.users = data
  },
}

const handleNewUser = async (req, res) => {
  const { username, password } = req.body
  const duplicate = usersDB.users.find((user) => user.username === username)

  if (!username || !password)
    return res.status(400).json({ message: 'ERROR: the username or password field is required' })

  if (duplicate) return res.status(409).json({ message: 'ERROR: Duplicate username' })

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = { username, password: hashedPassword, roles: { User: 2001 } }

    usersDB.setUsers([...usersDB.users, newUser])

    await writeFile(path.join(__dirname, '..', 'data', 'users.json'), JSON.stringify(usersDB.users))
    console.log(`New user ${newUser.username} is created`)
    res.status(201).json({ message: 'Success! New user created.' })
  } catch (error) {
    return res.status(500).json({ message: 'ERROR: Could not create new user' })
  }
}

module.exports = { handleNewUser }
