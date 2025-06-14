import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useApplication } from "@/context/ApplicationContext";
import { useAuth } from "@/context/AuthContext";
import { CalendarIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const StudentDashboard = () => {
  const { user } = useAuth();
  const { getApplicationsByStudentId } = useApplication();
  
  const applications = user ? getApplicationsByStudentId(user.id) : [];
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "approved_by_faculty":
      case "approved_by_hod":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "approved_by_faculty":
        return "Approved by Faculty";
      case "approved_by_hod":
        return "Approved by HOD";
      default:
        return "Pending";
    }
  };

  const recentApplications = applications.slice(0, 3);
  
  return (
    <div className="animate-in">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground">
            Here's an overview of your leave applications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/leave-application">
            <Button className="bg-cams-600 hover:bg-cams-700">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Apply for Leave
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.filter(app => app.status === "approved").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {applications.filter(app => 
                app.status === "pending" || 
                app.status === "approved_by_faculty" || 
                app.status === "approved_by_hod"
              ).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.filter(app => app.status === "rejected").length}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Recent Applications</h2>
        {recentApplications.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentApplications.map((application) => (
              <Card key={application.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-medium">
                      {new Date(application.startDate).toLocaleDateString()} - {new Date(application.endDate).toLocaleDateString()}
                    </CardTitle>
                    <div className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(application.status)}`}>
                      {getStatusText(application.status)}
                    </div>
                  </div>
                  <CardDescription className="truncate">{application.reason}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2 text-sm">
                  <p className="text-muted-foreground">
                    Submitted on {new Date(application.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
                <CardFooter>
                  <Link to={`/status?id=${application.id}`} className="text-xs text-cams-600 hover:underline">
                    View details
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-muted/40 rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium mb-2">No applications yet</h3>
            <p className="text-muted-foreground mb-4">You haven't submitted any leave applications</p>
            <Link to="/leave-application">
              <Button>Apply for Leave</Button>
            </Link>
          </div>
        )}
        
        {applications.length > 3 && (
          <div className="mt-4 text-center">
            <Link to="/status">
              <Button variant="outline">View All Applications</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;