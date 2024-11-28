import axios from "axios";

// Create an axios instance

// For development
export default axios.create({
  baseURL: "http://localhost:3000/api",
});

// For production
// export default axios.create({
//   baseURL: `https://qwiksavings.com/api`,
// });

// export default axios.create({
//   baseURL: `https://qwik-savings-eta.vercel.app/api`,
// });
