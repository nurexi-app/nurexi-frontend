const Star = ({
  className,
  ratingNumber = 5,
}: {
  className: string;
  ratingNumber: number;
}) => {
  return (
    <div className="flex items-center ">
      {Array.from({ length: ratingNumber }, (_, index) => (
        <svg
          key={index}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            fill="#FFC107"
          />
        </svg>
      ))}
    </div>
  );
};

export default Star;
