import express from "express";
import mongoose from 'mongoose';
import cookieParser from "cookie-parser";
import connectMongo from "connect-mongo";
import session from 'express-session';
import User from "./models/userModel.js";
import cors from "cors";
import bcrypt from "bcrypt";
import VerificationModel from "./models/verificationCodeModel.js";
import nodeMailer from "nodemailer";
import ImageKit from "imagekit";
import multer from "multer";
import fs from 'fs';
import Services from "./models/addServiceModel.js";
import crypto from "crypto";
import { Server } from 'socket.io';
import http from "http";
import Message from "./models/messageModel.js";
import fileType from 'detect-file-type';
import Requests from "./models/PadingRequests.js";
import axios from "axios";
import sharp from "sharp";
import jwt from "jsonwebtoken";
import { truncate } from "fs/promises";

const app = express();
const fuckenSecret = "Abcd1234.";
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: fuckenSecret,
    resave: false,
    saveUninitialized: false,
    visited: true,
    store: connectMongo.create({
        mongoUrl: "mongodb+srv://ali:Jj7nwuCkF9fUojR9@cluster0.jvmmmzc.mongodb.net/serverSideSession?retryWrites=true&w=majority&appName=Cluster0",
        collectionName: "sessions"
    }),
    cookie: {
        maxAge: 17 * 24 * 60 * 60 * 1000,
    }
}));

function handleErrors(e) {
    let errors = { username: '', email: "", password: '', image: '' };

    if (e.code === 11000) {
        errors.email = "Email Already Exsists"
    }

    if (e.message === "Password Required") {
        errors.password = "Password Required";
    }

    if (e.message === "TOO short password") {
        errors.password = "TOO short password";
    }

    if (e.message === "TOO long password") {
        errors.password = "TOO long password";
    }

    if (e.message === "This User Isnt Exsists") {
        errors.email = "This User Isnt Exsists";
    }

    if (e.message === "Incorrect Password") {
        errors.password = "Incorrect Password";
    }

    if (e.message === "Please Choose Img") {
        errors.image = "Please Choose Img";
    }

    if (e.errors) {
        for (let i = 0; i < Object.values(e.errors).length; i++) {
            errors[Object.values(e.errors)[i].properties.path] = Object.values(e.errors)[i].properties.message;
        }
    }
    return errors;
}

function handleAddServiceError(e) {
    let addServiceError = { serviceUsername: "", serviceDescription: "", servicePrice: "", addServicePicture: "" };

    if (e.message === "يجب ان يكون نوع الملفات صور" || e.message === "يجب ان يكون عدد الصور لا يقل ولا يزيد عن 4") {
        addServiceError.addServicePicture = e.message;
    }

    if (e.errors) {
        for (let i = 0; i < Object.values(e.errors).length; i++) {
            addServiceError[Object.values(e.errors)[i].properties.path] = Object.values(e.errors)[i].properties.message;
        }
    }

    return addServiceError;

}

const transporter = nodeMailer.createTransport({
    service: "",
    auth: {
        user: "",
        pass: ""
    }
});

const imagekit = new ImageKit({
    publicKey: "",
    privateKey: "",
    urlEndpoint: "",
});

const upload = multer({ storage: multer.memoryStorage() });

const getFileTypeFromBuffer = (buffer) => {
    return new Promise((resolve, reject) => {
        fileType.fromBuffer(buffer, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result)
            }
        });
    });
};

app.get("/auth", async (req, res) => {

    const sessionsCollection = await mongoose.connection.collection("sessions");

    const WantedSession = await sessionsCollection.findOne({ _id: req.sessionID });
    if (WantedSession) {

        const sessionInfo = await JSON.parse(WantedSession.session);

        if (Date.now() >= (sessionInfo.endsAt / 2) && Date.now() < sessionInfo.endsAt && req.session.refreshed === false) {
            const wantedTime = new Date(Date.now() + (13 * 24 * 60 * 60 * 1000))
            await sessionsCollection.updateOne({ _id: req.sessionId }, { $set: { expires: wantedTime } });
            res.cookie("connect.sid", req.cookies["connect.sid"], { maxAge: wantedTime.getTime() });
            req.session.refreshed = true;
            const user = await User.findOne({ _id: sessionInfo.userId });
            res.status(200).json({ user });
        } else if (req.session.refreshed === true) {
            const user = await User.findOne({ _id: sessionInfo.userId });
            res.status(200).json({ user });
        } else {
            res.status(400).json({ transfair: true });
        }


    } else {
        res.status(400).json({ transfair: true });
    }

});

