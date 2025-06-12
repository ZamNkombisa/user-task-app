import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

interface User {
  id: number;
  name: string;
  tasks: Task[];
}

interface Task {
  id: number;
  title: string;
  completed: boolean;
  userId?: number;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUserName, setNewUserName] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [userTasks, setUserTasks] = useState<Task[]>([]);

  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editedTaskTitle, setEditedTaskTitle] = useState<string>('');

  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editedUserName, setEditedUserName] = useState<string>('');


  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000'; // backend API URL

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get<User[]>(`${API_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim()) return;
    try {
      await axios.post(`${API_URL}/users`, { name: newUserName });
      setNewUserName('');
      fetchUsers(); // Refresh the user list
    } catch (error: any) { // Use 'any' for error type to access properties if needed
      console.error('Error creating user:', error);
      alert(`Failed to create user: ${error.response?.data?.message || error.message}`);
    }
  };

  const fetchUserTasks = async (userId: number) => {
    try {
      // Correct template literal usage
      const response = await axios.get<Task[]>(`${API_URL}/users/${userId}/tasks`);
      setUserTasks(response.data);
    } catch (error) {
      console.error('Error fetching user tasks:', error);
      setUserTasks([]); // Clear tasks if fetch fails
    }
  };

  const handleUserClick = (user: User) => {
    // Only select user if not currently editing a user
    if (editingUserId === null) {
        setSelectedUser(user);
        setEditingTaskId(null); // Reset task editing state
        setEditedTaskTitle('');
        fetchUserTasks(user.id);
    }
  };

  const createTaskForUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !selectedUser) return;
    try {
      // Correct template literal usage
      await axios.post(`${API_URL}/users/${selectedUser.id}/tasks`, { title: newTaskTitle });
      setNewTaskTitle('');
      fetchUserTasks(selectedUser.id); // Refresh tasks for the selected user
    } catch (error: any) { // Use 'any' for error type to access properties if needed
      console.error('Error creating task:', error);
      alert(`Failed to create task: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!selectedUser || !window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    try {
      // Correct template literal usage
      await axios.delete(`${API_URL}/users/${selectedUser.id}/tasks/${taskId}`);
      fetchUserTasks(selectedUser.id); // Refresh tasks
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task.');
    }
  };

  const handleEditClick = (task: Task) => {
    setEditingTaskId(task.id);
    setEditedTaskTitle(task.title);
  };

  const handleSaveEdit = async (taskId: number) => {
    if (!selectedUser || !editedTaskTitle.trim()) {
      return;
    }
    try {
      // Correct template literal usage
      await axios.put(`${API_URL}/users/${selectedUser.id}/tasks/${taskId}`, { title: editedTaskTitle });
      setEditingTaskId(null); // Exit edit mode
      setEditedTaskTitle(''); // Clear edit input
      fetchUserTasks(selectedUser.id); // Refresh tasks
    } catch (error) {
      console.error('Error updating task title:', error);
      alert('Failed to update task title.');
    }
  };

  const handleToggleComplete = async (task: Task) => {
    if (!selectedUser) return;
    try {
      // Correct template literal usage
      await axios.put(`${API_URL}/users/${selectedUser.id}/tasks/${task.id}`, { completed: !task.completed });
      fetchUserTasks(selectedUser.id); // Refresh tasks
    } catch (error) {
      console.error('Error toggling task completion:', error);
      alert('Failed to toggle task completion status.');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('Are you sure you want to delete this user and all their tasks?')) {
        return;
    }
    try {
        // Correct template literal usage
        await axios.delete(`${API_URL}/users/${userId}`);
        fetchUsers(); // Refresh the user list
        if (selectedUser && selectedUser.id === userId) {
            setSelectedUser(null); // Deselect user if deleted
            setUserTasks([]); // Clear tasks
        }
    } catch (error: any) {
        console.error('Error deleting user:', error);
        alert(`Failed to delete user: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleUserEditClick = (user: User) => {
    setEditingUserId(user.id);
    setEditedUserName(user.name);
    setSelectedUser(null); // Deselect user to prevent task view interference during user edit
  };

  const handleSaveUserEdit = async (userId: number) => {
    if (!editedUserName.trim()) {
        alert("User name cannot be empty.");
        return;
    }
    try {
        // Correct template literal usage
        await axios.put(`${API_URL}/users/${userId}`, { name: editedUserName });
        setEditingUserId(null); // Exit edit mode
        setEditedUserName(''); // Clear edit input
        fetchUsers(); // Refresh the user list
    } catch (error: any) {
        console.error('Error updating user name:', error);
        alert(`Failed to update user: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="App container mt-4">
      <h1 className="mb-4">User Task Manager</h1>

      {/* User Creation Form */}
      <div className="card mb-4">
        <div className="card-header">Create New User</div>
        <div className="card-body">
          <form onSubmit={createUser}>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="User name"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">
                Add User
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* User List */}
      <div className="card mb-4">
        <div className="card-header">Users</div>
        <ul className="list-group list-group-flush">
          {users.length === 0 ? (
            <li className="list-group-item text-muted">No users found. Create one above!</li>
          ) : (
            users.map((user) => (
              <li
                key={user.id}
                className={`list-group-item d-flex justify-content-between align-items-center list-group-item-action ${selectedUser?.id === user.id ? 'active' : ''}`}
                // Conditional onClick: only allow selection if not editing
                onClick={() => handleUserClick(user)}
                style={{ cursor: 'pointer' }}
              >
                {editingUserId === user.id ? (
                  // User Edit Mode
                  <div className="input-group flex-grow-1 me-2">
                    <input
                      type="text"
                      className="form-control"
                      value={editedUserName}
                      onChange={(e) => setEditedUserName(e.target.value)}
                    />
                    <button className="btn btn-sm btn-outline-success" onClick={(e) => { e.stopPropagation(); handleSaveUserEdit(user.id); }}>
                      Save
                    </button>
                    <button className="btn btn-sm btn-outline-secondary" onClick={(e) => { e.stopPropagation(); setEditingUserId(null); setEditedUserName(''); }}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  // User Display Mode
                  <>
                    <span className="flex-grow-1">{user.name}</span>
                    <div className="btn-group btn-group-sm" role="group">
                      <button className="btn btn-info" onClick={(e) => { e.stopPropagation(); handleUserEditClick(user); }}>
                        Edit
                      </button>
                      <button className="btn btn-danger" onClick={(e) => { e.stopPropagation(); handleDeleteUser(user.id); }}>
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Task Management Section */}
      {selectedUser && (
        <div className="card">
          <div className="card-header">Tasks for {selectedUser.name}</div>
          <div className="card-body">
            {/* Task Creation Form */}
            <form onSubmit={createTaskForUser} className="mb-3">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="New task title"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                />
                <button type="submit" className="btn btn-success">
                  Add Task
                </button>
              </div>
            </form>

            {/* Task List */}
            {userTasks.length === 0 ? (
              <p className="text-muted">No tasks for this user. Add one above!</p>
            ) : (
              <ul className="list-group">
                {userTasks.map((task) => (
                  <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
                    {editingTaskId === task.id ? (
                      // Edit mode for task
                      <div className="input-group w-75">
                        <input
                          type="text"
                          className="form-control"
                          value={editedTaskTitle}
                          onChange={(e) => setEditedTaskTitle(e.target.value)}
                        />
                        <button className="btn btn-sm btn-outline-success" onClick={() => handleSaveEdit(task.id)}>
                          Save
                        </button>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => setEditingTaskId(null)}>
                          Cancel
                        </button>
                      </div>
                    ) : (
                      // Display mode for task
                      <>
                        <div
                            className={`form-check d-flex align-items-center ${task.completed ? 'text-decoration-line-through text-muted' : ''}`}
                            onClick={() => handleToggleComplete(task)}
                            style={{ cursor: 'pointer' }}
                        >
                            <input
                                className="form-check-input me-2"
                                type="checkbox"
                                checked={task.completed}
                                onChange={(e) => e.stopPropagation()}
                                id={`task-${task.id}`}
                            />
                            <label className="form-check-label flex-grow-1" htmlFor={`task-${task.id}`}>
                                {task.title}
                            </label>
                        </div>
                        <div className="btn-group btn-group-sm" role="group">
                          <button className="btn btn-info" onClick={(e) => { e.stopPropagation(); handleEditClick(task); }}>
                            Edit
                          </button>
                          <button className="btn btn-danger" onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.id); }}>
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;