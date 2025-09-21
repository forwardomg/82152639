import Dexie, { type EntityTable } from 'dexie';
import type { Comment } from './types';

export class CommentsDatabase extends Dexie {
  comments!: EntityTable<Comment, 'id'>;

  constructor() {
    super('CommentsDatabase');
    this.version(1).stores({
      comments: 'id, parentId, createdAt, author',
    });
  }
}

export const db = new CommentsDatabase();
