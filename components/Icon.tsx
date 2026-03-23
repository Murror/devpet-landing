import {
  ScanSearch, BookOpen, Sprout, Activity, Trophy, MessageCircle,
  Zap, RotateCcw, Sparkles, Brain, Home, Star, BarChart3, User,
  Cat, Lock, type LucideProps,
} from 'lucide-react'
import { ComponentType } from 'react'

const icons: Record<string, ComponentType<LucideProps>> = {
  'scan-search': ScanSearch,
  'book-open': BookOpen,
  sprout: Sprout,
  activity: Activity,
  trophy: Trophy,
  'message-circle': MessageCircle,
  zap: Zap,
  'rotate-ccw': RotateCcw,
  sparkles: Sparkles,
  brain: Brain,
  home: Home,
  star: Star,
  'bar-chart': BarChart3,
  user: User,
  cat: Cat,
  lock: Lock,
}

interface IconProps extends LucideProps {
  name: string
}

export default function Icon({ name, ...props }: IconProps) {
  const Comp = icons[name]
  if (!Comp) return null
  return <Comp {...props} />
}
