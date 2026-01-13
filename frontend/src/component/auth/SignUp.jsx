import { Button } from "../ui/button";
import axios from "axios";
import { useState } from "react";
export default function SignUp({ onClose, openLogin }) {
  

  const [fullName,setFullName] = useState("");
  const [userName,setUserName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [rePassword,setRePassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle signup logic here
    const signUpData = { fullName, userName, email, password, rePassword };
    console.log("Signing up with data:", signUpData);

    axios.post('/api/signup', signUpData)
      .then(response => {
        console.log("Signup successful:", response.data);
        // Handle successful signup (e.g., redirect, show message, etc.)
      })
      .catch(error => {
        console.error("Signup failed:", error);
        // Handle signup error (e.g., show error message)
      });

      
  }

  return (
    <div className="lp modal-overlay">
      <div className="lp modal">
        <div className="signinheader">
          <h2 className="lp h2">SignUp</h2>
          <Button variant="ghost" onClick={onClose}>
            X
          </Button>
        </div>

        <form className="lp stack" onSubmit={handleSubmit}>
          <input type="text" placeholder="Full Name" className="lp input" value={fullName} onChange={(e)=>{setFullName(e.target.value)}}/>
          <input type="text" placeholder="User Name" className="lp input" value={userName} onChange={(e)=>{setUserName(e.target.value)}} />
          <input type="email" placeholder="Email" className="lp input" value={email} onChange={(e)=>{setEmail(e.target.value)}} />
          <input type="password" placeholder="Password" className="lp input" value={password} onChange={(e)=>{setPassword(e.target.value)}} />
          <input
            type="password"
            placeholder="Re-enter Password"
            className="lp input"
            value={rePassword} onChange={(e)=>{setRePassword(e.target.value)}}  
          />

          <Button className="inline-flex items-center gap-2 rounded-xl bg-gradient-cosmic px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow-primary hover:brightness-110">
            Submit
          </Button>
        </form>

        <p>
          Already have an account?{" "}
          <Button
            variant="ghost"
            style={{ padding: 0 }}
            onClick={openLogin}
          >
            Login
          </Button>
        </p>
      </div>
    </div>
  );
}
