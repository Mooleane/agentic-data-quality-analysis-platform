import '../styles/globals.css';

export const metadata = {
  title: 'Data Quality Analysis Platform',
  description: 'AI-powered data quality analysis and insights',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#3b82f6',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body>
        <div id="__next">{children}</div>
      </body>
    </html>
  );
}
