import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import AnimatedBackground from './AnimatedBackground';
import { useAuthStore } from '../../store/authStore';
import {
  MessageSquare, Target, Zap, Search, Database,
  ArrowRight, Sparkles, GitBranch, Shield, BarChart2,
  ChevronDown, Activity, Cpu, Lock, LayoutDashboard, LogOut,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const stats = [
  { value: '5', label: 'Specialized Agents', icon: Cpu },
  { value: '∞', label: 'Self-Refinement Loops', icon: Activity },
  { value: '100%', label: 'Cloud-Native', icon: Shield },
  { value: '< 90s', label: 'Avg. Execution Time', icon: BarChart2 },
];

const agents = [
  {
    name: 'Input',
    icon: MessageSquare,
    accent: '#F59E0B',
    description: 'Accepts your abstract goal and initiates the pipeline.',
    step: '01',
  },
  {
    name: 'Planner',
    icon: Target,
    accent: '#8B5CF6',
    description: 'Decomposes goals into ordered, actionable sub-tasks.',
    step: '02',
  },
  {
    name: 'Executor',
    icon: Zap,
    accent: '#10B981',
    description: 'Faithfully executes each planned sub-task in sequence.',
    step: '03',
  },
  {
    name: 'Critic',
    icon: Search,
    accent: '#EF4444',
    description: 'Scores output quality (0–100) and identifies issues.',
    step: '04',
  },
  {
    name: 'Memory',
    icon: Database,
    accent: '#3B82F6',
    description: 'Extracts and persists key context for future sessions.',
    step: '05',
  },
];

const features = [
  {
    icon: GitBranch,
    title: 'Self-Refining Loop',
    desc: 'Automatically re-plans and re-executes when quality score falls below 90.',
  },
  {
    icon: Shield,
    title: 'Role-Based Access',
    desc: 'JWT-protected routes with admin and user roles. Full audit trail.',
  },
  {
    icon: Database,
    title: 'Persistent Memory',
    desc: 'MongoDB-backed long-term memory that learns across sessions.',
  },
  {
    icon: BarChart2,
    title: 'Real-Time Telemetry',
    desc: 'Live execution logs, latency metrics, and IP-level audit trail.',
  },
  {
    icon: Zap,
    title: 'Groq-Powered LLM',
    desc: 'Blazing-fast inference via Llama 3.3 70B on Groq\'s hardware.',
  },
  {
    icon: Lock,
    title: 'Export Reports',
    desc: 'Generate professional PDF and DOCX reports from any execution.',
  },
];

/* ------------------------------------------------------------------ */
/*  Animation Helpers                                                   */
/* ------------------------------------------------------------------ */

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.7, delay },
});

/* ------------------------------------------------------------------ */
/*  Scroll Reveal wrapper                                              */
/* ------------------------------------------------------------------ */

const Reveal = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/*  Stat Counter                                                       */
/* ------------------------------------------------------------------ */