app.get("/", (req, res) => {
    res.send("Hello");
});

app.post("/auth/register", upload.single("picture"), async (req, res) => {
    const { username, email, password } = req.body;

    try {

        if (req.file) {
            if (req.file.mimetype !== "image/jpeg" && req.file.mimetype !== "image/png" && req.file.mimetype !== "image/jpg") {
                throw Error("Please Choose Img");
            } 
        } else {
            throw Error("Please Choose Img");
        }


        const user = await User.create({ username, email, password });
        req.session.userId = user._id;
        let currentDate = new Date();
        let endsAt = new Date(currentDate.getTime() + (30 * 24 * 60 * 60 * 1000));
        req.session.endsAt = endsAt.getTime();
        req.session.refreshed = false;

        const uploadedImage = await imagekit.upload({
            file: req.file.buffer,
            fileName: req.file.originalname,
            folder: "/users" // Specify the folder path where you want to store the image
        });

        await User.updateOne({ _id: user._id }, { $set: { image: uploadedImage.url } });

        const salt = await bcrypt.genSalt();
        const code = `${Math.trunc(Math.random() * 1000000)}`;
        const verificationCode = await bcrypt.hash(code, salt);

        try {
            const vcode = await VerificationModel.create({ code: verificationCode, userId: user._id, cAt: Date.now() });
        } catch (e) {
            console.log(e)
        }

        try {
            await transporter.sendMail({
                from: 'rebus5703@gmail.com',
                to: email,
                subject: '3alatat Email Verification!',
                html: `
                <h1>Talatat Team</h1><br>
                <strong>${user.username} مرحبا</strong><br>
                <strong>لقد أرسلنا إليك رمز تحقق من البريد الإلكتروني. لا تشارك هذا الرمز مع أي شخص آخر، ونحن لن نطلب منك أبدًا الحصول على هذا الرمز.</strong><br>
                <h2>${code}</h2>
                `
              });
        } catch (e) {
            console.log(e)
        }

        res.status(200).json({ user });
    } catch (e) {
        res.status(400).json({ errors: handleErrors(e) });
    }

});

app.post("/checkForUrl", async (req, res) => {
    const { id } = req.body;

    const doc = await VerificationModel.findOne({ userId: id });

    if (doc) {
        return res.json({ Found: true });
    }

    res.json({ Found: false })

});

app.post("/getUser", async (req, res) => {
    const { id } = req.body;
    try {
        if (mongoose.Types.ObjectId.isValid(id) === false) {
            return res.status(404).json({ notFound: true });
        }
        const user = await User.findOne({ _id: id });

        if (user) {
            return res.status(200).json({ user });
        }

        res.status(404).json({ notFound: true });
    } catch (e) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/verifypls", async (req, res) => {
    const { vcode } = req.body;
    const { id } = req.body;

    const vdoc = await VerificationModel.findOne({ userId: id, reason: "emailVerification" });

    if (vdoc) {
        const match = await bcrypt.compare(vcode, vdoc.code);
        if (match) {
            await User.updateOne({ _id: id }, { $set: { verified: true } });
            await VerificationModel.deleteOne({ userId: id, reason: "emailVerification" });
            res.status(200).json({ match: true });
        } else {
            res.status(400).json({ match: false })
        }
    } else {
        res.status(400).json({ userDidntFound: true });
    }

});

