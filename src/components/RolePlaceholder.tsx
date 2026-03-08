import { motion } from 'framer-motion';
import { Construction } from 'lucide-react';

interface RolePlaceholderProps {
  title: string;
  subtitle?: string;
}

export default function RolePlaceholder({ title, subtitle }: RolePlaceholderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center"
    >
      <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center mb-4">
        <Construction className="w-7 h-7 text-muted-foreground" />
      </div>
      <h1 className="text-xl font-bold tracking-tight mb-1">{title}</h1>
      <p className="text-sm text-muted-foreground max-w-md">
        {subtitle ?? 'This module is being built with full detail.'}
      </p>
      <div className="mt-6 px-4 py-2 rounded-md bg-muted text-xs text-muted-foreground font-medium">
        Coming soon
      </div>
    </motion.div>
  );
}
