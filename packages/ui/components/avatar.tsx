import Image from "next/image";

interface AvatarProps {
  initial: string;
  size: 32 | 64;
  src?: string | null;
}

export function Avatar({ initial, size, src }: AvatarProps) {
  return (
    <span
      className="grid shrink-0 place-items-center overflow-hidden rounded-full bg-avatar font-medium text-green-text"
      style={{ width: size, height: size, fontSize: size === 32 ? 13 : 22 }}
      aria-hidden
    >
      {src ? (
        <Image
          src={src}
          alt=""
          width={size}
          height={size}
          unoptimized
          className="size-full object-cover"
        />
      ) : (
        initial
      )}
    </span>
  );
}
