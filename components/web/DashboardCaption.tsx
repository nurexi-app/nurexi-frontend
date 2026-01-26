const DashboardCaption = ({
  heading,
  text,
}: {
  heading: string;
  text: string;
}) => {
  return (
    <div className="h-29.25 px-4 bg-linear-to-r text-white/82 overflow-hidden from-[#0C3A5F] to-[#6CB4EE] flex flex-col justify-center relative gap-2">
      <h2 className="t">{heading}</h2>
      <p>{text}</p>

      <div className="absolute -right-14 translate-x-1 bg-radial from-[#a9ceec] to-[#388fd6] rounded-full h-24 w-24"></div>
      <div className="absolute -right-14 translate-x-1 bg-radial from-[#a9ceec62] to-[#0e283d1c] rounded-full h-27 w-27"></div>
      <div className="absolute -right-14 translate-x-1 bg-radial from-[#1b304162] to-[#222f3a1c] rounded-full h-35 w-35"></div>
    </div>
  );
};

export default DashboardCaption;