app.post("/resendEmail", async (req, res) => {
    const { id } = req.body;
    try {

        const wantedDoc = await VerificationModel.findOne({ userId: id, reason: "emailVerification" });

        if (Date.now() >= wantedDoc.cAt) {

            await VerificationModel.deleteOne({ userId: id, reason: "emailVerification" });

            const salt = await bcrypt.genSalt();
            const code = `${Math.trunc(Math.random() * 1000000)}`;
            const verificationCode = await bcrypt.hash(code, salt);
    
            const vcode = await VerificationModel.create({ code: verificationCode, userId: id, cAt: Date.now() + 60000, reason: "emailVerification" });
    
            const user = await User.findOne({ _id: id });

            await transporter.sendMail({
                from: 'rebus5703@gmail.com',
                to: user.email,
                subject: '3alatat Email Verification!',
                html: `
                <h1>Talatat Team</h1><br>
                <strong>${user.username} مرحبا</strong><br>
                <strong>لقد أرسلنا إليك رمز تحقق من البريد الإلكتروني. لا تشارك هذا الرمز مع أي شخص آخر، ونحن لن نطلب منك أبدًا الحصول على هذا الرمز.</strong><br>
                <h2>${code}</h2>
                `
              });

            res.status(200).json({ sent: true });

        } else {
            res.json({ msg: "يجب عليك الانتظار 1 دقيقة قبل اعادة ارسال الرمز مرة اخرى" })
        }

      
    } catch (e) {
        console.log(e);
    }
});

app.post("/auth/login", async (req, res) => {

    let { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        req.session.userId = user._id;
        let currentDate = new Date();
        let endsAt = new Date(currentDate.getTime() + (30 * 24 * 60 * 60 * 1000));
        req.session.endsAt = endsAt.getTime();
        req.session.refreshed = false;
        res.status(200).json({ user });
    } catch (e) {
        res.status(400).json({ errors: handleErrors(e) });
    }

});

app.post("/addService", upload.array("pictures", 4), async (req, res) => {
    try {

        for (let i = 0; i < req.files.length; i++) {
            if (req.files[i].mimetype !== "image/jpeg" && req.files[i].mimetype !== "image/png" && req.files[i].mimetype !== "image/jpg") {
                throw Error("يجب ان يكون نوع الملفات صور");
            } 
        }

        if (req.files.length < 4) {
            throw Error("يجب ان يكون عدد الصور لا يقل ولا يزيد عن 4");
        }

        if (req.files.length > 4) {
            throw Error("يجب ان يكون عدد الصور لا يقل ولا يزيد عن 4");
        }

        const { serviceUsername, serviceDescription, _id, servicePrice } = req.body;

        const token = crypto.randomBytes(32).toString("hex")

        const service = await Services.create({ serviceUsername, serviceDescription, ServiceOwner: _id, token, servicePrice });

        for (let i = 0; i < req.files.length; i++) {
            const uploadedImage = await imagekit.upload({
                file: req.files[i].buffer,
                fileName: req.files[i].originalname,
                folder: `/Services/${token}/` 
            });
            await Services.updateOne({ _id: service._id}, { $push: { serviceImgs: { url: uploadedImage.url } } });
        }

        res.status(200).json({ service })

    } catch (e) {
        console.log(e);
        res.status(400).json({ addServiceError: handleAddServiceError(e) });
    }
});

app.post("/getServices", async (req, res) => {
    const srvcs = await Services.find({});
    let services = [];

    for (let i = 0; i < srvcs.length; i++) {

        if (srvcs[i].ServiceOwner !== req.body.id) {

            const user = await User.findOne({ _id: srvcs[i].ServiceOwner });

            let serviceObj = srvcs[i].toObject();
    
            serviceObj.ServiceOwnerName = user.username;
            serviceObj.ServiceOwnerPicture = user.image;
            
            services.push(serviceObj);

        }

    }

    res.status(200).json({ services });
});

app.post("/getService", async (req, res) => {
    const { id } = req.body;

    if (mongoose.Types.ObjectId.isValid(id) === false) {
    return res.status(404).json({ notFound: true });
    }

    const service = await Services.findOne({ _id: id });

    if (service) {
    let reqFound = false;
    const request = await Requests.findOne({ serviceId: service._id });
    if (request) {
        reqFound = true;
    }
    return res.status(200).json({ service, reqFound })
    }

    res.status(404).json({ notFound: true });

});

app.post("/getMessages", async (req, res) => {
    const messages = await Message.find({ });
    let msgs = [];

    for (let i = 0; i < messages.length; i++) {
        if ((messages[i].messageFrom === req.body.userId && messages[i].messageTo === req.body.anotherUserId) || (messages[i].messageTo === req.body.userId && messages[i].messageFrom === req.body.anotherUserId)) {
            msgs.push(messages[i]);
        }
    }

    res.status(200).json({ msgs });
})

