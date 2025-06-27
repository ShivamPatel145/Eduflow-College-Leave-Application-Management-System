import { CalendarIcon, FileText, UploadCloud, X, StickyNote, User, Calendar, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useApplication } from "@/context/ApplicationContext";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from "@/components/ui/progress";

const LeaveApplication = () => {
  const { user } = useAuth();
  const { submitApplication } = useApplication();
  const navigate = useNavigate();
  
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [applicationLetter, setApplicationLetter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Calculate leave days
  const leaveDays = startDate && endDate ? (Math.max(0, (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1) : 0;

  // Scroll to top on step change for best UX
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // File upload logic
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    const validFiles = newFiles.filter(f => allowedTypes.includes(f.type) && f.size <= 5 * 1024 * 1024);
    if (validFiles.length !== newFiles.length) {
      toast.error('Only PDF, JPG, PNG files up to 5MB are allowed.');
    }
    const allFiles = [...files, ...validFiles].slice(0, 3);
    setFiles(allFiles);
    e.target.value = '';
  };
  const handleRemoveFile = (idx: number) => {
    setFiles(files => files.filter((_, i) => i !== idx));
  };
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      const validFiles = newFiles.filter(f => allowedTypes.includes(f.type) && f.size <= 5 * 1024 * 1024);
      if (validFiles.length !== newFiles.length) {
        toast.error('Only PDF, JPG, PNG files up to 5MB are allowed.');
      }
      const allFiles = [...files, ...validFiles].slice(0, 3);
      setFiles(allFiles);
    }
  };

  // Handle submit (only on last step)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason || !applicationLetter) {
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
        applicationLetter,
        // files (not sent to backend yet)
      });
      toast.success("Leave application submitted!");
      setTimeout(() => navigate("/student-dashboard/my-applications"), 1200);
    } catch (error) {
      toast.error("Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-zinc-900 py-4 md:py-8 px-2 sm:px-4">
      <div className="w-full max-w-full sm:max-w-[500px] md:max-w-[600px] mx-auto">
        <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-100 dark:border-zinc-800 p-6">
          {/* Card Header */}
          <div className="pb-4 border-b mb-4 border-gray-100 dark:border-zinc-800">
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Apply for Leave</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">Submit your leave request for approval</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Student Info */}
            <div className="space-y-3 pb-4 border-b border-gray-100 dark:border-zinc-800">
              <div>
                <Label htmlFor="name" className="text-xs font-medium text-gray-600 dark:text-gray-300">Student Name</Label>
                <Input id="name" value={user?.name || ''} disabled className="h-9 w-full text-sm bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-zinc-700" />
              </div>
              <div>
                <Label htmlFor="department" className="text-xs font-medium text-gray-600 dark:text-gray-300">Department</Label>
                <Input id="department" value={user?.department || ''} disabled className="h-9 w-full text-sm bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-zinc-700" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="year" className="text-xs font-medium text-gray-600 dark:text-gray-300">Year</Label>
                  <Input id="year" value={user?.year || ''} disabled className="h-9 w-full text-sm bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-zinc-700" />
                </div>
                <div>
                  <Label htmlFor="section" className="text-xs font-medium text-gray-600 dark:text-gray-300">Section</Label>
                  <Input id="section" value={user?.section || ''} disabled className="h-9 w-full text-sm bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-zinc-700" />
                </div>
              </div>
            </div>
            {/* Reason (short summary) */}
            <div className="flex flex-col gap-2 pb-4 border-b border-gray-100 dark:border-zinc-800">
              <Label htmlFor="reason" className="text-xs font-medium text-gray-600 dark:text-gray-300">Reason <span className="text-gray-400 dark:text-gray-500">(short summary)</span></Label>
              <Input
                id="reason"
                type="text"
                maxLength={80}
                placeholder="E.g. Medical emergency, family function, etc."
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="h-9 w-full text-sm border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100"
                required
              />
              <span className="text-xs text-gray-500 dark:text-gray-400">Max 80 characters. This will show in your application list.</span>
            </div>
            {/* Application Letter (full details) */}
            <div className="flex flex-col gap-2 pb-4 border-b border-gray-100 dark:border-zinc-800">
              <Label htmlFor="applicationLetter" className="text-xs font-medium text-gray-600 dark:text-gray-300">Application Letter <span className="text-gray-400 dark:text-gray-500">(full details)</span></Label>
              <Textarea
                id="applicationLetter"
                placeholder="Write your full leave application letter here."
                value={applicationLetter}
                onChange={e => setApplicationLetter(e.target.value)}
                className="min-h-[120px] w-full resize-none border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-gray-900 dark:text-gray-100"
                required
              />
              <span className="text-xs text-gray-500 dark:text-gray-400">Paste or write your full leave application letter here.</span>
            </div>
            {/* Dates */}
            <div className="grid grid-cols-1 gap-4 pb-4 border-b border-gray-100 dark:border-zinc-800">
              <div className="relative">
                <Label htmlFor="startDate" className="text-xs font-medium text-gray-600 dark:text-gray-300">Start Date</Label>
                <div className="relative">
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="pr-10 h-9 w-full text-sm border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100"
                    placeholder="mm/dd/yyyy"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <CalendarIcon className="h-4 w-4 text-gray-400 dark:text-gray-300" />
                  </div>
                </div>
              </div>
              <div className="relative">
                <Label htmlFor="endDate" className="text-xs font-medium text-gray-600 dark:text-gray-300">End Date</Label>
                <div className="relative">
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    min={startDate}
                    required
                    className="pr-10 h-9 w-full text-sm border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100"
                    placeholder="mm/dd/yyyy"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <CalendarIcon className="h-4 w-4 text-gray-400 dark:text-gray-300" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Info className="h-4 w-4 text-gray-400 dark:text-gray-300" />
                {leaveDays > 0 && <span>{leaveDays} day{leaveDays > 1 ? 's' : ''} of leave</span>}
              </div>
            </div>
            {/* File Upload */}
            <div className="flex flex-col gap-2 pb-4 border-b border-gray-100 dark:border-zinc-800">
              <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">Supporting Documents <span className="text-gray-400 dark:text-gray-500">(optional, max 3 files, PDF/JPG/PNG, 5MB each)</span></Label>
              <div
                className={`relative border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center transition-colors cursor-pointer ${dragActive ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800'}`}
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                <UploadCloud className="h-8 w-8 text-gray-400 dark:text-gray-300 mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-300">Drag & drop or click to upload</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">PDF, JPG, PNG up to 5MB each. Max 3 files.</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {files.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-2 py-1 rounded bg-gray-100 dark:bg-zinc-800 text-xs text-gray-700 dark:text-gray-200">
                    <FileText className="h-4 w-4 text-gray-400 dark:text-gray-300" />
                    <span className="truncate max-w-[120px]">{file.name}</span>
                    <button type="button" onClick={() => handleRemoveFile(idx)} className="text-red-500 hover:text-red-700">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {/* Submit Button */}
            <div className="flex justify-end pt-2">
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-white" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeaveApplication;
