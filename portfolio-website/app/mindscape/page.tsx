import MindscapeGraph from '@/components/MindscapeGraph';

export const metadata = {
  title: 'Mindscape | ShirokoKun',
  description: 'Interactive visualization of my knowledge graph, projects, and ideas',
};

export default function MindscapePage() {
  return (
    <main className="w-full h-screen">
      <MindscapeGraph />
    </main>
  );
}
