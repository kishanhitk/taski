import React from "react";
import Register from "./RegisterPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register - Taski",
  description: "Register for a new account on Taski",
};

const page = () => {
  return <Register />;
};

export default page;
