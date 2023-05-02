import { UserRepository } from "../Repositories/UserRepository";
import bcrypt from 'bcrypt';

export class UserController {
    userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    public async createUser(request: any, response: any) {
        var body = request.body;

        var userExists = await this.userRepository.userExists(body.email);
        if(userExists) {
            return response.status(400).json({
                errors: [
                    {msg: "Usuário já existe"}
                ]
            })
        }

        body.password = await bcrypt.hash(body.password, 10);
        const user = await this.userRepository.createUser(body);

        if(user) {
            return response.status(201).json(user);
        } else {
            return response.status(400).json({
                errors: [
                    {msg: "Falha ao criar usuário"}
                ]
            });
        }
    }

    public async getAllUsers(request: any, response: any) {
        var users = await this.userRepository.getAllUsers();

        return response.status(200).json(users);
    }

    public async getUserById(request: any, response: any) {
        var user = await this.userRepository.getUserById(request.params.id);

        if(user) {
            return response.status(200).json(user);
        }else {
            return response.status(400).json({
                errors: [
                    {msg: "Usuário não encontrado"}
                ]
            });
        }
    }

    public async updateUser(request: any, response: any) {
        var id = request.params.id;
        var body = request.body;

        var user = await this.userRepository.getUserById(id);
        
        if(user) {
            var updatedUser = await this.userRepository.updateUser(id, body)

            if(updatedUser) {
                return response.status(200).json(updatedUser);
            } else {
                return response.status(400).json({
                    errors: [
                        {msg: "Falha ao atualizar usuário"}
                    ]
                });
            }
        }else {
            return response.status(400).json({
                errors: [
                    {msg: "Usuário não encontrado"}
                ]
            });
        }
    }

    public async deleteUser(request: any, response: any) {
        var id = request.params.id;

        var user = await this.userRepository.getUserById(id);

        if(user) {
            var deletedUser = await this.userRepository.deleteUser(id);

            if(deletedUser) {
                return response.status(200).json(deletedUser);
            } else {
                return response.status(400).json({
                    errors: [
                        {msg: "Falha ao deletar usuário"}
                    ]
                });
            }
        } else {
            return response.status(400).json({
                errors: [
                    {msg: "Usuário não encontrado"}
                ]
            });
        }
    }
}