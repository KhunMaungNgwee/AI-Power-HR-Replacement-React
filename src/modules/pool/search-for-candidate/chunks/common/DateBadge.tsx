export const DateBadge = ({ date }: { date: string }) => {
  return (
    <p className="bg-primary text-nowrap inline-block px-6 py-2 text-[0.7rem] text-white rounded-lg">
      {date}
    </p>
  );
};
