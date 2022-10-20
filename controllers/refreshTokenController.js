const usersDB = {
  users: require('../data/users.json'),
  setUsers: function (data) {
    this.users = data
  },
}
const jwt = require('jsonwebtoken')

const handleRefeshToken = (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(401)
  const refreshToken = cookies.jwt
  const foundUser = usersDB.users.find((user) => user.refreshToken === refreshToken)
  if (!foundUser) return res.sendStatus(403)

  const roles = Object.values(foundUser.roles)

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || decoded.username !== foundUser.username) return res.sendStatus(403)
    const accessToken = jwt.sign(
      { UserInfos: {username: foundUser.username, roles} },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    )
    res.json({ accessToken })
  })
}

module.exports = { handleRefeshToken }