app.post("/getUserServices", async (req, res) => {

    const { id } = req.body;

    try {
        if (mongoose.Types.ObjectId.isValid(id) === false) {
            return res.status(404).json({ notFound: true });
        }
        const user = await User.findOne({ _id: id });

        if (user) {
            const srvcs = await Services.find({ ServiceOwner: user._id });
            let services = [];
            
            for (let i = 0; i < srvcs.length; i++) {
                
                    let serviceObj = srvcs[i].toObject();
            
                    serviceObj.ServiceOwnerName = user.username;
                    serviceObj.ServiceOwnerPicture = user.image;
                    
                    services.push(serviceObj);
        
        
            }

            return res.status(200).json({ services });
        }

        res.status(404).json({ notFound: true });
    } catch (e) {
        res.status(500).json({ error: "Internal Server Error" });
    }

});

app.post("/getUserServicess", async (req, res) => {

    const { id } = req.body;

    try {
        if (mongoose.Types.ObjectId.isValid(id) === false) {
            return res.status(404).json({ notFound: true });
        }
console.log(id);
            const srvcs = await Services.find({ ServiceOwner: id });
            console.log(srvcs);
            const user = await User.findOne({ _id: id });
            let services = [];

            for (let i = 0; i < srvcs.length; i++) {
                let obj = srvcs[i].toObject();
                obj.ServiceOwnerPicture = user.image;
                obj.ServiceOwnerName = user.username;
                services.push(obj);
            }

           res.status(200).json({ services });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Internal Server Error" });
    }

})

io.on("connection", (socket) => {

    console.log("user connected");

    socket.on("msgSent", async (val) => {
        if (val.message) {
            try {
                if (val.message.length < 1) {
                    throw Error("message Empty");
                }
                const message = await Message.create({ messageFrom: val.from, messageTo: val.to, message: val.message });
                io.emit("msgSentSuccessfully", message);
            } catch (e) {
                console.log(e);
            }
        } else {
            try {

                if (val.filess.length < 1) {
                    throw Error("No Image Selected");
                }

                const token = crypto.randomBytes(32).toString("hex");
                const msg = await Message.create({ messageFrom: val.from, messageTo: val.to, token });
            
                for (let i = 0; i < val.filess.length; i++) {
                  const filename = crypto.randomBytes(32).toString("hex");
            
                  const ftype = await getFileTypeFromBuffer(val.filess[i]);

                  if (ftype.mime !== "image/png" && ftype.mime !== "image/jpeg") {
                    throw Error("file Type Must Be An Image");
                  }

                  const uploadedImage = await imagekit.upload({
                    file: val.filess[i],
                    fileName: filename,
                    folder: `/Messages/${token}/`
                  });
            
            
                  await Message.updateOne({ _id: msg._id }, {
                    $push: {
                      urls: {
                        url: uploadedImage.url,
                        type: uploadedImage.fileType
                      }
                    }
                  });
                }
            
                const message = await Message.findOne({ _id: msg._id });

                io.emit("msgSentSuccessfully", message);
              } catch (e) {
                console.log(e);
              }
        }
    });

    socket.on("disconnect", () => {
        console.log('A user disconnected');
    });
});

app.post("/createRequest", async (req, res) => {
    try {
        await Requests.create(req.body);
    } catch (e) {
        console.log(e);
    }
});

app.delete("/createRequest", async (req, res) => {
    try {
        await Requests.deleteOne({ Requester: req.body.Requester });
    } catch (e) {
        console.log(e);
    }
});

app.post("/getRequests", async (req, res) => {
    const { id } = req.body;

    try {
        const reqs = await Requests.find({ requestReciver: id });
        let users = [];
        for (let i = 0; i < reqs.length; i++) {
            let user = reqs[i].toObject();
            const userr = await User.findOne({ _id: user.Requester });
            user.username = userr.username;
            user.image = userr.image;
            users.push(user);
        }
        res.status(200).json({ users });
    } catch (e) {
        console.log(e);
    }
});

app.post("/getPeople", async (req, res) => {
    const { id } = req.body;
    try {
        const peoples = await Message.find({ });
        let people = [];
        for (let i = 0; i < peoples.length; i++) {
            if (peoples[i].messageFrom === id) {
                const user = await User.findOne({ _id: peoples[i].messageTo });
                let match = people.filter(usr => usr._id.toString() === peoples[i].messageTo);
                if (match.length < 1) {
                    people.push(user);
                }
            } else if (peoples[i].messageTo === id) {
                const user = await User.findOne({ _id: peoples[i].messageFrom });
                let match = people.filter(usr => usr._id.toString() === peoples[i].messageFrom);
                if (match.length < 1) {
                    people.push(user);
                }
            }
        }
        res.status(200).json({ people });
    } catch (e) {
        console.log(e);
    }
});

