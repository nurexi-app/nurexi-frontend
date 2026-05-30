import { Metadata } from "next";
import {
  Mail,
  MessageCircle,
  Clock,
  Send,
  Phone,
  MapPin,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export const metadata: Metadata = {
  title: "Contact Us ",
  description:
    "Get in touch with the Nurexi team. We're here to help with your nursing exam preparation journey.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="bg-primary/5 border-b">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Let's Talk
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions about our platform, partnership opportunities, or
            need support? We're just a message away.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {/* Email Card */}
          <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-500 to-blue-400" />
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Mail className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email Us</h3>
              <p className="text-muted-foreground mb-4">
                For general inquiries and support
              </p>
              <a
                href="mailto:support@mails.nurexi.com"
                className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
              >
                support@mails.nurexi.com
                <Send className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* WhatsApp Card */}
          <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-green-500 to-green-400" />
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <MessageCircle className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">WhatsApp</h3>
              <p className="text-muted-foreground mb-4">
                Quickest response within few minutes
              </p>
              <a
                href="https://wa.me/2349022517371"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-green-600 hover:underline font-medium"
              >
                +234 902 251 7371
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Response Time Card */}
          <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-amber-500 to-amber-400" />
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Clock className="h-8 w-8 text-amber-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Response Time</h3>
              <p className="text-muted-foreground mb-4">
                We typically respond within
              </p>
              <p className="text-2xl font-bold text-amber-600">24 hours</p>
              <p className="text-sm text-muted-foreground mt-2">everyday</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground mb-8">
            Find quick answers to common questions about Nurexi.
          </p>
          <Link href="/faq">
            <Button variant="outline" size="lg">
              View FAQ Page
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
