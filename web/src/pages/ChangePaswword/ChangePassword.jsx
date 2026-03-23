import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNew, setConfirmNew] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { changePassword, logout } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      await changePassword(oldPassword, newPassword, confirmNew);
      setMessage('Password changed successfully! Logging out...');
      setOldPassword('');
      setNewPassword('');
      setConfirmNew('');
      setTimeout(() => logout(), 1800);
    } catch (err) {
      setError(err.message || 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div >
      <form onSubmit={handleSubmit} className="add-form">
        <h2 className='add-form-header'>Change Password</h2>
        <div>
          <p className='add-form-label'>Current Password</p>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            autoComplete="current-password"
            className='add-form-input'
          />
        </div>

        <div>
          <p className='add-form-label'>New Password</p>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            autoComplete="new-password"
            className='add-form-input'
          />
        </div>

        <div>
          <p className='add-form-label'>Confirm New Password</p>
          <input
            type="password"
            value={confirmNew}
            onChange={(e) => setConfirmNew(e.target.value)}
            required
            autoComplete="new-password"
            className='add-form-input'
          />
        </div>

        {error && <div className="error">{error}</div>}
        {message && <div className="success">{message}</div>}

        <button type="submit" disabled={loading} className='add-form-submit'>
          {loading ? 'Changing...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
}

export default ChangePassword
