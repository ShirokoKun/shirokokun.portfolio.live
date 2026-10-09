import StatusBar from '@/components/site/StatusBar';
import PageFooter from '@/components/site/PageFooter';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StatusBar />
      <main id="main">{children}</main>
      <PageFooter />
    </>
  );
}
