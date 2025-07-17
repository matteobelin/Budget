import { useState, useEffect, useContext } from "react";
import UserContext from "../../context/UserContex";
import ChartPieDonutText from "../chart/PieChart/PieDonutChartText";
import ChartBarStacked from "../chart/BarChart/ChartBarStacked";

function Home() {
  const { name } = useContext(UserContext);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className="p-4">
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
    </div>
  );
}

export default Home;
