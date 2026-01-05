import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowRight, Brain, MessageCircle, Target, Clock, Sparkles, TrendingUp } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      // step: "01",
      icon: Brain,
      title: "Record Your Journey",
      description: "Capture your thoughts, emotions, and experiences through text or voice entries.",
      features: ["Text & voice journaling", "Emotion tagging", "Smart categorization"]
    },
    {
      // step: "02", 
      icon: Sparkles,
      title: "AI Learns Your Patterns",
      description: "AI analyzes your entries to understand growth patterns and emotional responses.",
      features: ["Pattern recognition", "Emotional insights", "Personal reflections"]
    },
    {
      // step: "03",
      icon: MessageCircle,
      title: "Chat with Future Self",
      description: "Converse with an AI version of your wiser, future self who learns from your memories.",
      features: ["Wisdom-based replies", "Growth advice", "Reflective chats"]
    },
    {
      // step: "04",
      icon: Target,
      title: "Track Your Growth",
      description: "Visualize your development with goals, mood tracking, and interactive timelines.",
      features: ["Goal tracking", "Mood analytics", "Timeline visualization"]
    },
    {
      // step: "05",
      icon: Clock,
      title: "Create Time Capsules",
      description: "Write messages to your future self and unlock them at just the right moment.",
      features: ["Future notes", "Scheduled unlocks", "Milestone reminders"]
    },
    {
      // step: "06",
      icon: TrendingUp,
      title: "Evolve Continuously",
      description: "Watch your AI companion grow more insightful with every memory you add.",
      features: ["Continuous learning", "Personalized wisdom", "Lifelong guide"]
    }
  ];

  return (
    <section id="how-it-works" className="py-12 bg-gradient-to-b from-secondary/20 to-background">
      <div className="container max-w-5xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-cosmic-warm/10 text-cosmic-warm border-cosmic-warm/20 px-3 py-1.5 text-xs">
            How It Works
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-cosmic">
            Your Journey to Self-Discovery
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Experience the magic of connecting with your future self through AI-powered emotional intelligence 
            that grows smarter with every memory you share.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-12 top-20 w-px h-12 bg-gradient-to-b from-vault-glow/40 to-cosmic-warm/40 hidden lg:block"></div>
              )}
              
              <Card className="p-6 lg:p-8 bg-card/40 backdrop-blur-sm border-border/40 hover:bg-card/60 hover:border-vault-glow/20 transition-all duration-300 hover:shadow-glow-primary group">
                <div className="flex flex-col lg:flex-row items-start gap-6">
                  
                  {/* Step Number & Icon */}
                  <div className="flex-shrink-0 flex items-center gap-4">
                    <div className="text-4xl lg:text-5xl font-bold text-vault-glow/20 group-hover:text-vault-glow/40 transition-colors duration-300">
                      {step.step}
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-secondary to-secondary/40 border border-border shadow-glow-primary group-hover:shadow-glow-warm group-hover:scale-105 transition-all duration-300">
                      <step.icon className="w-7 h-7 text-vault-glow" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-4">
                    <h3 className="text-xl lg:text-2xl font-semibold text-foreground group-hover:text-gradient-cosmic transition-all duration-300">
                      {step.title}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                    
                    {/* Features List */}
                    <div className="flex flex-wrap gap-2">
                      {step.features.map((feature, featureIndex) => (
                        <Badge 
                          key={featureIndex}
                          variant="secondary" 
                          className="bg-vault-secondary/10 text-vault-secondary border-vault-secondary/20 px-3 py-1 text-xs hover:bg-vault-secondary/20 transition-colors"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Arrow */}
                  {index < steps.length  && (
                    <div className="hidden lg:block text-vault-glow/20 group-hover:text-vault-glow/50 group-hover:translate-x-1 transition-all duration-300">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </div>
              </Card>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
