interface HeaderCardProps {
  lakeCount: number;
}

export function HeaderCard({ lakeCount }: HeaderCardProps) {
  return (
    <div className="absolute top-4 left-4 z-40 rounded-2xl bg-white/90 backdrop-blur-sm shadow-md border border-slate-100 px-4 py-3 w-[240px]">
      <div
        className="text-2xl text-slate-800 leading-none"
        style={{ fontFamily: '"DM Serif Display", serif' }}
      >
        Limnos
      </div>
      <div className="text-xs text-slate-500 mt-1">Bangalore Lake Monitor</div>
      <div className="mt-3 flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-sky-300" />
          <span className="text-xs text-slate-600">Lake</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-sky-500" />
          <span className="text-xs text-slate-600">Selected</span>
        </div>
      </div>
      <div className="text-xs text-slate-400 mt-2">{lakeCount} lakes monitored</div>
    </div>
  );
}

export default HeaderCard;
