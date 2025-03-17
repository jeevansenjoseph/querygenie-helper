
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import { Terminal } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/select-database');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        {/* Left column - Form */}
        <div className="w-full xl:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="flex justify-center mb-8">
              <div className="flex items-center gap-2">
                <Terminal className="h-8 w-8 text-primary" />
                <span className="text-2xl font-semibold">QueryGenie</span>
              </div>
            </div>
            <LoginForm />
          </div>
        </div>
        
        {/* Right column - Image/Gradient (hidden on mobile) */}
        <div className="hidden xl:block xl:w-1/2 bg-gradient-to-br from-primary/80 to-accent/80 p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97')] bg-cover bg-center opacity-20"></div>
          <div className="relative z-10 h-full flex flex-col justify-center items-center text-white">
            <div className="max-w-md text-center">
              <div className="inline-block p-3 rounded-full bg-white/10 backdrop-blur-sm mb-6">
                <Terminal className="h-12 w-12" />
              </div>
              <h2 className="text-4xl font-bold mb-4">Transform Language to Queries</h2>
              <p className="text-lg opacity-90 mb-8">
                Convert your natural language into SQL and NoSQL queries effortlessly with our advanced NLP engine.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
                  <h3 className="font-medium mb-1">SQL & NoSQL</h3>
                  <p className="text-sm opacity-80">Support for multiple database types</p>
                </div>
                <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
                  <h3 className="font-medium mb-1">NLP Powered</h3>
                  <p className="text-sm opacity-80">Advanced natural language processing</p>
                </div>
                <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
                  <h3 className="font-medium mb-1">Real-time</h3>
                  <p className="text-sm opacity-80">Instant query generation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
