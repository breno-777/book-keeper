'use client'

import styles from "@styles/page.module.scss";
import Loading from "./pages/loading/page";
import Settings from "./pages/settings/page";
import Main from "./pages/main/page";
import PdfViewer from "@/components/modals/pdf";
import { SideBar } from "@/components/sidebar";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { useContext, useEffect, useState } from "react";
import { PageContext } from "@/hooks/context/page/PageContext";
import { UploadModal } from "@/components/modals/upload";
import { Login } from "./pages/login/page";

export default function Home() {
  const context = useContext(PageContext);
  const [loadingMessages, setLoadingMessages] = useState<string>('Loading...');

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const loadData = async () => {
    const updateMessage = (msg: string) => {
      setLoadingMessages(msg);
    };

    try {
      updateMessage('Checking for updates...');
      await window.electron.startFunction('check-for-updates');

      updateMessage('Creating necessary directories...');
      await delay(1000);
      await window.electron.startFunction('check-necessary-directories');

      setLoadingMessages('');
    } catch (error) {
      console.error('Error loading data:', error);
      setLoadingMessages('Failed to load data. Please check the console for more details.');
    }
  };

  const renderPage = () => {
    if (currentPage === 'all-books') {
      return <Main />
    } else if (currentPage === 'settings') {
      return <Settings />
    }
    return <p>Page not found</p>;
  }

  useEffect(() => {
    loadData();
  }, []);

  if (!context) return null;
  const { currentPage, user, isUploadModalOpen } = context;

  return (
    <div className={styles.page}>
      {loadingMessages.length > 0 ? (
        <Loading messages={loadingMessages} />
      ) :
        user ? (
          <main className={styles.main} >
            <div className={styles.sidebar}>
              <SideBar />
            </div>
            <div className={styles.render_page}>
              <div className={styles.footer_container}>
                <Header />
              </div>
              {renderPage()}
              <div className={styles.footer_container}>
                <Footer />
              </div>
            </div>
          </main>
        ) : (
          <Login />
        )}

      <PdfViewer />
      {user && isUploadModalOpen && <UploadModal />}
      <div className={styles.notification_container}>

      </div>
    </div >
  );
}