function compareImages(buffer1, buffer2) {
    if (buffer1.length !== buffer2.length) {
      return true;
    }
    for (let i = 0; i < buffer1.length; i++) {
      if (buffer1[i] !== buffer2[i]) {
        return true;
      }
    }
    return false;
}

app.post("/editService", upload.array("pictures", 4), async (req, res) => {
    try {
        const service = await Services.findOne({ _id: req.body.id });

        if (req.body.serviceUsername.length > 0 && req.body.serviceDescription.length > 0 && req.body.servicePrice.length > 0) {
            let errors = { serviceUsername: "", serviceDescription: "" };
            if (req.body.serviceUsername.length < 4 || req.body.serviceUsername.length > 20) {
                errors.serviceUsername = "لا يجب ان يحتوي اسم الخدمة على اقل من 4 حروف او اكثر من 20 حرف";
            }
            if (req.body.serviceDescription.length < 30 || req.body.serviceDescription.length > 120) {
                errors.serviceDescription = "لا يجب ان يحتوي اسم الخدمة على اقل من 30 حروف او اكثر من 120 حرف";
            }
            if (errors.serviceUsername.length > 0 || errors.serviceDescription.length > 0) {
                return res.status(400).json({ errors });
            }
        } else {
            return res.status(400).json({ error: "لا يجب  ترك الحقول فارغة" })
        }

        if ((req.files.length >= 1 && req.files.length < 4) || (req.files.length > 4)) {
            return res.status(400).json({ error: "لا يجب ان يقل عدد الصور او يزيد عن 4" })
        } else {
            for (let i = 0; i < req.files.length; i++) {
                if (req.files[i].mimetype !== "image/jpeg" && req.files[i].mimetype !== "image/png") {
                    return res.status(400).json({ error: "يجب ان يكون نوع الملفات صور" });
                } 
            }
        }

        let imgsSame = true;
        for (let i = 0; i < req.files.length; i++) {
            for (let j = 0; j < service.serviceImgs.length; j++) {
                const response = await axios.get(service.serviceImgs[i].url, { responseType: 'arraybuffer' });
                const imageKitImage = await sharp(response.data).raw().toBuffer();
                console.log(response.data);
                const isSame = compareImages(req.files[i].buffer, response.data); 
               if (isSame) {
                    imgsSame = false;
                    break;
                }
            }
        }

        console.log(imgsSame);

        let txtsSame = false;

        if (req.body.serviceUsername === service.serviceUsername && req.body.serviceDescription === service.serviceDescription && req.body.servicePrice === service.servicePrice) {
            txtsSame = true;
        }

        console.log(txtsSame);

        if (imgsSame && txtsSame) {
            return res.status(400).json({ error: "يجب وضع تغيرات" })
        }

        if (req.files.length > 0 && imgsSame === false) {
            await imagekit.deleteFolder(`/Services/${service.token}`);
            const token = crypto.randomBytes(32).toString("hex")
            for (let i = 0; i < req.files.length; i++) {
                const uploadedImage = await imagekit.upload({
                    file: req.files[i].buffer,
                    fileName: req.files[i].originalname,
                    folder: `/Services/${token}/` 
                });
                const oldImage = service.serviceImgs[i].url;
                await Services.updateOne({ _id: service._id, "serviceImgs.url": oldImage }, { $set: { "serviceImgs.$.url": uploadedImage.url } });
                await Services.updateOne({ _id: service._id }, { $set: { token } });
            }
        }

        if (txtsSame === false) {
            await Services.updateOne( { _id: service._id }, { $set: { serviceUsername: req.body.serviceUsername, serviceDescription: req.body.serviceDescription, servicePrice: req.body.servicePrice } } );
        }

        res.status(200).json({ updated: true });

    } catch (e) {
        console.log(e);
    }
});

