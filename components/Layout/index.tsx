// import { Footer } from '../Footer';
import { Header } from "../Header";
import styles from "./Layout.module.css";

interface LayoutProps {
  children: any;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main className={styles.main}>{children}</main>
      {/* <Footer /> */}
    </>
  );
};
