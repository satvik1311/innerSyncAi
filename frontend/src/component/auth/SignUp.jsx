import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <div style={{ maxWidth: 480, margin: "80px auto", padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>Sign Up</h2>
      <form>
        <input type="text" placeholder="Full Name" style={{ width: "100%", padding: 12, marginBottom: 12 }} />
        <input type="text" placeholder="User Name" style={{ width: "100%", padding: 12, marginBottom: 12 }} />
        <input type="email" placeholder="Email" style={{ width: "100%", padding: 12, marginBottom: 12 }} />
        <input type="password" placeholder="Password" style={{ width: "100%", padding: 12, marginBottom: 12 }} />
        <input type="password" placeholder="Re-enter password" style={{ width: "100%", padding: 12, marginBottom: 12 }} />
        <button type="button" style={{ width: "100%", padding: 12 }}>Submit</button>
      </form>
      <p style={{ marginTop: 12 }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Signup;
