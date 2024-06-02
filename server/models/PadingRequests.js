import mongoose from "mongoose";

const RequestsSchema = new mongoose.Schema({ 
    Requester: {
        type: String,
        required: true
    },
    requestReciver: {
        type: String,
        required: true
    },
    serviceName: {
        type: String,
        required: true
    },
    serviceId: {
        type: String,
        required: true
    }
});

const Requests = mongoose.model("request", RequestsSchema);

export default Requests;