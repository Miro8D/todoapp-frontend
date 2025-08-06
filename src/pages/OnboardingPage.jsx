'use client';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Phone, MapPin, ArrowRight } from 'lucide-react';

const countries = [
  'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Spain', 'Italy', 
  'Australia', 'Japan', 'South Korea', 'China', 'India', 'Brazil', 'Mexico', 'Russia',
  'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Switzerland', 'Austria',
  'Belgium', 'Portugal', 'Ireland', 'New Zealand', 'Singapore', 'Other'
];

export default function OnboardingPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { username, password } = location.state || {};

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [country, setCountry] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!username || !password) {
            navigate('/signup');
        }
    }, [username, password, navigate]);

    const handleComplete = async () => {
        if (!firstName.trim() || !lastName.trim()) {
            setError('First name and last name are required');
            return;
        }

        setIsLoading(true);
        setError('');
        
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/accounts/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    username, 
                    password, 
                    firstName, 
                    lastName, 
                    phone: phone || null, 
                    country: country || null 
                }),
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Signup failed');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            navigate('/todo');
        } catch (err) {
            setError(err.message || 'Signup failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!username || !password) {
        return (
            <div className="min-h-screen bg-gradient-board flex items-center justify-center p-6">
                <div className="text-center text-muted-foreground">Redirecting...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-board flex items-center justify-center p-6">
            <div className="w-full max-w-md mx-auto">
                <Card className="shadow-card hover:shadow-card-hover transition-all duration-200">
                    <CardHeader className="text-center pb-6">
                        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <User className="w-6 h-6 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground">Complete Your Profile</h1>
                        <p className="text-muted-foreground">Tell us a bit more about yourself</p>
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
                                handleComplete();
                            }}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">First Name *</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        type="text"
                                        placeholder="Enter your first name"
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Last Name *</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        type="text"
                                        placeholder="Enter your last name"
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        type="tel"
                                        placeholder="Enter your phone number"
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Country</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                                    <Select value={country} onValueChange={setCountry}>
                                        <SelectTrigger className="pl-10">
                                            <SelectValue placeholder="Select your country" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {countries.map((countryOption) => (
                                                <SelectItem key={countryOption} value={countryOption}>
                                                    {countryOption}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full gap-2 mt-6"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        <ArrowRight className="w-4 h-4" />
                                        Complete Signup
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}