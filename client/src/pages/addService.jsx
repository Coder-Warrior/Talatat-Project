import { useState } from 'react';

export default function AddService({ user }) {
  const [images, setImages] = useState([]);

  async function handleSubmission(e) {
    e.preventDefault();
    let form = document.querySelector("form");
    let serviceUsername = form.serviceUsername.value;
    let serviceDescription = form.serviceDescription.value;
    let servicePrice = form.servicePrice.value;

    let serviceUsernameError = document.querySelector(".serviceUsernameError");
    let serviceDescreptionError = document.querySelector(".serviceDescreptionError");
    let addServicePicturesError = document.querySelector(".addServicePicturesError");
    let servicePriceError = document.querySelector(".servicePriceError");

    let formData = new FormData();

    formData.append("serviceUsername", serviceUsername);
    formData.append("serviceDescription", serviceDescription);
    formData.append("_id", user._id);
    formData.append("servicePrice", servicePrice)

    images.map(picture => formData.append("pictures", picture));

    try {
        const res = await fetch("/addService", {
            method: "POST",
            body: formData
        });
        const data = await res.json();

        if (data.service) {
            window.location.assign("/");
        } else {
            serviceUsernameError.textContent = data.addServiceError.serviceUsername;
            serviceDescreptionError.textContent = data.addServiceError.serviceDescription;
            addServicePicturesError.textContent = data.addServiceError.addServicePicture;
            servicePriceError.textContent = data.addServiceError.servicePrice;
        }

    } catch (e) {
        console.log(e);
    }
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    // Filter out duplicate images
    const newImages = imageFiles.filter(
      file => !images.some(image => image.name === file.name)
    );

    if (newImages.length + images.length <= 4) {
      setImages(prevImages => [...prevImages, ...newImages]);
    } else {
      alert("يجب ان لا يقل او يزيد عدد الصور عن 4 صور");
    }
  };

  return (
    <div className="addService">
      <h1>اضف خدمتك</h1>
      <form method="POST" encType="multipart/form-data" onSubmit={handleSubmission} >
        <input type="text" name="serviceUsername" placeholder="اسم الخدمة" />
        <p className="serviceUsernameError"></p>
        <textarea type="text" name="serviceDescription" placeholder="وصف الخدمة" />
        <p className="serviceDescreptionError"></p>
        <input type="text" name="servicePrice" placeholder="سعر الخدمة" />
        <p className="servicePriceError"></p>
        <input type="file" id="files" multiple onChange={handleFileChange} accept='image/jpeg,image/jpg,image/png' />
        <p className="addServicePicturesError"></p>
        <input type="submit" value="اضف خدمة" />
      </form>
      <div className="pictures">
        {images.map((image, index) => (
          <img
            key={index}
            src={URL.createObjectURL(image)}
            alt={`Selected ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
