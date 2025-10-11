import axios from "axios"

const getXML = (async (req, res) => {
  const URL = process.env.URL;
  const PYTHONPORT = process.env.PYTHONPORT;

  try {
    const response = await axios.get(`${URL}:${PYTHONPORT}/sendXML`);
    res.json(response.data);
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default {
  getXML
}
