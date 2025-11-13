"use client";

import { Button } from "@repo/ui/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Button onClick={() => alert("working")} variant={"destructive"}>Click me</Button>
    </main>
  );
}
