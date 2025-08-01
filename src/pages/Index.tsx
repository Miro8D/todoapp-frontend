import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, UserPlus, CheckSquare, Layout, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-board">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-6">
              <CheckSquare className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-4">
              Organize Your Tasks
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A beautiful, Trello-inspired todo app to help you stay organized and productive. 
              Create, manage, and track your tasks with ease.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button asChild size="lg" className="gap-2 min-w-[140px]">
              <Link to="/login">
                <LogIn className="w-5 h-5" />
                Sign In
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2 min-w-[140px]">
              <Link to="/signup">
                <UserPlus className="w-5 h-5" />
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="text-center shadow-card hover:shadow-card-hover transition-all duration-200">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Layout className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Clean Interface</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Beautiful, card-based design inspired by Trello for an intuitive user experience.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center shadow-card hover:shadow-card-hover transition-all duration-200">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <CheckSquare className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Rich Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Add titles, descriptions, and images to make your tasks as detailed as you need.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center shadow-card hover:shadow-card-hover transition-all duration-200">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Fast & Responsive</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Quick interactions and smooth animations make task management effortless.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
