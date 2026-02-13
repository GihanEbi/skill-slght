"use client";

import React from "react";
import { useRouter } from "next/navigation";

const page = () => {
  // redirect to auth/signin page
  const router = useRouter();
  React.useEffect(() => {
    router.push("/auth/signin");
  }, [router]);
  return <div>Redirecting to sign in...</div>;
};

export default page;
