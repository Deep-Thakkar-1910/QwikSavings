import axios from "axios";

// Create an axios instance

// For development
export default axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Cache-Control": "no-cache",
  },
});

// For production
// export default axios.create({
//   baseURL: `https://qwikky-savings.vercel.app/api`,
//   headers: {
//     "Cache-Control": "no-cache",
//     Pragma: "no-cache",
//   },
// });
