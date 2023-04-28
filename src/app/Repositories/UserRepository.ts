import { PrismaClient, User } from "@prisma/client";

export class UserRepository
{
    private prisma: PrismaClient

    constructor() {
        this.prisma = new PrismaClient()    
    }

    public async createUser(userData: Omit<User, 'id'>): Promise<Omit<User, 'password'>> {
        const user = await this.prisma.user.create({ data: userData })
        return this.exclude(user, ["password"]);
    }

    public async getUserById(userId: number): Promise<User | null> {
        const user = await this.prisma.user.findUnique({ where: { id: userId } })
        return user
    }

    public async getAllUsers() {
        const users = await this.prisma.user.findMany();

        var usersWithoutPassword = users.map(user => {
            return this.exclude(user, ["password"]);
        })

        return usersWithoutPassword;
    }

    public async updateUser(userId: number, userData: Partial<User>): Promise<User | null> {
        userData = this.exclude(userData, ['id']);
        
        const user = await this.prisma.user.update({ where: { id: userId }, data: userData })
        
        return user
    }

    public async deleteUser(userId: number): Promise<User | null> {
        const user = await this.prisma.user.delete({ where: { id: userId } })
        return user
    }

    public async userExists(email: string): Promise<boolean> {
        const user = await this.prisma.user.findUnique({ where: { email : email } })

        return !user ? false : true
    }

    private exclude<User, Key extends keyof User> (user: User, keys: Key[]): Omit<User, Key> {
        for (let key of keys) {
          delete user[key]
        }

        return user
    }
}