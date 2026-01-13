import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
export default function Login({ onClose, openSignUp }) {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    const loginData = { email, password };
    console.log("Logging in with data:", loginData);

    axios.post('/api/login', loginData)
      .then(response => {
        console.log("Login successful:", response.data);
        navigate('/dashboard');
        window.location.reload();

        // Handle successful login (e.g., redirect, store token, etc.)
      })
      .catch(error => {
        console.error("Login failed:", error);
        // Handle login error (e.g., show error message)
      });
  }



  return (
    <div className="lp modal-overlay">
      <div className="lp modal">
        <div className="signinheader">
          <h2 className="lp h2">Login</h2>
          <Button variant="ghost" onClick={onClose}>
            X
          </Button>
        </div>

        <form className="lp stack" onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" className="lp input" value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
          <input type="password" placeholder="Password" className="lp input" value={password} onChange={(e)=>{setPassword(e.target.value)}}/>

          <p>
            Remember me <input type="checkbox" />
          </p>

          <Button className="inline-flex items-center gap-2 rounded-xl bg-gradient-cosmic px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow-primary hover:brightness-110">
            Submit
          </Button>
        </form>

        <p>
          Didn't register yet?{" "}
          <Button
            variant="ghost"
            style={{ padding: 0 }}
            onClick={openSignUp}
          >
            Sign Up
          </Button>
        </p>
      </div>
    </div>
  );
}
