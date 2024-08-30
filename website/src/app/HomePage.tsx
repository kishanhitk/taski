"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center container pt-12 md:pt-0 ">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8 md:mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Welcome to Taski
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8">
          Streamline your workflow with our intuitive task management solution
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/dashboard">
            <Button size="lg" className="w-full sm:w-auto">
              Get Started
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Login
            </Button>
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-4xl"
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 text-center max-w-2xl"
      >
        <p className="text-sm text-gray-500 italic bg-black/5 rounded-3xl p-4">
          <span className="text-red-500">Disclaimer: </span>
          Due to the backend code being deployed on the free tier of Render, it
          may enter a sleep mode after inactivity. If you encounter any unusual
          behaviour, please refresh the page and access the website after
          approximately 50 seconds to ensure the backend server returns to a
          normal state.
        </p>
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
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center">
      <div className="text-3xl md:text-4xl mb-3 md:mb-4">{icon}</div>
      <h2 className="text-lg md:text-xl font-semibold mb-2">{title}</h2>
      <p className="text-sm md:text-base text-gray-600">{description}</p>
    </div>
  );
}
