import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div style={{ maxWidth: 420, margin: "80px auto", padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>Login</h2>
      <form>
        <input type="email" placeholder="Email" style={{ width: "100%", padding: 12, marginBottom: 12 }} />
        <input type="password" placeholder="Password" style={{ width: "100%", padding: 12, marginBottom: 12 }} />
        <button type="button" style={{ width: "100%", padding: 12 }}>Submit</button>
      </form>
      <p style={{ marginTop: 12 }}>
        Didn’t register yet? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;
