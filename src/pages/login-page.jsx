'use client';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { LogIn, UserPlus, Lock, User } from 'lucide-react';

export default function LoginPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (username, password) => {
        setIsLoading(true);
        setError('');
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/accounts/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Login failed');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            navigate('/todo');
        } catch (err) {
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-board flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <Card className="shadow-card hover:shadow-card-hover transition-all duration-200">
                    <CardHeader className="text-center pb-6">
                        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <LogIn className="w-6 h-6 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
                        <p className="text-muted-foreground">Sign in to your account</p>
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
                                handleLogin(user, pass);
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
                                        placeholder="Enter your username"
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
                                        placeholder="Enter your password"
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
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="w-4 h-4" />
                                        Sign In
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="text-center pt-4 border-t border-border">
                            <p className="text-sm text-muted-foreground">
                                Don't have an account?{' '}
                                <Link to="/signup" className="text-primary hover:text-primary/80 font-medium transition-colors">
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
