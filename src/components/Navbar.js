"use client";

import Link from "next/link";
import { Briefcase, Menu, X } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { useState } from "react";
import { Button } from "./ui/button";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-5 px-4 sm:px-6 md:px-10">
      <div className="flex justify-between items-center gap-6">
        {/* Left - Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Briefcase className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block text-lg">
            FreelanceTrack
          </span>
        </Link>

        {/* Middle - Desktop Navigation */}
        <nav className="hidden md:flex gap-6 ">
          <Link
            href="/projects"
            className="text-base font-medium text-muted-foreground hover:text-primary"
          >
            Projects
          </Link>
          <Link
            href="/clients"
            className="text-base font-medium text-muted-foreground hover:text-primary"
          >
            Clients
          </Link>
          <Link
            href="/referrals"
            className="text-base font-medium text-muted-foreground hover:text-primary"
          >
            Referrals
          </Link>
          <Link
            href="/testimonials"
            className="text-base font-medium text-muted-foreground hover:text-primary"
          >
            Testimonials
          </Link>
          <Link
            href="/finances"
            className="text-base font-medium text-muted-foreground hover:text-primary"
          >
            Finances
          </Link>
        </nav>

        {/* Right - Mobile Menu + User */}
        <div className="flex items-center gap-4">
          {/* Mobile menu toggle */}
          <Button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </Button>

          {/* User */}
          <UserButton />
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div
        className={`md:hidden fixed top-0 right-0 h-screen w-64 bg-white shadow-lg p-6 z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Briefcase className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              FreelanceTrack
            </span>
          </Link>
          <Button
            onClick={() => setIsOpen(!isOpen)}
            variant={"outline"}
            className="border-none p-0"
          >
            {" "}
            <X />
          </Button>
        </div>
        <hr className="my-4 border-t border-gray-200" />
        <nav className="flex flex-col gap-4 ">
          <Link
            href="/projects"
            className="text-sm font-medium text-muted-foreground hover:text-primary"
            onClick={() => setIsOpen(false)}
          >
            Projects
          </Link>
          <Link
            href="/clients"
            className="text-sm font-medium text-muted-foreground hover:text-primary"
            onClick={() => setIsOpen(false)}
          >
            Clients
          </Link>
          <Link
            href="/referrals"
            className="text-base font-medium text-muted-foreground hover:text-primary"
            onClick={() => setIsOpen(false)}
          >
            Referrals
          </Link>
          <Link
            href="/testimonials"
            className="text-sm font-medium text-muted-foreground hover:text-primary"
            onClick={() => setIsOpen(false)}
          >
            Testimonials
          </Link>
          <Link
            href="/finances"
            className="text-sm font-medium text-muted-foreground hover:text-primary"
            onClick={() => setIsOpen(false)}
          >
            Finances
          </Link>
        </nav>
      </div>
    </header>
  );
}
