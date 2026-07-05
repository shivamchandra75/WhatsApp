import React, { useState } from 'react';
import styles from './LoginPage.module.css';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { loginUser, registerUser } from '../authSlice';

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { authLoading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLogin) {
      dispatch(loginUser({ email, password }));
    } else {
      dispatch(registerUser({ email, password, displayName: name }));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            alt="WhatsApp Logo"
            className={styles.logo}
          />
          <h1 className={styles.title}>WhatsApp Web</h1>
        </div>
        <div className={styles.body}>
          <p className={styles.instructions}>
            {isLogin ? "Sign in to use WhatsApp on your computer." : "Create an account to get started."}
          </p>

          <form className={styles.form} onSubmit={handleSubmit}>
            {!isLogin && (
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.input}
                required
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />

            {error && <p className={styles.error}>{error}</p>}

            <button type="submit" className={styles.submitButton} disabled={authLoading}>
              {authLoading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <button
            type="button"
            className={styles.toggleButton}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Need an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

