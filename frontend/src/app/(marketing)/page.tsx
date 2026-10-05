import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Keyboard, Target, TrendingUp, Trophy, BookOpen, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-ivory-light">
      {/* Navigation */}
      <nav className="border-b border-border bg-ivory-light/95 backdrop-blur supports-[backdrop-filter]:bg-ivory-light/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Keyboard className="h-8 w-8 text-forest-primary" />
            <span className="text-2xl font-bold text-forest-primary">ANDIKA</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
          {/* Left side - Text content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-forest-primary" />
              <p className="text-xs font-semibold tracking-widest uppercase text-forest-primary">
                Modern typing platform
              </p>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-forest-primary mb-6 leading-[1.1]">
              Learn. Practice.<br />
              <span className="font-light text-forest-primary/80">Master Typing.</span>
            </h1>
            <p className="text-lg md:text-xl text-text-secondary mb-8 max-w-2xl mx-auto lg:mx-0">
              A modern typing-learning and typing-performance platform. Improve your speed and accuracy with structured lessons, practice modes, and real-time competitions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/signup">
                <Button size="lg" className="shadow-lg">
                  Start Learning Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/test">
                <Button size="lg" variant="outline">Try a Test</Button>
              </Link>
            </div>
          </div>

          {/* Right side - Seamless GIF */}
          <div className="relative hidden lg:block">
            <div
              className="relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(65, 82, 57, 0.03) 0%, rgba(65, 82, 57, 0.06) 50%, rgba(65, 82, 57, 0.03) 100%)',
                padding: '0',
                margin: '0',
                borderRadius: '0',
                boxShadow: 'none',
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(65, 82, 57, 0.08) 0%, transparent 70%)',
                }}
              />
              <img
                src="/Typing.gif"
                alt="Typing demonstration"
                className="relative w-full max-w-xl mx-auto"
                style={{
                  maxHeight: '520px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 2px 8px rgba(65, 82, 57, 0.08))',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-forest-primary text-center mb-12">
          Everything you need to master typing
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <BookOpen className="h-12 w-12 text-forest-primary mb-4" />
              <CardTitle>Structured Learning</CardTitle>
              <CardDescription>
                Progressive courses from fundamentals to advanced techniques
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Target className="h-12 w-12 text-forest-primary mb-4" />
              <CardTitle>Adaptive Practice</CardTitle>
              <CardDescription>
                Personalized practice based on your weak keys and patterns
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-forest-primary mb-4" />
              <CardTitle>Detailed Analytics</CardTitle>
              <CardDescription>
                Track your progress with comprehensive performance insights
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Trophy className="h-12 w-12 text-forest-primary mb-4" />
              <CardTitle>Competitions</CardTitle>
              <CardDescription>
                Real-time typing races against other users
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Zap className="h-12 w-12 text-forest-primary mb-4" />
              <CardTitle>Programming Mode</CardTitle>
              <CardDescription>
                Practice typing real code in multiple programming languages
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Keyboard className="h-12 w-12 text-forest-primary mb-4" />
              <CardTitle>Multiple Layouts</CardTitle>
              <CardDescription>
                Support for QWERTY, AZERTY, QWERTZ, Dvorak, and Colemak
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-forest-primary text-ivory-light py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to improve your typing?</h2>
          <p className="text-lg mb-8 opacity-90">Join thousands of users mastering their typing skills</p>
          <Link href="/signup">
            <Button size="lg" variant="secondary">Get Started Free</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-text-secondary">
          <p>&copy; 2026 ANDIKA. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
