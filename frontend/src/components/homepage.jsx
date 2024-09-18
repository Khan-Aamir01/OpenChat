import { Link } from 'react-router-dom';

const Homepage = ()=>{

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-950">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">OpenChat</h1>
        <div className="flex flex-col space-y-4">
          <button className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300">
            <Link to="/create">Create Chat </Link>
          </button>
          <button className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300">
            <Link to="/join">Join Chat </Link>
          </button>
        </div>
      </div>
      );

}
export default Homepage;