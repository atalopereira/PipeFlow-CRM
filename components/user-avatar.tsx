import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn, getInitials } from "@/lib/utils";

interface UserAvatarProps {
  name: string;
  initials?: string;
  className?: string;
}

export function UserAvatar({ name, initials, className }: UserAvatarProps) {
  const fallback = initials ?? getInitials(name);

  return (
    <Avatar className={cn("h-8 w-8", className)}>
      <AvatarFallback className="bg-primary/15 text-xs font-medium text-primary">
        {fallback}
      </AvatarFallback>
    </Avatar>
  );
}
