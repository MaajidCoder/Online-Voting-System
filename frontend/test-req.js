fetch("http://localhost:3000/api/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Maajid",
    email: "maajidhassan2006@gmail.com",
    password: "password",
    role: "student"
  })
}).then(async res => {
  console.log("Status:", res.status);
  console.log("Body:", await res.text());
}).catch(err => console.error("Error:", err));
