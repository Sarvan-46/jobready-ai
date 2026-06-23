import { Check, Crown, Sparkles, Zap, Shield, Users } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "Access to 50 questions",
      "Basic aptitude tests",
      "Limited coding problems",
      "Community support",
      "Progress tracking",
    ],
    limitations: [
      "No AI mock interviews",
      "No resume analyzer",
      "No company-specific prep",
      "Limited analytics",
    ],
    color: "from-[#475569] to-[#334155]",
    buttonText: "Current Plan",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "Most popular for serious learners",
    features: [
      "Unlimited access to all questions",
      "AI-powered mock interviews",
      "Advanced resume analyzer",
      "Company-specific preparation",
      "Detailed analytics & insights",
      "Personalized study plans",
      "Priority support",
      "Ad-free experience",
    ],
    limitations: [],
    color: "from-[#2563EB] to-[#1D4ED8]",
    buttonText: "Upgrade to Pro",
    popular: true,
  },
  {
    name: "Premium",
    price: "$79",
    period: "per month",
    description: "For career changers & serious job seekers",
    features: [
      "Everything in Pro",
      "1-on-1 mentorship sessions",
      "Live mock interviews with experts",
      "Resume building service",
      "Interview guarantee program",
      "Exclusive job opportunities",
      "Career coaching sessions",
      "LinkedIn profile optimization",
      "Salary negotiation guide",
    ],
    limitations: [],
    color: "from-[#F59E0B] to-[#D97706]",
    buttonText: "Upgrade to Premium",
    popular: false,
  },
];

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Learning",
    description: "Get personalized recommendations based on your performance",
    color: "#2563EB",
  },
  {
    icon: Zap,
    title: "Instant Feedback",
    description: "Receive detailed feedback on all your practice sessions",
    color: "#F59E0B",
  },
  {
    icon: Shield,
    title: "Interview Guarantee",
    description: "Premium members get guaranteed interview preparation success",
    color: "#10B981",
  },
  {
    icon: Users,
    title: "Expert Mentorship",
    description: "Learn from industry professionals and get career guidance",
    color: "#8B5CF6",
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "SDE at Google",
    image: "👩‍💻",
    text: "JobReady AI helped me land my dream job at Google. The mock interviews were incredibly realistic!",
    rating: 5,
  },
  {
    name: "Rahul Kumar",
    role: "Software Engineer at Microsoft",
    image: "👨‍💻",
    text: "The company-specific preparation and AI feedback made all the difference. Highly recommended!",
    rating: 5,
  },
  {
    name: "Anjali Patel",
    role: "Product Manager at Amazon",
    image: "👩‍💼",
    text: "Best investment in my career. Got offers from 3 top companies within 2 months!",
    rating: 5,
  },
];

const stats = [
  { value: "50K+", label: "Students Placed" },
  { value: "94%", label: "Success Rate" },
  { value: "500+", label: "Partner Companies" },
  { value: "4.9/5", label: "Average Rating" },
];

const faqs = [
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.",
  },
  {
    question: "Do you offer student discounts?",
    answer:
      "Yes! We offer 30% discount for students with a valid student ID. Contact our support team to get your discount code.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, debit cards, UPI, and net banking.",
  },
  {
    question: "Is there a money-back guarantee?",
    answer:
      "Yes, we offer a 7-day money-back guarantee. If you're not satisfied, we'll refund your payment, no questions asked.",
  },
];

export function Premium() {
  return (
    <div className="max-w-[1400px] mx-auto space-y-16">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F59E0B] to-[#D97706] rounded-full text-white mb-6">
          <Crown className="w-5 h-5" />
          <span className="text-sm">Unlock Premium Features</span>
        </div>
        <h1 className="text-5xl mb-4 text-white">
          Invest in Your Career Success
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
          Join 50,000+ students who landed their dream jobs with JobReady AI
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white border border-slate-200 rounded-2xl p-6 text-center"
          >
            <p className="text-3xl mb-2 text-slate-900">{stat.value}</p>
            <p className="text-sm text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative bg-slate-50 border-2 rounded-2xl p-8 ${
              plan.popular
                ? "border-[#2563EB] shadow-xl shadow-[#2563EB]/20 scale-105"
                : "border-slate-200"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1.5 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white text-sm rounded-full">
                  Most Popular
                </span>
              </div>
            )}
            <div className="text-center mb-8">
              <h3 className="text-2xl mb-2 text-slate-900">{plan.name}</h3>
              <p className="text-slate-500 mb-4">{plan.description}</p>
              <div className="mb-2">
                <span className="text-5xl text-slate-900">{plan.price}</span>
                <span className="text-slate-500 ml-2">/ {plan.period}</span>
              </div>
            </div>

            <button
              className={`w-full py-4 rounded-xl mb-6 transition-all ${
                plan.popular
                  ? "bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white hover:shadow-lg hover:shadow-[#2563EB]/50"
                  : plan.name === "Free"
                  ? "bg-[#334155] text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white hover:shadow-lg hover:shadow-[#F59E0B]/50"
              }`}
              disabled={plan.name === "Free"}
            >
              {plan.buttonText}
            </button>

            <div className="space-y-4">
              <p className="text-sm text-slate-500">What's included:</p>
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                  <span className="text-slate-900">{feature}</span>
                </div>
              ))}
              {plan.limitations.map((limitation, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                    <div className="w-4 h-4 border-2 border-[#334155] rounded-full"></div>
                  </div>
                  <span className="text-slate-500 line-through">
                    {limitation}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Features Grid */}
      <div>
        <h3 className="text-xl text-center mb-12 text-slate-900">
          Why Choose JobReady AI Pro?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-[#2563EB] transition-all"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${feature.color}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>
                <h3 className="text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] rounded-2xl p-8">
        <h2 className="text-3xl text-center mb-12 text-slate-900">
          Success Stories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                  {testimonial.image}
                </div>
                <div>
                  <h4 className="text-white">{testimonial.name}</h4>
                  <p className="text-sm text-blue-100">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-[#F59E0B]">
                    ⭐
                  </span>
                ))}
              </div>
              <p className="text-white">{testimonial.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-3xl text-center mb-12 text-slate-900">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-slate-200 rounded-2xl p-6"
            >
              <h4 className="text-slate-900 mb-3">{faq.question}</h4>
              <p className="text-slate-500">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-[#10B981] to-[#059669] rounded-2xl p-12 text-center">
        <Crown className="w-16 h-16 text-white mx-auto mb-6" />
        <h2 className="text-3xl mb-4 text-white">
          Ready to Land Your Dream Job?
        </h2>
        <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
          Join thousands of successful candidates who accelerated their career
          with JobReady AI
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 bg-white text-[#10B981] rounded-xl hover:bg-green-50 transition-colors text-lg">
            Start 7-Day Free Trial
          </button>
          <button className="px-8 py-4 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-colors text-lg">
            View All Plans
          </button>
        </div>
        <p className="text-sm text-green-100 mt-6">
          No credit card required • Cancel anytime • 7-day money-back guarantee
        </p>
      </div>
    </div>
  );
}
