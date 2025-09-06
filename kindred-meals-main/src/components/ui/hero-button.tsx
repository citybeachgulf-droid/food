import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export interface HeroButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

const HeroButton = forwardRef<HTMLButtonElement, HeroButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <Button
        className={cn(
          "h-14 px-8 text-lg font-semibold transition-bounce shadow-warm hover:shadow-glow",
          variant === "primary" && "gradient-primary hover:scale-105 animate-glow",
          variant === "secondary" && "bg-card border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground hover:scale-105",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

HeroButton.displayName = "HeroButton";

export { HeroButton };