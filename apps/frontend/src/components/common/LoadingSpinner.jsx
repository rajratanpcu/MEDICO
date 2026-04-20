const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="animate-spin rounded-full h-12 w-12 
                      border-b-2 border-cyan-400 mb-4"></div>
      <p className="text-slate-400 text-sm">{message}</p>
    </div>
  );
};

export default LoadingSpinner;