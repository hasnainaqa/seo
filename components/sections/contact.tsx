"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SectionHeader } from "@/components/ui/custom/section-headers";
import { appConfig } from "@/lib/app-config";

const formSchema = z.object({
  firstName: z.string().min(2, { message: "First Name is required" }).max(255),
  lastName: z.string().min(2, { message: "Last Name is required" }).max(255),
  email: z.string().email(),
  subject: z.string().min(2, { message: "Subject is required" }).max(255),
  message: z.string().min(2, { message: "Message is required" }).max(255),
});

export default function Contact() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      subject: "SEO Dashboard Setup",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { firstName, lastName, email, subject, message } = values;
    console.log(values);

    const mailToLink = `mailto:${appConfig.resend.supportEmail}?subject=${subject}&body=Hello I am ${firstName} ${lastName}, my Email is ${email}. %0D%0A${message}`;

    window.location.href = mailToLink;
  }

  return (
    <div id="contact">
      <SectionHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SectionHeader.HeaderContent className="text-start space-y-4 pb-8 mx-auto">
            <SectionHeader.Badge>CONTACT</SectionHeader.Badge>
            <SectionHeader.Heading>Contact Us</SectionHeader.Heading>
            <SectionHeader.Text>
              Have questions about setting up your SEO dashboard or managing
              your keyword tracking? Our team is here to help you optimize your
              website’s performance and grow your online presence.
            </SectionHeader.Text>
          </SectionHeader.HeaderContent>

          <SectionHeader.Content>
            <Card className="shadow-none border text-secondary-foreground">
              <CardHeader className="text-primary text-2xl"> </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid w-full gap-4"
                  >
                    <div className="flex flex-col md:flex-row! gap-8">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Leopoldo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Miranda" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="example@domain.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a subject" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="SEO Dashboard Setup">
                                  SEO Dashboard Setup
                                </SelectItem>
                                <SelectItem value="Keyword Tracking Issues">
                                  Keyword Tracking Issues
                                </SelectItem>
                                <SelectItem value="Subscription and Billing">
                                  Subscription and Billing
                                </SelectItem>
                                <SelectItem value="Integration Help">
                                  Integration Help
                                </SelectItem>
                                <SelectItem value="General Inquiry">
                                  General Inquiry
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea
                                rows={5}
                                placeholder="Your message..."
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button className="mt-4">Send message</Button>
                  </form>
                </Form>
              </CardContent>

              <CardFooter></CardFooter>
            </Card>
          </SectionHeader.Content>
        </div>
      </SectionHeader>
    </div>
  );
}
