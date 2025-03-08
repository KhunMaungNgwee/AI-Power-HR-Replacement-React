import { CandidateData } from "@/api/candidate/types";
import { ApexOptions } from "apexcharts";
import { useEffect, useMemo, useState } from "react";
import Chart from "react-apexcharts";
import { useTranslation } from "react-i18next";

interface ChartAndVideoProps {
  data?: CandidateData;
}

const ChartAndVideo = ({ data }: ChartAndVideoProps) => {
  const { t, i18n } = useTranslation();
  const [series, setSeries] = useState([
    { name: t("common.chart"), data: [] as number[] },
  ]);
  const [xAxisCategories, setXAxisCategories] = useState<string[][]>([]);

  const chartOptions: ApexOptions = useMemo(
    () => ({
      chart: { height: 600, type: "radar" },
      dataLabels: { enabled: false },
      plotOptions: {
        radar: {
          size: 120,
          polygons: {
            strokeColors: "#e9e9e9",
            fill: { colors: ["#f8f8f8", "#fff"] },
          },
        },
      },
      title: { text: t("common.chart") },
      yaxis: { show: false },
      colors: ["#FF4560"],
      xaxis: { categories: xAxisCategories },
      responsive: [
        {
          breakpoint: 640,
          options: {
            chart: { height: 400 },
            plotOptions: { radar: { size: 75 } },
            xaxis: {
              categories: xAxisCategories,
              labels: { style: { fontSize: "9px" } },
            },
          },
        },
      ],
    }),
    [t, xAxisCategories]
  );

  useEffect(() => {
    if (data) {
      setSeries([
        {
          name: t("common.chart"),
          data: data.questionAndAnswerAnalysis?.map((qna) => qna.score) || [],
        },
      ]);

      setXAxisCategories(
        data.questionAndAnswerAnalysis?.map((qna) => {
          let index = 20;
          const question =
            i18n.language === "en" ? qna.questionEnglish : qna.questionThai;

          // break question into two line
          while (index < question.length && question[index] !== " ") {
            index++;
          }

          return [question.slice(0, index), question.slice(index)];
        }) || []
      );
    }
  }, [data, t, i18n.language]);

  return (
    <section className="flex gap-3 pr-6 bg-white rounded-lg shadow">
      <div className="text-primary-foreground flex items-center justify-center w-10 min-h-full bg-gray-900 rounded-l-lg">
        <h4 className="whitespace-nowrap -rotate-90">
          {t("common.chart-and-video")}
        </h4>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 w-full gap-4 my-3 mb-4">
        <div
          id="chart"
          className="col-span-1 lg:col-span-3 p-3  border-b sm:border-b-0 sm:border-r"
        >
          <Chart type="radar" options={chartOptions} series={series} />
        </div>

        <div className="col-span-1 lg:col-span-2 flex flex-col gap-2">
          <h6 className="font-semibold text-[15px] mb-1">
            {t("common.video")}:
          </h6>
          <div className="bg-muted flex items-center justify-center w-full h-full min-h-[160px] rounded">
            {data?.videoUrl ? (
              <video
                src={data.videoUrl}
                controls
                className="aspect-video w-full h-auto"
              ></video>
            ) : (
              <span className="animate-pulse text-primary-foreground text-xs text-center">
                {t("common.processing")}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChartAndVideo;
