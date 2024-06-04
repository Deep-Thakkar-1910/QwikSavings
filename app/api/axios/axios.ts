import axios from "axios";

// Create an axios instance

export default axios.create({
  baseURL: `${process.env.BASE_URL}/api`,
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  },
});
