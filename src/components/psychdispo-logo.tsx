type PsychDispoLogoProps = {
  className?: string;
};

export function PsychDispoLogo({ className }: PsychDispoLogoProps) {
  return (
    <span className={className ? `site-wordmark ${className}` : "site-wordmark"}>
      Psych<i>Dispo</i>
    </span>
  );
}
