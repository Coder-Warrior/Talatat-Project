import mongoose from "mongoose";

const codeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, "code required"]
    },
    userId: {
        type: String,
        required: [true, "id required"]
    },
    cAt: {
        type: typeof Date.now(),
        default: Date.now(),
    },
    reason: {
        type: String,
        default: "emailVerification"
    }
});

const Code = mongoose.model("code", codeSchema);

export default Code;