const StatCard = ({ value, label, icon: Icon, delay }) => (
  <Reveal delay={delay} className="flex flex-col items-center gap-2 text-center">
    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-1">
      <Icon className="w-5 h-5 text-amber-400" />
    </div>
    <span className="text-3xl font-black text-white tracking-tight">{value}</span>
    <span className="text-sm text-slate-400 font-medium">{label}</span>
  </Reveal>
);

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const LandingPage = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [goalInput, setGoalInput] = useState('');

  const handleGoalSubmit = (e) => {
    e.preventDefault();
    if (!goalInput.trim()) return;
    navigate('/workspace', { state: { goal: goalInput.trim() } });
  };

  return (
    <div className="min-h-screen bg-[#080b12] text-white overflow-x-hidden font-sans">

      {/* ══════════════════ HERO ══════════════════ */}
      <section className="relative min-h-screen flex flex-col overflow-hidden">
        <AnimatedBackground />

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#080b12]/40 to-[#080b12] pointer-events-none z-0" />

        {/* ── Nav ── */}
        <motion.nav
          {...fadeIn(0)}
          className="relative z-10 flex items-center justify-between px-6 md:px-14 py-5 border-b border-white/[0.06] backdrop-blur-md bg-[#080b12]/60"
        >
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-black" />
            </div>
            <span className="text-base font-bold text-white tracking-tight">Agentic AI</span>
            <span className="text-[10px] font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full ml-1">T-78</span>
          </Link>

          <div className="flex items-center gap-3 text-sm">
            <Link to="/how-it-works" className="hidden sm:inline text-slate-400 hover:text-white transition-colors px-3 py-1.5">
              Architecture
            </Link>
            {isAuthenticated ? (
              <>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/dashboard"
                    className="hidden sm:inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors px-3 py-1.5 border border-white/10 rounded-lg hover:bg-white/5"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Dashboard
                  </Link>
                </motion.div>
                <div className="flex items-center gap-2 pl-1">
                  <div className="w-7 h-7 rounded-full bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400 text-xs font-bold uppercase">
                    {user?.username?.[0] || 'U'}
                  </div>
                  <button
                    onClick={() => { logout(); navigate('/'); }}
                    className="text-slate-500 hover:text-red-400 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-300 hover:text-white transition-colors px-3 py-1.5 border border-white/10 rounded-lg hover:bg-white/5">
                  Sign In
                </Link>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/workspace"
                    className="px-4 py-2 rounded-lg bg-amber-400 text-black font-semibold hover:bg-amber-300 transition-colors shadow-[0_0_20px_rgba(251,191,36,0.25)] text-sm"
                  >
                    Launch App
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </motion.nav>

        {/* ── Hero Content ── */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-12 pb-32 gap-10">
          <motion.div {...fadeUp(0.1)} className="inline-flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-[0.25em] bg-amber-400/8 border border-amber-400/20 px-4 py-2 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Cloud-Deployed · Self-Refining · Multi-Agent
          </motion.div>

          <motion.h1 {...fadeUp(0.2)} className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tight max-w-5xl">
            <span className="text-white">AI That Thinks,</span>
            <br />
            <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-300 bg-clip-text text-transparent">
              Refines Itself.
            </span>
          </motion.h1>

          <motion.p {...fadeUp(0.3)} className="text-slate-400 text-lg md:text-xl max-w-2xl leading-relaxed font-light">
            A production-grade autonomous system that decomposes abstract goals,
            executes them through a specialized agent pipeline, critiques its own output,
            and iterates until quality is achieved — without human supervision.
          </motion.p>

          <motion.div {...fadeUp(0.4)} className="w-full max-w-xl">
            {isAuthenticated ? (
              <form onSubmit={handleGoalSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={goalInput}
                  onChange={e => setGoalInput(e.target.value)}
                  placeholder="Enter a goal and run the agent pipeline..."
                  className="flex-1 px-5 py-3.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white placeholder-slate-500 focus:border-amber-400/50 focus:outline-none text-sm transition-all"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-6 py-3.5 rounded-xl bg-amber-400 text-black font-bold hover:bg-amber-300 transition-all shadow-[0_4px_24px_rgba(251,191,36,0.3)] text-sm whitespace-nowrap flex items-center gap-2"
                >
                  Run <ArrowRight className="w-4 h-4" />
                </motion.button>
              </form>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-4">
                <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-amber-400 text-black font-bold hover:bg-amber-300 transition-all shadow-[0_8px_32px_rgba(251,191,36,0.3)] text-base"
                  >
                    Get Started <ArrowRight className="w-5 h-5" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/how-it-works"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/8 transition-all backdrop-blur-sm text-base"
                  >
                    View Architecture
                  </Link>
                </motion.div>
              </div>
            )}
          </motion.div>

          {/* Pipeline preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex items-center gap-2 md:gap-3 flex-wrap justify-center"
          >
            {agents.map((agent, i) => {
              const Icon = agent.icon;
              return (
                <React.Fragment key={agent.name}>
                  <motion.div
                    whileHover={{ scale: 1.1, y: -4 }}
                    className="flex flex-col items-center gap-1.5 cursor-default"
                  >
                    <div
                      className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center border backdrop-blur-sm transition-all duration-300"
                      style={{
                        background: `${agent.accent}12`,
                        borderColor: `${agent.accent}30`,
                        boxShadow: `0 0 20px ${agent.accent}10`,
                      }}
                    >
                      <Icon className="w-5 h-5 md:w-6 md:h-6" style={{ color: agent.accent }} />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{agent.name}</span>
                  </motion.div>
                  {i < agents.length - 1 && (
                    <div className="flex items-center gap-1 pb-4">
                      <div className="w-6 md:w-10 h-[1px] bg-white/10 relative overflow-hidden rounded-full">
                        <motion.div
                          className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"
                          animate={{ x: ['-100%', '300%'] }}
                          transition={{ duration: 1.8, repeat: Infinity, ease: 'linear', delay: i * 0.36 }}
                        />
                      </div>
                      <ArrowRight className="w-3 h-3 text-slate-600" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-600 flex flex-col items-center gap-1"
          >
            <span className="text-[10px] tracking-widest uppercase">Scroll</span>
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </div>
      </section>

      {/* ══════════════════ STATS ══════════════════ */}
      <section className="py-16 px-6 border-y border-white/[0.05] bg-white/[0.01]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
          {stats.map((s, i) => (
            <StatCard key={s.label} {...s} delay={i * 0.08} />
          ))}
        </div>
      </section>

      {/* ══════════════════ PIPELINE ══════════════════ */}
      <section className="py-28 px-6 md:px-14 relative overflow-hidden">
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <Reveal className="text-center mb-20">
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-[0.3em] mb-4">The Pipeline</p>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-5 tracking-tight">
              Five Agents. One Goal.
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto font-light">
              Each agent is purpose-built and specialized. Together they form a closed-loop reasoning system.
            </p>
          </Reveal>

          <div className="flex flex-col gap-4">
            {agents.map((agent, i) => {
              const Icon = agent.icon;
              return (
                <Reveal key={agent.name} delay={i * 0.07}>
                  <motion.div
                    whileHover={{ x: 6 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="flex items-center gap-6 p-6 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-white/[0.12] hover:bg-white/[0.05] transition-all duration-300 group"
                  >
                    <span className="text-4xl font-black text-white/[0.05] group-hover:text-white/10 transition-colors w-12 shrink-0 text-right font-mono">
                      {agent.step}
                    </span>
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border"
                      style={{ background: `${agent.accent}15`, borderColor: `${agent.accent}30` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: agent.accent }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">{agent.name} Agent</h3>
                      <p className="text-slate-400 text-sm font-light leading-relaxed">{agent.description}</p>
                    </div>
                    <div
                      className="hidden md:block w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: agent.accent }}
                    />
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════ FEATURES ══════════════════ */}
      <section className="py-28 px-6 md:px-14 bg-gradient-to-b from-transparent to-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-[0.3em] mb-4">Capabilities</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
              Built for Production
            </h2>
            <p className="text-slate-400 text-lg max-w-lg mx-auto font-light">
              Enterprise-grade features from day one.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal key={f.title} delay={i * 0.05}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="p-7 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-amber-400/20 hover:bg-white/[0.05] transition-all duration-300 group h-full"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mb-5 group-hover:bg-amber-400/15 transition-colors">
                      <Icon className="w-5 h-5 text-amber-400" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed font-light">{f.desc}</p>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════ CTA ══════════════════ */}
      <section className="py-28 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400/[0.04] via-transparent to-purple-500/[0.04] pointer-events-none" />
        <Reveal className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-8">
          <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-[0.3em] bg-amber-400/8 border border-amber-400/20 px-4 py-2 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            Ready to Deploy
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Start Building
            <br />
            <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
              Autonomously.
            </span>
          </h2>
          <p className="text-slate-400 text-lg font-light max-w-md">
            No setup headaches. The full agent pipeline is ready — just open the workspace and give it a goal.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {isAuthenticated ? (
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/workspace"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-amber-400 text-black font-bold hover:bg-amber-300 transition-all shadow-[0_8px_40px_rgba(251,191,36,0.3)] text-base"
                >
                  Open Workspace <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-amber-400 text-black font-bold hover:bg-amber-300 transition-all shadow-[0_8px_40px_rgba(251,191,36,0.3)] text-base"
                  >
                    Create Account <ArrowRight className="w-5 h-5" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/8 transition-all text-base"
                  >
                    Sign In
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </Reveal>
      </section>

      {/* ══════════════════ FOOTER ══════════════════ */}
      <footer className="border-t border-white/[0.06] py-10 px-6 md:px-14 bg-[#080b12]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-amber-400 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-black" />
            </div>
            <span className="text-sm font-semibold text-slate-300">Agentic AI · T-78</span>
          </div>
          <div className="flex items-center gap-8 text-sm text-slate-500">
            <Link to="/workspace" className="hover:text-slate-300 transition-colors">Workspace</Link>
            <Link to="/dashboard" className="hover:text-slate-300 transition-colors">Dashboard</Link>
            <Link to="/how-it-works" className="hover:text-slate-300 transition-colors">Architecture</Link>
            <Link to="/login" className="hover:text-slate-300 transition-colors">Login</Link>
          </div>
          <p className="text-slate-600 text-xs">
            GLA University · CSE-AIML · 2025–26
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
