import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart2, BookOpen, DollarSign } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-gradient-to-b from-background to-secondary">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-20 text-center">
        <h1 className="text-5xl font-bold mb-4">
          Welcome to <span className="text-primary">TradePro Journal</span>
        </h1>
        <p className="text-xl mb-8 max-w-2xl">
          Your ultimate trading companion for success. Track, analyze, and improve your trading performance with our powerful tools and insights.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <FeatureCard
            icon={<BarChart2 className="w-8 h-8 mb-4" />}
            title="Advanced Analytics"
            description="Gain deep insights into your trading performance with our comprehensive analytics tools."
          />
          <FeatureCard
            icon={<DollarSign className="w-8 h-8 mb-4" />}
            title="Stock Valuation"
            description="Make informed decisions with our automated stock valuation models and historical trends."
          />
          <FeatureCard
            icon={<BookOpen className="w-8 h-8 mb-4" />}
            title="Reflective Journaling"
            description="Improve your trading strategy with structured performance reflections and goal tracking."
          />
        </div>
        <Link href="/auth/register" passHref>
          <Button asChild size="lg">
            <span>
              Get Started <ArrowRight className="ml-2" />
            </span>
          </Button>
        </Link>
      </main>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center p-6 m-2 max-w-sm rounded-lg bg-card shadow-lg">
      {icon}
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}