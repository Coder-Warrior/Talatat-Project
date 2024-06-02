import mongoose from "mongoose";
import bcrypt from 'bcrypt';

function isEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'username required'],
        maxLength: [30, 'TOO long username'],
        minLength: [3, 'TOO short username'],
    },
    email: {
        type: String,
        required: [true, 'email required'],
        unique: [true, "this email is already exsists"],
        validate: [isEmail, "Please Enter A Valid Email"],
    },
    password: {
        type: String,
        required: [true, "password required"],
        maxLength: [30, 'TOO long password'],
        minLength: [3, 'TOO short password'],
    },
    verified: {
        type: Boolean,
        default: false,
    },
    image: {
        type: String,
        default: "url"
    }
});

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.statics.login = async function (email, password) {
    let user = await this.findOne({ email });

    if (user) {
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            return user;
        }
      throw Error("Incorrect Password")
    }

    throw Error("This User Isnt Exsists")

}

const User = mongoose.model("user", userSchema);

export default User;