import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginWithGoogle } = useAuth();

  async function handleGoogleLogin() {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
    } catch (error) {
      setError('Google ile giriş başarısız oldu.');
      console.error('Google login error:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-dark-900 border-2 border-gold rounded-lg shadow-glow-lg p-8">
        <div className="text-center mb-8">
          <img 
            src={`${import.meta.env.BASE_URL}logo.svg`}
            alt="Logo" 
            className="w-24 h-24 mx-auto mb-4 drop-shadow-[0_0_20px_rgba(255,184,0,0.8)] animate-pulseGlow"
          />
          <h2 className="text-3xl font-bold text-gold mb-2">
            Giriş Yap
          </h2>
          <p className="text-gray-400">
            Medya takip sisteminize hoş geldiniz
          </p>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white hover:bg-gold text-gray-900 font-semibold py-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 hover:shadow-glow"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="text-lg">
            {loading ? 'Giriş Yapılıyor...' : 'Google ile Giriş Yap'}
          </span>
        </button>

        <p className="text-gray-400 text-sm text-center mt-6">
          Google hesabınızla <span className="text-gold font-semibold">güvenli</span> bir şekilde giriş yapın
        </p>
      </div>
    </div>
  );
}

export default Login;
