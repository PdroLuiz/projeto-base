const {Router} = require('express');
const usercontroller = require('./controllers/usercontroller');
const auth = require("./middlewares/auth");
const routes = Router();

routes.use('/user', Router()
.get('/info', auth, usercontroller.info)
.post('/create', usercontroller.signup)
.post('/session', usercontroller.signin)
.post('/changepassword', auth, usercontroller.changePassword)
.post('/logout', auth, usercontroller.logout)
);

module.exports = routes;