import { useState, useEffect, useContext } from "react";
import UserContext from "../../context/UserContex";
import ChartPieDonutText from "../chart/PieChart/PieDonutChartText";
import ChartBarStacked from "../chart/BarChart/ChartBarStacked";
import ChatDemo from "../chat/chat";

function Home() {
  const { name } = useContext(UserContext);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("http://localhost:3000/depense/statistic", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Erreur lors du chargement des données", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleChat = () => {
    setIsChatVisible(!isChatVisible);
  };

  return (
    <div className="p-4 space-y-6">
      <h3 className="text-lg font-semibold mb-4">
        Bienvenue {name?.lastname} {name?.firstname}
      </h3>

      <div className="flex flex-col min-[1952px]:flex-row gap-4">
        <div className="flex-1">
          <ChartPieDonutText data={data} isLoading={isLoading} />
        </div>
        <div className="flex-1">
          <ChartBarStacked data={data} isLoading={isLoading} />
        </div>  
      </div>

      {!isChatVisible && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-all duration-200 z-50 hover:scale-105 cursor-pointer"
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
            />
          </svg>
        </button>
      )}

      {isChatVisible && (
        <div className="fixed bottom-0 right-6 w-96 z-40">
          <div className="bg-white rounded-lg shadow-lg border p-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-base font-medium">Assistant</h4>
              <button
                onClick={toggleChat}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="h-120 overflow-auto">
              <ChatDemo />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;