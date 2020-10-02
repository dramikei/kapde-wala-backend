const Login = require('../models/login');

module.exports = {
  login: (req, res) => {
    const username = req.body.username.toLowerCase();
    const password = req.body.password;
    Login.findOne({ where: { username: username, password: password } }).then(
      (user) => {
        if (user == null) {
          res.json({
            status: 'error',
            message: 'Invalid username or password',
          });
        } else {
          res.json({
            status: 'success',
          });
        }
      }
    );
  },
};
