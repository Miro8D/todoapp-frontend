'use client';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Edit3, LogOut, Image as ImageIcon, Save, XCircle } from 'lucide-react';

function checkToken() {
  const token = localStorage.getItem('token')
  if (token){
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp < Date.now() / 1000) {
        localStorage.removeItem('token');
        return 0;
      } else return 1;        // Returns 1 if its succesful, 0 if failed
    } catch (err) {
      console.error('Failed to decode JWT:', err);
      localStorage.removeItem('token');
      return 0;
    }
  } else return 0;
}

export default function TodoPage() {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const [user, setUser] = useState(null);

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

        const json = await response.json();
        return json;
    };

    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);

    const [changeTitle, setChangeTitle] = useState('');
    const [changeDescription, setChangeDescription] = useState('');
    const [changeImage, setChangeImage] = useState(null);
    const [changeId, setChangeId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!checkToken()) {
            navigate('/');
        } else {
            try {
              setUser(jwtDecode(token));
            } catch (err) {
              console.error(err)
            }

            fetchApi(token, 'api/todos')
                .then(todos => setTodos(todos))
                .catch(err => console.error('Failed to fetch todos:', err));
        }
    }, []);

    const handleAdd = async () => {
        if (!title.trim()) return;
        
        const token = localStorage.getItem('token');
        try {
            const formData = new FormData();
            formData.append('title', title);
            if (description) formData.append('description', description);
            if (image) formData.append('image', image);

            await fetchApi(token, 'api/todos/', {
                method: 'POST',
                body: formData,
                headers: {} // Let browser set content-type for FormData
            });

            // Refresh todos
            const updatedTodos = await fetchApi(token, 'api/todos/');
            setTodos(updatedTodos);
            
            // Reset form
            setTitle('');
            setDescription('');
            setImage(null);
        } catch (err) {
            console.error('Failed to add todo:', err);
        }
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await fetchApi(token, `api/todos/${id}`, { method: 'DELETE' });
            setTodos(todos.filter(todo => todo.id !== id));
        } catch (err) {
            console.error('Failed to delete todo:', err);
        }
    };

    const setChange = (todo) => {
        setChangeId(todo.id);
        setChangeTitle(todo.title);
        setChangeDescription(todo.description || '');
    };

    const handleChange = async (newTitle, newDescription) => {
        const token = localStorage.getItem('token');
        try {
            const formData = new FormData();
            formData.append('title', newTitle);
            if (newDescription) formData.append('description', newDescription);
            if (changeImage) formData.append('image', changeImage);

            await fetchApi(token, `api/todos/${changeId}`, {
                method: 'PUT',
                body: formData,
                headers: {} // Let browser set content-type for FormData
            });

            // Refresh todos
            const updatedTodos = await fetchApi(token, 'api/todos/');
            setTodos(updatedTodos);
            setChangeId(null);
        } catch (err) {
            console.error('Failed to update todo:', err);
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
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">My Board</h1>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-sm">
                                Logged in as <span className="font-semibold">{user?.username}</span>
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
                                                className="flex-1 gap-2"
                                            >
                                                <Save className="w-3 h-3" />
                                                Save
                                            </Button>
                                            <Button 
                                                onClick={() => setChangeId(null)}
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 gap-2"
                                            >
                                                <XCircle className="w-3 h-3" />
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
                                                    src={`http://localhost:8000/${todo.image_url}`}
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
}
