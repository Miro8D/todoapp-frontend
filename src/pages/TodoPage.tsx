import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Edit3, LogOut, Image as ImageIcon } from 'lucide-react';

interface Todo {
  id: number;
  title: string;
  description?: string;
  image_url?: string;
}

// Mock data and functions for demo - replace with your actual implementations
const mockUser = { username: "demo_user" };
const mockTodos: Todo[] = [
  { id: 1, title: "Design new landing page", description: "Create mockups and wireframes for the new landing page design" },
  { id: 2, title: "Fix responsive issues", description: "Address mobile layout problems on todo cards" },
  { id: 3, title: "Add image upload", description: "", image_url: "sample-image.jpg" },
];

const TodoPage = () => {
  const [todos, setTodos] = useState<Todo[]>(mockTodos);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [changeId, setChangeId] = useState<number | null>(null);
  const [changeTitle, setChangeTitle] = useState('');
  const [changeDescription, setChangeDescription] = useState('');
  const [changeImage, setChangeImage] = useState<File | null>(null);

  const handleAdd = () => {
    if (!title.trim()) return;
    
    const newTodo: Todo = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim() || undefined,
      image_url: image ? 'temp-url' : undefined
    };
    
    setTodos([...todos, newTodo]);
    setTitle('');
    setDescription('');
    setImage(null);
  };

  const handleDelete = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const setChange = (todo: Todo) => {
    setChangeId(todo.id);
    setChangeTitle(todo.title);
    setChangeDescription(todo.description || '');
  };

  const handleChange = (newTitle: string, newDescription: string) => {
    setTodos(todos.map(todo => 
      todo.id === changeId 
        ? { ...todo, title: newTitle, description: newDescription }
        : todo
    ));
    setChangeId(null);
  };

  const logout = () => {
    // Handle logout
    console.log('Logout clicked');
  };

  return (
    <div className="min-h-screen bg-gradient-board p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Board</h1>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                Logged in as <span className="font-semibold">{mockUser.username}</span>
              </Badge>
            </div>
          </div>
          <Button variant="outline" onClick={logout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Add New Todo Card */}
        <Card className="mb-8 shadow-card hover:shadow-card-hover transition-all duration-200">
          <CardHeader>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Add New Task
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              className="text-base"
            />
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description (optional)..."
              className="min-h-[80px] resize-none"
            />
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ImageIcon className="w-4 h-4" />
                  <span>Add image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
                {image && (
                  <span className="text-xs text-primary ml-6">{image.name}</span>
                )}
              </div>
              <Button onClick={handleAdd} disabled={!title.trim()} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Task
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Todo List */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {todos.map((todo) => (
            <Card key={todo.id} className="shadow-card hover:shadow-card-hover transition-all duration-200 group">
              <CardContent className="p-4">
                {changeId === todo.id ? (
                  // Edit Mode
                  <div className="space-y-3">
                    <Input
                      value={changeTitle}
                      onChange={(e) => setChangeTitle(e.target.value)}
                      className="font-medium"
                    />
                    <Textarea
                      value={changeDescription}
                      onChange={(e) => setChangeDescription(e.target.value)}
                      placeholder="Add description..."
                      className="min-h-[60px] resize-none"
                    />
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground">
                        <ImageIcon className="w-4 h-4" />
                        Update image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setChangeImage(e.target.files?.[0] || null)}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleChange(changeTitle, changeDescription)}
                        size="sm"
                        className="flex-1"
                      >
                        Save
                      </Button>
                      <Button 
                        onClick={() => setChangeId(null)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-base leading-tight flex-1">
                        {todo.title}
                      </h3>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          onClick={() => setChange(todo)}
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(todo.id)}
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {todo.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {todo.description}
                      </p>
                    )}
                    
                    {todo.image_url && (
                      <div className="rounded-lg overflow-hidden bg-muted">
                        <img
                          src={todo.image_url}
                          alt="Todo attachment"
                          className="w-full h-32 object-cover"
                        />
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {todos.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-muted-foreground">
                <Plus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No tasks yet</p>
                <p className="text-sm">Add your first task to get started!</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TodoPage;