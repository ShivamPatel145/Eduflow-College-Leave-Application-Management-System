import { useApplication } from "@/context/ApplicationContext";
import { useAuth } from "@/context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { CalendarIcon, CheckIcon, XIcon, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";
import { format, parseISO, isAfter, isBefore } from "date-fns";

export default function StudentLeaveHistoryPage() {
  const { user } = useAuth();
  const { getApplicationsByStudentId } = useApplication();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Get all non-pending applications for this student
  const applications = useMemo(() => {
    if (!user) return [];
    return getApplicationsByStudentId(user.id).filter(app =>
      app.status !== "pending" &&
      app.status !== "approved_by_faculty" &&
      app.status !== "approved_by_hod"
    );
  }, [user, getApplicationsByStudentId]);

  // Filter by date range
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const appStart = parseISO(app.startDate);
      const appEnd = parseISO(app.endDate);
      let afterStart = true, beforeEnd = true;
      if (startDate) afterStart = !isBefore(appEnd, parseISO(startDate));
      if (endDate) beforeEnd = !isAfter(appStart, parseISO(endDate));
      return afterStart && beforeEnd;
    });
  }, [applications, startDate, endDate]);

  const selectedApplication = filteredApplications.find(app => app.id === selectedId) || filteredApplications[0] || null;

  return (
    <div className="animate-in max-w-5xl mx-auto px-2 md:px-0 bg-gray-50 dark:bg-zinc-900 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Leave History</h1>
        <p className="text-muted-foreground dark:text-gray-300">View your past leave applications and their outcomes</p>
      </div>
      <div className="flex flex-col md:flex-row gap-6 bg-gray-50 dark:bg-zinc-900 min-h-screen">
        {/* Applications List */}
        <div className="w-full md:w-1/3 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-100 dark:border-zinc-800">
          <CardHeader className="pb-3 border-b border-gray-100 dark:border-zinc-800">
            <CardTitle className="text-base text-gray-900 dark:text-gray-100">History</CardTitle>
            <div className="flex flex-col space-y-2 mt-2">
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="h-9 text-xs bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100"
                  placeholder="Start date"
                  max={endDate || undefined}
                />
                <Input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="h-9 text-xs bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100"
                  placeholder="End date"
                  min={startDate || undefined}
                />
              </div>
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
                        <span>{format(parseISO(app.startDate), "MM/dd/yyyy")} - {format(parseISO(app.endDate), "MM/dd/yyyy")}</span>
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
                  <h3 className="text-lg font-medium mb-2">No leave history found</h3>
                  <p className="text-sm">No applications in this date range.</p>
                </div>
              </div>
            }
          </CardContent>
          <CardFooter className="border-t border-gray-100 dark:border-zinc-800 p-3 text-xs text-muted-foreground dark:text-gray-400">
            {filteredApplications.length} application(s) found
          </CardFooter>
        </div>
        {/* Application Details */}
        <div className="flex-1 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-100 dark:border-zinc-800">
          <Card className="h-full flex flex-col bg-white dark:bg-zinc-900 border-none">
            {selectedApplication ? (
              <>
                <CardHeader className="border-b border-gray-100 dark:border-zinc-800">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-gray-900 dark:text-gray-100">Leave Application</CardTitle>
                      <p className="text-xs text-muted-foreground dark:text-gray-400">
                        Submitted on {format(parseISO(selectedApplication.createdAt), "MM/dd/yyyy")}
                      </p>
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
                        <p className="text-gray-900 dark:text-gray-100">{format(parseISO(selectedApplication.startDate), "MM/dd/yyyy")}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground dark:text-gray-400">End Date</p>
                        <p className="text-gray-900 dark:text-gray-100">{format(parseISO(selectedApplication.endDate), "MM/dd/yyyy")}</p>
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
                        <p className="text-xs text-muted-foreground dark:text-gray-400">
                          {format(parseISO(selectedApplication.createdAt), "MM/dd/yyyy, h:mm a")}
                        </p>
                      </div>
                    </div>
                    {/* Faculty Approval */}
                    <div className="flex gap-3 items-start">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center ${["approved_by_faculty", "approved_by_hod", "approved"].includes(selectedApplication.status) ? "bg-green-100 dark:bg-green-900" : "bg-gray-100 dark:bg-zinc-800"}`}> 
                        <CheckIcon className={`h-3 w-3 ${["approved_by_faculty", "approved_by_hod", "approved"].includes(selectedApplication.status) ? "text-green-700 dark:text-green-300" : "text-gray-400 dark:text-gray-500"}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Faculty Approval</p>
                        <p className="text-xs text-muted-foreground dark:text-gray-400">
                          {selectedApplication.status === "approved_by_faculty" ? "Approved" : selectedApplication.status === "pending" ? "In Progress" : ["approved_by_hod", "approved"].includes(selectedApplication.status) ? "Approved" : "Waiting"}
                        </p>
                      </div>
                    </div>
                    {/* HOD Approval */}
                    <div className="flex gap-3 items-start">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center ${["approved_by_hod", "approved"].includes(selectedApplication.status) ? "bg-green-100 dark:bg-green-900" : "bg-gray-100 dark:bg-zinc-800"}`}> 
                        <CheckIcon className={`h-3 w-3 ${["approved_by_hod", "approved"].includes(selectedApplication.status) ? "text-green-700 dark:text-green-300" : "text-gray-400 dark:text-gray-500"}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">HOD Approval</p>
                        <p className="text-xs text-muted-foreground dark:text-gray-400">
                          {selectedApplication.status === "approved_by_hod" ? "Approved" : selectedApplication.status === "approved" ? "Approved" : "Waiting"}
                        </p>
                      </div>
                    </div>
                    {/* Principal Approval */}
                    <div className="flex gap-3 items-start">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center ${selectedApplication.status === "approved" ? "bg-green-100 dark:bg-green-900" : "bg-gray-100 dark:bg-zinc-800"}`}> 
                        <CheckIcon className={`h-3 w-3 ${selectedApplication.status === "approved" ? "text-green-700 dark:text-green-300" : "text-gray-400 dark:text-gray-500"}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Principal Approval</p>
                        <p className="text-xs text-muted-foreground dark:text-gray-400">
                          {selectedApplication.status === "approved" ? "Approved" : "Waiting"}
                        </p>
                      </div>
                    </div>
                    {/* Rejection (if applicable) */}
                    {selectedApplication.status === "rejected" && (
                      <div className="flex gap-3 items-start">
                        <div className="h-6 w-6 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                          <XIcon className="h-3 w-3 text-red-700 dark:text-red-300" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            Application Rejected by <span className="capitalize">{selectedApplication.rejectedBy}</span>
                          </p>
                          <p className="text-xs text-muted-foreground dark:text-gray-400">
                            {selectedApplication.rejectionReason}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground dark:text-gray-400 p-6">
                <h3 className="text-lg font-medium mb-2">No application selected</h3>
                <p className="text-center mb-4">Select an application from the list to view details</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function getStatusDisplay(status: string) {
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
}

function getStatusColor(status: string) {
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
} 