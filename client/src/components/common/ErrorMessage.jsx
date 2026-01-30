function ErrorMessage({ message }) {
  return (
    <div className="bg-red-900 bg-opacity-50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
      <p className="font-medium">Error</p>
      <p className="text-sm">{message || 'Something went wrong. Please try again.'}</p>
    </div>
  );
}

export default ErrorMessage;
