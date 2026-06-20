export type ToolFrameProps = {
  src: string;
  title: string;
};

export function ToolFrame({ src, title }: ToolFrameProps) {
  return (
    <div className="flex flex-col h-screen min-h-0 bg-[#f6f6f3]">
      <iframe src={src} title={title} className="flex-1 w-full h-full border-0 min-h-0" />
    </div>
  );
}
