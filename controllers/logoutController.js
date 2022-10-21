const User = require('../models/User')

const handleLogout = async (req, res) => {
  const cookies = req.cookies
  if (!cookies.jwt) return res.status(204) // No content
  const refreshToken = cookies.jwt
  const foundUser = await User.findOne({ refreshToken }).exec()
  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
    return res.sendStatus(204)
  }

  // Clear refresh token in db
  foundUser.refreshToken = ''
  const result = await foundUser.save()
  res.clearCookie('jwt', { 
    httpOnly: true, 
    sameSite: 'None', 
    // secure: true Put it back when in production mode
  })
  res.sendStatus(result)
}

module.exports = { handleLogout }
