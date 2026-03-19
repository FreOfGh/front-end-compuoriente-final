import Image from "next/image";

export default function BrandLogo({
  className,
  label,
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div className={className ?? "flex items-center gap-2"}>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-700 text-white shadow-sm">
        <span className="text-lg font-semibold">E</span>
      </div>
      <div className="hidden flex-col sm:flex">
        <span className="text-sm font-semibold">{label ?? "EduPro"}</span>
        <span className="text-xs text-slate-500">Portal estudiantil</span>
      </div>
    </div>
  );
}
