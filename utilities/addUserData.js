module.exports = (req, res, next) => {
  if (!res.locals.userData) {
    res.locals.userData = null;
  }
  next();
}