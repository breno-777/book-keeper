'use client'

import styles from "@styles/page.module.scss";
import { SideBar } from "@/components/sidebar";
import Main from "./pages/main/page";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import Settings from "./pages/settings/page";
import { Loading } from "./pages/loading";
import { useContext, useEffect, useState } from "react";
import { PageContext } from "@/hooks/context/page/PageContext";
import { UploadModal } from "@/components/modals/upload";
import PdfViewer from "@/components/modals/pdf";
import { Login } from "./pages/login";

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

      // updateMessage('Getting all the files...');
      // await delay(1000);
      // const result = await window.electron.getAllBooks('get-books-files');
      // setFiles(result);

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
    // setLoadingMessages('');
  }, []);

  if (!context) return null;
  const { currentPage, setFiles, userId } = context

  return (
    <div className={styles.page}>
      {loadingMessages.length > 0 ? (
        <Loading messages={loadingMessages} />
      ) :
        userId ? (
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
      <UploadModal />
      <div className={styles.notification_container}>

      </div>
    </div >
  );
}
