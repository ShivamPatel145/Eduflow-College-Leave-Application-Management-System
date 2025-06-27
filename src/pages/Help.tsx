import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { ChevronDown, ChevronUp, Mail, MessageSquare, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { pageFade, cardMotion, buttonMotion } from "@/lib/motion";

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
    <motion.div className="max-w-4xl mx-auto px-4 py-10 min-h-[80vh]" {...pageFade}>
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Help & Support</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">Find answers to common questions or contact support</p>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-3">
        <motion.div className="md:col-span-2" {...cardMotion}>
          <Card className="border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100">Frequently Asked Questions</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Quick answers to common questions about the College Application Management System
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  layout
                  initial={false}
                  animate={{ borderRadius: openFAQ === index ? 16 : 8, boxShadow: openFAQ === index ? '0 4px 24px 0 rgba(80,80,120,0.08)' : '0 1px 4px 0 rgba(80,80,120,0.03)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className={
                    `overflow-hidden border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800 transition-shadow duration-300`
                  }
                >
                  <Collapsible
                    open={openFAQ === index}
                    onOpenChange={() => toggleFAQ(index)}
                  >
                    <CollapsibleTrigger className="flex w-full items-center justify-between p-4 text-left font-medium text-gray-900 dark:text-gray-100 focus:outline-none transition-colors">
                      {faq.question}
                      <motion.span
                        initial={false}
                        animate={{ rotate: openFAQ === index ? 180 : 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      >
                        {openFAQ === index ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </motion.span>
                    </CollapsibleTrigger>
                    <AnimatePresence initial={false}>
                      {openFAQ === index && (
                        <CollapsibleContent asChild forceMount>
                          <motion.div
                            key="faq-content"
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.25 }}
                            className="px-4 pb-4 pt-0 text-sm text-gray-700 dark:text-gray-300"
                          >
                            {faq.answer}
                          </motion.div>
                        </CollapsibleContent>
                      )}
                    </AnimatePresence>
                  </Collapsible>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...cardMotion}>
          <Card className="border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100">Need Help?</CardTitle>
              <CardDescription className="dark:text-gray-400">Send us a message and we'll get back to you</CardDescription>
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
                    className="bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div className="space-y-2">
                  <Textarea
                    name="message"
                    placeholder="Your message..."
                    value={contactForm.message}
                    onChange={handleChange}
                    required
                    className="min-h-[120px] bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <motion.div {...buttonMotion}>
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </motion.div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2 text-sm">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                <Mail className="h-4 w-4" />
                <span>support@college.edu</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                <MessageSquare className="h-4 w-4" />
                <span>Live chat: 9 AM - 5 PM (Weekdays)</span>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Help;
