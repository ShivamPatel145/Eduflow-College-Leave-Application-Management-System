import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to home page
    navigate('/');
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">College Application Management System</h1>
        <p className="text-muted-foreground">Redirecting to home page...</p>
      </div>
    </div>
  );
};

export default Index;
