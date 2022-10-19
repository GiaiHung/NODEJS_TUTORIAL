const usersDB = {
  users: require('../data/users.json'),
  setUsers: function (data) {
    this.users = data
  },
}

const { writeFile } = require('fs').promises
const path = require('path')

const handleLogout = async (req, res) => {
  const cookies = req.cookies
  if (!cookies.jwt) return res.status(204) // No content
  const refreshToken = cookies.jwt
  const foundUser = usersDB.users.find((user) => user.refreshToken === refreshToken)
  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
    return res.sendStatus(204)
  }

  // Clear refresh token in db
  const otherUsers = usersDB.users.filter((user) => user.username !== foundUser.username)
  const currentUser = { ...foundUser, accessToken: '' }
  usersDB.setUsers([...otherUsers, currentUser])

  await writeFile(path.join(__dirname, '..', 'data', 'users.json'), JSON.stringify(usersDB.users))
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }) 
  res.sendStatus(204)
}

module.exports = { handleLogout }
