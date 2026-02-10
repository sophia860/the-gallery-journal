import { User, ExternalLink, Globe, Twitter, Instagram, Mail } from 'lucide-react';

interface SocialLink {
  type: 'website' | 'twitter' | 'instagram' | 'email';
  url: string;
  label?: string;
}

interface AuthorBioCardProps {
  authorId?: string;
  authorName: string;
  authorBio: string;
  authorPhoto?: string;
  socialLinks?: SocialLink[];
  workCount?: number;
  variant?: 'default' | 'compact' | 'inline';
  className?: string;
}

export function AuthorBioCard({
  authorId,
  authorName,
  authorBio,
  authorPhoto,
  socialLinks = [],
  workCount,
  variant = 'default',
  className = '',
}: AuthorBioCardProps) {
  const isCompact = variant === 'compact';
  const isInline = variant === 'inline';

  // Get social icon
  const getSocialIcon = (type: string) => {
    switch (type) {
      case 'website':
        return <Globe className="w-4 h-4" />;
      case 'twitter':
        return <Twitter className="w-4 h-4" />;
      case 'instagram':
        return <Instagram className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      default:
        return <ExternalLink className="w-4 h-4" />;
    }
  };

  // Format social label
  const getSocialLabel = (link: SocialLink) => {
    if (link.label) return link.label;
    
    switch (link.type) {
      case 'website':
        return 'Website';
      case 'twitter':
        return 'Twitter';
      case 'instagram':
        return 'Instagram';
      case 'email':
        return 'Email';
      default:
        return 'Link';
    }
  };

  // Inline variant - minimal, flows with text
  if (isInline) {
    return (
      <div className={`flex items-start gap-4 py-6 px-6 bg-[#FAF7F2] border-l-4 border-[#C4A265] ${className}`}>
        {/* Avatar */}
        <div className="flex-shrink-0">
          {authorPhoto ? (
            <img
              src={authorPhoto}
              alt={authorName}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#E0D8D0]"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#C4A265]/20 to-[#E11D48]/20 flex items-center justify-center border-2 border-[#E0D8D0]">
              <User className="w-8 h-8 text-[#8B7355]" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-['Courier_New'] text-xs text-[#8B7355] uppercase tracking-wider">
              About the Author
            </span>
          </div>
          <h4 className="font-['Cardo'] text-xl text-[#2C1810] mb-2">
            {authorName}
          </h4>
          <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355] leading-relaxed line-clamp-2">
            {authorBio}
          </p>
          {authorId && (
            <a
              href={`/writer/${authorId}`}
              className="inline-flex items-center gap-1 mt-3 font-['Courier_New'] text-xs text-[#E11D48] hover:text-[#C01040] transition-colors uppercase tracking-wider"
            >
              View Profile
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    );
  }

  // Compact variant - smaller card
  if (isCompact) {
    return (
      <div className={`bg-white border-2 border-[#E0D8D0] rounded-lg p-6 hover:border-[#C4A265] transition-all ${className}`}>
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {authorPhoto ? (
              <img
                src={authorPhoto}
                alt={authorName}
                className="w-20 h-20 rounded-full object-cover border-2 border-[#E0D8D0]"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C4A265]/20 to-[#E11D48]/20 flex items-center justify-center border-2 border-[#E0D8D0]">
                <User className="w-10 h-10 text-[#8B7355]" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-['Cardo'] text-2xl text-[#2C1810] mb-2">
              {authorName}
            </h3>
            <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355] leading-relaxed line-clamp-3 mb-3">
              {authorBio}
            </p>
            
            {/* Social links */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-2 mb-3">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border border-[#E0D8D0] hover:border-[#C4A265] hover:text-[#E11D48] text-[#8B7355] rounded transition-all"
                    title={getSocialLabel(link)}
                  >
                    {getSocialIcon(link.type)}
                  </a>
                ))}
              </div>
            )}

            {/* View all works */}
            {authorId && (
              <a
                href={`/writer/${authorId}`}
                className="inline-flex items-center gap-2 font-['Courier_New'] text-xs text-[#E11D48] hover:text-[#C01040] transition-colors uppercase tracking-wider"
              >
                View All Works
                {workCount && <span className="text-[#8B7355]">({workCount})</span>}
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default variant - full card
  return (
    <div className={`bg-gradient-to-br from-[#FAF7F2] to-white border-2 border-[#E0D8D0] rounded-lg overflow-hidden hover:border-[#C4A265] transition-all ${className}`}>
      {/* Header with decorative element */}
      <div className="bg-gradient-to-r from-[#C4A265]/10 to-transparent px-8 py-4 border-b border-[#E0D8D0]">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-[#C4A265]" />
          <span className="font-['Courier_New'] text-xs text-[#8B7355] uppercase tracking-wider">
            About the Author
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {authorPhoto ? (
              <img
                src={authorPhoto}
                alt={authorName}
                className="w-24 h-24 rounded-full object-cover border-2 border-[#E0D8D0]"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#C4A265]/20 to-[#E11D48]/20 flex items-center justify-center border-2 border-[#E0D8D0]">
                <User className="w-12 h-12 text-[#8B7355]" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h3 className="font-['Cardo'] text-3xl text-[#2C1810] mb-3">
              {authorName}
            </h3>
            <p className="font-['Libre_Baskerville'] text-base text-[#8B7355] leading-relaxed mb-6">
              {authorBio}
            </p>

            {/* Social links */}
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 border-2 border-[#E0D8D0] hover:border-[#C4A265] hover:text-[#E11D48] text-[#8B7355] rounded transition-all font-[family-name:var(--font-ui)] text-sm"
                  >
                    {getSocialIcon(link.type)}
                    <span>{getSocialLabel(link)}</span>
                  </a>
                ))}
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-[#E0D8D0]"></div>
              <div className="w-1.5 h-1.5 bg-[#C4A265] rotate-45"></div>
              <div className="h-px flex-1 bg-[#E0D8D0]"></div>
            </div>

            {/* View all works */}
            {authorId && (
              <div className="flex items-center justify-between">
                <a
                  href={`/writer/${authorId}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#E11D48] text-white hover:bg-[#C01040] transition-colors font-['Courier_New'] text-sm uppercase tracking-wider"
                >
                  View All Works
                  <ExternalLink className="w-4 h-4" />
                </a>
                {workCount && (
                  <span className="font-['Courier_New'] text-xs text-[#8B7355] uppercase tracking-wider">
                    {workCount} {workCount === 1 ? 'piece' : 'pieces'} published
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
