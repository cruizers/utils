"use client";

import { ArrowRight, Image, Link2 } from "lucide-react";
import Link from "next/link";

const features = [
  {
    name: "Image Processor",
    description: "Bulk rename, reorder, and download images in a flash.",
    href: "/images",
    icon: <Image className="w-8 h-8" />,
  },
  {
    name: "Link Extractor",
    description: "Extract, manage, and export links from any text.",
    href: "/links",
    icon: <Link2 className="w-8 h-8" />,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
          A Suite of Powerful Utilities
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          Streamline your workflow with our collection of intuitive,
          high-performance tools. Designed for simplicity and power.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature) => (
            <Link
              href={feature.href}
              key={feature.href}
              className="bg-card p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-transparent hover:border-primary/20 flex flex-col items-start text-left group"
            >
              <div className="p-3 bg-primary/10 rounded-full mb-4">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-3">{feature.name}</h3>
              <p className="text-muted-foreground mb-6 flex-grow">
                {feature.description}
              </p>
              <div className="flex items-center text-primary font-medium">
                Go to {feature.name}
                <ArrowRight className="w-4 h-4 ml-2 transform transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

