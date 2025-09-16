import { Brain, Menu, User } from "lucide-react";

export default function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-cosmic shadow-glow-primary">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-gradient-cosmic">
              Memory Vault
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-foreground hover:text-vault-glow transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-foreground hover:text-vault-glow transition-colors"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="text-foreground hover:text-vault-glow transition-colors"
            >
              Pricing
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Sign In button (ghost style) */}
            <button className="px-4 py-2 text-sm text-foreground hover:text-vault-glow transition-colors">
              Sign In
            </button>

            {/* Get Started button (cosmic style) */}
            <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-cosmic px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow-primary hover:brightness-110">
              <User className="w-4 h-4" />
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-lg text-foreground hover:text-vault-glow transition-colors">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
