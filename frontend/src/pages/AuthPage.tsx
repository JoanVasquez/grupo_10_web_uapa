import React, { useState } from "react";
import { Card, SignIn, SignUp } from "../components";

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md overflow-hidden p-2 sm:max-w-lg lg:max-w-xl">
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
            }}
            className={`rounded-lg px-3 py-2 text-xs font-medium transition sm:px-4 sm:text-sm ${
              mode === "signin"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Iniciar sesión
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("signup");
            }}
            className={`rounded-lg px-3 py-2 text-xs font-medium transition sm:px-4 sm:text-sm ${
              mode === "signup"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Crear cuenta
          </button>
        </div>

        <div className="p-3 sm:p-5 md:p-6">
          {mode === "signin" ? <SignIn /> : <SignUp onRegistered={() => setMode("signin")} />}
        </div>
      </Card>
    </main>
  );
};

export default AuthPage;
