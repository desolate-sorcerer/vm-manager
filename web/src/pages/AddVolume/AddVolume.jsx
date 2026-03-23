import { useParams } from "react-router";
import { useState, useEffect } from "react"

function AddVolume() {
  const { pool } = useParams()
  const [label, setLabel] = useState("");
  const [capacity, setCapacity] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("/api/createVolume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pool,
          label,
          capacity,
        }),
        credentials: 'include'
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="add-form">
        <h2 className="add-form-header">Create Storage Volume</h2>

        <div>
          <p className="add-form-label">Label</p>
          <input
            type="text"
            className="add-form-input"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            required
          />
        </div>

        <div>
          <p className="add-form-label">Capacity</p>
          <input
            type="text"
            className="add-form-input"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="add-form-submit">Create</button>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  )
}

export default AddVolume
