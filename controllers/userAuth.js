const usersDB = {
  users: require('../data/users.json'),
  setUsers: function (data) {
    this.users = data
  },
}

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fsPromises = require('fs').promises
const path = require('path')
require('dotenv').config()

const handleLogin = async (req, res) => {
  const { username, password } = req.body
  if (!username || !password)
    return res.status(400).json({ message: 'Error: Username or password is required' })
  const foundUser = usersDB.users.find((user) => user.username === username)
  if (!foundUser) return res.sendStatus(401)

  const salt = await bcrypt.genSalt(15)
  const newHashedPassword = await bcrypt.hash(foundUser.password, salt)

  const isMatch = await bcrypt.compare(password, newHashedPassword)

  if (isMatch) {
    const accessToken = jwt.sign(
      { username: foundUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1m' }
    )
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    )

    // Saving refresh token to current user
    const currentUser = { ...foundUser, refreshToken }
    const otherUsers = usersDB.users.filter((user) => user.username !== foundUser.username)

    usersDB.setUsers([...otherUsers, currentUser])
    await fsPromises.writeFile(
      path.join(__dirname, '..', 'data', 'users.json'),
      JSON.stringify(usersDB.users)
    )

    res.cookie('jwt', refreshToken, {
      // Add in to fix bug but don't know why :))
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    })
    res.json({ accessToken })
  } else {
    return res.sendStatus(401)
  }
}

module.exports = { handleLogin }
