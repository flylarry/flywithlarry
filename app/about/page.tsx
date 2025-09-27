import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            About Larry AI
          </h1>
          <p className="text-gray-600">
            Your trusted flight companion for a smoother journey
          </p>
        </div>

        <div className="prose prose-gray max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Our Story
            </h2>
            <p className="text-gray-700 mb-4">
              Larry was inspired by something deeply personal. For years, I struggled with flight anxiety. 
              Every time turbulence hit or nerves rose, I'd text my dad - Larry. Without fail, he'd respond 
              with calm, comforting words that made me feel safe and understood. His encouragement, empathy, 
              and simple presence turned fear into something I could manage. Sometimes it even brought me 
              to tears, just knowing I wasn't alone up there.
            </p>
            <p className="text-gray-700 mb-4">
              This experience showed me the power of having someone steady to lean on in the sky. That's 
              why we built Larry: to share that same feeling of reassurance with anyone who needs it. 
              A companion in your pocket, ready to soothe, ground, and remind you - you're safe.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-700 mb-4">
              Larry AI is designed to help travelers overcome flight anxiety and 
              make their journey more comfortable. We understand that flying can 
              be stressful, and our AI-powered assistant is here to provide 
              support, information, and peace of mind throughout your flight experience.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              What We Do
            </h2>
            <p className="text-gray-700 mb-4">
              Our platform offers comprehensive flight assistance through:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Real-time turbulence monitoring and predictions</li>
              <li>Personalized anxiety management techniques</li>
              <li>Flight safety information and statistics</li>
              <li>Breathing exercises and meditation guidance</li>
              <li>24/7 AI chat support for flight-related concerns</li>
              <li>Weather and flight condition updates</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Our Technology
            </h2>
            <p className="text-gray-700 mb-4">
              Larry AI leverages cutting-edge artificial intelligence and real-time 
              data integration to provide accurate, helpful information when you need it most. 
              We combine:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Advanced AI language models for natural conversation</li>
              <li>Real-time weather and aviation data</li>
              <li>NOAA and aviation authority data sources</li>
              <li>Machine learning for personalized recommendations</li>
              <li>Secure, privacy-focused architecture</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Why Choose Larry AI?
            </h2>
            <p className="text-gray-700 mb-4">
              We're not just another travel app. Larry AI is specifically designed 
              for travelers who experience flight anxiety, providing:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Evidence-based anxiety management techniques</li>
              <li>Real-time flight condition monitoring</li>
              <li>Personalized support tailored to your needs</li>
              <li>Professional-grade aviation data and insights</li>
              <li>Privacy-first approach to your personal information</li>
              <li>Continuous improvement based on user feedback</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Our Commitment
            </h2>
            <p className="text-gray-700 mb-4">
              We're committed to making air travel more accessible and comfortable 
              for everyone. Our team continuously works to improve our platform, 
              expand our data sources, and enhance the user experience based on 
              real user feedback and the latest developments in aviation technology.
            </p>
            <p className="text-gray-700 mb-4">
              Your safety, comfort, and privacy are our top priorities. We believe 
              that with the right support and information, anyone can have a 
              positive flying experience.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-gray-700 mb-4">
              Have questions, feedback, or suggestions? We'd love to hear from you. 
              Your input helps us make Larry AI better for everyone.
            </p>
            <p className="text-gray-700">
              Email:{" "}
              <a
                href="mailto:uselarryai@gmail.com"
                className="text-blue-600 hover:underline"
              >
                uselarryai@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
      <Footer fixed={false} marginTop={false} />
    </div>
  );
}