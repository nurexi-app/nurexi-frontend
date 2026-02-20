import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href={"/"}
      className="flex items-center gap-2 font-bold text-xl text-foreground"
    >
      <Image src="/Logo.svg" height={31} width={31} alt="logo" />
      Nurexi
    </Link>
  );
}
