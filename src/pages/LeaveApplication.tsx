import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useApplication } from "@/context/ApplicationContext";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const LeaveApplication = () => {
  const { user } = useAuth();
  const { submitApplication } = useApplication();
  const navigate = useNavigate();
  
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate || !reason) {
      toast.error("Please fill all required fields");
      return;
    }
    
    if (new Date(startDate) > new Date(endDate)) {
      toast.error("End date cannot be before start date");
      return;
    }
    
    if (!user) {
      toast.error("You need to be logged in");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      submitApplication({
        studentId: user.id,
        studentName: user.name,
        department: user.department || "",
        year: user.year || "",
        section: user.section || "",
        startDate,
        endDate,
        reason,
      });
      
      // Redirect to status page
      navigate("/status");
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="animate-in max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Leave Application Form</h1>
        <p className="text-muted-foreground">Submit your leave request for approval</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Student Leave Application</CardTitle>
          <CardDescription>
            Fill in the details below to apply for leave
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Student Name</Label>
                <Input id="name" value={user?.name || ""} disabled />
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="grid gap-2">
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" value={user?.department || ""} disabled />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="year">Year</Label>
                  <Input id="year" value={user?.year || ""} disabled />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="section">Section</Label>
                  <Input id="section" value={user?.section || ""} disabled />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input 
                    id="startDate" 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input 
                    id="endDate" 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || new Date().toISOString().split('T')[0]}
                    required 
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="reason">Reason for Leave</Label>
                <Textarea 
                  id="reason" 
                  placeholder="Please provide detailed reason for your leave request" 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="min-h-[120px]"
                  required
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/student-dashboard")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-cams-600 hover:bg-cams-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveApplication;
