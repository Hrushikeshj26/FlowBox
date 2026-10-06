import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Box, ArrowLeft, Loader2 } from "lucide-react";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true); // true = Sign In, false = Sign Up
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication delay
    setTimeout(() => {
      setIsLoading(false);
      navigate("/");
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Back to website link */}
      <div className="absolute top-6 left-6">
        <Link
          to="/landing"
          className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to website
        </Link>
      </div>

      <div className="w-full max-w-[420px]">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2.5 mb-2">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-indigo-600 shadow-md shadow-indigo-200">
              <Box className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-slate-950">
              FlowBox
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Supply Chain Management Engine
          </p>
        </div>

        {/* Main Card */}
        <Card className="border border-slate-200/80 shadow-2xl shadow-slate-200/50 rounded-2xl bg-white overflow-hidden">
          {/* Custom Pill Toggle Switch */}
          <div className="p-6 pb-0">
            <div className="flex bg-slate-100 p-1 rounded-xl h-12">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`flex-1 rounded-lg font-medium text-sm transition-all ${
                  isLogin
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`flex-1 rounded-lg font-medium text-sm transition-all ${
                  !isLogin
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          <CardContent className="p-6 pt-6">
            {isLogin ? (
              /* --- SIGN IN FORM --- */
              <div className="space-y-4">
                <div className="space-y-1 mb-5">
                  <h3 className="text-xl font-bold text-slate-900">
                    Welcome back
                  </h3>
                  <p className="text-sm text-slate-500">
                    Enter your credentials to access your dashboard.
                  </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-900">
                      Email Address
                    </label>
                    <Input
                      required
                      type="email"
                      placeholder="admin@flowbox.com"
                      className="h-11 rounded-lg bg-slate-50 border-slate-200 focus-visible:ring-indigo-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-900">
                        Password
                      </label>
                      <a
                        href="#"
                        className="text-xs text-indigo-600 font-medium hover:underline"
                      >
                        Forgot password?
                      </a>
                    </div>
                    <Input
                      required
                      type="password"
                      placeholder="••••••••"
                      className="h-11 rounded-lg bg-slate-50 border-slate-200 focus-visible:ring-indigo-600"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-base font-medium rounded-lg shadow-md shadow-indigo-200 mt-2 transition-all"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Authenticating...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </div>
            ) : (
              /* --- SIGN UP FORM --- */
              <div className="space-y-4">
                <div className="space-y-1 mb-5">
                  <h3 className="text-xl font-bold text-slate-900">
                    Create an account
                  </h3>
                  <p className="text-sm text-slate-500">
                    Set up your organization workspace in seconds.
                  </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-900">
                      Company Name
                    </label>
                    <Input
                      required
                      placeholder="Acme Logistics Inc."
                      className="h-11 rounded-lg bg-slate-50 border-slate-200 focus-visible:ring-slate-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-900">
                      Work Email
                    </label>
                    <Input
                      required
                      type="email"
                      placeholder="you@company.com"
                      className="h-11 rounded-lg bg-slate-50 border-slate-200 focus-visible:ring-slate-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-900">
                      Secure Password
                    </label>
                    <Input
                      required
                      type="password"
                      placeholder="••••••••"
                      className="h-11 rounded-lg bg-slate-50 border-slate-200 focus-visible:ring-slate-900"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-base font-medium rounded-lg shadow-md mt-2 transition-all"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Provisioning workspace...
                      </>
                    ) : (
                      "Create Workspace"
                    )}
                  </Button>
                </form>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
