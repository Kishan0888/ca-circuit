'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { login,loginWithGoogle, user, userData, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
  if (!loading && user && userData) {
    const params = new URLSearchParams(window.location.search);
    const redirectTo = params.get('redirect');

    if (redirectTo) {
      router.push(redirectTo);
      return;
    }

    if (userData.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  }
}, [user, userData, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoginLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      // Redirect will be handled by useEffect
    } else {
      setError(result.error || 'Login failed. Please try again.');
      setLoginLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
  setError('');
  setLoginLoading(true);

  const result = await loginWithGoogle();

  if (!result.success) {
    setError(result.error || 'Google login failed. Please try again.');
    setLoginLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-lg mb-4">
            <span className="text-white font-heading font-bold text-2xl">CA</span>
          </div>
          <h1 className="font-heading text-3xl font-bold text-heading mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your CA Connect account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-gold hover:bg-gold/90 text-white" disabled={loginLoading}>
                {loginLoading ? 'Signing in...' : 'Sign In'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <div className="relative my-5">
  <div className="absolute inset-0 flex items-center">
    <span className="w-full border-t" />
  </div>
  <div className="relative flex justify-center text-xs uppercase">
    <span className="bg-background px-2 text-muted-foreground">
      Or continue with
    </span>
  </div>
</div>

<Button
  type="button"
  variant="outline"
  className="w-full"
  onClick={handleGoogleLogin}
  disabled={loginLoading}
>
  <svg
    className="mr-2 h-5 w-5"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      fill="#4285F4"
      d="M21.35 12.27c0-.71-.06-1.39-.18-2.05H12v3.88h5.22a4.46 4.46 0 0 1-1.94 2.93v2.42h3.14c1.84-1.69 2.93-4.18 2.93-7.18z"
    />
    <path
      fill="#34A853"
      d="M12 21.5c2.64 0 4.86-.87 6.48-2.35l-3.14-2.42c-.87.58-1.98.93-3.34.93-2.56 0-4.73-1.73-5.51-4.06H3.24v2.5A9.79 9.79 0 0 0 12 21.5z"
    />
    <path
      fill="#FBBC05"
      d="M6.49 13.6A5.88 5.88 0 0 1 6.18 12c0-.56.1-1.1.31-1.6V7.9H3.24A9.5 9.5 0 0 0 2.25 12c0 1.48.35 2.88.99 4.1l3.25-2.5z"
    />
    <path
      fill="#EA4335"
      d="M12 6.34c1.44 0 2.73.5 3.75 1.48l2.81-2.81C16.86 3.45 14.64 2.5 12 2.5a9.79 9.79 0 0 0-8.76 5.4l3.25 2.5C7.27 8.07 9.44 6.34 12 6.34z"
    />
  </svg>

  Continue with Google
</Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link href="/register" className="text-primary font-medium hover:underline">
                  Create free account
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
