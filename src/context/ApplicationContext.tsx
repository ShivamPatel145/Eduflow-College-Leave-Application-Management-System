import { mockApplications } from "@/data/mockData";
import { LeaveApplication, UserRole } from "@/types";
import React, { createContext, useContext, useState } from "react";
import { toast } from "sonner";

interface ApplicationContextType {
  applications: LeaveApplication[];
  submitApplication: (application: Omit<LeaveApplication, "id" | "status" | "createdAt" | "updatedAt">) => void;
  updateApplicationStatus: (
    id: string, 
    status: LeaveApplication["status"], 
    rejectionReason?: string, 
    rejectedBy?: UserRole
  ) => void;
  getApplicationById: (id: string) => LeaveApplication | undefined;
  getApplicationsByStudentId: (studentId: string) => LeaveApplication[];
  getApplicationsByDepartment: (department: string) => LeaveApplication[];
  getAllApplications: () => LeaveApplication[];
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const ApplicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [applications, setApplications] = useState<LeaveApplication[]>(mockApplications);

  const submitApplication = (application: Omit<LeaveApplication, "id" | "status" | "createdAt" | "updatedAt">) => {
    const newApplication: LeaveApplication = {
      ...application,
      id: `app${Date.now()}`,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setApplications(prev => [newApplication, ...prev]);
  };

  const updateApplicationStatus = (
    id: string, 
    status: LeaveApplication["status"], 
    rejectionReason?: string,
    rejectedBy?: UserRole
  ) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === id 
          ? { 
              ...app, 
              status, 
              updatedAt: new Date().toISOString(),
              ...(status === "rejected" ? { rejectionReason, rejectedBy } : {})
            } 
          : app
      )
    );

    const statusMessages = {
      pending: "Application marked as pending",
      approved_by_faculty: "Application approved by faculty",
      approved_by_hod: "Application approved by HOD",
      approved: "Application fully approved",
      rejected: "Application rejected",
    };

    toast.success(statusMessages[status] || "Application status updated");
  };

  const getApplicationById = (id: string) => {
    return applications.find(app => app.id === id);
  };

  const getApplicationsByStudentId = (studentId: string) => {
    return applications.filter(app => app.studentId === studentId);
  };

  const getApplicationsByDepartment = (department: string) => {
    return applications.filter(app => app.department === department);
  };

  const getAllApplications = () => {
    return applications;
  };

  return (
    <ApplicationContext.Provider
      value={{
        applications,
        submitApplication,
        updateApplicationStatus,
        getApplicationById,
        getApplicationsByStudentId,
        getApplicationsByDepartment,
        getAllApplications,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplication = (): ApplicationContextType => {
  const context = useContext(ApplicationContext);
  if (context === undefined) {
    throw new Error("useApplication must be used within an ApplicationProvider");
  }
  return context;
};
