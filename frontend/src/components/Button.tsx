interface ButtonProps {
  label: string;
  buttonType?: "button" | "submit" | "reset";
  onClick?: () => void;
}

const Button = ({
  label,
  buttonType = "button",
  onClick = () => {},
}: ButtonProps) => {
  return (
    <button
      type={buttonType}
      onClick={onClick}
      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md
                 shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      {label}
    </button>
  );
};

export default Button;
