import { ReactNode } from "react";
import { Link } from "wouter";
import { Book } from "lucide-react";
import { APP_TITLE } from "@/const";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ヘッダー */}
      <header className="bg-slate-800 text-white shadow-md sticky top-0 z-40">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                <Book className="w-8 h-8" />
                <h1 className="text-2xl font-bold">{APP_TITLE}</h1>
              </div>
            </Link>
{/* TODO: 機能実装後に復活させる
            <nav className="hidden md:flex gap-6">
              <Link href="/" className="hover:underline">
                ホーム
              </Link>
              <a href="#" className="hover:underline">
                ランキング
              </a>
              <a href="#" className="hover:underline">
                タグ一覧
              </a>
            </nav>
            */}
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1">{children}</main>

      {/* フッター */}
      <footer className="bg-muted py-8 mt-auto">
        <div className="container text-center text-muted-foreground">
          <p className="text-sm">
            © 2025 {APP_TITLE}. Qiita記事から技術書ランキングを集計しています。
          </p>
        </div>
      </footer>
    </div>
  );
}

