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
  isCollected: boolean;
  collectedAt?: Date;
  position: { row: number; col: number }; // For grid layout
}

interface AppState {
  readingRecords: ReadingRecord[];
  animalStamps: AnimalStamp[];
  loading: boolean;
  error: string | null;
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
    { id: 'cat', name: '猫', emoji: '🐱', description: '初回完読', isCollected: true, collectedAt: new Date(Date.now() - 172800000), position: { row: 0, col: 0 } },
    { id: 'dog', name: '犬', emoji: '🐶', description: '2冊完読', isCollected: false, position: { row: 0, col: 1 } },
    { id: 'rabbit', name: 'うさぎ', emoji: '🐰', description: '3冊完読', isCollected: false, position: { row: 0, col: 2 } },
    { id: 'bear', name: 'くま', emoji: '🐻', description: '5冊完読', isCollected: false, position: { row: 0, col: 3 } },
    { id: 'fox', name: 'きつね', emoji: '🦊', description: '7冊完読', isCollected: false, position: { row: 1, col: 0 } },
    { id: 'lion', name: 'ライオン', emoji: '🦁', description: '10冊完読', isCollected: false, position: { row: 1, col: 1 } },
    { id: 'elephant', name: 'ぞう', emoji: '🐘', description: '15冊完読', isCollected: false, position: { row: 1, col: 2 } },
    { id: 'panda', name: 'パンダ', emoji: '🐼', description: '20冊完読', isCollected: false, position: { row: 1, col: 3 } },
    { id: 'tiger', name: 'とら', emoji: '🐯', description: '25冊完読', isCollected: false, position: { row: 2, col: 0 } },
    { id: 'monkey', name: 'さる', emoji: '🐵', description: '30冊完読', isCollected: false, position: { row: 2, col: 1 } },
    { id: 'pig', name: 'ぶた', emoji: '🐷', description: '40冊完読', isCollected: false, position: { row: 2, col: 2 } },
    { id: 'dragon', name: 'りゅう', emoji: '🐲', description: '50冊完読', isCollected: false, position: { row: 2, col: 3 } }
  ],
  loading: false,
  error: null
};

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ readingRecords, animalStamps }) => ({
    totalReadingRecords: computed(() => readingRecords().length),
    collectedStamps: computed(() => animalStamps().filter(stamp => stamp.isCollected)),
    collectedStampsCount: computed(() => animalStamps().filter(stamp => stamp.isCollected).length),
    recentReadingRecord: computed(() => 
      readingRecords()
        .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
        .slice(0, 1)[0] || null
    ),
    stampGrid: computed(() => {
      const grid: (AnimalStamp | null)[][] = Array(3).fill(null).map(() => Array(4).fill(null));
      animalStamps().forEach(stamp => {
        grid[stamp.position.row][stamp.position.col] = stamp;
      });
      return grid;
    })
  })),
  withMethods((store) => ({
    addReadingRecord(record: Omit<ReadingRecord, 'id' | 'completedAt'>) {
      const newRecord: ReadingRecord = {
        ...record,
        id: Date.now().toString(),
        completedAt: new Date()
      };
      
      const updatedRecords = [...store.readingRecords(), newRecord];
      
      // Check for stamp collection based on total completed books
      const totalCompleted = updatedRecords.length;
      const updatedStamps = store.animalStamps().map(stamp => {
        const requiredBooks = this.getRequiredBooksForStamp(stamp.id);
        if (!stamp.isCollected && totalCompleted >= requiredBooks) {
          return {
            ...stamp,
            isCollected: true,
            collectedAt: new Date()
          };
        }
        return stamp;
      });

      // Assign stamp to the new record if a new stamp was collected
      const newlyCollectedStamp = updatedStamps.find(stamp => 
        stamp.isCollected && 
        !store.animalStamps().find(s => s.id === stamp.id)?.isCollected
      );

      if (newlyCollectedStamp) {
        newRecord.stampId = newlyCollectedStamp.id;
      }

      patchState(store, { 
        readingRecords: updatedRecords,
        animalStamps: updatedStamps
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
    getRequiredBooksForStamp(stampId: string): number {
      const requirements: { [key: string]: number } = {
        'cat': 1, 'dog': 2, 'rabbit': 3, 'bear': 5, 'fox': 7, 'lion': 10,
        'elephant': 15, 'panda': 20, 'tiger': 25, 'monkey': 30, 'pig': 40, 'dragon': 50
      };
      return requirements[stampId] || 1;
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