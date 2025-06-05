import React, { useState } from "react";
import { useForm } from "react-hook-form";
import apiReview from "@/Axios/Reviewapi";
import CustomAlert from "@/Components/CustomAlert";

export default function RaiseComplaint({ userId , chatId , closeForm }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [message , setMessage ] = useState('');

  const onSubmit = async (data) => {
    try {

      const formData = new FormData();
      formData.append("user", userId);
      formData.append("chat", chatId);
      formData.append("category", data.category);
      formData.append("subject", data.subject);
      formData.append("description", data.description);
      formData.append("screen_shot", data.screen_shot[0]);
      formData.append("status", "open");

      const response = await apiReview.post("complaints/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 201 ) {
          setMessage("complaint provided successfully✅")
          closeForm()
          reset();
          console.log(response.data)
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {message &&

        <CustomAlert title={'registered'} setMessage={setMessage} message={message} isError={false} />
      }

      <form onSubmit={handleSubmit(onSubmit)} >
        <div>
          <label className="block mb-1 font-medium">Category</label>
          <select {...register("category", { required: true })} className="w-full border px-3 py-2 rounded-md">
            <option value="">Select...</option>
            <option value="booking">Booking Issue</option>
            <option value="payment">Payment Issue</option>
            <option value="technical">Technical Problem</option>
            <option value="general">General Feedback</option>
          </select>
          {errors.category && <p className="text-red-500 text-sm">Category is required.</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Subject</label>
          <input
            type="text"
            {...register("subject", { required: true })}
            className="w-full border px-3 py-2 rounded-md"
          />
          {errors.subject && <p className="text-red-500 text-sm">Subject is required.</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            {...register("description", { required: true })}
            className="w-full border px-3 py-2 rounded-md"
          ></textarea>
          {errors.description && <p className="text-red-500 text-sm">Description is required.</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Upload Screenshot (optional)</label>
          <input
            type="file"
            {...register("screen_shot")}
            className="w-full border px-3 py-2 rounded-md"
            accept="image/*"
            />
        </div>
          <div className="flex justify-center mt-5" >

              
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Submit Complaint
        </button>
          </div>
      </form>
    </div>
  );
}
