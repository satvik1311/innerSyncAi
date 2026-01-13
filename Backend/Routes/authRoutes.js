import express from 'express';
const routes = express.Router();
import { signUp , Login } from '../Controllers/authController.js';

routes.post('/signup', signUp);
routes.post('/login', Login);

// routes.post('/signup', (req, res) => {
//     // Handle signup logic here
//     res.json({ message: 'Signup successful!' });
// });

// routes.post('/login', (req, res) => {
//     // Handle login logic here
//     res.json({ message: 'Login successful!' });
// });
export default routes;