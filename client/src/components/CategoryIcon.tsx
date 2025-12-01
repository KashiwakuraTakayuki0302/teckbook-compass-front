interface CategoryIconProps {
    name: string;
    className?: string;
}

export function CategoryIcon({ name, className }: CategoryIconProps) {
    const iconMap: Record<string, string> = {
        robot: "🤖",
        pc: "💻",
        cloud: "☁️",
        security: "🔒",
        development: "🛠️",
        testing: "✅",
        infrastructure: "📡",
        network: "🌐",
    };

    const emoji = iconMap[name.toLowerCase()];

    if (!emoji) {
        return null;
    }

    return (
        <span className={`flex items-center justify-center ${className}`} role="img" aria-label={name}>
            {emoji}
        </span>
    );
}
