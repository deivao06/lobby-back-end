import express from "express";
import { body, validationResult } from 'express-validator';

import { AuthController } from "../Controllers/AuthController";

const app = express();
const authRouter = express.Router();

const authController: AuthController = new AuthController();

authRouter.post('/login', 
    body('email').notEmpty().withMessage("Campo email obrigatório"),
    body('email').isEmail().withMessage("Campo mail deve ser um email válido"),
    body('password').notEmpty().withMessage("Campo senha é obrigatório"),
    function(request, response) {
        const errors = validationResult(request);

        if(!errors.isEmpty()) {
            return response.status(400).json({ errors:errors.array() });
        }

        authController.login(request, response)
});

export default authRouter;