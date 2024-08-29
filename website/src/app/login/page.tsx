import React from "react";
import Login from "./LoginPage";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Taski",
  description: "Login to your Taski account",
};

const page = () => {
  return <Login />;
};

export default page;
