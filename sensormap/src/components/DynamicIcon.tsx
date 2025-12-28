import * as Icons from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import type { ComponentType } from 'react';

interface DynamicIconProps extends LucideProps {
  name: string;
}

export const DynamicIcon = ({ name, ...props }: DynamicIconProps) => {
  const IconComponent = Icons[name as keyof typeof Icons] as unknown as
    | ComponentType<LucideProps>
    | undefined;
  if (!IconComponent) {
    return <Icons.HelpCircle {...props} />;
  }
  return <IconComponent {...props} />;
};
