import mongoose from "mongoose";

const AddServiceSchema = new mongoose.Schema({
    serviceUsername: {
        type: String,
        required: [true, "اضف اسم الخدمة"],
        minLength: [4, "يجب ان يحتوي اسم الخدمة على خمس حروف على الاقل"],
        maxLength: [20, "يجب ان لا يزيد اسم الخدمة عن 20 حرف"]
    },
    serviceDescription: {
        type: String,
        required: [true, "اضف وصف الخدمة"],
        minLength: [30, "يجب ان يحتوي وصف الخدمة على 30 حرف على الاقل"],
        maxLength: [120, "يجب ان لا يزيد وصف الخدمة عن 90 حرف"]
    },
    servicePrice: {
        type: String,
        required: [true, "ضع سعر للخدمة"]
    },
    serviceImgs: [
        {
            url: String
        }
    ],
    ServiceOwner: {
        type: String,
        required: [true, "Service Owner Required"]
    },
    token: String
});

const Services = mongoose.model('service', AddServiceSchema);

export default Services;