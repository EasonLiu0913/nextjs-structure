import { getTranslations } from "next-intl/server";

interface AnalyticsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AnalyticsPage({ params }: AnalyticsPageProps) {
  await params;
  const t = await getTranslations("Dashboard");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t("quickActions.analytics")}</h1>
        <p className="text-muted-foreground mt-2">查看詳細的分析數據和趨勢</p>
      </div>

      <div className="bg-white rounded-lg border p-8 text-center">
        <p className="text-muted-foreground">此頁面正在開發中...</p>
      </div>
    </div>
  );
}
