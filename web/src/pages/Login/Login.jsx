import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/')
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className='add-form'>
        <h2 className='add-form-header'>Login</h2>
        <div>
          <p className='add-form-label'>Username</p>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
            className='add-form-input'
          />
        </div>

        <div>
          <p className='add-form-label'>Password</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className='add-form-input'
          />
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={loading} className='add-form-submit'>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </>
  );
}
