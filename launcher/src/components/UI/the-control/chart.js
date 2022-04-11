import { Chart, Legend, Title, Tooltip } from "chart.js";

Chart.register(Legend, Title, Tooltip);

Chart.defaults.color = "grey";
Chart.defaults.borderColor = "#323331";
// Chart.defaults.font.family = "'Fira Sans', 'sans-serif'";
Chart.defaults.font.size = 16;
Chart.defaults.font.lineHeight = 1.5;
Chart.defaults.layout.padding = 16;
Chart.defaults.plugins.legend.position = "bottom";
Chart.defaults.plugins.title.display = true;
Chart.defaults.plugins.title.padding = 16;
