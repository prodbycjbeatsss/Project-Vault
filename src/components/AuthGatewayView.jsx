import React, { useState, useEffect } from 'react';
import { AudioWaveform, Eye, EyeOff, Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AUTH_SCENES, preloadScenes } from '../utils/authScenes';
import '../styles/auth.css';

export default function AuthGatewayView() {
  const { signUp, signIn, signInWithGoogle, continueAsGuest, authError, clearError } = useAuth();

  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

  // Preload scenes on mount
  useEffect(() => {
    preloadScenes();
  }, []);

  // Automatic crossfade rotation timer (7.5 seconds per scene)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSceneIndex((prev) => (prev + 1) % AUTH_SCENES.length);
    }, 7500);

    return () => clearInterval(timer);
  }, []);

  const currentScene = AUTH_SCENES[currentSceneIndex] || AUTH_SCENES[0];

  const handleToggleMode = () => {
    setIsSignUp((prev) => !prev);
    setLocalError('');
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    // Client-side validation
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setLocalError('Please enter your email address.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      setLocalError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setLocalError('Please enter your password.');
      return;
    }
    if (isSignUp && password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isSignUp) {
        await signUp(trimmedEmail, password);
      } else {
        await signIn(trimmedEmail, password);
      }
    } catch (err) {
      setLocalError(err?.message || 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLocalError('');
    clearError();
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setLocalError(err?.message || 'Google sign in failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeErrorMessage = localError || authError;

  return (
    <div className="auth-viewport">
      {/* Background Layered Crossfade */}
      {AUTH_SCENES.map((scene, idx) => (
        <div
          key={scene.id}
          className={`auth-bg-layer ${idx === currentSceneIndex ? 'active' : ''}`}
          style={{ backgroundImage: `url(${scene.url})` }}
          aria-hidden="true"
        />
      ))}

      {/* Subtle Digital Inspo Grid Overlay */}
      <div className="auth-bg-overlay" aria-hidden="true" />

      {/* Main Centered Floating Card */}
      <div className="auth-card-container">
        {/* Left Column: Form & Identity */}
        <div className="auth-form-column">
          <div>
            {/* Brand Logo & Name */}
            <div className="auth-brand-badge">
              <div className="auth-brand-icon-box">
                <AudioWaveform size={18} strokeWidth={2.4} />
              </div>
              <span className="auth-brand-name">ProjectVault</span>
            </div>

            {/* Main Heading (Editorial Serif) */}
            <h1 className="auth-heading">
              {isSignUp ? 'Create an account' : 'Welcome back'}
            </h1>

            {/* Subtitle (Body Sans) */}
            <p className="auth-subtitle">
              {isSignUp
                ? 'Enter your credentials to get started with ProjectVault'
                : 'Enter your credentials to access your creator workspace'}
            </p>

            {/* Error Banner */}
            {activeErrorMessage && (
              <div className="auth-error-banner" role="alert">
                <AlertCircle size={15} />
                <span>{activeErrorMessage}</span>
              </div>
            )}

            {/* Credentials Form */}
            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              <div className="auth-field-group">
                <div className="auth-input-wrapper">
                  <input
                    type="email"
                    className="auth-input"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="auth-field-group">
                <div className="auth-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="auth-input with-icon"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                    autoComplete={isSignUp ? 'new-password' : 'current-password'}
                    required
                  />
                  <button
                    type="button"
                    className="auth-field-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Primary Action Button */}
              <button
                type="submit"
                className="auth-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Continue</span>
                )}
              </button>
            </form>

            {/* OR Divider */}
            <div className="auth-divider">
              <span>or</span>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              className="auth-google-btn"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
            >
              <svg className="google-icon-svg" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Mode Switch Link */}
            <div className="auth-switch-prompt">
              <span>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              </span>
              <button
                type="button"
                className="auth-switch-link"
                onClick={handleToggleMode}
              >
                {isSignUp ? 'Login Now' : 'Sign Up'}
              </button>
            </div>
          </div>

          {/* Footer Terms & Guest Bypass Link */}
          <div className="auth-footer">
            <p className="auth-terms-text">
              By clicking on continue, you agree to our{' '}
              <span className="auth-terms-link">Terms of Service</span> and{' '}
              <span className="auth-terms-link">Privacy Policy</span>.
            </p>
            <button
              type="button"
              className="auth-guest-bypass"
              onClick={continueAsGuest}
            >
              <span>Continue as Guest</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Right Column: Inner Scenic Window Card */}
        <div className="auth-window-column" aria-label="Scenic Preview">
          {AUTH_SCENES.map((scene, idx) => (
            <div
              key={scene.id}
              className={`auth-window-pane ${idx === currentSceneIndex ? 'active' : ''}`}
              style={{ backgroundImage: `url(${scene.url})` }}
            />
          ))}

          {/* Inner Scenic Window Meta */}
          <div className="auth-window-overlay">
            <div className="auth-window-meta">
              <span className="auth-window-title">{currentScene.title}</span>
              <span className="auth-window-loc">{currentScene.location}</span>
            </div>
          </div>

          {/* Indicator Dots */}
          <div className="auth-scene-indicators">
            {AUTH_SCENES.map((scene, idx) => (
              <button
                key={scene.id}
                type="button"
                className={`auth-indicator-dot ${idx === currentSceneIndex ? 'active' : ''}`}
                onClick={() => setCurrentSceneIndex(idx)}
                aria-label={`Switch to scene: ${scene.title}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