app.post("/createVerificationCode", async (req, res) => {

    const { id, username, email } = req.body;

    const vdoc = await VerificationModel.findOne({ userId: id, reason: "passwordVerification" });

    if (vdoc) {
        return res.status(200);
    } else {
        const salt = await bcrypt.genSalt();
        const code = `${Math.trunc(Math.random() * 1000000)}`;
        const verificationCode = await bcrypt.hash(code, salt);

        try {
            const v = await VerificationModel.create({ code: verificationCode, userId: id, cAt: Date.now(), reason: "passwordVerification" });

            await transporter.sendMail({
                from: 'rebus5703@gmail.com',
                to: email,
                subject: '3alatat Email Verification!',
                html: `
                <h1>Talatat Team</h1><br>
                <strong>${username} مرحبا</strong><br>
                <strong>لقد أرسلنا إليك رمز تحقق من البريد الإلكتروني. لا تشارك هذا الرمز مع أي شخص آخر، ونحن لن نطلب منك أبدًا الحصول على هذا الرمز.</strong><br>
                <h2>${code}</h2>
                `
              });
              console.log("الكود اتبعت");
        } catch (e) {
            console.log(e)
        }
    }
});

app.post("/verifyPasswordPls", async (req, res) => {
    const { vcode } = req.body;
    const { id } = req.body;

    const vdoc = await VerificationModel.findOne({ userId: id, reason: "passwordVerification" });

    if (vdoc) {
        const match = await bcrypt.compare(vcode, vdoc.code);
        if (match) {
            const token = jwt.sign({ _id: id }, "fuckYou", { expiresIn: 5 * 60 });
            res.status(200).json({ match: true, token });
        } else {
            res.status(400).json({ match: false })
        }
    } else {
        res.status(400).json({ userDidntFound: true });
    }
});

app.post("/resendPassword", async (req, res) => {
    const { id } = req.body;
    try {

        const wantedDoc = await VerificationModel.findOne({ userId: id, reason: "passwordVerification" });

        if (Date.now() >= wantedDoc.cAt) {

            await VerificationModel.deleteOne({ userId: id, reason: "passwordVerification" });

            const salt = await bcrypt.genSalt();
            const code = `${Math.trunc(Math.random() * 1000000)}`;
            const verificationCode = await bcrypt.hash(code, salt);
    
            const vcode = await VerificationModel.create({ code: verificationCode, userId: id, cAt: Date.now() + 60000,  reason: "passwordVerification" });
    
            const user = await User.findOne({ _id: id });

            await transporter.sendMail({
                from: 'rebus5703@gmail.com',
                to: user.email,
                subject: '3alatat Email Verification!',
                html: `
                <h1>Talatat Team</h1><br>
                <strong>${user.username} مرحبا</strong><br>
                <strong>لقد أرسلنا إليك رمز تحقق من البريد الإلكتروني. لا تشارك هذا الرمز مع أي شخص آخر، ونحن لن نطلب منك أبدًا الحصول على هذا الرمز.</strong><br>
                <h2>${code}</h2>
                `
              });

            res.status(200).json({ sent: true });

        } else {
            res.json({ msg: "يجب عليك الانتظار 1 دقيقة قبل اعادة ارسال الرمز مرة اخرى" })
        }

      
    } catch (e) {
        console.log(e);
    }
});

app.post("/checkPassword", async (req, res) => {
    const { id, password } = req.body;
    try {
        const user = await User.findOne({ _id: id });
        if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                const token = jwt.sign({ _id: user._id }, "fuckYou", { expiresIn: 5 * 60 });
                res.status(200).json({ token });
            } else {
                res.status(400).json({ error: "كلمة مرور غير صحيحة" });
            }
        } else {
            res.status(400).json({ error: "هذا المستخدم غير موجود" })
        }
    } catch (e) {
        console.log(e);
    }
});

app.post("/checkToken", async (req, res) => {
    const { token } = req.body;

    jwt.verify(token, "fuckYou", (err, decoded) => {
        if (err) {
            res.status(400).json({ error: "Invalid Token" })
            return;
        } 
        res.status(200).json({ valid: true });
    });

});

