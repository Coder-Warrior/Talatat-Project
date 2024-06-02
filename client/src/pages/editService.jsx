import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";

export default function EditService({ user }) {
    const [images, setImages] = useState([]);
    let [service, setService] = useState({});
    let [IsLoading, setIsLoading] = useState(true);
    let [notFound, setNotFound] = useState(false);

    const { id } = useParams();

    useEffect(() => {
        async function getService() {
            try {
                const res = await fetch("/getService", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ id })
                });
                const data = await res.json();
                if (data.service) {
                    setService(data.service);
                    setIsLoading(false)
                } else {
                    setNotFound(true);
                    setIsLoading(false);
                }
            } catch (e) {
                console.log(e)
            }
        }
        getService();
    }, []);

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
      let editError = document.querySelector(".editError");

      let formData = new FormData();
  
      formData.append("serviceUsername", serviceUsername);
      formData.append("serviceDescription", serviceDescription);
      formData.append("id", id);
      formData.append("servicePrice", servicePrice)
  
      images.map(picture => formData.append("pictures", picture));
  
      try {
          const res = await fetch("/editService", {
              method: "POST",
              body: formData
          });
          const data = await res.json();
  
          if (data.updated) {
              window.location.assign("/");
          } else {
            if (data.errors) {
                serviceUsernameError.textContent = data.errors.serviceUsername;
                serviceDescreptionError.textContent = data.errors.serviceDescription;
            } else if (data.error) {
                editError.textContent = data.error;                
            }
            setTimeout(_ => {
                editError.textContent = "";
                serviceDescreptionError.textContent = "";
                serviceUsernameError.textContent = "";
            }, 3000);
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
  
    const handleChange = (e) => {
        const { name, value } = e.target;
        let prevv = e.target.value;
        setService((prevService) => ({
            prevv,
          [name]: value
        }));
    };

    return (
      IsLoading === false && notFound === false ? <div className="addService">
        <h1>اضف خدمتك</h1>
        <form method="POST" encType="multipart/form-data" onSubmit={handleSubmission} >
          <input type="text" name="serviceUsername" placeholder="اسم الخدمة" value={service.serviceUsername} onChange={handleChange}/>
          <p className="serviceUsernameError"></p>
          <textarea type="text" name="serviceDescription" placeholder="وصف الخدمة" value={service.serviceDescription} onChange={handleChange}/>
          <p className="serviceDescreptionError"></p>
          <input type="text" name="servicePrice" placeholder="سعر الخدمة" value={service.servicePrice} onChange={handleChange}/>
          <p className="servicePriceError"></p>
          <input type="file" id="files" multiple onChange={handleFileChange} accept='image/jpeg,image/jpg,image/png' />
          <p className="addServicePicturesError"></p>
          <input type="submit" value="تاكيد التعديلات" />
          <p className="editError"></p>
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
      </div> : IsLoading === false && notFound === true ? <Navigate to="/error404" /> : <></>
    );
}