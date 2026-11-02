import { HashLoader } from "react-spinners";

/**
 * Full-page centered loading indicator used while data is being fetched.
 *
 * @returns A React element that shows a spinner in the center of the available space.
 */
const LoadingSpinner = () => {
  return (
    <div className="w-full h-full flex justify-center items-center flex-col">
      <HashLoader />
    </div>
  );
};

export default LoadingSpinner;
