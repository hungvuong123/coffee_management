import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://puiiqwoajgvphezrshmc.supabase.co/rest/v1",
  headers: {
    apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1aWlxd29hamd2cGhlenJzaG1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2ODcyNzgsImV4cCI6MjA4ODI2MzI3OH0.ke-sFcqR3WkNgBbHk6W0wMphK4C3Gqt7dCysgPduKUU",
    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1aWlxd29hamd2cGhlenJzaG1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2ODcyNzgsImV4cCI6MjA4ODI2MzI3OH0.ke-sFcqR3WkNgBbHk6W0wMphK4C3Gqt7dCysgPduKUU",
  },
});

export default axiosClient;