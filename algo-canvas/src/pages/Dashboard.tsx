import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  GitBranch, 
  Grid3X3, 
  TreeDeciduous,
  ArrowRight,
  Trophy,
  Target,
  Zap,
  TrendingUp,
  ArrowLeftRight,
  Map,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';

const categories = [
  {
    icon: BarChart3,
    title: 'Sorting Algorithms',
    description: 'QuickSort, MergeSort, HeapSort, and more',
    path: '/sorting',
    color: 'from-blue-500 to-cyan-400',
    count: 6,
  },
  {
    icon: ArrowLeftRight,
    title: 'Algorithm Race',
    description: 'Compare two algorithms side-by-side',
    path: '/comparison',
    color: 'from-rose-500 to-orange-400',
    count: 'NEW',
  },
  {
    icon: Map,
    title: 'Pathfinding',
    description: 'A*, Dijkstra, BFS with interactive grid',
    path: '/pathfinding',
    color: 'from-teal-500 to-emerald-400',
    count: 'NEW',
  },
  {
    icon: GitBranch,
    title: 'Graph Algorithms',
    description: 'BFS, DFS, Dijkstra, Prim\'s MST',
    path: '/graph',
    color: 'from-purple-500 to-pink-400',
    count: 8,
  },
  {
    icon: Grid3X3,
    title: 'Dynamic Programming',
    description: 'Knapsack, LCS, Matrix Chain',
    path: '/dp',
    color: 'from-orange-500 to-yellow-400',
    count: 10,
  },
  {
    icon: TreeDeciduous,
    title: 'Data Structures',
    description: 'Trees, Heaps, Linked Lists',
    path: '/structures',
    color: 'from-green-500 to-emerald-400',
    count: 7,
  },
];

const stats = [
  { icon: Trophy, label: 'Algorithms', value: '31', color: 'text-yellow-400' },
  { icon: Target, label: 'Data Structures', value: '8', color: 'text-blue-400' },
  { icon: Zap, label: 'Visualizations', value: 'Real-time', color: 'text-purple-400' },
  { icon: TrendingUp, label: 'Interactive', value: '100%', color: 'text-green-400' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Dashboard = () => {
  return (
    <MainLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Hero Section */}
        <motion.div variants={itemVariants} className="relative overflow-hidden rounded-2xl glass-card p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Master Algorithms with{' '}
              <span className="gradient-text">Visual Learning</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mb-6">
              For Your Brain's Whiteboard ; )
            </p>
            <Link
              to="/sorting"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-primary rounded-lg font-medium text-primary-foreground hover:opacity-90 transition-opacity glow-effect"
            >
              Start Learning
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card rounded-xl p-5 text-center">
              <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Categories */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold mb-6">Algorithm Categories</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {categories.map((category, index) => (
              <Link key={category.title} to={category.path}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-card rounded-xl p-6 group cursor-pointer transition-all duration-300 hover:border-primary/50"
                >
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4`}>
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      category.count === 'NEW' 
                        ? 'bg-gradient-primary text-primary-foreground font-bold animate-pulse' 
                        : 'text-muted-foreground bg-muted'
                    }`}>
                      {category.count === 'NEW' ? 'NEW' : `${category.count} algorithms`}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {category.description}
                  </p>
                  <div className="flex items-center gap-2 text-primary text-sm font-medium">
                    Explore
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Legend */}
        <motion.div variants={itemVariants} className="glass-card rounded-xl p-6">
          <h3 className="font-semibold mb-4">Visualization Color Guide</h3>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bar-unsorted" />
              <span className="text-sm text-muted-foreground">Unsorted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bar-comparing" />
              <span className="text-sm text-muted-foreground">Comparing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bar-swapping" />
              <span className="text-sm text-muted-foreground">Swapping</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bar-sorted" />
              <span className="text-sm text-muted-foreground">Sorted</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </MainLayout>
  );
};

export default Dashboard;
