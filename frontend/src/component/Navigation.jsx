import { Brain, Menu, User } from "lucide-react";
import { Button } from "./ui/button";
import "./Navigation.css";
import * as React from "react";
export default function Navigation() {
  const [isLoginOpen, setIsLoginOpen] = React.useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = React.useState(false);
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
            <button onClick={() => setIsLoginOpen(true)} className="px-4 py-2 text-sm text-foreground hover:text-vault-glow transition-colors">
              LogIn
            </button>
            {isLoginOpen && (
              <div className="lp modal-overlay">
                <div className="lp modal">
                  <div className="signinheader">
                    <h2 className="lp h2">Login</h2>
                    <Button
                      variant="ghost"
                      onClick={() => setIsLoginOpen(false)}
                    >
                      X
                    </Button>
                  </div>
                          
                  <form className="lp stack">
                    
                    <input type="email" placeholder="Email" className="lp input" />
                    <input type="password" placeholder="Password" className="lp input" />
                    <p>Remember me <input type="checkbox" name="remember me" /></p>
                    <Button className="inline-flex items-center gap-2 rounded-xl bg-gradient-cosmic px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow-primary hover:brightness-110">Submit</Button>
                  </form>
                  
                          
                  <p>Didn't register yet? <Button
                  variant="ghost" style={{padding:0}}
                  onClick={() => {setIsSignUpOpen(true);
                    setIsLoginOpen(false)
                  }}
                  >
                    Sign Up
                  </Button>  </p>
                </div>
              </div>
            )}

            {/* Get Started button (cosmic style) */}
            <button onClick={() => setIsSignUpOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-gradient-cosmic px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow-primary hover:brightness-110">
              <User className="w-4 h-4" />
              Get Started
            </button>
            {isSignUpOpen && (
                      <div className="lp modal-overlay">
                        <div className="lp modal">
                          <div className="signinheader">
                            <h2 className="lp h2">SignUp</h2>
                          <Button
                            variant="ghost"
                            onClick={() => setIsSignUpOpen(false)}
                          >
                            X
                          </Button>
                          </div>
                          <form className="lp stack">
                            <input type="text" placeholder="Full Name" className="lp input" />
                            <input type="text" placeholder="User Name" className="lp input" />
                            <input type="email" placeholder="Email" className="lp input" />
                            <input type="password" placeholder="Password" className="lp input" />
                            <input type="password" placeholder="renter password" className="lp input"/>
                            <Button className="inline-flex items-center gap-2 rounded-xl bg-gradient-cosmic px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow-primary hover:brightness-110">Submit</Button>
                          </form>
                          <p>Already have an account? <Button
                            variant="ghost" style={{padding:0}}
                            onClick={() => {setIsLoginOpen(true);
                            setIsSignUpOpen(false)
                            }}>
                            Login
                          </Button>  </p>
                        </div>
                      </div>
                    )}
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
