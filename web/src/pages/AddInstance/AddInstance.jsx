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
      <form onSubmit={handleSubmit} className="add-form">
        <h2 className="add-form-header">Create VM Instance</h2>

        <div>
          <p className="add-form-label">Name</p>
          <input
            type="text"
            className="add-form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <p className="add-form-label">Memory</p>
          <input
            type="text"
            className="add-form-input"
            value={memory}
            onChange={(e) => setMemory(e.target.value)}
            required
          />
        </div>

        <div>
          <p className="add-form-label">Vcpu</p>
          <input
            type="text"
            className="add-form-input"
            value={vcpu}
            onChange={(e) => setVcpu(e.target.value)}
            required
          />
        </div>

        <div>
          <p className="add-form-label">Path</p>
          <input
            type="text"
            className="add-form-input"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            required
          />
        </div>

        <div>
          <p className="add-form-label">Iso</p>
          <input
            type="text"
            className="add-form-input"
            value={iso}
            onChange={(e) => setIso(e.target.value)}
            required
          />
        </div>

        <div>
          <p className="add-form-label">Network</p>
          <input
            type="text"
            className="add-form-input"
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
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

export default AddInstance
