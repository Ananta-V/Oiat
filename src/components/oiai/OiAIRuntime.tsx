"use client";

import { useEffect } from "react";
import { initializeOiAI } from "@/lib/oiai-interactions";

export default function OiAIRuntime() {
  useEffect(() => { initializeOiAI(); }, []);
  return null;
}