app.post("/changeUserPassword", async (req, res) => {
    const { id, password } = req.body;
    let valid = true;
    try {
            const user = await User.findOne({ _id: id });
            if (user) {

                if (password.length < 1) { 
                    return res.status(400).json({ error: "اكتب كلمة المرور" });
                } 
                if (password.length < 3) {
                    return res.status(400).json({ error: "يجب ان لا تقل كلمة المرور عن 3 حروف" });
                }
                if (password.length > 30) {
                    return res.status(400).json({ error: "يحب ان لا تزيد كلمة المرور عن 30 حرف" });
                }

                const salt = await bcrypt.genSalt();
                const hashedPassword = await bcrypt.hash(password, salt);
                await User.updateOne({ _id: id }, { $set: { password: hashedPassword } });
                const sessionsCollection = await mongoose.connection.collection("sessions");
                await sessionsCollection.deleteOne({ _id: req.sessionID });
                res.status(200).json({ changed: true });
            } else {
                res.status(400).json({ exception: "User Not Found" });
            }
    } catch (e) {
        console.log(e);
    }
});

app.post("/usernameEdit", async (req, res) => {
    const { id, username } = req.body;
    try {
        if (username.length < 1) {
            return res.status(400).json({ error: "اكتب اسمك الجديد" })
        }
        if (username.length < 3) {
            return res.status(400).json({ error: "يجب ان لا يقل اسمك الجديد عن 3 حروف" })
        }
        if (username.length > 30) {
            return res.status(400).json({ error: "يجب ان لا يزيد اسمك الجديد عن 30 حرف" });
        }
        const user = await User.findOne({ _id: id });
        if (user) {
            await User.updateOne({ _id: id }, { $set: { username } });
            res.status(200).json({ changed: true });
        } else {
            return res.status(400).json({ userError: "المستخدم غير موجود" });
        }
    } catch (e) {
        console.log(e);
    }
});

app.post("/changeImage", upload.single("image"), async (req, res) => {
    const { id } = req.body;
    let image = req.file;
    try {

        if (image) {

            if (image.mimetype !== "image/jpeg" && image.mimetype !== "image/png") {
              return res.status(400).json({ error: "يجب اختيار صورة" });
            }

        } else {
            return res.status(400).json({ error: "يجب اختيار صورة" });
        }

        const user = await User.findOne({ _id: id });
        if (user) {


      // List files in the specified folder
       const files = await imagekit.listFiles({
        path: "/users/",
        limit: 100 // Adjust the limit as needed
      });
  
      // Loop through the files and compare URLs
      for (const file of files) {
        if (file.url === user.image) {
            await imagekit.deleteFile(file.fileId);
            const uploadedImage = await imagekit.upload({
                file: image.buffer,
                fileName: image.originalname,
                folder: "/users" // Specify the folder path where you want to store the image
            });
            await User.updateOne({ _id: id }, { $set: { image: uploadedImage.url } });
            return res.status(200).json({ changed: true });
            break;
        } else {
        }
      }



        } else {
            res.status(400).json({ userError: "UserNotFound" });
        }
    } catch (e) {
        console.log(e);
    }
});

const connectToMongo = mongoose.connect()

Promise.all([connectToMongo, imagekit]).then(_ => {
    server.listen(2024, () => {
        console.log("Server Listening On Port => 2024");
    });
}).catch(err => console.log(err));





























/*

يفرخة بدل مدخلات ال DB ومدخلات ال imagekit بمدخلاتك

هو ده تلاتات احسن مشروع عملتو فحياتي وهو اهداء ليك

انا هنا معاك وهديلك قواعد عشان تختبر البرنامج صح:

1- لو ضغطت ع زرار ال submit ف اي form ومحصلش حاجة اصبر شوية  لان الحوار بياخد وقت كتير وصدقني هيحصل حاجه بس اصبر

2- ونت بتضيف خدمة هتلاقي ان سعر الخدمة بدل متحط رقم تقدر عادي تحط بداله string ودي غلطه مني بس بصراحه تعبت ومكسل اصلحها فعديهالي عادي

3- ممكن ال front end يكون مش احسن حاجه بس عادي يعم انا كده كده مركز ف المشروع ده ع الباك اند اكتر

4- اختبر كل حاجة ف الموقع مش بعد التعب دهه متختبرش حاجهههههه

5- ممكن تلاقي بعض المكتبات الي نزلتها وعملتلها import بس مستعملهاش عادي لان الموقع ده قبل محولو لمشروع كنت بتعلم فيه

6- (: تحياتي ليك يفرخه كان معاك تلميذك المتواضع => كتكوت

*/