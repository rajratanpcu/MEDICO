import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center 
                    bg-gray-950 text-white px-4">
      <h1 className="text-[120px] font-extrabold text-blue-500 leading-none">
        404
      </h1>
      <div className="text-6xl mb-4">🏥</div>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-gray-400 text-center max-w-md mb-8">
        The medical record you're looking for doesn't exist or has been moved.
        Please check the URL or return to the dashboard.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 
                     rounded-lg font-medium transition-colors"
        >
          🏠 Go to Dashboard
        </button>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 
                     rounded-lg font-medium transition-colors"
        >
          ← Go Back
        </button>
      </div>
      <p className="mt-12 text-gray-600 text-sm">
        MEDICO — AI-Powered Smart Medical Assistant
      </p>
    </div>
  );
};

export default NotFound;