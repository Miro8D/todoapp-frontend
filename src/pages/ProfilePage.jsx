'use client';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { User, Phone, MapPin, Lock, ArrowLeft, Save } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { useToast } from '@/hooks/use-toast';

const countries = [
  'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Spain', 'Italy', 
  'Australia', 'Japan', 'South Korea', 'China', 'India', 'Brazil', 'Mexico', 'Russia',
  'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Switzerland', 'Austria',
  'Belgium', 'Portugal', 'Ireland', 'New Zealand', 'Singapore', 'Other'
];

export default function ProfilePage() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Profile info state
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [country, setCountry] = useState('');

    // Password change state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const fetchApi = async (token, uri, options = {}) => {
        if (uri[0] === '/') {
            uri = uri.substring(1);
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/${uri}`, {
            ...options,
            headers: {
                'Authorization': `Bearer ${token}`,
                ...(options.headers || {})
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || response.statusText);
        }

        return await response.json();
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const decoded = jwtDecode(token);
            if (decoded.exp < Date.now() / 1000) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }
            setUser(decoded);

            // Fetch user profile data
            fetchApi(token, 'api/profile')
                .then(profile => {
                    setFirstName(profile.firstName || '');
                    setLastName(profile.lastName || '');
                    setPhone(profile.phone || '');
                    setCountry(profile.country || '');
                })
                .catch(err => {
                    console.error('Failed to fetch profile:', err);
                });
        } catch (err) {
            console.error('Failed to decode JWT:', err);
            localStorage.removeItem('token');
            navigate('/login');
        }
    }, [navigate]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (!firstName.trim() || !lastName.trim()) {
            toast({
                title: "Error",
                description: "First name and last name are required",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);
        const token = localStorage.getItem('token');

        try {
            await fetchApi(token, 'api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    phone: phone || null,
                    country: country || null
                })
            });

            toast({
                title: "Success",
                description: "Profile updated successfully"
            });
        } catch (err) {
            toast({
                title: "Error",
                description: err.message || "Failed to update profile",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast({
                title: "Error",
                description: "New passwords don't match",
                variant: "destructive"
            });
            return;
        }

        if (newPassword.length < 6) {
            toast({
                title: "Error",
                description: "New password must be at least 6 characters",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);
        const token = localStorage.getItem('token');

        try {
            await fetchApi(token, 'api/accounts/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            });

            toast({
                title: "Success",
                description: "Password changed successfully"
            });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            toast({
                title: "Error",
                description: err.message || "Failed to change password",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-board flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-board p-6">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <Button variant="outline" onClick={() => navigate('/todo')} className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Board
                    </Button>
                    <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
                </div>

                <div className="space-y-6">
                    {/* Profile Information */}
                    <Card className="shadow-card hover:shadow-card-hover transition-all duration-200">
                        <CardHeader>
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <User className="w-5 h-5 text-primary" />
                                Personal Information
                            </h2>
                            <p className="text-muted-foreground">Update your profile details</p>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">First Name *</label>
                                        <Input
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            type="text"
                                            placeholder="Enter your first name"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Last Name *</label>
                                        <Input
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            type="text"
                                            placeholder="Enter your last name"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Username</label>
                                    <Input
                                        value={user.username}
                                        disabled
                                        className="bg-muted"
                                    />
                                    <p className="text-xs text-muted-foreground">Username cannot be changed</p>
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

                                <Button type="submit" disabled={isLoading} className="gap-2">
                                    <Save className="w-4 h-4" />
                                    {isLoading ? 'Updating...' : 'Update Profile'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Password Change */}
                    <Card className="shadow-card hover:shadow-card-hover transition-all duration-200">
                        <CardHeader>
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Lock className="w-5 h-5 text-primary" />
                                Change Password
                            </h2>
                            <p className="text-muted-foreground">Update your account password</p>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Current Password</label>
                                    <Input
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        type="password"
                                        placeholder="Enter your current password"
                                        required
                                    />
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">New Password</label>
                                    <Input
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        type="password"
                                        placeholder="Enter your new password"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Confirm New Password</label>
                                    <Input
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        type="password"
                                        placeholder="Confirm your new password"
                                        required
                                    />
                                </div>

                                <Button type="submit" disabled={isLoading} className="gap-2">
                                    <Lock className="w-4 h-4" />
                                    {isLoading ? 'Changing...' : 'Change Password'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}