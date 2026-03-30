import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { validateEmail } from "../utils/validators";

function Login() {

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    form: "",
  });

  const handleSubmit = (e)=>{
    e.preventDefault();

    const nextErrors = { email: "", password: "", form: "" };

    if(!email.trim()){
      nextErrors.email = "Email is required";
    } else if(!validateEmail(email)){
      nextErrors.email = "Please enter a valid email";
    }

    if(!password.trim()){
      nextErrors.password = "Password is required";
    }

    if(nextErrors.email || nextErrors.password){
      setErrors(nextErrors);
      return;
    }

    setErrors({ email: "", password: "", form: "" });

    const result = login({ email, password });

    if (!result.success) {
      setErrors({ email: "", password: "", form: result.message });
      return;
    }

    navigate("/dashboard");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative z-10 w-full max-w-md space-y-5 rounded-2xl border border-white/10 bg-white/10 p-8 text-white backdrop-blur-xl"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">MVP Teams</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Welcome Back</h2>
        <p className="mt-1 text-sm text-slate-300">Sign in to continue to your workspace.</p>
      </div>

      <input
        type="email"
        placeholder="Email"
        value={email}
        className="w-full rounded-lg border border-slate-500/60 bg-slate-900/40 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none"
        onChange={(e)=>{
          setEmail(e.target.value);
          setErrors((prev) => ({ ...prev, email: "", form: "" }));
        }}
      />
      {errors.email && <p className="-mt-3 text-sm text-red-300">{errors.email}</p>}

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          className="w-full rounded-lg border border-slate-500/60 bg-slate-900/40 px-4 py-3 pr-12 text-sm text-white placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none"
          onChange={(e)=>{
            setPassword(e.target.value);
            setErrors((prev) => ({ ...prev, password: "", form: "" }));
          }}
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 transition hover:text-white"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M3 3l18 18" />
              <path d="M10.6 10.6a2 2 0 102.8 2.8" />
              <path d="M9.9 5.1A10.9 10.9 0 0112 5c5 0 9.3 3.1 11 7-1 2.2-2.7 4-4.8 5.2" />
              <path d="M6.7 6.7C4.6 8 2.9 9.8 2 12c1.7 3.9 6 7 10 7 1.2 0 2.3-.2 3.4-.5" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
      {errors.password && <p className="-mt-3 text-sm text-red-300">{errors.password}</p>}

      <button
        className="w-full rounded-lg bg-cyan-400 px-4 py-3 font-semibold text-slate-900 transition hover:bg-cyan-300"
      >
        Login
      </button>

      {errors.form && <p className="text-sm text-red-300">{errors.form}</p>}

      <p className="text-sm text-slate-300">
        Don't have account?
        <Link to="/signup" className="ml-1 font-medium text-cyan-300 hover:text-cyan-200">
          Signup
        </Link>
      </p>
    </form>
  );
}

export default Login;