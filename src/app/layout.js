import { Inter } from 'next/font/google';
import { MswComponent } from './components/MswComponent';
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: '오마이드로우',
  description: 'Just Simple Draw App',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <MswComponent>{children}</MswComponent>
      </body>
    </html>
  );
}
