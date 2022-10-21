const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const handleLogin = async (req, res) => {
  const { username, password } = req.body
  if (!username || !password)
    return res.status(400).json({ message: 'Error: Username or password is required' })
  const foundUser = await User.findOne({username}).exec()
  if (!foundUser) return res.sendStatus(401)

  const roles = Object.values(foundUser.roles) // Convert to array

  const salt = await bcrypt.genSalt(15)
  const newHashedPassword = await bcrypt.hash(foundUser.password, salt)

  const isMatch = await bcrypt.compare(password, newHashedPassword)

  if (isMatch) {
    // JWT signs the access token
    jwt.sign(
      {
        UserInfos: { username: foundUser.username, roles },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1m' }
    )
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    )

    // Saving refresh token to current user
    foundUser.refreshToken = refreshToken
    foundUser.save()

    res.cookie('jwt', refreshToken, {
      // Add in to fix bug but don't know why :))
      httpOnly: true,
      sameSite: 'None',
      // secure: true, Put it back when in production mode works in Chrome or other browsers
      maxAge: 24 * 60 * 60 * 1000,
    })
    res.json(foundUser)
  } else {
    return res.sendStatus(401)
  }
}

module.exports = { handleLogin }
