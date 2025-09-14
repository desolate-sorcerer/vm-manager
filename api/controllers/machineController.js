import axios from "axios"

const getXML = (async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/sendXML");
    res.json(response.data);
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default {
  getXML
}
