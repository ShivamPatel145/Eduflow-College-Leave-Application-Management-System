import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApplication } from "@/context/ApplicationContext";
import { useAuth } from "@/context/AuthContext";
import { departments } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const DepartmentOverview = () => {
  const { user } = useAuth();
  const { getAllApplications } = useApplication();
  
  // Get all applications
  const allApplications = getAllApplications();
  
  // Group applications by department
  const departmentStats = departments.map(dept => {
    const deptApps = allApplications.filter(app => app.department === dept.name);
    return {
      department: dept.name,
      total: deptApps.length,
      pending: deptApps.filter(a => a.status === "pending").length,
      approvedByFaculty: deptApps.filter(a => a.status === "approved_by_faculty").length,
      approvedByHOD: deptApps.filter(a => a.status === "approved_by_hod").length,
      approved: deptApps.filter(a => a.status === "approved").length,
      rejected: deptApps.filter(a => a.status === "rejected").length,
    };
  });

  // Prepare data for the chart
  const chartData = departmentStats.map(stat => ({
    name: stat.department,
    Pending: stat.pending,
    "Approved by Faculty": stat.approvedByFaculty,
    "Approved by HOD": stat.approvedByHOD,
    Approved: stat.approved,
    Rejected: stat.rejected,
  }));

  return (
    <div className="animate-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Department Overview</h1>
        <p className="text-muted-foreground">View leave application statistics by department</p>
      </div>

      <div className="grid gap-6">
        {/* Department Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {departmentStats.map((stat) => (
            <Card key={stat.department}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{stat.department}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Applications</span>
                    <span className="font-medium">{stat.total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pending</span>
                    <span className="font-medium">{stat.pending}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Approved by Faculty</span>
                    <span className="font-medium">{stat.approvedByFaculty}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Approved by HOD</span>
                    <span className="font-medium">{stat.approvedByHOD}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Approved</span>
                    <span className="font-medium">{stat.approved}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Rejected</span>
                    <span className="font-medium">{stat.rejected}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Department Comparison Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Department Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="Pending" stackId="a" fill="#fbbf24" />
                  <Bar dataKey="Approved by Faculty" stackId="a" fill="#60a5fa" />
                  <Bar dataKey="Approved by HOD" stackId="a" fill="#34d399" />
                  <Bar dataKey="Approved" stackId="a" fill="#10b981" />
                  <Bar dataKey="Rejected" stackId="a" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DepartmentOverview; 