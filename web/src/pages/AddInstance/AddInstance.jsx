import { useState } from "react"
import "./AddInstance.css"

function AddInstance() {
  const [name, setName] = useState("");
  const [memory, setMemory] = useState("");
  const [path, setPath] = useState("");
  const [vcpu, setVcpu] = useState("");
  const [iso, setIso] = useState("");
  const [network, setNetwork] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/addInstance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          memory,
          path,
          vcpu,
          iso,
          network
        }),
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
      <form onSubmit={handleSubmit} className="add-volume-form">
        <h2>Create VM Instance</h2>

        <input
          type="text"
          className="add-volume-input"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          className="add-volume-input"
          placeholder="memory"
          value={memory}
          onChange={(e) => setMemory(e.target.value)}
          required
        />

        <input
          type="text"
          className="add-volume-input"
          placeholder="vcpu"
          value={vcpu}
          onChange={(e) => setVcpu(e.target.value)}
          required
        />

        <input
          type="text"
          className="add-volume-input"
          placeholder="path"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          required
        />

        <input
          type="text"
          className="add-volume-input"
          placeholder="iso"
          value={iso}
          onChange={(e) => setIso(e.target.value)}
          required
        />

        <input
          type="text"
          className="add-volume-input"
          placeholder="network"
          value={network}
          onChange={(e) => setNetwork(e.target.value)}
          required
        />

        <button type="submit" className="add-volume-submit">Create</button>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  )
}

export default AddInstance
