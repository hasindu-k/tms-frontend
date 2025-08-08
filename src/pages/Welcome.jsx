import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-secondary-green to-primary-green text-white py-4">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-4 sm:mb-0">
            <img className="h-8 w-8 mr-2" src="images/logo_icon.svg" alt="" />
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-[2px]">
              Work Stream
            </h1>
          </div>
          <nav className="flex flex-col sm:flex-row">
            <Link
              to={"/login"}
              className="text-white border border-white py-2 px-4 rounded-[8px] hover:bg-gray-100 hover:text-secondary-green mx-1 mb-2 sm:mb-0"
            >
              Login
            </Link>
            <Link
              to={"/register"}
              className="bg-white text-secondary-green border border-white py-2 px-4 rounded-[8px] hover:bg-inherit hover:text-white mx-1"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-secondary-green tracking-[0.02em]">
            Your Tasks, Organized
          </h2>
          <p className="text-md sm:text-lg mb-6 text-secondary-green">
            Manage your projects and team with ease.
          </p>
          <Link
            to={""}
            className="bg-secondary-green text-white py-3 px-6 rounded-md text-lg hover:bg-secondary-green/90 transition duration-200"
          >
            Get Started
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-white py-6 mt-6">
        <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="text-center transform hover:scale-105 transition-transform duration-300 ease-in-out">
            <img
              src="images/welcome/teamwork2.svg"
              alt="Feature 1"
              className="mx-auto mb-1 w-40 h-40"
            />
            <h3 className="text-xl font-bold text-secondary-green">
              Collaborate
            </h3>
            <p className="text-gray-600">
              Work with your team in real-time to get things done.
            </p>
          </div>
          <div className="text-center transform hover:scale-105 transition-transform duration-300 ease-in-out">
            <img
              src="images/welcome/teamwork1.svg"
              alt="Feature 2"
              className="mx-auto mb-1 w-40 h-40"
            />
            <h3 className="text-xl font-bold text-secondary-green">Organize</h3>
            <p className="text-gray-600">
              Manage tasks with boards, lists, and cards.
            </p>
          </div>
          <div className="text-center transform hover:scale-105 transition-transform duration-300 ease-in-out">
            <img
              src="images/welcome/teamwork3.svg"
              alt="Feature 2"
              className="mx-auto mb-1 w-40 h-40"
            />
            <h3 className="text-xl font-bold text-secondary-green">
              Track Progress
            </h3>
            <p className="text-gray-600">
              Monitor task completion and ensure project success.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-green text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Work Stream. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
