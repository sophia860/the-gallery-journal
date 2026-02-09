import { Instagram, Globe, Twitter } from 'lucide-react';

/**
 * AuthorBioCard - Displays author biography and social media links
 * Used in the Collection Gallery to show author info alongside published pieces.
 * 
 * Related: Issue #22 - Elegant literary Collection Gallery with author bios
 * Related: Issue #16 - Author bio and social media links in submission flow
 */

interface AuthorBioCardProps {
  name: string;
  bio?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
  authorId?: string;
  compact?: boolean;
}

export function AuthorBioCard({
  name,
  bio,
  instagramUrl,
  twitterUrl,
  websiteUrl,
  authorId,
  compact = false,
}: AuthorBioCardProps) {
  const hasSocialLinks = instagramUrl || twitterUrl || websiteUrl;

  if (!bio && !hasSocialLinks) return null;

  return (
    <div className={`border-t border-[#E0D8D0] ${
      compact ? 'mt-4 pt-4' : 'mt-6 pt-6'
    }`}>
      {/* Author Name */}
      <div className="flex items-center gap-2 mb-2">
        <span className="font-['Cardo'] text-sm font-semibold text-[#2C2C2C] tracking-wide">
          {name}
        </span>
        {authorId && (
          <a
            href={`/writer/${authorId}`}
            className="text-xs text-[#C4918A] hover:text-[#E11D48] transition-colors font-['Inter']"
          >
            View Profile
          </a>
        )}
      </div>

      {/* Bio */}
      {bio && (
        <p className="font-['Libre_Baskerville'] text-sm text-[#717171] leading-relaxed italic mb-3">
          {bio}
        </p>
      )}

      {/* Social Links */}
      {hasSocialLinks && (
        <div className="flex items-center gap-4">
          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#717171] hover:text-[#E11D48] transition-colors"
              title="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
          )}
          {twitterUrl && (
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#717171] hover:text-[#E11D48] transition-colors"
              title="Twitter"
            >
              <Twitter className="w-4 h-4" />
            </a>
          )}
          {websiteUrl && (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#717171] hover:text-[#E11D48] transition-colors"
              title="Website"
            >
              <Globe className="w-4 h-4" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
