import axios from "axios";

// Create an axios instance
// For development
// export default axios.create({
//   baseURL: "http://localhost:3000/api",
// });

// Create an axios instance
// For production
export default axios.create({
  baseURL: "https://qwikky-savings.vercel.app/api",
});
