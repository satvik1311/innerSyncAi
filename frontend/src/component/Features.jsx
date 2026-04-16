import { Brain, MessageCircle, Target, Clock, Activity, Sparkles } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: Brain,
      title: "Sync Engine",
      description: "Securely store your thoughts, emotions, and experiences with intelligent tagging and search.",
      premium: false,
      color: "text-purple-400"
    },
    {
      icon: MessageCircle,
      title: "Future Self Sync",
      description: "AI-powered conversations with your wiser future self, learning from your past memories.",
      premium: false,
      color: "text-fuchsia-400"
    },
    {
      icon: Target,
      title: "Goal Tracking",
      description: "Set meaningful goals and track your progress with visual insights and AI guidance.",
      premium: false,
      color: "text-indigo-400"
    },
    {
      icon: Clock,
      title: "Time Capsules",
      description: "Create messages for your future self and unlock them at the perfect moment.",
      premium: true,
      color: "text-blue-400"
    },
    {
      icon: Activity,
      title: "Life Timeline",
      description: "Visualize your personal growth journey with an interactive timeline of memories.",
      premium: false,
      color: "text-purple-400"
    },
    {
      icon: Sparkles,
      title: "Voice Journaling",
      description: "Record voice entries that transform into searchable text memories automatically.",
      premium: true,
      color: "text-fuchsia-400"
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-neutral-950 to-purple-950/20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block mb-4 px-3 py-1 rounded-full bg-purple-400/10 text-purple-400 border border-purple-400/20 text-sm font-medium">
            Core Features
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-fuchsia-500 bg-clip-text text-transparent">
            Your Personal Time Machine
          </h2>
          <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
            Experience the future of personal reflection with InnerSync tools that help you align,
            remember, and connect with your evolving self.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 hover:bg-neutral-900/80 transition-all duration-300 hover:shadow-lg group"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-xl bg-neutral-800 border border-neutral-700 shadow-md group-hover:shadow-lg transition-all duration-300">
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-xl font-semibold text-white">
                      {feature.title}
                    </h3>
                    {feature.premium && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-fuchsia-400/10 text-fuchsia-400 border border-fuchsia-400/20">
                        Premium
                      </span>
                    )}
                  </div>
                  <p className="text-neutral-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}