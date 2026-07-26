function splitProse(text: string): string[] {
    const parts = text
      .split(/\n+/)
      .flatMap((block) => block.split(/(?<=[。！？；])\s*/))
      .map((part) => part.trim())
      .filter(Boolean);
  
    return parts.length > 0 ? parts : [text];
  }
  
  type DigestProseProps = {
    text: string;
    className?: string;
  };
  
  export function DigestProse({ text, className = "" }: DigestProseProps) {
    const parts = splitProse(text);
  
    if (parts.length === 1) {
      return <p className={`digest-paragraph ${className}`.trim()}>{parts[0]}</p>;
    }
  
    return (
      <div className={`digest-prose ${className}`.trim()}>
        {parts.map((part, index) => (
          <p key={`${index}-${part.slice(0, 12)}`}>{part}</p>
        ))}
      </div>
    );
  }