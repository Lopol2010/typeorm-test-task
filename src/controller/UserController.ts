import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";
import { Address } from "../entity/Address";
import { Company } from "../entity/Company";

export class UserController {

    private userRepository = getRepository(User);
    private addressRepository = getRepository(Address);
    private companyRepository = getRepository(Company);

    async all(request: Request, response: Response, next: NextFunction) {
        // return this.userRepository.find({relations: ["address", "company"]});
        return this.userRepository.find();
    }

    async one(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.findOne(request.params.id);
    }

    async save(request: Request, response: Response, next: NextFunction) {
        let user = await this.userRepository.findOne({email: request.body.email})
        if (user) {
            console.log("Такой email уже зарегистрирован, обновление данных")
            return this.userRepository.save(user)
        }
        console.log("Регистрация нового email: " + request.body.email)
        return this.userRepository.save(request.body);
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        let userToRemove = await this.userRepository.findOne(request.params.id);
        await this.userRepository.remove(userToRemove);
    }

    async removeAll(request: Request, response: Response, next: NextFunction) {
        let users = await this.userRepository.find({relations: ["address", "company"]})
        console.log("Очистка базы данных")
        return this.userRepository.remove(users);
    }

}