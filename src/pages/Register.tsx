
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '@/components/auth/RegisterForm';
import { Terminal } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Register = () => {
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
        {/* Left column - Image/Gradient (hidden on mobile) */}
        <div className="hidden xl:block xl:w-1/2 bg-gradient-to-br from-accent/80 to-primary/80 p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71')] bg-cover bg-center opacity-20"></div>
          <div className="relative z-10 h-full flex flex-col justify-center items-center text-white">
            <div className="max-w-md text-center">
              <div className="inline-block p-3 rounded-full bg-white/10 backdrop-blur-sm mb-6">
                <Terminal className="h-12 w-12" />
              </div>
              <h2 className="text-4xl font-bold mb-4">Smart Query Generation</h2>
              <p className="text-lg opacity-90 mb-8">
                Simplify your database interactions with human-language query creation.
              </p>
              <div className="grid grid-cols-1 gap-4 mb-8">
                <div className="p-6 rounded-lg bg-white/10 backdrop-blur-sm">
                  <h3 className="text-xl font-medium mb-3">How It Works</h3>
                  <ol className="text-left space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/30 inline-flex items-center justify-center mt-0.5">1</span>
                      <span>Create your account to get started</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/30 inline-flex items-center justify-center mt-0.5">2</span>
                      <span>Select your database type (SQL or NoSQL)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/30 inline-flex items-center justify-center mt-0.5">3</span>
                      <span>Write your query in natural language</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/30 inline-flex items-center justify-center mt-0.5">4</span>
                      <span>Get instant, accurate database queries</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right column - Form */}
        <div className="w-full xl:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="flex justify-center mb-8">
              <div className="flex items-center gap-2">
                <Terminal className="h-8 w-8 text-primary" />
                <span className="text-2xl font-semibold">QueryGenie</span>
              </div>
            </div>
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
