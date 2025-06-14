import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { ChevronDown, ChevronUp, Mail, MessageSquare, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const faqs = [
  {
    question: "How do I submit a leave application?",
    answer:
      "Students can submit leave applications by logging in, navigating to 'Apply for Leave' from the sidebar menu, and filling out the required details including the leave dates and reason. Once submitted, the application will be reviewed by faculty, HOD, and principal in sequence.",
  },
  {
    question: "How long does it take to get approval for leave?",
    answer:
      "Typically, the approval process takes 1-2 working days, depending on the availability of faculty and administrators. You can check the status of your application on the 'Application Status' page.",
  },
  {
    question: "Who approves my leave application?",
    answer:
      "Leave applications follow a hierarchical approval flow. First, your faculty mentor reviews it, then the Head of Department, and finally the Principal for final approval. Each level may approve or reject the application.",
  },
  {
    question: "Can I modify my leave application after submission?",
    answer:
      "No, once submitted, applications cannot be modified. If you need to change details, you should contact your faculty mentor or submit a new application.",
  },
  {
    question: "How do I check the status of my leave application?",
    answer:
      "You can view the status of all your leave applications by navigating to the 'Application Status' page from the student dashboard sidebar.",
  },
];

const Help = () => {
  const { user } = useAuth();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Your message has been sent! We'll get back to you soon.");
    setContactForm({
      subject: "",
      message: "",
    });
  };

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="animate-in max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Help & Support</h1>
        <p className="text-muted-foreground">Find answers to common questions or contact support</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>
              Quick answers to common questions about the College Application Management System
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {faqs.map((faq, index) => (
              <Collapsible
                key={index}
                open={openFAQ === index}
                onOpenChange={() => toggleFAQ(index)}
                className="border rounded-md"
              >
                <CollapsibleTrigger className="flex w-full items-center justify-between p-4 text-left font-medium">
                  {faq.question}
                  {openFAQ === index ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-4 pt-0 text-sm text-muted-foreground">
                  {faq.answer}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>Send us a message and we'll get back to you</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  name="subject"
                  placeholder="Subject"
                  value={contactForm.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Textarea
                  name="message"
                  placeholder="Your message..."
                  value={contactForm.message}
                  onChange={handleChange}
                  required
                  className="min-h-[120px]"
                />
              </div>
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>support@college.edu</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>Live chat: 9 AM - 5 PM (Weekdays)</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Help;
