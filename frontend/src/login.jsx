import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    const endpoint = isRegister ? "register" : "login";

    const body = isRegister
      ? { name, email, password }
      : { email, password };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error);
        return;
      }

      if (isRegister) {
        alert("Registration successful! Please login.");
        setIsRegister(false);
      } else {
        localStorage.setItem("token", data.token);
        onLogin();
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6">
        <h2 className="text-3xl font-bold text-center mb-6">
          {isRegister ? "Create Account" : "Login"}
        </h2>

        {isRegister && (
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-3"
          />
        )}

        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3"
        />

        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-3"
        />

        <Button onClick={handleSubmit} className="w-full">
          {isRegister ? "Register" : "Login"}
        </Button>

        <p
          className="text-center mt-4 cursor-pointer"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister
            ? "Already have an account? Login"
            : "Don't have an account? Register"}
        </p>
      </div>
    </div>
  );
}

export default Login;