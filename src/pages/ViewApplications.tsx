import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useApplication } from "@/context/ApplicationContext";
import { useAuth } from "@/context/AuthContext";
import { LeaveApplication } from "@/types";
import { CheckIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ViewApplications = () => {
  const { user } = useAuth();
  const { 
    getAllApplications, 
    getApplicationsByDepartment, 
    getApplicationById, 
    updateApplicationStatus 
  } = useApplication();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get application ID from URL query params
  const params = new URLSearchParams(location.search);
  const appIdFromUrl = params.get("id");
  
  const [applications, setApplications] = useState<LeaveApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<LeaveApplication[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<LeaveApplication | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  
  // Initialize applications based on user role
  useEffect(() => {
    let apps: LeaveApplication[] = [];
    
    if (!user) return;
    
    if (user.role === "principal") {
      apps = getAllApplications();
    } else if (user.role === "hod" || user.role === "faculty") {
      if (user.department) {
        apps = getApplicationsByDepartment(user.department);
      }
    }
    
    // Show applications that are relevant to the current user role
    if (user.role === "faculty") {
      // Faculty only sees pending applications
      apps = apps.filter(app => app.status === "pending");
    } else if (user.role === "hod") {
      // Check if we're on the faculty applications page
      const isFacultyApplicationsPage = location.pathname === "/faculty-applications";
      
      if (isFacultyApplicationsPage) {
        // Show only faculty applications (pending and approved by faculty)
        apps = apps.filter(app => 
          app.status === "pending" || 
          app.status === "approved_by_faculty"
        );
      } else {
        // Show applications that faculty approved
        apps = apps.filter(app => 
          app.status === "approved_by_faculty" || 
          app.status === "approved_by_hod" || 
          app.status === "approved" ||
          app.status === "rejected"
        );
      }
    }
    
    // Sort by date (most recent first)
    const sortedApps = [...apps].sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    
    setApplications(sortedApps);
    setFilteredApplications(sortedApps);
    
    // If application ID is in URL, select that application
    if (appIdFromUrl) {
      const appFromUrl = getApplicationById(appIdFromUrl);
      if (appFromUrl) {
        setSelectedApplication(appFromUrl);
      }
    }
  }, [user, getAllApplications, getApplicationsByDepartment, getApplicationById, appIdFromUrl, location.pathname]);
  
  // Apply filters when filter status or search query changes
  useEffect(() => {
    let filtered = [...applications];
    
    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(app => app.status === filterStatus);
    }
    
    // Apply search filter (search by student name or ID)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app => 
        app.studentName.toLowerCase().includes(query) || 
        app.studentId.toLowerCase().includes(query)
      );
    }
    
    setFilteredApplications(filtered);
  }, [applications, filterStatus, searchQuery]);
  
  // Handle filter change
  const handleFilterChange = (value: string) => {
    setFilterStatus(value);
  };
  
  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle application selection
  const handleSelectApplication = (application: LeaveApplication) => {
    setSelectedApplication(application);
    // Update URL with application ID
    navigate(`${location.pathname}?id=${application.id}`);
  };
  
  // Handle approve application
  const handleApprove = () => {
    if (!selectedApplication || !user) return;
    
    let newStatus: LeaveApplication["status"] = "pending";
    
    if (user.role === "faculty") {
      newStatus = "approved_by_faculty";
    } else if (user.role === "hod") {
      newStatus = "approved_by_hod";
    } else if (user.role === "principal") {
      newStatus = "approved";
    }
    
    updateApplicationStatus(selectedApplication.id, newStatus);
    
    // Refresh applications list
    const updatedApp = getApplicationById(selectedApplication.id);
    if (updatedApp) {
      setSelectedApplication(updatedApp);
    }
  };
  
  // Handle reject dialog open
  const handleOpenRejectDialog = () => {
    setRejectionReason("");
    setShowRejectionDialog(true);
  };
  
  // Handle reject application
  const handleReject = () => {
    if (!selectedApplication || !user) return;
    
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    
    updateApplicationStatus(
      selectedApplication.id, 
      "rejected",
      rejectionReason,
      user.role
    );
    
    setShowRejectionDialog(false);
    
    // Refresh applications list
    const updatedApp = getApplicationById(selectedApplication.id);
    if (updatedApp) {
      setSelectedApplication(updatedApp);
    }
  };
  
  // Get status display text
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "approved_by_faculty":
        return "Approved by Faculty";
      case "approved_by_hod":
        return "Approved by HOD";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      default:
        return status;
    }
  };
  
  // Get status color
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
  
  // Check if user can take action on this application
  const canTakeAction = (app: LeaveApplication) => {
    if (!user) return false;
    
    if (user.role === "faculty" && app.status === "pending") {
      return true;
    }
    
    if (user.role === "hod" && app.status === "approved_by_faculty") {
      return true;
    }
    
    if (user.role === "principal" && app.status === "approved_by_hod") {
      return true;
    }
    
    return false;
  };
  
  return (
    <div className="animate-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          {user?.role === "faculty" && "Student Leave Applications"}
          {user?.role === "hod" && location.pathname === "/faculty-applications" 
            ? "Faculty Leave Applications" 
            : "Department Leave Applications"}
          {user?.role === "principal" && "All Leave Applications"}
        </h1>
        <p className="text-muted-foreground">Review and manage leave applications</p>
      </div>
      
      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        {/* Applications List */}
        <Card className="h-[calc(100vh-200px)] flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Applications</CardTitle>
            <div className="flex flex-col space-y-2 mt-2">
              <Input 
                placeholder="Search by student name" 
                value={searchQuery}
                onChange={handleSearch}
              />
              <Select value={filterStatus} onValueChange={handleFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Applications</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved_by_faculty">Approved by Faculty</SelectItem>
                  <SelectItem value="approved_by_hod">Approved by HOD</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            {filteredApplications.length > 0 ? (
              <div className="space-y-2">
                {filteredApplications.map((app) => (
                  <div
                    key={app.id}
                    className={`p-3 rounded-md border cursor-pointer transition-colors ${
                      selectedApplication?.id === app.id
                        ? "bg-cams-50 border-cams-300"
                        : "hover:bg-muted/40"
                    }`}
                    onClick={() => handleSelectApplication(app)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium">{app.studentName}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(app.status)}`}>
                        {getStatusDisplay(app.status)}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <p>{app.department}, {app.year} Year, {app.section}</p>
                      <p>{new Date(app.startDate).toLocaleDateString()} - {new Date(app.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <p>No applications found</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t p-3 text-xs text-muted-foreground">
            {filteredApplications.length} application(s) found
          </CardFooter>
        </Card>
        
        {/* Application Details */}
        <Card className="h-[calc(100vh-200px)] flex flex-col">
          {selectedApplication ? (
            <>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Leave Application Details</CardTitle>
                    <CardDescription>
                      Submitted on {new Date(selectedApplication.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className={`px-3 py-1 rounded-md text-sm font-medium ${getStatusColor(selectedApplication.status)}`}>
                    {getStatusDisplay(selectedApplication.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Student Information</h3>
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p>{selectedApplication.studentName}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Student ID</p>
                        <p>{selectedApplication.studentId}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Department</p>
                        <p>{selectedApplication.department}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Year & Section</p>
                        <p>{selectedApplication.year} Year, Section {selectedApplication.section}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Leave Details</h3>
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Start Date</p>
                        <p>{new Date(selectedApplication.startDate).toLocaleDateString()}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">End Date</p>
                        <p>{new Date(selectedApplication.endDate).toLocaleDateString()}</p>
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <p className="text-sm text-muted-foreground">Duration</p>
                        <p>
                          {Math.ceil(
                            (new Date(selectedApplication.endDate).getTime() - 
                             new Date(selectedApplication.startDate).getTime()) / 
                            (1000 * 60 * 60 * 24)
                          ) + 1} days
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Reason for Leave</h3>
                    <div className="rounded-md border p-3 bg-muted/40">
                      <p>{selectedApplication.reason}</p>
                    </div>
                  </div>
                  
                  {selectedApplication.status === "rejected" && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Rejection Reason</h3>
                      <div className="rounded-md border p-3 bg-muted/40">
                        <p className="text-sm mb-2">
                          <span className="text-muted-foreground">Rejected by: </span>
                          <span className="capitalize">{selectedApplication.rejectedBy}</span>
                        </p>
                        <p>{selectedApplication.rejectionReason}</p>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Application Timeline</h3>
                    <div className="space-y-3">
                      <div className="flex gap-3 items-start">
                        <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckIcon className="h-3 w-3 text-green-700" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Application Submitted</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(selectedApplication.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      {(selectedApplication.status === "approved_by_faculty" || 
                        selectedApplication.status === "approved_by_hod" || 
                        selectedApplication.status === "approved") && (
                        <div className="flex gap-3 items-start">
                          <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckIcon className="h-3 w-3 text-green-700" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Approved by Faculty</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(selectedApplication.updatedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {(selectedApplication.status === "approved_by_hod" || 
                        selectedApplication.status === "approved") && (
                        <div className="flex gap-3 items-start">
                          <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckIcon className="h-3 w-3 text-green-700" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Approved by HOD</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(selectedApplication.updatedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {selectedApplication.status === "approved" && (
                        <div className="flex gap-3 items-start">
                          <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckIcon className="h-3 w-3 text-green-700" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Approved by Principal</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(selectedApplication.updatedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {selectedApplication.status === "rejected" && (
                        <div className="flex gap-3 items-start">
                          <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center">
                            <XIcon className="h-3 w-3 text-red-700" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              Application Rejected by <span className="capitalize">{selectedApplication.rejectedBy}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(selectedApplication.updatedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t p-6">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedApplication(null);
                    navigate(location.pathname);
                  }}
                >
                  Close
                </Button>
                
                {canTakeAction(selectedApplication) && (
                  <div className="flex gap-2">
                    <Button 
                      variant="destructive" 
                      onClick={handleOpenRejectDialog}
                    >
                      Reject
                    </Button>
                    <Button 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={handleApprove}
                    >
                      Approve
                    </Button>
                  </div>
                )}
              </CardFooter>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-6">
              <h3 className="text-lg font-medium mb-2">No application selected</h3>
              <p className="text-center mb-4">Select an application from the list to view details</p>
            </div>
          )}
        </Card>
      </div>
      
      {/* Rejection Dialog */}
      <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this application
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <Label htmlFor="rejectionReason">Reason for Rejection</Label>
            <Textarea
              id="rejectionReason"
              placeholder="Enter rejection reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectionDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Reject Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewApplications;