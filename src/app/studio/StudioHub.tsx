import { Pen, FileText, BookOpen, Map, Sparkles, FolderOpen, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ToolCard {
  name: string;
  description: string;
  icon: any;
  href: string;
  color: string;
}

const tools: ToolCard[] = [
  {
    name: 'Literary Editor',
    description: 'Beautiful, distraction-free editor with preview and publishing tools',
    icon: Sparkles,
    href: '/writer-editor',
    color: 'border-[#DC143C]',
  },
  {
    name: 'Freewrite',
    description: 'Distraction-free writing with timed sessions, word goals, zen mode',
    icon: Pen,
    href: '/studio/freewrite',
    color: 'border-[#5B8A8A]',
  },
  {
    name: 'Poetry Editor',
    description: 'Craft poems with line-break control, visual preview, submit to gallery',
    icon: Sparkles,
    href: '/studio/poetry',
    color: 'border-[#8A9A7B]',
  },
  {
    name: 'Essay Writer',
    description: 'Structured sections: thesis, intro, body, conclusion, citations manager',
    icon: FileText,
    href: '/studio/essay',
    color: 'border-[#C4918A]',
  },
  {
    name: 'Longform Planner',
    description: 'Chapters, characters, plot timeline, scene cards, research notes',
    icon: BookOpen,
    href: '/studio/longform',
    color: 'border-[#A8998F]',
  },
  {
    name: 'Concrete Poetry',
    description: 'Experimental visual poetry canvas with drag, rotate, scale',
    icon: Map,
    href: '/studio/concrete',
    color: 'border-[#B5A8A1]',
  },
];

export function StudioHub() {
  const { user } = useAuth();

  if (!user) {
    window.location.href = '/signin';
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-8">
        {/* Header */}
        <div className="mb-16">
          <h1 className="font-serif text-6xl mb-4 text-[#2B2B2B]">
            Your Studio
          </h1>
          <p className="text-xl text-[#717171] font-serif">
            Choose a tool to begin writing. Each tool saves drafts to My Work.
          </p>
        </div>

        {/* Writing Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {tools.map((tool) => (
            <a
              key={tool.name}
              href={tool.href}
              className={`group p-8 border-2 ${tool.color} bg-white hover:bg-[#FAF7F2] transition-all duration-300`}
            >
              <tool.icon className="w-8 h-8 mb-4 text-[#2B2B2B] group-hover:text-[#5B8A8A] transition-colors" />
              <h3 className="font-serif text-2xl mb-3 text-[#2B2B2B]">
                {tool.name}
              </h3>
              <p className="text-[#717171] leading-relaxed">
                {tool.description}
              </p>
            </a>
          ))}
        </div>

        {/* Studio Management */}
        <div className="border-t-2 border-[#E0D8D0] pt-12">
          <h2 className="font-serif text-3xl mb-8 text-[#2B2B2B]">
            Studio Management
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <a
              href="/studio/work"
              className="group p-8 border-2 border-[#2B2B2B] bg-white hover:bg-[#FAF7F2] transition-all duration-300"
            >
              <FolderOpen className="w-8 h-8 mb-4 text-[#2B2B2B] group-hover:text-[#5B8A8A] transition-colors" />
              <h3 className="font-serif text-2xl mb-3 text-[#2B2B2B]">
                My Work
              </h3>
              <p className="text-[#717171] leading-relaxed">
                View all drafts, create exhibits, manage published pieces, see intimacy metrics
              </p>
            </a>

            <a
              href="/studio/room-settings"
              className="group p-8 border-2 border-[#E0D8D0] bg-white hover:bg-[#FAF7F2] transition-all duration-300"
            >
              <Settings className="w-8 h-8 mb-4 text-[#2B2B2B] group-hover:text-[#5B8A8A] transition-colors" />
              <h3 className="font-serif text-2xl mb-3 text-[#2B2B2B]">
                Room Settings
              </h3>
              <p className="text-[#717171] leading-relaxed">
                Customize your public room: atmosphere, typography, pinned piece, bookshelf
              </p>
            </a>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 p-8 bg-white border-2 border-[#E0D8D0]">
          <p className="font-['Courier_New'] text-sm text-[#717171] tracking-wide">
            STUDIO PHILOSOPHY: This is your back room. Your notebook. Your private workspace. 
            The writing tools feel like opening a fresh page. When you're ready, curate your 
            drafts into exhibits and step into the gallery.
          </p>
        </div>
      </div>
    </div>
  );
}