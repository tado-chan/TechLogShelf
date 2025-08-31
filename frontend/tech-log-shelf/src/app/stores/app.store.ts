import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  views: number;
}

interface AppState {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

const initialState: AppState = {
  posts: [
    {
      id: '1',
      title: 'Welcome to TechLogShelf',
      content: 'This is your first blog post!',
      createdAt: new Date(),
      views: 42
    },
    {
      id: '2',
      title: 'Getting Started with Angular',
      content: 'Learn the basics of Angular development.',
      createdAt: new Date(Date.now() - 86400000), // Yesterday
      views: 128
    }
  ],
  loading: false,
  error: null
};

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ posts }) => ({
    totalPosts: computed(() => posts().length),
    totalViews: computed(() => posts().reduce((sum, post) => sum + post.views, 0)),
    recentPosts: computed(() => 
      posts()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
    )
  })),
  withMethods((store) => ({
    addPost(post: Omit<Post, 'id' | 'views' | 'createdAt'>) {
      const newPost: Post = {
        ...post,
        id: Date.now().toString(),
        views: 0,
        createdAt: new Date()
      };
      patchState(store, { posts: [...store.posts(), newPost] });
    },
    updatePost(id: string, updates: Partial<Omit<Post, 'id'>>) {
      patchState(store, {
        posts: store.posts().map(post => 
          post.id === id ? { ...post, ...updates } : post
        )
      });
    },
    deletePost(id: string) {
      patchState(store, {
        posts: store.posts().filter(post => post.id !== id)
      });
    },
    incrementViews(id: string) {
      patchState(store, {
        posts: store.posts().map(post => 
          post.id === id ? { ...post, views: post.views + 1 } : post
        )
      });
    },
    setLoading(loading: boolean) {
      patchState(store, { loading });
    },
    setError(error: string | null) {
      patchState(store, { error });
    }
  }))
);