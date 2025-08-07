import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { UserPlus, User, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const SignupPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (username: string, password: string) => {
    if (!username.trim() || !password.trim()) {
      setError('Username and password are required');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // First, check if username is available
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/accounts/check-username`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Username check failed');
      }

      // If username is available, navigate to onboarding with credentials
      navigate('/onboarding', { 
        state: { username, password }
      });
    } catch (err) {
      setError(err.message || 'Failed to validate username. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSignup(username, password);
  };

  return (
    <div className="min-h-screen bg-gradient-board flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="shadow-card-hover">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
            <p className="text-muted-foreground">Join us to start organizing your tasks</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                    Checking...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Create Account
                  </>
                )}
              </Button>
            </form>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </p>
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground inline-block">
                ← Back to home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;