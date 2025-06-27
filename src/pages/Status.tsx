import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useApplication } from "@/context/ApplicationContext";
import { useAuth } from "@/context/AuthContext";
import { CheckIcon, XIcon } from "lucide-react";
import { useLocation } from "react-router-dom";

const Status = () => {
  const { user } = useAuth();
  const { getApplicationsByStudentId, getApplicationById } = useApplication();
  const location = useLocation();
  
  // Determine if this is the leave history page
  const isHistory = location.pathname.includes("leave-history");
  
  // Get application ID from URL query params
  const params = new URLSearchParams(location.search);
  const appId = params.get("id");
  
  // Get all applications for this student
  let studentApplications = user ? getApplicationsByStudentId(user.id) : [];
  
  // Filter for leave history if needed
  if (isHistory) {
    studentApplications = studentApplications.filter(app => app.status !== "pending" && app.status !== "approved_by_faculty" && app.status !== "approved_by_hod");
  }
  
  // Get specific application if ID is provided
  const specificApplication = appId ? getApplicationById(appId) : null;
  
  // Application to display
  const application = specificApplication || (studentApplications.length > 0 ? studentApplications[0] : null);
  
  // Get status display text and color
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending Faculty Approval";
      case "approved_by_faculty":
        return "Pending HOD Approval";
      case "approved_by_hod":
        return "Pending Principal Approval";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      default:
        return status;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved_by_faculty":
      case "approved_by_hod":
        return "bg-blue-100 text-blue-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  // Get step status for timeline
  const getStepStatus = (step: string) => {
    if (!application) return "upcoming";
    
    switch (step) {
      case "submitted":
        return "completed";
      case "faculty":
        return application.status === "pending" ? "current" : 
              (application.status === "rejected" && application.rejectedBy === "faculty") ? "rejected" : "completed";
      case "hod":
        return application.status === "pending" ? "upcoming" : 
              application.status === "approved_by_faculty" ? "current" :
              (application.status === "rejected" && application.rejectedBy === "hod") ? "rejected" : "completed";
      case "principal":
        return (application.status === "pending" || application.status === "approved_by_faculty") ? "upcoming" : 
              application.status === "approved_by_hod" ? "current" :
              (application.status === "rejected" && application.rejectedBy === "principal") ? "rejected" : "completed";
      default:
        return "upcoming";
    }
  };
  
  return (
    <div className="animate-in max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{isHistory ? "Leave History" : "Application Status"}</h1>
        <p className="text-muted-foreground">
          {isHistory
            ? "View your past approved and rejected leave applications."
            : "Track the progress of your leave applications"}
        </p>
      </div>
      
      {application ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Leave Application</CardTitle>
                <CardDescription>
                  Submitted on {new Date(application.createdAt).toLocaleDateString()}
                </CardDescription>
              </div>
              <div className={`px-3 py-1 rounded-md text-sm font-medium ${getStatusColor(application.status)}`}>
                {getStatusDisplay(application.status)}
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-6">
              {/* Leave Details */}
              <div>
                <h3 className="font-medium mb-3">Leave Details</h3>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p>{new Date(application.startDate).toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">End Date</p>
                    <p>{new Date(application.endDate).toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <p className="text-sm text-muted-foreground">Reason</p>
                    <p>{application.reason}</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Application Timeline */}
              {!isHistory && (
                <div>
                  <h3 className="font-medium mb-3">Application Timeline</h3>
                  <div className="space-y-6">
                    {/* Step 1: Submitted */}
                    <div className="flex gap-3 items-start">
                      <div className="h-7 w-7 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckIcon className="h-4 w-4 text-green-700" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Application Submitted</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(application.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    {/* Step 2: Faculty Approval */}
                    <div className="flex gap-3 items-start">
                      {getStepStatus("faculty") === "completed" ? (
                        <div className="h-7 w-7 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckIcon className="h-4 w-4 text-green-700" />
                        </div>
                      ) : getStepStatus("faculty") === "rejected" ? (
                        <div className="h-7 w-7 rounded-full bg-red-100 flex items-center justify-center">
                          <XIcon className="h-4 w-4 text-red-700" />
                        </div>
                      ) : getStepStatus("faculty") === "current" ? (
                        <div className="h-7 w-7 rounded-full bg-blue-100 border-2 border-blue-400"></div>
                      ) : (
                        <div className="h-7 w-7 rounded-full bg-gray-100"></div>
                      )}
                      <div>
                        <p className="text-sm font-medium">Faculty Approval</p>
                        {getStepStatus("faculty") === "completed" ? (
                          <p className="text-xs text-green-600">Approved</p>
                        ) : getStepStatus("faculty") === "rejected" ? (
                          <p className="text-xs text-red-600">Rejected</p>
                        ) : getStepStatus("faculty") === "current" ? (
                          <p className="text-xs text-blue-600">In Progress</p>
                        ) : (
                          <p className="text-xs text-muted-foreground">Waiting</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Step 3: HOD Approval */}
                    <div className="flex gap-3 items-start">
                      {getStepStatus("hod") === "completed" ? (
                        <div className="h-7 w-7 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckIcon className="h-4 w-4 text-green-700" />
                        </div>
                      ) : getStepStatus("hod") === "rejected" ? (
                        <div className="h-7 w-7 rounded-full bg-red-100 flex items-center justify-center">
                          <XIcon className="h-4 w-4 text-red-700" />
                        </div>
                      ) : getStepStatus("hod") === "current" ? (
                        <div className="h-7 w-7 rounded-full bg-blue-100 border-2 border-blue-400"></div>
                      ) : (
                        <div className="h-7 w-7 rounded-full bg-gray-100"></div>
                      )}
                      <div>
                        <p className="text-sm font-medium">HOD Approval</p>
                        {getStepStatus("hod") === "completed" ? (
                          <p className="text-xs text-green-600">Approved</p>
                        ) : getStepStatus("hod") === "rejected" ? (
                          <p className="text-xs text-red-600">Rejected</p>
                        ) : getStepStatus("hod") === "current" ? (
                          <p className="text-xs text-blue-600">In Progress</p>
                        ) : (
                          <p className="text-xs text-muted-foreground">Waiting</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Step 4: Principal Approval */}
                    <div className="flex gap-3 items-start">
                      {getStepStatus("principal") === "completed" ? (
                        <div className="h-7 w-7 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckIcon className="h-4 w-4 text-green-700" />
                        </div>
                      ) : getStepStatus("principal") === "rejected" ? (
                        <div className="h-7 w-7 rounded-full bg-red-100 flex items-center justify-center">
                          <XIcon className="h-4 w-4 text-red-700" />
                        </div>
                      ) : getStepStatus("principal") === "current" ? (
                        <div className="h-7 w-7 rounded-full bg-blue-100 border-2 border-blue-400"></div>
                      ) : (
                        <div className="h-7 w-7 rounded-full bg-gray-100"></div>
                      )}
                      <div>
                        <p className="text-sm font-medium">Principal Approval</p>
                        {getStepStatus("principal") === "completed" ? (
                          <p className="text-xs text-green-600">Approved</p>
                        ) : getStepStatus("principal") === "rejected" ? (
                          <p className="text-xs text-red-600">Rejected</p>
                        ) : getStepStatus("principal") === "current" ? (
                          <p className="text-xs text-blue-600">In Progress</p>
                        ) : (
                          <p className="text-xs text-muted-foreground">Waiting</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Rejection Reason (if rejected) */}
              {application.status === "rejected" && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-3">Rejection Details</h3>
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                      <p className="text-sm mb-2">
                        <span className="text-muted-foreground">Rejected by: </span>
                        <span className="capitalize">{application.rejectedBy}</span>
                      </p>
                      <p className="text-sm">
                        <span className="text-muted-foreground">Reason: </span>
                        {application.rejectionReason}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-medium mb-2">No applications found</h3>
            <p className="text-muted-foreground mb-4 text-center">
              {isHistory
                ? "You have no approved or rejected leave applications yet."
                : "You haven't submitted any leave applications yet"}
            </p>
          </CardContent>
        </Card>
      )}
      
      {/* All Applications List */}
      {studentApplications.length > 1 && !specificApplication && (
        <div className="mt-8">
          <h2 className="text-lg font-medium mb-4">{isHistory ? "Previous Leave History" : "Previous Applications"}</h2>
          <div className="space-y-4">
            {studentApplications.slice(1).map(app => (
              <Card key={app.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between p-4 border-b">
                    <div>
                      <p className="font-medium">
                        {new Date(app.startDate).toLocaleDateString()} - {new Date(app.endDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {app.reason.length > 50 ? `${app.reason.substring(0, 50)}...` : app.reason}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded-md text-xs ${getStatusColor(app.status)}`}>
                      {getStatusDisplay(app.status)}
                    </div>
                  </div>
                  <div className="px-4 py-2 bg-muted/20 text-xs text-muted-foreground">
                    Submitted on {new Date(app.createdAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Status;