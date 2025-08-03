import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const status = searchParams.get('status');

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  const getMessage = () => {
    switch (status) {
      case 'success':
        return { text: '🎉 Email verified successfully!', color: 'green' };
      case 'already':
        return { text: '✅ Email is already verified.', color: 'blue' };
      case 'expired':
        return { text: '⏳ Token expired. Please request a new one.', color: 'orange' };
      case 'invalid':
        return { text: '❌ Invalid verification token.', color: 'red' };
      case 'missing':
        return { text: '⚠️ Verification token missing in URL.', color: 'gray' };
      default:
        return { text: 'Something went wrong.', color: 'black' };
    }
  };

  const { text, color } = getMessage();

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f4f4f4',
    }}>
      <div style={{
        padding: '2rem 3rem',
        borderRadius: '10px',
        backgroundColor: 'white',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        textAlign: 'center',
        borderLeft: `6px solid ${color}`
      }}>
        <h2 style={{ color }}>{text}</h2>
        <p style={{ marginTop: '1rem', color: '#666' }}>Redirecting to homepage...</p>
      </div>
    </div>
  );
}
