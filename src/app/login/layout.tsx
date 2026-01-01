export const metadata = {
  title: "Login - Panel Admin",
  description: "Panel Admin Markaz Al-Hijrah",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
