import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Seed default accounts in localStorage if not already present
const seedUsers = () => {
  const existingUsers = localStorage.getItem('mycity_users');
  if (!existingUsers) {
    const defaultUsers = [
      {
        email: 'citizen@city.os',
        password: 'citizen123',
        role: 'citizen',
        name: 'Jane Doe',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
        points: 450,
        reportsCount: 12,
        resolvedCount: 8,
        badges: ['Eagle Eye', 'Road Warrior', 'Clean Green'],
        joinedDate: '2026-01-15'
      },
      {
        email: 'worker@city.os',
        password: 'worker123',
        role: 'worker',
        name: 'Officer Dave',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
        department: 'Sanitation & Roads',
        tasksCompleted: 34,
        joinedDate: '2025-08-10'
      },
      {
        email: 'admin@city.os',
        password: 'admin123',
        role: 'admin',
        name: 'Director Susan',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
        department: 'Municipal Operations',
        joinedDate: '2024-03-22'
      }
    ];
    localStorage.setItem('mycity_users', JSON.stringify(defaultUsers));
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    seedUsers();
    const savedSession = localStorage.getItem('mycity_session');
    if (savedSession) {
      setUser(JSON.parse(savedSession));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('mycity_users') || '[]');
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    
    if (!foundUser) {
      throw new Error('Invalid email or password.');
    }
    
    // Set active session (excluding password)
    const { password: _, ...sessionUser } = foundUser;
    localStorage.setItem('mycity_session', JSON.stringify(sessionUser));
    setUser(sessionUser);
    return sessionUser;
  };

  const register = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('mycity_users') || '[]');
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Email is already registered.');
    }

    const newUser = {
      email: email.toLowerCase(),
      password,
      role: 'citizen',
      name,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 999999)}?auto=format&fit=crop&q=80&w=150`,
      points: 0,
      reportsCount: 0,
      resolvedCount: 0,
      badges: ['Novice Reporter'],
      joinedDate: new Date().toISOString().split('T')[0]
    };

    users.push(newUser);
    localStorage.setItem('mycity_users', JSON.stringify(users));

    // Auto-login
    const { password: _, ...sessionUser } = newUser;
    localStorage.setItem('mycity_session', JSON.stringify(sessionUser));
    setUser(sessionUser);
    return sessionUser;
  };

  const logout = () => {
    localStorage.removeItem('mycity_session');
    setUser(null);
  };

  // Gamification: Add points and unlock badges for the citizen
  const addCitizenPoints = (pointsAmount, badgeName = null) => {
    if (!user || user.role !== 'citizen') return;

    const users = JSON.parse(localStorage.getItem('mycity_users') || '[]');
    const userIndex = users.findIndex(u => u.email === user.email);

    if (userIndex !== -1) {
      users[userIndex].points = (users[userIndex].points || 0) + pointsAmount;
      users[userIndex].reportsCount = (users[userIndex].reportsCount || 0) + 1;
      
      if (badgeName && !users[userIndex].badges.includes(badgeName)) {
        users[userIndex].badges.push(badgeName);
      }

      // Check for milestones
      if (users[userIndex].reportsCount >= 5 && !users[userIndex].badges.includes('Civic Leader')) {
        users[userIndex].badges.push('Civic Leader');
      }

      // Save user back to users array and current session
      localStorage.setItem('mycity_users', JSON.stringify(users));
      const { password: _, ...sessionUser } = users[userIndex];
      localStorage.setItem('mycity_session', JSON.stringify(sessionUser));
      setUser(sessionUser);
    }
  };

  const incrementResolvedCount = (email) => {
    const users = JSON.parse(localStorage.getItem('mycity_users') || '[]');
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex !== -1) {
      users[userIndex].resolvedCount = (users[userIndex].resolvedCount || 0) + 1;
      users[userIndex].points = (users[userIndex].points || 0) + 100; // Reward for resolution
      
      localStorage.setItem('mycity_users', JSON.stringify(users));
      
      // Update session if it's the current user
      if (user && user.email === email) {
        const { password: _, ...sessionUser } = users[userIndex];
        localStorage.setItem('mycity_session', JSON.stringify(sessionUser));
        setUser(sessionUser);
      }
    }
  const updateProfile = (updatedData) => {
    if (!user) return;

    const users = JSON.parse(localStorage.getItem('mycity_users') || '[]');
    const userIndex = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());

    if (userIndex !== -1) {
      const updatedUser = { ...users[userIndex], ...updatedData };
      users[userIndex] = updatedUser;
      
      localStorage.setItem('mycity_users', JSON.stringify(users));
      
      // Update active session (excluding password)
      const { password: _, ...sessionUser } = updatedUser;
      localStorage.setItem('mycity_session', JSON.stringify(sessionUser));
      setUser(sessionUser);
      return sessionUser;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, addCitizenPoints, incrementResolvedCount, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
