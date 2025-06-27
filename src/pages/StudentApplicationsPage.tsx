import { useApplication } from "@/context/ApplicationContext";
import { useAuth } from "@/context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckIcon, XIcon, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";

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

export default function StudentApplicationsPage() {
  const { user } = useAuth();
  const { getApplicationsByStudentId } = useApplication();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Get all applications for this student
  const applications = useMemo(() => user ? getApplicationsByStudentId(user.id) : [], [user, getApplicationsByStudentId]);

  // Filtered applications
  const filteredApplications = useMemo(() => {
    let filtered = [...applications];
    if (filterStatus !== "all") {
      filtered = filtered.filter(app => app.status === filterStatus);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app =>
        app.reason.toLowerCase().includes(query) ||
        app.department.toLowerCase().includes(query)
      );
    }
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [applications, filterStatus, searchQuery]);

  const selectedApplication = filteredApplications.find(app => app.id === selectedId) || filteredApplications[0] || null;

  return (
    <div className="animate-in max-w-5xl mx-auto px-2 md:px-0 bg-gray-50 dark:bg-zinc-900 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Leave Applications</h1>
        <p className="text-muted-foreground dark:text-gray-300">View and track all your leave applications</p>
      </div>
      <div className="flex gap-6 min-h-[500px] max-h-[80vh] h-[70vh]">
        {/* Applications List */}
        <Card className="h-full flex flex-col w-[340px] min-w-[260px] max-w-[340px] bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
          <CardHeader className="pb-3 border-b border-gray-100 dark:border-zinc-800">
            <CardTitle className="text-base text-gray-900 dark:text-gray-100">Applications</CardTitle>
            <div className="flex flex-col space-y-2 mt-2">
              <Input
                placeholder="Search by reason"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100"
              />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 text-gray-900 dark:text-gray-100">
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
          <CardContent className="flex-1 overflow-y-auto p-0 divide-y divide-gray-100 dark:divide-zinc-800">
            {filteredApplications.length > 0 ? (
              <div>
                {filteredApplications.map(app => (
                  <div
                    key={app.id}
                    className={`flex gap-2 px-4 py-3 cursor-pointer transition-all group ${selectedApplication?.id === app.id ? "bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-600 dark:border-blue-400" : "hover:bg-muted/40 dark:hover:bg-zinc-800"}`}
                    onClick={() => setSelectedId(app.id)}
                    tabIndex={0}
                    role="button"
                    aria-label={`View application for ${app.reason}`}
                  >
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <p className="font-medium break-words whitespace-normal leading-snug mb-1 text-gray-900 dark:text-gray-100">{app.reason}</p>
                      <div className="text-xs text-muted-foreground dark:text-gray-400">
                        <span>{new Date(app.startDate).toLocaleDateString()} - {new Date(app.endDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end flex-shrink-0 ml-2 min-w-[120px]">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(app.status)} text-right whitespace-pre-line mb-1`}>
                        {getStatusDisplay(app.status)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        tabIndex={-1}
                        aria-label="View details"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) :
              <div className="h-full flex items-center justify-center text-muted-foreground dark:text-gray-400 p-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">No applications found</h3>
                  <p className="text-sm">You haven't submitted any leave applications yet.</p>
                </div>
              </div>
            }
          </CardContent>
          <CardFooter className="border-t border-gray-100 dark:border-zinc-800 p-3 text-xs text-muted-foreground dark:text-gray-400">
            {filteredApplications.length} application(s) found
          </CardFooter>
        </Card>
        {/* Application Details */}
        <div className="flex-1 h-full">
          <Card className="h-full flex flex-col bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
            {selectedApplication ? (
              <>
                <CardHeader className="border-b border-gray-100 dark:border-zinc-800">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-gray-900 dark:text-gray-100">Leave Application</CardTitle>
                      <CardDescription className="dark:text-gray-400">
                        Submitted on {new Date(selectedApplication.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className={`px-3 py-1 rounded-md text-sm font-medium ${getStatusColor(selectedApplication.status)}`}>
                      {getStatusDisplay(selectedApplication.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto">
                  <div>
                    <h3 className="text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Leave Details</h3>
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground dark:text-gray-400">Start Date</p>
                        <p className="text-gray-900 dark:text-gray-100">{new Date(selectedApplication.startDate).toLocaleDateString()}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground dark:text-gray-400">End Date</p>
                        <p className="text-gray-900 dark:text-gray-100">{new Date(selectedApplication.endDate).toLocaleDateString()}</p>
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <p className="text-sm text-muted-foreground dark:text-gray-400">Reason</p>
                        <p className="text-gray-900 dark:text-gray-100">{selectedApplication.reason}</p>
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <p className="text-sm text-muted-foreground dark:text-gray-400">Application Letter</p>
                        <p className="whitespace-pre-line break-words text-gray-900 dark:text-gray-100">{selectedApplication.applicationLetter}</p>
                      </div>
                    </div>
                  </div>
                  <Separator className="my-4 bg-gray-100 dark:bg-zinc-800" />
                  <h3 className="text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Application Timeline</h3>
                  <div className="space-y-3">
                    {/* Application Submitted */}
                    <div className="flex gap-3 items-start">
                      <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                        <CheckIcon className="h-3 w-3 text-green-700 dark:text-green-300" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Application Submitted</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(selectedApplication.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {/* Faculty Approval */}
                    <div className="flex gap-3 items-start">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center ${["approved_by_faculty", "approved_by_hod", "approved"].includes(selectedApplication.status) ? "bg-green-100" : "bg-gray-100"}`}> 
                        <CheckIcon className={`h-3 w-3 ${["approved_by_faculty", "approved_by_hod", "approved"].includes(selectedApplication.status) ? "text-green-700" : "text-gray-400"}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Faculty Approval</p>
                        <p className="text-xs text-muted-foreground">
                          {selectedApplication.status === "approved_by_faculty" ? "Approved" : selectedApplication.status === "pending" ? "In Progress" : ["approved_by_hod", "approved"].includes(selectedApplication.status) ? "Approved" : "Waiting"}
                        </p>
                      </div>
                    </div>
                    {/* HOD Approval */}
                    <div className="flex gap-3 items-start">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center ${["approved_by_hod", "approved"].includes(selectedApplication.status) ? "bg-green-100" : "bg-gray-100"}`}> 
                        <CheckIcon className={`h-3 w-3 ${["approved_by_hod", "approved"].includes(selectedApplication.status) ? "text-green-700" : "text-gray-400"}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">HOD Approval</p>
                        <p className="text-xs text-muted-foreground">
                          {selectedApplication.status === "approved_by_hod" ? "Approved" : selectedApplication.status === "approved" ? "Approved" : "Waiting"}
                        </p>
                      </div>
                    </div>
                    {/* Principal Approval */}
                    <div className="flex gap-3 items-start">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center ${selectedApplication.status === "approved" ? "bg-green-100" : "bg-gray-100"}`}> 
                        <CheckIcon className={`h-3 w-3 ${selectedApplication.status === "approved" ? "text-green-700" : "text-gray-400"}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Principal Approval</p>
                        <p className="text-xs text-muted-foreground">
                          {selectedApplication.status === "approved" ? "Approved" : "Waiting"}
                        </p>
                      </div>
                    </div>
                    {/* Rejection (if applicable) */}
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
                            {selectedApplication.rejectionReason}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </>
            ) : null}
          </Card>
        </div>
      </div>
    </div>
  );
}