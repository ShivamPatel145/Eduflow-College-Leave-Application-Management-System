import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApplication } from "@/context/ApplicationContext";
import { useAuth } from "@/context/AuthContext";
import { FileTextIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const FacultyDashboard = () => {
  const { user } = useAuth();
  const { getAllApplications } = useApplication();
  
  // Get applications for faculty's department
  const allApplications = getAllApplications();
  const departmentApplications = user?.department 
    ? allApplications.filter(app => app.department === user.department)
    : [];
  
  const pendingApplications = departmentApplications.filter(app => app.status === "pending");
  const approvedApplications = departmentApplications.filter(app => 
    app.status === "approved_by_faculty" || 
    app.status === "approved_by_hod" || 
    app.status === "approved"
  );
  const rejectedApplications = departmentApplications.filter(app => app.status === "rejected");
  
  return (
    <div className="animate-in">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground">
            Manage student leave applications for {user?.department}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/view-applications">
            <Button className="bg-cams-600 hover:bg-cams-700">
              <FileTextIcon className="mr-2 h-4 w-4" />
              View Applications
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
            <div className="text-2xl font-bold">{departmentApplications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingApplications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedApplications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedApplications.length}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingApplications.length > 0 ? (
              <div className="space-y-4">
                {pendingApplications.slice(0, 5).map((application) => (
                  <div key={application.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{application.studentName}</p>
                      <div className="flex gap-2 text-sm text-muted-foreground">
                        <p>{application.year} Year, {application.section}</p>
                        <span>•</span>
                        <p>{new Date(application.startDate).toLocaleDateString()} - {new Date(application.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/view-applications?id=${application.id}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No pending applications</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Department Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">Department</span>
                  <span className="text-lg">{user?.department}</span>
                </div>
                <div className="flex flex-col gap-1 text-right">
                  <span className="text-sm font-medium">Role</span>
                  <span className="text-lg capitalize">{user?.role}</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Application Statistics</h3>
                <div className="bg-muted rounded-md p-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold">{pendingApplications.length}</p>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{approvedApplications.length}</p>
                      <p className="text-xs text-muted-foreground">Approved</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{rejectedApplications.length}</p>
                      <p className="text-xs text-muted-foreground">Rejected</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FacultyDashboard;
