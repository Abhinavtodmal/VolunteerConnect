import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Users,
  Calendar,
  MapPin,
  Sparkles,
  HandHeart,
  Globe,
  Rocket,
  ArrowRight,
  PlusCircle,
  Heart,
  Leaf,
  Shield,
  Star,
} from "lucide-react";
import { useNavigate } from 'react-router-dom';

export default function EventHero({ onScrollToEvents }: { onScrollToEvents: () => void }) {
  const [animatedElements, setAnimatedElements] = useState<JSX.Element[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Floating shapes
    const shapes = Array.from({ length: 20 }, (_, i) => {
      const size = 20 + Math.random() * 50;
      const colors = [
        'text-emerald-300/30',
        'text-sky-300/30',
        'text-purple-300/30',
        'text-amber-300/30',
        'text-rose-300/30',
        'text-indigo-300/30',
      ];
      const color = colors[i % colors.length];
      
      return {
        style: {
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: `${size}px`,
          height: `${size}px`,
          animationDelay: `${Math.random() * 5}s`,
          rotate: `${Math.random() * 360}deg`,
        },
        color,
        shape: ['rounded-full', 'rounded-sm', 'rounded-lg'][i % 3]
      };
    });

    // Floating icons
    const icons = [
      { icon: <Heart className="w-6 h-6" />, color: 'text-rose-400/30' },
      { icon: <Leaf className="w-6 h-6" />, color: 'text-emerald-400/30' },
      { icon: <Shield className="w-6 h-6" />, color: 'text-indigo-400/30' },
      { icon: <Star className="w-6 h-6" />, color: 'text-amber-400/30' },
    ].map(icon => ({
      ...icon,
      style: {
        left: `${10 + Math.random() * 80}%`,
        top: `${10 + Math.random() * 80}%`,
        animationDelay: `${Math.random() * 5}s`,
        rotate: `${Math.random() * 360}deg`,
      }
    }));

    setAnimatedElements([
      ...shapes.map(({ style, color, shape }, index) => (
        <div
          key={`shape-${index}`}
          className={`absolute ${color} ${shape} animate-float`}
          style={style}
        />
      )),
      ...icons.map(({ icon, color, style }, index) => (
        <div
          key={`icon-${index}`}
          className={`absolute ${color} animate-float-slow`}
          style={style}
        >
          {icon}
        </div>
      ))
    ]);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 md:py-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {animatedElements}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(14,165,233,0.1)_0,_transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(234,179,8,0.1)_0,_transparent_70%)]"></div>
      </div>

      <div className="container relative mx-auto px-4">
        <div className="flex flex-col items-center space-y-8 text-center">
          <div className="space-y-4 max-w-5xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-2 bg-slate-800/50 backdrop-blur-sm rounded-full border border-slate-700 animate-pulse">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
              <span className="text-sm font-medium text-amber-300 tracking-wider">
                JOIN THE MOVEMENT • BE THE CHANGE • MAKE AN IMPACT
              </span>
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 animate-text">
                Empower
              </span>
              <span className="text-white"> Your </span>
              <span className="relative inline-block bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-500 animate-text">
                Community
                <Rocket className="absolute -right-6 -top-1 w-5 h-5 text-amber-400 animate-bounce" />
              </span>
            </h1>
            
            <p className="max-w-[700px] mx-auto text-base font-normal text-slate-300 md:text-lg leading-relaxed">
              Unite with passionate changemakers to create meaningful impact where it matters most. 
              Together, we can transform neighborhoods, uplift lives, and build a brighter future.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-6xl">
            <Card className="p-6 bg-slate-800/50 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 hover:scale-[1.02] group border border-slate-700/50 shadow-lg hover:shadow-xl hover:shadow-emerald-500/20">
              <div className="flex flex-col items-center">
                <div className="mb-4 p-3 bg-emerald-500/10 rounded-full group-hover:bg-emerald-500/20 transition-all duration-300 group-hover:rotate-12">
                  <Users className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Connect & Grow</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Build meaningful relationships with like-minded individuals who share your passion for making a difference.
                </p>
                <div className="mt-3 w-12 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"></div>
              </div>
            </Card>
            
            <Card className="p-6 bg-slate-800/50 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 hover:scale-[1.02] group border border-slate-700/50 shadow-lg hover:shadow-xl hover:shadow-sky-500/20">
              <div className="flex flex-col items-center">
                <div className="mb-4 p-3 bg-sky-500/10 rounded-full group-hover:bg-sky-500/20 transition-all duration-300 group-hover:-rotate-12">
                  <Calendar className="w-6 h-6 text-sky-400 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Engage & Learn</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Participate in diverse events that expand your skills while contributing to worthy causes.
                </p>
                <div className="mt-3 w-12 h-1 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full"></div>
              </div>
            </Card>
            
            <Card className="p-6 bg-slate-800/50 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 hover:scale-[1.02] group border border-slate-700/50 shadow-lg hover:shadow-xl hover:shadow-purple-500/20">
              <div className="flex flex-col items-center">
                <div className="mb-4 p-3 bg-purple-500/10 rounded-full group-hover:bg-purple-500/20 transition-all duration-300 group-hover:rotate-12">
                  <MapPin className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Impact & Inspire</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Witness the tangible results of your efforts and inspire others to join the movement.
                </p>
                <div className="mt-3 w-12 h-1 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full"></div>
              </div>
            </Card>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative p-0.5 rounded-full bg-gradient-to-r from-emerald-400 via-teal-500 to-green-500 animate-gradient-border hover:scale-105 transition-transform shadow-lg hover:shadow-emerald-500/50">
              <Button 
                onClick={onScrollToEvents} 
                className="h-12 px-6 rounded-full bg-slate-900 text-base font-semibold text-white hover:bg-slate-800 transition-all duration-300 group w-full"
              >
                <div className="flex items-center gap-2">
                  <HandHeart className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300 transition-colors group-hover:animate-pulse" />
                  Find Volunteer Opportunities
                  <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-all duration-300 text-emerald-300 group-hover:translate-x-1" />
                </div>
              </Button>
            </div>
            
            <div className="relative p-0.5 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 animate-gradient-border hover:scale-105 transition-transform shadow-lg hover:shadow-amber-500/50">
              <Button 
                onClick={() => navigate('/create-event')} 
                className="h-12 px-6 rounded-full bg-slate-900 text-base font-semibold text-white hover:bg-slate-800 transition-all duration-300 group w-full"
              >
                <div className="flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-amber-400 group-hover:text-amber-300 transition-colors group-hover:animate-pulse" />
                  Start Your Own Initiative
                  <Globe className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-all duration-300 text-amber-300 group-hover:translate-x-1" />
                </div>
              </Button>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 text-slate-400">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-slate-600"></div>
            <span className="text-xs">Join 10,000+ volunteers making a difference</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-slate-600"></div>
          </div>
        </div>
      </div>
    </section>
  );
}