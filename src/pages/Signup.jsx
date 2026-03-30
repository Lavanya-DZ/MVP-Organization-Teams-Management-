import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { validateEmail, validatePassword } from "../utils/validators";
import { AuthContext } from "../context/AuthContext";
import AuthFormCard from "../components/AuthFormCard";
import PasswordInput from "../components/PasswordInput";

function Signup(){

  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    form: "",
  });

  const handleSubmit=async (e)=>{
    e.preventDefault();

    const nextErrors = { email: "", password: "", confirmPassword: "", form: "" };

    if(!email.trim()){
      nextErrors.email = "Email is required";
    } else if(!validateEmail(email)){
      nextErrors.email = "Please enter a valid email";
    }

    if(!password.trim()){
      nextErrors.password = "Password is required";
    } else if(!validatePassword(password)){
      nextErrors.password = "Password must be at least 8 characters";
    }

    if(!confirmPassword.trim()){
      nextErrors.confirmPassword = "Confirm password is required";
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match";
    }

    if(nextErrors.email || nextErrors.password || nextErrors.confirmPassword){
      setErrors(nextErrors);
      return;
    }

    setErrors({ email: "", password: "", confirmPassword: "", form: "" });

    const inferredName = email.split("@")[0] || "User";
    const result = await register({ email, password, name: inferredName });

    if (!result.success) {
      setErrors({ email: "", password: "", confirmPassword: "", form: result.message });
      return;
    }

    navigate("/dashboard");
  };

  return(
    <AuthFormCard
      onSubmit={handleSubmit}
      eyebrow="Create Account"
      title="Join MVP Teams"
      description="Get started in under a minute."
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

      <PasswordInput
        value={confirmPassword}
        placeholder="Confirm Password"
        hideLabel="Hide confirm password"
        showLabel="Show confirm password"
        onChange={(e)=>{
          setConfirmPassword(e.target.value);
          setErrors((prev) => ({ ...prev, confirmPassword: "", form: "" }));
        }}
      />
      {errors.confirmPassword && <p className="-mt-3 text-sm text-red-300">{errors.confirmPassword}</p>}

      <button className="w-full rounded-lg bg-cyan-400 px-4 py-3 font-semibold text-slate-900 transition hover:bg-cyan-300">
        Signup
      </button>

      {errors.form && <p className="text-sm text-red-300">{errors.form}</p>}

      <p className="text-sm text-slate-300">
        Already have account?
        <Link to="/" className="ml-1 font-medium text-cyan-300 hover:text-cyan-200">
          Login
        </Link>
      </p>

    </AuthFormCard>
  )
}

export default Signup;