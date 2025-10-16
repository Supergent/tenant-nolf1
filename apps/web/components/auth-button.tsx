"use client";

import { useState } from "react";
import { useSession, signIn, signOut, signUp } from "../lib/auth-client";
import { Button, Dialog, Input, Card } from "@jn704kmvn1w3p5a4xx8aankht17sksat/components";
import { LogIn, LogOut, UserPlus, Loader2 } from "lucide-react";

export function AuthButton() {
  const { data: session, isPending } = useSession();
  const [showDialog, setShowDialog] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isSignUp) {
        await signUp.email({
          email,
          password,
          name: name || undefined,
        });
      } else {
        await signIn.email({
          email,
          password,
        });
      }

      setShowDialog(false);
      setEmail("");
      setPassword("");
      setName("");
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (isPending) {
    return (
      <Button variant="ghost" disabled>
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        Loading...
      </Button>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-text-secondary">
          {session.user?.email}
        </span>
        <Button variant="outline" onClick={handleSignOut}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button onClick={() => setShowDialog(true)}>
        <LogIn className="h-4 w-4 mr-2" />
        Sign In
      </Button>

      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md p-6">
            <h2 className="text-2xl font-bold mb-4">
              {isSignUp ? "Create Account" : "Sign In"}
            </h2>

            <form onSubmit={handleAuth} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="text-sm font-medium mb-1 block">Name (optional)</label>
                  <Input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-medium mb-1 block">Email *</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Password *</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              {error && (
                <div className="text-sm text-danger bg-danger/10 p-3 rounded-md">
                  {error}
                </div>
              )}

              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      {isSignUp ? "Creating..." : "Signing in..."}
                    </>
                  ) : (
                    <>
                      {isSignUp ? (
                        <>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Create Account
                        </>
                      ) : (
                        <>
                          <LogIn className="h-4 w-4 mr-2" />
                          Sign In
                        </>
                      )}
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDialog(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>

            <div className="mt-4 text-center text-sm">
              {isSignUp ? (
                <button
                  onClick={() => {
                    setIsSignUp(false);
                    setError("");
                  }}
                  className="text-primary hover:underline"
                >
                  Already have an account? Sign in
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsSignUp(true);
                    setError("");
                  }}
                  className="text-primary hover:underline"
                >
                  Don't have an account? Sign up
                </button>
              )}
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
