import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3V2XApKgRGhljQRC275JOVqferWDvfQw",
  authDomain: "movie-database-65d3f.firebaseapp.com",
  projectId: "movie-database-65d3f",
  storageBucket: "movie-database-65d3f.firebasestorage.app",
  messagingSenderId: "72659441028",
  appId: "1:72659441028:web:50953d5ea6fcb85a4bb9d1",
  measurementId: "G-CFPL2QTRDN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function Auth({ isOpen, onClose }) {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Reset form when modal opens/closes
    if (!isOpen) {
      setEmail('');
      setPassword('');
      setError('');
      setSuccess('');
      setLoading(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isSignIn) {
        await signInWithEmailAndPassword(auth, email, password);
        setSuccess('Successfully signed in!');
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        setSuccess('Account created successfully!');
      }
      
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error('Auth error:', error.code, error.message);
      
      switch (error.code) {
        case 'auth/invalid-credential':
          setError(isSignIn 
            ? 'Invalid email or password. Please try again.' 
            : 'Could not create account. Please try again.');
          break;
        case 'auth/user-not-found':
          setError('No account found with this email. Please sign up first.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again.');
          break;
        case 'auth/email-already-in-use':
          setError('An account with this email already exists. Please sign in instead.');
          break;
        case 'auth/weak-password':
          setError('Password must be at least 6 characters long.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your internet connection.');
          break;
        case 'auth/too-many-requests':
          setError('Too many attempts. Please try again later.');
          break;
        default:
          setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content bg-dark text-light">
          <div className="modal-header border-0">
            <h5 className="modal-title">
              {isSignIn ? 'Welcome to XStream' : 'Create Account'}
            </h5>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control bg-secondary text-light"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control bg-secondary text-light"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && (
                <div className="alert alert-danger py-2" role="alert">
                  {error}
                </div>
              )}
              {success && (
                <div className="alert alert-success py-2" role="alert">
                  {success}
                </div>
              )}
              <button 
                type="submit" 
                className="btn btn-danger w-100"
                disabled={loading}
              >
                {loading ? 'Please wait...' : (isSignIn ? 'Sign In' : 'Sign Up')}
              </button>
            </form>
            <p className="text-center mt-3">
              <button
                className="btn btn-link text-light text-decoration-none"
                onClick={() => setIsSignIn(!isSignIn)}
              >
                {isSignIn 
                  ? 'New to XStream? Sign up now' 
                  : 'Already have an account? Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
