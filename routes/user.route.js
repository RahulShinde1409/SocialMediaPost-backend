import express from 'express'
import { addUser,getUsers,getUser,updateUser,deleteUser } from '../controller/user.controller.js';
import { login,Register,forgetPassword,resetPassword} from '../controller/auth.controller.js';



const route = express.Router();


route.post('/add-user', addUser)
route.get('/get-users', getUsers)
route.get('/get-user/:user_id', getUser)
route.put('/update-user/:user_id', updateUser)
route.delete('/delete-user/:user_id', deleteUser)



//Authentication Route
route.post('/login',login);
route.post('/register',Register)
// route.post('/forget-password', forgetPassword);
// route.post('/reset-password',resetPassword);

export default route