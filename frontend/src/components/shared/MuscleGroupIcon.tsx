import type { MuscleGroup } from "@/schemas"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const MUSCLE_GROUP_ICON_NAMES: Record<MuscleGroup, string> = {
  Chest: "chest",
  Back: "back",
  Legs: "legs",
  Shoulders: "shoulder",
  Arms: "arms",
  Core: "core",
  Cardio: "cardio",
}

interface MuscleGroupIconProps {
  muscleGroup: MuscleGroup
  className?: string
  dark?: boolean
}

export function getMuscleGroupIconSrc(muscleGroup: MuscleGroup, dark = false) {
  const iconName = MUSCLE_GROUP_ICON_NAMES[muscleGroup]
  return `/muscle-groups/muscle-${iconName}${dark ? "-dark" : ""}.svg`
}

export function MuscleGroupIcon({
  muscleGroup,
  className,
  dark = false,
}: MuscleGroupIconProps) {
  return (
    <img
      src={getMuscleGroupIconSrc(muscleGroup, dark)}
      alt=""
      aria-hidden="true"
      className={cn("block size-5 object-contain", className)}
      loading="lazy"
      decoding="async"
    />
  )
}

interface MuscleGroupBadgeProps {
  muscleGroup: MuscleGroup
  className?: string
  iconClassName?: string
  darkIcon?: boolean
}

export function MuscleGroupBadge({
  muscleGroup,
  className,
  iconClassName,
  darkIcon = false,
}: MuscleGroupBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn("gap-1.5 pl-1 pr-2 uppercase tracking-[0.05em]", className)}
    >
      <span className="grid size-4 shrink-0 place-items-center rounded-full bg-card">
        <MuscleGroupIcon
          muscleGroup={muscleGroup}
          dark={darkIcon}
          className={cn("size-3.5", iconClassName)}
        />
      </span>
      {muscleGroup}
    </Badge>
  )
}
