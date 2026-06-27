import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
  subtitle?: string;
  href?: string;
  className?: string;
  height?: number;
  tone?: "onPrimary" | "onLight";
}

export function PetopiaLogo({
  subtitle,
  href,
  className,
  height = 32,
  tone = "onLight",
}: Props) {
  const width = Math.round(height * (145 / 35));

  const image = (
    <Image
      src="/logo.jpg"
      alt="Petopia"
      width={width}
      height={height}
      className="block object-contain object-left"
      style={{ maxHeight: height, width: "auto", height: "auto" }}
      priority
    />
  );

  const logoMark =
    tone === "onPrimary" ? (
      image
    ) : (
      <span className="inline-flex rounded-lg bg-primary px-2 py-1 leading-none">
        {image}
      </span>
    );

  const content = (
    <div className={cn("flex flex-col gap-1 min-w-0", className)}>
      {logoMark}
      {subtitle && (
        <p
          className={cn(
            "text-xs leading-tight",
            tone === "onPrimary" ? "text-primary-foreground/80" : "text-muted-foreground",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block shrink-0">
        {content}
      </Link>
    );
  }

  return content;
}
