export interface DealsCardProps {
  archOnClick?: () => void;
  archived?: boolean;
  avatarImg?: string;
  className?: string;
  date?: string;
  id?: string;
  isNew?: boolean;
  isWinner?: boolean;
  isQualified?: boolean;
  probability?: number | null; // Use `null` to signal "no value" instead of a boolean
  name?: string;
  offer?: string | { amount: number }; // Simplified type for `offer`
  parentOnClick?: () => void;
  profileId?: string;
  stage?: string;
  lang: string;
}
