import { Link } from "react-router-dom";
import { Building2 } from "lucide-react";

const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
        <Building2 className="h-5 w-5 text-white" />
      </div>
      <span className="font-semibold text-lg text-foreground">EduFlow</span>
    </Link>
  );
};

export default Logo; 