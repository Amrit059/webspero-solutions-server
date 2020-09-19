import { Request, Response, NextFunction } from 'express';
import { UserModel, UserDocument } from '../models/user.model';
import { UtillServices } from '../utill.service';
import { createJsonWebToken } from '../jwt-token.service';

const utillServices: UtillServices = new UtillServices();

export class UserController {
    constructor() {
        console.log('User Controller called');
    }

    async loginUser(req: Request, res: Response, next: NextFunction) {
        try {
            let userModel: UserDocument = req.body;
            userModel = await UserModel.findOne({
                email: userModel.email
            }).exec();
            // console.log('inside loginUser userModel is ', userModel);
            if (userModel == null || userModel == undefined) {
                res.status(403).send({ message: 'invalid credential!' });
            } else if (utillServices.decodeBase64(userModel.password) === utillServices.decodeBase64(userModel.password)) {
                let newUserModel = await UserModel.findByIdAndUpdate({
                    _id: userModel._id
                }, { isActive: true }, { new: true })
                newUserModel.set('token', `Bearer ${createJsonWebToken(userModel)}`, { strict: false });
                res.status(200).send(newUserModel);
            } else {
                res.status(404).send({ message: 'invalid credential!' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).send({ message: err });
        }
    }

    async getUserById(req: Request, res: Response, next: NextFunction) {
        // console.log('inside getUserListByLocation');
        const userId: Number = req.app.locals.userId
        try {
            const userModel: UserDocument = await UserModel.findById({ _id: userId })
            res.status(200).send(userModel);
        } catch (err) {
            console.error(err);
            res.status(500).send({ message: err });
        }
    }

    async getUserListByLocation(req: Request, res: Response, next: NextFunction) {
        // console.log('inside getUserListByLocation');
        const latitude: Number = Number(req.query.lat)
        const longitude: Number = Number(req.query.lng)
        try {
            const userModel: UserDocument[] = await UserModel.find({
                isActive: true,
                location: {
                    $near:
                    {
                        $geometry: { type: "Point", coordinates: [latitude, longitude] },
                        $maxDistance: 100000
                    }
                }
            }, {
                _id: 1, name: 1, email: 1, phoneNo: 1, profilePic: 1, isActive: 1
            }).skip(Number(0)).limit(Number(5)).exec();
            res.status(200).send(userModel);
        } catch (err) {
            console.error(err);
            res.status(500).send({ message: err });
        }
    }

    async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            let userModel: UserDocument = req.body;
            if (!userModel.email ||
                userModel.email == undefined ||
                userModel.email == '' ||
                userModel.email == null
            ) {
                res.status(404).send({ message: 'email is required' })
            }
            if (!userModel.zipCode ||
                userModel.zipCode == undefined ||
                userModel.zipCode == null
            ) {
                res.status(404).send({ message: 'zipcode is required' })
            }
            userModel.password = utillServices.encodeBase64(userModel.password)
            let newLocationJson: any = {
                coordinates: [userModel.lat, userModel.lng],
                type: 'Point'
            }
            userModel.location = newLocationJson;
            userModel = new UserModel(userModel);
            userModel = await userModel.save()
            res.status(200).send(userModel);
        } catch (err) {
            console.error(err);
            res.status(500).send({ message: err });
        }
    }

    async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            let userModel: UserDocument = req.body;
            let userId = req.app.locals.userId
            let mkres = {};
            if (userModel.name) {
                mkres['name'] = userModel.name
            }
            if (userModel.email) {
                mkres['email'] = userModel.email
            }
            if (userModel.password) {
                mkres['password'] = utillServices.encodeBase64(userModel.password)
            }
            if (userModel.phoneNo) {
                mkres['phoneNo'] = userModel.phoneNo;
            }
            if (userModel.mobileNo) {
                mkres['mobileNo'] = userModel.mobileNo;
            }
            if (userModel.profilePic) {
                mkres['profilePic'] = userModel.profilePic;
            }
            userModel = await UserModel.findOneAndUpdate({ _id: userId, isActive: true }, {
                $set: mkres
            }).exec();
            res.status(200).send(userModel);
        } catch (err) {
            console.error(err);
            res.status(500).send({ message: err });
        }
    }

    async logoutUser(req: Request, res: Response, next: NextFunction) {
        let userId: string = req.app.locals.userId;
        // console.log(req.app.locals)
        try {
            await UserModel.findByIdAndUpdate({
                _id: userId
            }, { isActive: false }, { new: true })
            res.status(200).send({ message: 'logout sucessfully' });
        } catch (err) {
            console.error(err)
        }
    }

}