//Define our about us schema
import * as mongoose from 'mongoose'

export interface LocationDocument extends mongoose.Document {
    type?: string;
    coordinates?: Number[];
}
const LocationSchema = new mongoose.Schema({
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
}, { _id: false });



export interface UserDocument extends mongoose.Document {
    _id: string;
    name?: string;
    password?: string;
    email?: string;
    phoneNo?: string;
    mobileNo?: string;
    location?: LocationDocument;
    profilePic?: string;
    zipCode?: Number;
    lat?: Number;
    lng?: Number;
    isActive?: Boolean;
    createdAt?: Date;
}

const UserSchema = new mongoose.Schema({
    name: { type: String },
    password: { type: String },
    email: { type: String, unique: true, required: true },
    phoneNo: { type: String },
    mobileNo: { type: String },
    location: { type: LocationSchema },
    profilePic: { type: String },
    zipCode: { type: Number, required: true },
    lat: { type: Number },
    lng: { type: Number },
    isActive: { type: Boolean },
    createdAt: { type: Date, 'default': Date.now },
});

UserSchema.index({location: "2dsphere"}) 
export const UserModel: mongoose.Model<UserDocument> =
    mongoose.model<UserDocument>('NewUser', UserSchema, 'NewUser');