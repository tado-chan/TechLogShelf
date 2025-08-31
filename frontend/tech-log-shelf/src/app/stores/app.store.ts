import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

export interface ReadingRecord {
  id: string;
  bookTitle: string;
  rating: number; // 1-5
  memo: string;
  completedAt: Date;
  stampId?: string; // Associated stamp if completed
}

export interface AnimalStamp {
  id: string;
  name: string;
  emoji: string;
  description: string;
  order: number; // Order of acquisition (1st book, 2nd book, etc.)
}

export interface StampSlot {
  position: { row: number; col: number };
  stamp?: AnimalStamp;
  collectedAt?: Date;
}

interface AppState {
  readingRecords: ReadingRecord[];
  animalStamps: AnimalStamp[];
  stampGrid: StampSlot[][];
  loading: boolean;
  error: string | null;
}

// Create 5x5 empty grid
function createEmptyGrid(): StampSlot[][] {
  const grid: StampSlot[][] = [];
  for (let row = 0; row < 5; row++) {
    grid[row] = [];
    for (let col = 0; col < 5; col++) {
      grid[row][col] = {
        position: { row, col }
      };
    }
  }
  return grid;
}

const initialState: AppState = {
  readingRecords: [
    {
      id: '1',
      bookTitle: 'Learning React',
      rating: 4,
      memo: 'Great introduction to React concepts',
      completedAt: new Date(Date.now() - 172800000), // 2 days ago
      stampId: 'cat'
    }
  ],
  animalStamps: [
    { id: 'cat', name: '猫', emoji: '🐱', description: '1冊完読', order: 1 },
    { id: 'dog', name: '犬', emoji: '🐶', description: '2冊完読', order: 2 },
    { id: 'rabbit', name: 'うさぎ', emoji: '🐰', description: '3冊完読', order: 3 },
    { id: 'fox', name: 'きつね', emoji: '🦊', description: '4冊完読', order: 4 },
    { id: 'bear', name: 'くま', emoji: '🐻', description: '5冊完読', order: 5 },
    { id: 'lion', name: 'ライオン', emoji: '🦁', description: '6冊完読', order: 6 },
    { id: 'elephant', name: 'ぞう', emoji: '🐘', description: '7冊完読', order: 7 },
    { id: 'panda', name: 'パンダ', emoji: '🐼', description: '8冊完読', order: 8 },
    { id: 'tiger', name: 'とら', emoji: '🐯', description: '9冊完読', order: 9 },
    { id: 'monkey', name: 'さる', emoji: '🐵', description: '10冊完読', order: 10 },
    { id: 'pig', name: 'ぶた', emoji: '🐷', description: '11冊完読', order: 11 },
    { id: 'dragon', name: 'りゅう', emoji: '🐲', description: '12冊完読', order: 12 },
    { id: 'penguin', name: 'ペンギン', emoji: '🐧', description: '13冊完読', order: 13 },
    { id: 'koala', name: 'コアラ', emoji: '🐨', description: '14冊完読', order: 14 },
    { id: 'hamster', name: 'ハムスター', emoji: '🐹', description: '15冊完読', order: 15 },
    { id: 'mouse', name: 'ねずみ', emoji: '🐭', description: '16冊完読', order: 16 },
    { id: 'horse', name: 'うま', emoji: '🐴', description: '17冊完読', order: 17 },
    { id: 'cow', name: 'うし', emoji: '🐄', description: '18冊完読', order: 18 },
    { id: 'sheep', name: 'ひつじ', emoji: '🐑', description: '19冊完読', order: 19 },
    { id: 'chicken', name: 'にわとり', emoji: '🐓', description: '20冊完読', order: 20 },
    { id: 'frog', name: 'かえる', emoji: '🐸', description: '21冊完読', order: 21 },
    { id: 'turtle', name: 'かめ', emoji: '🐢', description: '22冊完読', order: 22 },
    { id: 'fish', name: 'さかな', emoji: '🐟', description: '23冊完読', order: 23 },
    { id: 'whale', name: 'くじら', emoji: '🐳', description: '24冊完読', order: 24 },
    { id: 'octopus', name: 'たこ', emoji: '🐙', description: '25冊完読', order: 25 }
  ],
  stampGrid: (() => {
    const grid = createEmptyGrid();
    // Place the first stamp (cat) in first slot since we have 1 reading record
    grid[0][0] = {
      position: { row: 0, col: 0 },
      stamp: { id: 'cat', name: '猫', emoji: '🐱', description: '1冊完読', order: 1 },
      collectedAt: new Date(Date.now() - 172800000)
    };
    return grid;
  })(),
  loading: false,
  error: null
};

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ readingRecords, stampGrid }) => ({
    totalReadingRecords: computed(() => readingRecords().length),
    collectedStamps: computed(() => 
      stampGrid().flat().filter(slot => slot.stamp).map(slot => slot.stamp!)
    ),
    collectedStampsCount: computed(() => 
      stampGrid().flat().filter(slot => slot.stamp).length
    ),
    recentReadingRecord: computed(() => 
      readingRecords()
        .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
        .slice(0, 1)[0] || null
    )
  })),
  withMethods((store) => ({
    addReadingRecord(record: Omit<ReadingRecord, 'id' | 'completedAt'>) {
      const newRecord: ReadingRecord = {
        ...record,
        id: Date.now().toString(),
        completedAt: new Date()
      };
      
      const updatedRecords = [...store.readingRecords(), newRecord];
      const totalCompleted = updatedRecords.length;
      
      // Get the next stamp to award (based on reading order)
      const nextStamp = store.animalStamps().find(stamp => stamp.order === totalCompleted);
      
      let updatedGrid = store.stampGrid();
      
      if (nextStamp) {
        // Find the next empty slot in the 5x5 grid
        const emptySlot = updatedGrid.flat().find(slot => !slot.stamp);
        
        if (emptySlot) {
          // Create new grid with the stamp placed
          updatedGrid = updatedGrid.map(row => 
            row.map(slot => 
              slot.position.row === emptySlot.position.row && 
              slot.position.col === emptySlot.position.col
                ? { ...slot, stamp: nextStamp, collectedAt: new Date() }
                : slot
            )
          );
          
          newRecord.stampId = nextStamp.id;
        }
      }

      patchState(store, { 
        readingRecords: updatedRecords,
        stampGrid: updatedGrid
      });
    },
    updateReadingRecord(id: string, updates: Partial<Omit<ReadingRecord, 'id'>>) {
      patchState(store, {
        readingRecords: store.readingRecords().map(record => 
          record.id === id ? { ...record, ...updates } : record
        )
      });
    },
    deleteReadingRecord(id: string) {
      patchState(store, {
        readingRecords: store.readingRecords().filter(record => record.id !== id)
      });
    },
    getRecordsByStamp(stampId: string) {
      return store.readingRecords().filter(record => record.stampId === stampId);
    },
    setLoading(loading: boolean) {
      patchState(store, { loading });
    },
    setError(error: string | null) {
      patchState(store, { error });
    }
  }))
);