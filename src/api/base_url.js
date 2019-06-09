let url;
if (process.env.NODE_ENV === "production") {
  url = "/api";
} else {
  url = "http://localhost:3000/api";
}

export default url;
