const ErrorView = ({ error }: { error: string }) => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <p className="text-xl font-bold text-content-muted">{error}</p>
    </div>
  );
};

export default ErrorView;
