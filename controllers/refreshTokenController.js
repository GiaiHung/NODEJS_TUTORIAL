const User = require('../models/User')
const jwt = require('jsonwebtoken')

const handleRefeshToken = async (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(401)
  const refreshToken = cookies.jwt
  const foundUser = await User.findOne({ refreshToken }).exec()
  if (!foundUser) return res.sendStatus(403)

  const roles = Object.values(foundUser.roles)

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || decoded.username !== foundUser.username) return res.sendStatus(403)
    const accessToken = jwt.sign(
      { UserInfos: { username: foundUser.username, roles } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '30s' }
    )
    res.json({ accessToken })
  })
}

module.exports = { handleRefeshToken }
