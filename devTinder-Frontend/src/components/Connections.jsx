import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/conectionSlice";

const Connections = () => {
  const connections = useSelector((store) => store.connections) || [];
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (err) {
      setError("Failed to fetch connections. Please try again later.");
      console.error("Error fetching connections:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (loading) {
    return <div className="text-center my-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center my-10 text-red-500">{error}</div>;
  }

  if (connections.length === 0) {
    return <h1 className="text-center my-10">No Connections Found</h1>;
  }

  return (
    <div className="text-center my-10">
      <h1 className="text-bold text-white text-3xl mb-6">Connections</h1>

      {connections.map((connection) => {
        const { id, firstName, lastName, photoUrl, age, gender, about } =
          connection;

        return (
          <div
            key={id} // Add a unique key for each connection
            className="flex m-4 p-4 rounded-lg bg-base-300 w-1/2 mx-auto"
          >
            <div>
              <img
                alt="photo"
                className="w-20 h-20 rounded-full"
                src={photoUrl || "https://via.placeholder.com/150"} // Fallback image if photoUrl is missing
              />
            </div>
            <div className="text-left mx-4">
              <h2 className="font-bold text-xl">
                {firstName} {lastName}
              </h2>
              {(age || gender) && (
                <p>
                  {age && `${age}`}
                  {age && gender && ", "}
                  {gender}
                </p>
              )}
              <p>{about}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Connections;