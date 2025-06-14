import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useApplication } from "@/context/ApplicationContext";
import { useAuth } from "@/context/AuthContext";
import { FileTextIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { departments } from "@/data/mockData";

const PrincipalDashboard = () => {
  const { user } = useAuth();
  const { getAllApplications } = useApplication();
  
  // Get all applications
  const allApplications = getAllApplications();
  
  // Filter applications by status
  const pendingPrincipalApproval = allApplications.filter(app => 
    app.status === "approved_by_hod"
  );
  const approvedApplications = allApplications.filter(app => 
    app.status === "approved"
  );
  const rejectedApplications = allApplications.filter(app => 
    app.status === "rejected"
  );
  
  // Group applications by department
  const applicationsByDepartment = departments.map(dept => {
    const deptApps = allApplications.filter(app => app.department === dept.name);
    return {
      department: dept.name,
      count: deptApps.length,
      pending: deptApps.filter(a => a.status === "approved_by_hod").length
    };
  });
  
  return (
    <div className="animate-in">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground">
            Principal's Dashboard - College Application Management System
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/view-applications">
            <Button className="bg-cams-600 hover:bg-cams-700">
              <FileTextIcon className="mr-2 h-4 w-4" />
              Review Applications
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
            <div className="text-2xl font-bold">{allApplications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Your Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPrincipalApproval.length}</div>
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
            <CardTitle>Pending Your Approval</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingPrincipalApproval.length > 0 ? (
              <div className="space-y-4">
                {pendingPrincipalApproval.slice(0, 5).map((application) => (
                  <div key={application.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{application.studentName}</p>
                      <div className="flex flex-col gap-1 sm:flex-row sm:gap-2 text-sm text-muted-foreground">
                        <p>{application.department}</p>
                        <span className="hidden sm:block">•</span>
                        <p>{application.year} Year, {application.section}</p>
                        <span className="hidden sm:block">•</span>
                        <p>{new Date(application.startDate).toLocaleDateString()} - {new Date(application.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/view-applications?id=${application.id}`}>Review</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No applications pending your approval</p>
              </div>
            )}
            
            {pendingPrincipalApproval.length > 5 && (
              <CardFooter className="pt-4 px-0">
                <Link to="/view-applications" className="text-sm text-cams-600 hover:underline">
                  View all pending applications ({pendingPrincipalApproval.length})
                </Link>
              </CardFooter>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Department Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applicationsByDepartment.map((dept, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                  <div className="font-medium">{dept.department}</div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Total: </span>
                      <span>{dept.count}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Pending: </span>
                      <span className={dept.pending > 0 ? "text-cams-600 font-medium" : ""}>{dept.pending}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Link to="/department-overview">
              <Button variant="outline" className="w-full">View Detailed Report</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PrincipalDashboard;
