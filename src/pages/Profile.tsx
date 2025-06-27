import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { pageFade, cardMotion, buttonMotion } from "@/lib/motion";

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    department: user?.department || "",
    year: user?.year || "",
    section: user?.section || "",
    role: user?.role || "",
    studentId: user?.id || "",
  });
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [originalData, setOriginalData] = useState(formData);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isEditing]);

  const isChanged = JSON.stringify(formData) !== JSON.stringify(originalData) || profilePhoto !== null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDepartmentChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      department: value,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically call an API to update user profile
    toast.success("Profile updated successfully!");
    setIsEditing(false);
  };

  const getInitials = () => {
    const name = `${formData.name}`;
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setProfilePhoto(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div className="animate-in max-w-3xl mx-auto px-2 md:px-0 bg-gray-50 dark:bg-zinc-900 min-h-screen" {...pageFade}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Profile</h1>
        <p className="text-muted-foreground dark:text-gray-300">View and edit your account information</p>
      </div>
      <motion.div className="grid gap-6" {...cardMotion}>
        {/* Profile Summary Card */}
        <Card className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center gap-4 border-b border-gray-100 dark:border-zinc-800">
            <div className="relative">
              <Avatar className="h-16 w-16">
                {profilePhoto ? (
                  <AvatarImage src={profilePhoto} alt={formData.name} />
                ) : (
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${formData.name}`} alt={formData.name} />
                )}
                <AvatarFallback>{formData.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
              </Avatar>
              <button
                type="button"
                className="absolute bottom-0 right-0 bg-white dark:bg-zinc-800 rounded-full p-1 shadow hover:bg-gray-100 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Upload profile photo"
                disabled={!isEditing}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 002.828 2.828L18 9.828M7 7h.01M21 21H3a2 2 0 01-2-2V5a2 2 0 012-2h4l2-2h4l2 2h4a2 2 0 012 2v14a2 2 0 01-2 2z" /></svg>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handlePhotoChange}
                  disabled={!isEditing}
                />
              </button>
            </div>
            <div>
              <CardTitle className="text-gray-900 dark:text-gray-100">{formData.name}</CardTitle>
              <CardDescription className="capitalize dark:text-gray-400">{formData.role}</CardDescription>
              <div className="text-xs text-muted-foreground dark:text-gray-400 mt-1">{formData.email}</div>
              {user?.updatedAt && (
                <div className="text-xs text-muted-foreground dark:text-gray-400 mt-1">Last updated: {new Date(user.updatedAt).toLocaleString()}</div>
              )}
            </div>
          </CardHeader>
        </Card>
        {/* Show form only in edit mode, otherwise show read-only info */}
        {isEditing ? (
          <form onSubmit={handleSave}>
            <Card className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100">Personal Information</CardTitle>
                <CardDescription className="dark:text-gray-400">Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-900 dark:text-gray-100">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      ref={nameInputRef}
                      className={isEditing ? "border-blue-400 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400 text-gray-900 dark:text-gray-100" : "bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100"}
                    />
                    <span className="text-xs text-muted-foreground dark:text-gray-400">Your full name as per college records.</span>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-900 dark:text-gray-100">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      disabled={true}
                      className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100"
                    />
                    <span className="text-xs text-muted-foreground dark:text-gray-400">This email is used for notifications.</span>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-gray-900 dark:text-gray-100">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={isEditing ? "border-blue-400 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400 text-gray-900 dark:text-gray-100" : "bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100"}
                    />
                    <span className="text-xs text-muted-foreground dark:text-gray-400">For important updates (optional).</span>
                  </div>
                </div>
                <Separator className="my-6 bg-gray-100 dark:bg-zinc-800" />
                <div className="mb-2 font-semibold text-sm text-gray-700 dark:text-gray-200">Academic Information</div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-gray-900 dark:text-gray-100">Department</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      disabled={true}
                      className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year" className="text-gray-900 dark:text-gray-100">Year</Label>
                    <Input
                      id="year"
                      value={formData.year}
                      disabled={true}
                      className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="section" className="text-gray-900 dark:text-gray-100">Section</Label>
                    <Input
                      id="section"
                      value={formData.section}
                      disabled={true}
                      className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-gray-900 dark:text-gray-100">Role</Label>
                    <Input
                      id="role"
                      value={formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
                      disabled={true}
                      className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="studentId" className="text-gray-900 dark:text-gray-100">Student ID</Label>
                    <Input
                      id="studentId"
                      value={formData.studentId}
                      disabled={true}
                      className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <motion.div {...buttonMotion}>
                  <Button variant="outline" onClick={() => { setIsEditing(false); setFormData(originalData); setProfilePhoto(null); }}>
                    Cancel
                  </Button>
                </motion.div>
                <motion.div {...buttonMotion}>
                  <Button type="submit" disabled={!isChanged}>Save Changes</Button>
                </motion.div>
              </CardFooter>
            </Card>
          </form>
        ) : (
          <Card className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100">Personal Information</CardTitle>
              <CardDescription className="dark:text-gray-400">Your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-gray-900 dark:text-gray-100">Name</Label>
                  <div className="p-2 bg-gray-50 dark:bg-zinc-800 rounded border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100">{formData.name}</div>
                  <span className="text-xs text-muted-foreground dark:text-gray-400">Your full name as per college records.</span>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-900 dark:text-gray-100">Email Address</Label>
                  <div className="p-2 bg-gray-50 dark:bg-zinc-800 rounded border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100">{formData.email}</div>
                  <span className="text-xs text-muted-foreground dark:text-gray-400">This email is used for notifications.</span>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-900 dark:text-gray-100">Phone Number</Label>
                  <div className="p-2 bg-gray-50 dark:bg-zinc-800 rounded border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100">{formData.phoneNumber || <span className='text-gray-400 dark:text-gray-500'>Not provided</span>}</div>
                  <span className="text-xs text-muted-foreground dark:text-gray-400">For important updates (optional).</span>
                </div>
              </div>
              <Separator className="my-6 bg-gray-100 dark:bg-zinc-800" />
              <div className="mb-2 font-semibold text-sm text-gray-700 dark:text-gray-200">Academic Information</div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-gray-900 dark:text-gray-100">Department</Label>
                  <div className="p-2 bg-gray-50 dark:bg-zinc-800 rounded border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100">{formData.department}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-900 dark:text-gray-100">Year</Label>
                  <div className="p-2 bg-gray-50 dark:bg-zinc-800 rounded border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100">{formData.year}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-900 dark:text-gray-100">Section</Label>
                  <div className="p-2 bg-gray-50 dark:bg-zinc-800 rounded border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100">{formData.section}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-900 dark:text-gray-100">Role</Label>
                  <div className="p-2 bg-gray-50 dark:bg-zinc-800 rounded border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100">{formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-900 dark:text-gray-100">Student ID</Label>
                  <div className="p-2 bg-gray-50 dark:bg-zinc-800 rounded border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100">{formData.studentId}</div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <motion.div {...buttonMotion}>
                <Button type="button" onClick={() => { setIsEditing(true); setOriginalData(formData); }}>Edit Profile</Button>
              </motion.div>
            </CardFooter>
          </Card>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Profile;
