const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) return res.sendStatus(401)
    const rolesArray = [...allowedRoles]
    const roles = req.roles

    const result = roles
      .map((role) => rolesArray.includes(role))
      .find((boolean) => boolean === true)
    if (!result) return res.sendStatus(401)

    next()
  }
}

module.exports = verifyRoles
