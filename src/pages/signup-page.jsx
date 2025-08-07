'use client';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { UserPlus, LogIn, Lock, User } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

export default function SignupPage() {
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token){
          try {
            const decoded = jwtDecode(token);
            if (decoded.exp < Date.now() / 1000) {
              localStorage.removeItem('token');
              return;
            } else navigate('/todo');
          } catch (err) {
            console.error('Failed to decode JWT:', err);
            localStorage.removeItem('token');
          }
        } else return;
  }, []);
    
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignup = async (username, password) => {
        if (!username.trim() || !password.trim()) {
            setError('Username and password are required');
            return;
        }
        
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        try{
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/accounts/signup`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ username, password }),
            });
            if (!response.ok) {
                    const errorData = await response.text();
                    throw new Error(errorData || 'Signup failed');
            }
            const data = await response.json();
            localStorage.setItem('token', data.token);
            navigate('/onboarding' , { state: { username } });
        } catch (err) {
            setError(err.message || 'Signup failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-board flex items-center justify-center p-6">
            <div className="w-full max-w-md mx-auto">
                <Card className="shadow-card hover:shadow-card-hover transition-all duration-200">
                    <CardHeader className="text-center pb-6">
                        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <UserPlus className="w-6 h-6 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
                        <p className="text-muted-foreground">Sign up for a new account</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSignup(user, pass);
                            }}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Username</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        value={user}
                                        onChange={(e) => setUser(e.target.value)}
                                        type="text"
                                        placeholder="Choose a username"
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        value={pass}
                                        onChange={(e) => setPass(e.target.value)}
                                        type="password"
                                        placeholder="Choose a password"
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full gap-2"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-4 h-4" />
                                        Sign Up
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="text-center pt-4 border-t border-border">
                            <p className="text-sm text-muted-foreground">
                                Already have an account?{' '}
                                <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
