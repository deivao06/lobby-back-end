import * as dotenv from "dotenv";
import { UserRepository } from "../Repositories/UserRepository";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthController {
    userRepository: UserRepository;
    secret: jwt.Secret;

    constructor() {
        this.userRepository = new UserRepository();

        dotenv.config();

        if (!process.env.TOKEN_SECRET) {
            process.exit(1);
        }

        this.secret = process.env.TOKEN_SECRET;
    }

    public async login(request: any, response: any) {
        var body = request.body;
        var userExists = await this.userRepository.userExists(body.email);

        if(!userExists) {
            return response.status(400).json({
                errors: [
                    {msg: "Usuário inexistente"}
                ]
            })
        }

        const user = await this.userRepository.getUserByEmail(body.email);

        if(user && bcrypt.compareSync(body.password, user.password)) {
            const token = jwt.sign({ user }, this.secret, {
                expiresIn: "30 days"
            })

            response.status(200).json({
                token: token
            })
        } else {
            return response.status(400).json({
                errors: [
                    {msg: "Email ou senha incorretos"}
                ]
            })
        }
    }
}