/**
 * Displays a simple centered error message.
 *
 * @param props - Contains the error text to show.
 * @param props.error - The message to render in the UI.
 * @returns A full-size centered error state.
 */
const ErrorView = ({ error }: { error: string }) => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <p className="text-xl font-bold text-content-muted">{error}</p>
    </div>
  );
};

export default ErrorView;
