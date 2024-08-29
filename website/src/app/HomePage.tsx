"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">Welcome to Taski</h1>
        <p className="text-xl text-gray-600 mb-8">
          Streamline your workflow with our intuitive task management solution
        </p>
        <Link href="/dashboard">
          <Button size="lg" className="mr-4">
            Get Started
          </Button>
        </Link>
        <Link href="/login">
          <Button variant="outline" size="lg">
            Login
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl"
      >
        <FeatureCard
          icon="📊"
          title="Kanban Board"
          description="Visualize your workflow with our drag-and-drop Kanban board"
        />
        <FeatureCard
          icon="🔒"
          title="Secure"
          description="Your data is protected with industry-standard security measures"
        />
        <FeatureCard
          icon="🌐"
          title="Accessible Anywhere"
          description="Access your tasks from any device, anytime, anywhere"
        />
      </motion.div>
    </main>
  );
}

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
