import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name: string;
  initials?: string;
  className?: string;
}

export function UserAvatar({ name, initials, className }: UserAvatarProps) {
  const fallback =
    initials ??
    name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <Avatar className={cn("h-8 w-8", className)}>
      <AvatarFallback className="bg-primary/15 text-xs font-medium text-primary">
        {fallback}
      </AvatarFallback>
    </Avatar>
  );
}
