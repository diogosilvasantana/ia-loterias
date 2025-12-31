import { motion } from "framer-motion";
import { cn } from "../lib/utils";

interface LotteryBallProps {
    number: number;
    featured?: boolean; // For "Hot" numbers or special display
    delay?: number; // Animation delay
    className?: string;
    size?: "sm" | "md" | "lg";
}

export const LotteryBall = ({
    number,
    featured = false,
    delay = 0,
    className,
    size = "md"
}: LotteryBallProps) => {
    const sizeClasses = {
        sm: "w-8 h-8 text-sm",
        md: "w-10 h-10 text-base",
        lg: "w-12 h-12 text-lg",
    };

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0, rotate: -180 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: delay
            }}
            className={cn(
                "rounded-full flex items-center justify-center font-mono font-bold shadow-xl border-t border-white/20 relative overflow-hidden",
                featured
                    ? "bg-[radial-gradient(circle_at_30%_30%,_#fbbf24,_#d97706)] text-amber-950 shadow-amber-500/30"
                    : "bg-[radial-gradient(circle_at_30%_30%,_#f8fafc,_#94a3b8)] text-slate-900 shadow-slate-200/10",
                sizeClasses[size],
                className
            )}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.8)_0%,_transparent_25%)]" />
            <span className="relative z-10">{number.toString().padStart(2, "0")}</span>
        </motion.div>
    );
};
