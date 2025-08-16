import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";

// Register chart elements
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const SentimentChart = ({ data }) => {
  const counts = { positive: 0, negative: 0, neutral: 0 };

  if (Array.isArray(data)) {
    data.forEach((c) => {
      if (c.score > 0) counts.positive++;
      else if (c.score < 0) counts.negative++;
      else counts.neutral++;
    });
  }

  const chartData = {
    labels: ["Positive 😀", "Negative 😡", "Neutral 😐"],
    datasets: [
      {
        label: "Feedback Sentiment",
        data: [counts.positive, counts.negative, counts.neutral],
        backgroundColor: ["#4CAF50", "#F44336", "#FFC107"],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Sentiment Analysis Results" },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default SentimentChart;
