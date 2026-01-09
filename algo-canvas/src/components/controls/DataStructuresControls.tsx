import { useDataStructuresStore, DataStructureType } from '@/store/dataStructuresStore';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Plus, Minus, Search, Trash2, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

const structures: { value: DataStructureType; label: string; description: string }[] = [
  { value: 'binary-tree', label: 'Binary Tree', description: 'Basic tree with at most 2 children per node' },
  { value: 'bst', label: 'Binary Search Tree', description: 'Ordered binary tree for efficient search' },
  { value: 'avl', label: 'AVL Tree', description: 'Self-balancing BST' },
  { value: 'heap', label: 'Min/Max Heap', description: 'Priority queue implementation' },
  { value: 'linked-list', label: 'Linked List', description: 'Sequential nodes with pointers' },
  { value: 'stack', label: 'Stack', description: 'LIFO data structure' },
  { value: 'queue', label: 'Queue', description: 'FIFO data structure' },
  { value: 'hash-table', label: 'Hash Table', description: 'Key-value storage with hashing' },
];

export const DataStructuresControls = () => {
  const {
    structureType,
    setStructureType,
    speed,
    setSpeed,
    isMaxHeap,
    setIsMaxHeap,
    insertToTree,
    deleteFromTree,
    searchInTree,
    insertAtHead,
    insertAtTail,
    deleteByValue,
    push,
    pop,
    peek,
    enqueue,
    dequeue,
    insertToHeap,
    extractFromHeap,
    hashInsert,
    hashDelete,
    hashSearch,
    resetVisualization,
    generateRandomTree,
    generateRandomList,
    generateRandomHeap,
  } = useDataStructuresStore();

  const [inputValue, setInputValue] = useState<string>('');
  const [keyValue, setKeyValue] = useState<string>('');

  const selectedStructure = structures.find((s) => s.value === structureType);

  const handleInsert = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) return;
    
    switch (structureType) {
      case 'binary-tree':
      case 'bst':
      case 'avl':
        insertToTree(value);
        break;
      case 'linked-list':
        insertAtTail(value);
        break;
      case 'stack':
        push(value);
        break;
      case 'queue':
        enqueue(value);
        break;
      case 'heap':
        insertToHeap(value);
        break;
      case 'hash-table':
        if (keyValue) {
          hashInsert(keyValue, value);
        }
        break;
    }
    setInputValue('');
    setKeyValue('');
  };

  const handleDelete = () => {
    const value = parseInt(inputValue);
    
    switch (structureType) {
      case 'binary-tree':
      case 'bst':
      case 'avl':
        if (!isNaN(value)) deleteFromTree(value);
        break;
      case 'linked-list':
        if (!isNaN(value)) deleteByValue(value);
        break;
      case 'stack':
        pop();
        break;
      case 'queue':
        dequeue();
        break;
      case 'heap':
        extractFromHeap();
        break;
      case 'hash-table':
        if (keyValue) hashDelete(keyValue);
        break;
    }
  };

  const handleSearch = () => {
    const value = parseInt(inputValue);
    
    switch (structureType) {
      case 'binary-tree':
      case 'bst':
      case 'avl':
        if (!isNaN(value)) searchInTree(value);
        break;
      case 'stack':
      case 'queue':
        peek();
        break;
      case 'hash-table':
        if (keyValue) hashSearch(keyValue);
        break;
    }
  };

  const handleGenerateSample = () => {
    switch (structureType) {
      case 'binary-tree':
      case 'bst':
      case 'avl':
        generateRandomTree(7);
        break;
      case 'linked-list':
        generateRandomList(5);
        break;
      case 'heap':
        generateRandomHeap(7);
        break;
    }
  };

  const renderOperationButtons = () => {
    switch (structureType) {
      case 'stack':
        return (
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleInsert} size="sm" className="flex-1 min-w-[70px] flex items-center justify-center gap-1">
              <ArrowDown className="w-4 h-4" /> Push
            </Button>
            <Button onClick={handleDelete} size="sm" variant="destructive" className="flex-1 min-w-[70px] flex items-center justify-center gap-1">
              <ArrowUp className="w-4 h-4" /> Pop
            </Button>
            <Button onClick={handleSearch} size="sm" variant="outline" className="flex-1 min-w-[70px] flex items-center justify-center gap-1">
              <Search className="w-4 h-4" /> Peek
            </Button>
          </div>
        );
      
      case 'queue':
        return (
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleInsert} size="sm" className="flex-1 min-w-[80px] flex items-center justify-center gap-1">
              <ArrowRight className="w-4 h-4" /> Enqueue
            </Button>
            <Button onClick={handleDelete} size="sm" variant="destructive" className="flex-1 min-w-[80px] flex items-center justify-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Dequeue
            </Button>
            <Button onClick={handleSearch} size="sm" variant="outline" className="flex-1 min-w-[70px] flex items-center justify-center gap-1">
              <Search className="w-4 h-4" /> Peek
            </Button>
          </div>
        );
      
      case 'heap':
        return (
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleInsert} size="sm" className="flex-1 min-w-[80px] flex items-center justify-center gap-1">
              <Plus className="w-4 h-4" /> Insert
            </Button>
            <Button onClick={handleDelete} size="sm" variant="destructive" className="flex-1 min-w-[80px] flex items-center justify-center gap-1">
              <Minus className="w-4 h-4" /> Extract
            </Button>
          </div>
        );
      
      default:
        return (
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleInsert} size="sm" className="flex-1 min-w-[70px] flex items-center justify-center gap-1">
              <Plus className="w-4 h-4" /> Insert
            </Button>
            <Button onClick={handleDelete} size="sm" variant="destructive" className="flex-1 min-w-[70px] flex items-center justify-center gap-1">
              <Minus className="w-4 h-4" /> Delete
            </Button>
            <Button onClick={handleSearch} size="sm" variant="outline" className="flex-1 min-w-[70px] flex items-center justify-center gap-1">
              <Search className="w-4 h-4" /> Search
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="glass-card rounded-xl p-4 space-y-6">
      <div className="space-y-3">
        <Label className="text-sm font-medium">Data Structure</Label>
        <Select value={structureType} onValueChange={(v) => setStructureType(v as DataStructureType)}>
          <SelectTrigger className="w-full bg-slate-800 border-slate-700">
            <SelectValue placeholder="Select structure" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            {structures.map((s) => (
              <SelectItem key={s.value} value={s.value} className="focus:bg-slate-700">
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedStructure && (
          <p className="text-xs text-muted-foreground">{selectedStructure.description}</p>
        )}
      </div>

      {structureType === 'heap' && (
        <div className="flex items-center gap-4">
          <Button
            variant={!isMaxHeap ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIsMaxHeap(false)}
          >
            Min Heap
          </Button>
          <Button
            variant={isMaxHeap ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIsMaxHeap(true)}
          >
            Max Heap
          </Button>
        </div>
      )}

      <div className="space-y-3">
        <Label className="text-sm font-medium">Value</Label>
        {structureType === 'hash-table' && (
          <Input
            type="text"
            placeholder="Key"
            value={keyValue}
            onChange={(e) => setKeyValue(e.target.value)}
            className="bg-slate-800 border-slate-700 mb-2"
          />
        )}
        <Input
          type="number"
          placeholder={structureType === 'hash-table' ? 'Value' : 'Enter value'}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
          className="bg-slate-800 border-slate-700"
        />
      </div>

      {renderOperationButtons()}

      <div className="space-y-3">
        <Label className="text-sm font-medium">Animation Speed: {speed}ms</Label>
        <Slider
          value={[speed]}
          onValueChange={([v]) => setSpeed(v)}
          min={50}
          max={2000}
          step={50}
          className="w-full"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          onClick={handleGenerateSample}
          variant="secondary"
          size="sm"
          className="flex-1 min-w-[100px] flex items-center justify-center gap-2"
        >
          Sample Data
        </Button>
        <Button onClick={resetVisualization} variant="outline" size="sm" className="flex-1 min-w-[80px] flex items-center justify-center gap-2">
          <Trash2 className="w-4 h-4" />
          Clear
        </Button>
      </div>

      <div className="pt-4 border-t border-slate-700 space-y-2">
        <h4 className="text-sm font-medium">Time Complexity</h4>
        <div className="text-xs text-muted-foreground font-mono space-y-1">
          {structureType === 'binary-tree' && (
            <>
              <p>Insert: O(n) | Search: O(n) | Delete: O(n)</p>
            </>
          )}
          {structureType === 'bst' && (
            <>
              <p>Insert: O(h) | Search: O(h) | Delete: O(h)</p>
              <p className="text-yellow-400">h = log n (balanced) or n (skewed)</p>
            </>
          )}
          {structureType === 'avl' && (
            <>
              <p>Insert: O(log n) | Search: O(log n) | Delete: O(log n)</p>
              <p className="text-green-400">Always balanced!</p>
            </>
          )}
          {structureType === 'heap' && (
            <>
              <p>Insert: O(log n) | Extract: O(log n) | Peek: O(1)</p>
            </>
          )}
          {structureType === 'linked-list' && (
            <>
              <p>Insert (head): O(1) | Insert (tail): O(n)</p>
              <p>Search: O(n) | Delete: O(n)</p>
            </>
          )}
          {structureType === 'stack' && (
            <>
              <p>Push: O(1) | Pop: O(1) | Peek: O(1)</p>
            </>
          )}
          {structureType === 'queue' && (
            <>
              <p>Enqueue: O(1) | Dequeue: O(1) | Peek: O(1)</p>
            </>
          )}
          {structureType === 'hash-table' && (
            <>
              <p>Insert: O(1) avg | Search: O(1) avg | Delete: O(1) avg</p>
              <p className="text-yellow-400">O(n) worst case (collisions)</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
