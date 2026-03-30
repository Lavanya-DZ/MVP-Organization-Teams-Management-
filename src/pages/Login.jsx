import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { validateEmail } from "../utils/validators";
import AuthFormCard from "../components/AuthFormCard";
import PasswordInput from "../components/PasswordInput";

function Login() {

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    form: "",
  });

  const handleSubmit = async (e)=>{
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

    const result = await login({ email, password });

    if (!result.success) {
      setErrors({ email: "", password: "", form: result.message });
      return;
    }

    navigate("/dashboard");
  };

  return (
    <AuthFormCard
      onSubmit={handleSubmit}
      eyebrow="MVP Teams"
      title="Welcome Back"
      description="Sign in to continue to your workspace."
    >
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

      <PasswordInput
        value={password}
        placeholder="Password"
        hideLabel="Hide password"
        showLabel="Show password"
        onChange={(e)=>{
          setPassword(e.target.value);
          setErrors((prev) => ({ ...prev, password: "", form: "" }));
        }}
      />
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
    </AuthFormCard>
  );
}

export default Login;