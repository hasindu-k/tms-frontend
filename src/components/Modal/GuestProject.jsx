function GuestProject({ onCreateProject }) {
  return (
    <div className="flex flex-col w-full items-center justify-center h-[85vh] md:h-[83vh] lg:h-[85.4vh] bg-gray-100 text-center">
      <h1 className="text-4xl font-bold text-secondary-green mb-4">Welcome!</h1>
      <p className="text-xl text-gray-600 mb-8">
        Create your own project and get started
      </p>
      <button
        className="px-6 py-3 bg-secondary-green text-white text-lg font-semibold rounded-md hover:bg-primary-green transition duration-300"
        onClick={onCreateProject}
      >
        Create Project
      </button>
    </div>
  );
}

export default GuestProject;
