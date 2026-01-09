import { motion } from 'framer-motion';
import { Construction, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';

interface ComingSoonProps {
  title: string;
  description: string;
}

const ComingSoon = ({ title, description }: ComingSoonProps) => {
  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] text-center"
      >
        <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center mb-6 animate-glow">
          <Construction className="w-10 h-10 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold mb-3">{title}</h1>
        <p className="text-muted-foreground max-w-md mb-8">{description}</p>
        <Link to="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>
      </motion.div>
    </MainLayout>
  );
};

export const GraphPage = () => (
  <ComingSoon
    title="Graph Algorithms"
    description="BFS, DFS, Dijkstra's, Prim's MST, and Kruskal's algorithms with interactive graph visualization coming soon!"
  />
);

export const DPPage = () => (
  <ComingSoon
    title="Dynamic Programming"
    description="Knapsack, LCS, Matrix Chain Multiplication, and more DP visualizations with step-by-step table filling animations coming soon!"
  />
);

export const StructuresPage = () => (
  <ComingSoon
    title="Data Structures"
    description="Binary Trees, Heaps, AVL Trees, and more data structure visualizations with insert/delete operations coming soon!"
  />
);
