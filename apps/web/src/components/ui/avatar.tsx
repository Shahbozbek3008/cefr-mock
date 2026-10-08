export function Avatar({ initial, size }: { initial: string; size: 32 | 64 }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full bg-avatar font-medium text-green-text"
      style={{ width: size, height: size, fontSize: size === 32 ? 13 : 22 }}
      aria-hidden
    >
      {initial}
    </span>
  );
}
