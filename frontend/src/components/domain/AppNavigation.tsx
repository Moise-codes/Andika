"use client";

import Link from "next/link";
import { Keyboard, Home, BookOpen, Target, BarChart3, Trophy, Code, User, Settings, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function AppNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b border-border bg-ivory-light/95 backdrop-blur sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Keyboard className="h-8 w-8 text-forest-primary" />
            <span className="text-xl font-bold text-forest-primary">ANDIKA</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2 text-text-secondary hover:text-forest-primary transition-colors text-sm">
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link href="/learn" className="flex items-center gap-2 text-text-secondary hover:text-forest-primary transition-colors text-sm">
              <BookOpen className="h-4 w-4" />
              Learn
            </Link>
            <Link href="/practice" className="flex items-center gap-2 text-text-secondary hover:text-forest-primary transition-colors text-sm">
              <Target className="h-4 w-4" />
              Practice
            </Link>
            <Link href="/test" className="flex items-center gap-2 text-text-secondary hover:text-forest-primary transition-colors text-sm">
              <Target className="h-4 w-4" />
              Test
            </Link>
            <Link href="/analytics" className="flex items-center gap-2 text-text-secondary hover:text-forest-primary transition-colors text-sm">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Link>
            <Link href="/leaderboard" className="flex items-center gap-2 text-text-secondary hover:text-forest-primary transition-colors text-sm">
              <Trophy className="h-4 w-4" />
              Leaderboard
            </Link>
            <Link href="/programming" className="flex items-center gap-2 text-text-secondary hover:text-forest-primary transition-colors text-sm">
              <Code className="h-4 w-4" />
              Programming
            </Link>
          </div>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/profile">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-text-secondary hover:text-forest-primary"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              <Link href="/dashboard" className="flex items-center gap-2 text-text-secondary hover:text-forest-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <Link href="/learn" className="flex items-center gap-2 text-text-secondary hover:text-forest-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
                <BookOpen className="h-4 w-4" />
                Learn
              </Link>
              <Link href="/practice" className="flex items-center gap-2 text-text-secondary hover:text-forest-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
                <Target className="h-4 w-4" />
                Practice
              </Link>
              <Link href="/test" className="flex items-center gap-2 text-text-secondary hover:text-forest-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
                <Target className="h-4 w-4" />
                Test
              </Link>
              <Link href="/analytics" className="flex items-center gap-2 text-text-secondary hover:text-forest-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
                <BarChart3 className="h-4 w-4" />
                Analytics
              </Link>
              <Link href="/leaderboard" className="flex items-center gap-2 text-text-secondary hover:text-forest-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
                <Trophy className="h-4 w-4" />
                Leaderboard
              </Link>
              <Link href="/programming" className="flex items-center gap-2 text-text-secondary hover:text-forest-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
                <Code className="h-4 w-4" />
                Programming
              </Link>
              <div className="border-t border-border pt-2 mt-2 flex gap-2">
                <Link href="/profile" className="flex-1 flex items-center justify-center gap-2 text-text-secondary hover:text-forest-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                <Link href="/settings" className="flex-1 flex items-center justify-center gap-2 text-text-secondary hover:text-forest-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
