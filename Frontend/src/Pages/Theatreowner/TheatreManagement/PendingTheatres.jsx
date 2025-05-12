import React, { useEffect, useState } from "react";
import TheatreApi from "@/Axios/theatreapi";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateOwnershipStatus } from "@/Redux/Features/Theatreownerslice";

function PendingTheatres() {
  const [pendingTheatres, setPendingTheatres] = useState([]);
  const [verifiedTheatres, setVerifiedTheatres] = useState([]);
  const owner_id = useSelector((state) => state.theatreOwner.theatreId)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingTheatres();
  }, []); 
  const fetchPendingTheatres = async () => {
    try {
      const res = await TheatreApi.get(`/pending-theatre/${owner_id}/`);
      const pending = res.data.filter((theatre) => !theatre.is_confirmed);
      const verified = res.data.filter((theatre) => theatre.is_confirmed);

      setPendingTheatres(pending);
      setVerifiedTheatres(verified);
      
      if (pending.length === 0) {
        dispatch(updateOwnershipStatus("All theatres are verified"));
      }
    } catch (e) {
      console.error("Error fetching theatres:", e.response?.data || e.message);
    }
  };
  console.log(pendingTheatres , verifiedTheatres)

  return (
    <div className="mt-10 flex flex-wrap justify-center gap-10">
      <div className="rounded-lg shadow-lg bg-white py-6 px-8 w-[400px]">
        <h1 className="text-red-500 text-2xl font-bold mb-6 text-center">
          Pending Theatre Approvals
        </h1>

        {pendingTheatres.length > 0 ? (
          pendingTheatres.map((theatre) => (
            <div
              key={theatre.id}
              className="border border-gray-300 rounded-lg p-5 mb-4 flex flex-col gap-2 shadow-sm"
            >
              <h2 className="text-xl font-semibold">
                {theatre.name}, 📍 {theatre.city}
              </h2>
              <p className="text-gray-500">Address: {theatre.address}</p>
              <span className="text-yellow-500 font-bold">
                {theatre.is_confirmed ? "Confirmed" : "Not Confirmed"}
              </span>

              <button
                onClick={() => navigate(`/theatre-owner/${theatre.id}/add-screen`)}
                disabled={theatre.has_screens}
                className={`w-full mt-4 py-2 rounded-lg font-bold transition ${
                  theatre.has_screens
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-orange-400 hover:bg-orange-500 text-white"
                }`}
              >
                {theatre.has_screens ? "Requested" : "Verify Screen ‼️"}
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center text-lg">
            No pending theatres to verify.
          </p>
        )}
      </div>

      <div className="rounded-lg shadow-lg bg-white py-6 px-8 w-[400px]">
        <h1 className="text-green-500 text-2xl font-bold mb-6 text-center">
          Verified Theatres
        </h1>

        {verifiedTheatres.length > 0 ? (
          verifiedTheatres.map((theatre) => (
            <div
              key={theatre.id}
              className="border border-gray-300 rounded-lg p-5 mb-4 flex flex-col gap-2 shadow-sm"
            >
              <h2 className="text-xl font-semibold">
                {theatre.name}, 📍 {theatre.city}
              </h2>
              <p className="text-gray-500">Address: {theatre.address}</p>
              <span className="text-green-500 font-bold">✅ Confirmed</span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center text-lg">
            No verified theatres yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default PendingTheatres;
