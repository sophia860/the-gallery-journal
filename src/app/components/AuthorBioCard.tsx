import { motion } from 'motion/react';

interface AuthorBioCardProps {
  name: string;
  bio: string;
  instagramUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
  authorId: string;
}

export function AuthorBioCard({
  name,
  bio,
  instagramUrl,
  twitterUrl,
  websiteUrl,
  authorId,
}: AuthorBioCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8 p-6 border border-[#E0D8D0] bg-[#F5F0EB]"
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-[#C4918A] text-white flex items-center justify-center font-['Cardo'] text-xl">
          {name.charAt(0)}
        </div>
        <div className="flex-1">
          <a
            href={`/room/${authorId}`}
            className="font-['Cardo'] text-xl text-[#2C2C2C] hover:text-[#C4918A] transition-colors"
          >
            {name}
          </a>
          <p className="font-[family-name:var(--font-body)] text-sm text-[#717171] mt-2 leading-relaxed">
            {bio}
          </p>
          <div className="flex gap-4 mt-3">
            {instagramUrl && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-['Courier_New'] text-xs text-[#717171] hover:text-[#C4918A] transition-colors uppercase tracking-wider"
              >
                Instagram
              </a>
            )}
            {twitterUrl && (
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-['Courier_New'] text-xs text-[#717171] hover:text-[#C4918A] transition-colors uppercase tracking-wider"
              >
                Twitter
              </a>
            )}
            {websiteUrl && (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-['Courier_New'] text-xs text-[#717171] hover:text-[#C4918A] transition-colors uppercase tracking-wider"
              >
                Website
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
