import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Box, ArrowLeft, Loader2 } from "lucide-react";

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans text-foreground">
      {/* =========================================
          CUSTOM ANIMATIONS (Same as Landing)
      ========================================= */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes moving-gradient {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            .animate-moving-gradient {
              background-size: 200% 200%;
              animation: moving-gradient 8s ease infinite;
            }
          `,
        }}
      />

      {/* =========================================
          SUBTLE AMBIENT BACKGROUND
      ========================================= */}
      <div className="absolute inset-0 -z-10 bg-background overflow-hidden">
        {/* Subtle glowing orb */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] opacity-20 dark:opacity-10 animate-moving-gradient bg-gradient-to-r from-primary/40 via-teal-400/40 to-emerald-500/40 blur-[100px] rounded-full" />

        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]" />
      </div>

      {/* Back to website link */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          to="/"
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to website
        </Link>
      </div>

      <div className="w-full max-w-[420px] relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2.5 mb-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary text-primary-foreground shadow-sm">
              <Box className="h-6 w-6" />
            </div>
            <span className="font-bold text-2xl tracking-tight">FlowBox</span>
          </div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            Supply Chain Management Engine
          </p>
        </div>

        {/* Main Auth Card */}
        <Card className="border border-border/60 shadow-2xl shadow-black/5 dark:shadow-black/40 rounded-xl bg-card/90 backdrop-blur-xl overflow-hidden ring-1 ring-border/50">
          {/* Custom Squarish Toggle Switch */}
          <div className="p-6 pb-0">
            <div className="flex bg-muted p-1 rounded-md h-12 border border-border/50">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`flex-1 rounded-md font-medium text-sm transition-all ${
                  isLogin
                    ? "bg-background text-foreground shadow-sm ring-1 ring-border/50"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`flex-1 rounded-md font-medium text-sm transition-all ${
                  !isLogin
                    ? "bg-background text-foreground shadow-sm ring-1 ring-border/50"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
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
                <div className="space-y-1 mb-6 text-center">
                  <h3 className="text-2xl font-bold tracking-tight">
                    Welcome back
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Enter your credentials to access your dashboard.
                  </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <Input
                      required
                      type="email"
                      placeholder="admin@flowbox.com"
                      className="h-11 rounded-md bg-background border-border/60 focus-visible:ring-primary shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Password</label>
                      <a
                        href="#"
                        className="text-xs text-primary font-medium hover:underline"
                      >
                        Forgot password?
                      </a>
                    </div>
                    <Input
                      required
                      type="password"
                      placeholder="••••••••"
                      className="h-11 rounded-md bg-background border-border/60 focus-visible:ring-primary shadow-sm"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 text-base font-medium rounded-md shadow-sm mt-4 transition-all"
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
                <div className="space-y-1 mb-6 text-center">
                  <h3 className="text-2xl font-bold tracking-tight">
                    Create an account
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Set up your organization workspace in seconds.
                  </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Company Name</label>
                    <Input
                      required
                      placeholder="Acme Logistics Inc."
                      className="h-11 rounded-md bg-background border-border/60 focus-visible:ring-primary shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Work Email</label>
                    <Input
                      required
                      type="email"
                      placeholder="you@company.com"
                      className="h-11 rounded-md bg-background border-border/60 focus-visible:ring-primary shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Secure Password
                    </label>
                    <Input
                      required
                      type="password"
                      placeholder="••••••••"
                      className="h-11 rounded-md bg-background border-border/60 focus-visible:ring-primary shadow-sm"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 bg-foreground text-background hover:bg-foreground/90 text-base font-medium rounded-md shadow-sm mt-4 transition-all"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Provisioning...
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

        {/* Footer Text */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          By continuing, you agree to FlowBox's{" "}
          <a href="#" className="underline hover:text-foreground">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-foreground">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
