import React from "react";
import Home from "./HomePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Taski - Task Management",
  description:
    "Streamline your workflow with our intuitive task management solution",
};

const page = () => {
  const healthStatus = fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/health`
  ).then((res) => res.json());

  return <Home />;
};

export default page;
