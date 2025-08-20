import { getTranslations } from "next-intl/server";

interface SettingsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  await params;
  const t = await getTranslations("Dashboard");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t("quickActions.settings")}</h1>
        <p className="text-muted-foreground mt-2">管理系統設定和偏好</p>
      </div>

      <div className="bg-white rounded-lg border p-8 text-center">
        <p className="text-muted-foreground">此頁面正在開發中...</p>
      </div>
    </div>
  );
}
