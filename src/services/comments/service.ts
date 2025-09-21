import { db } from './db';
import type { Comment } from './types';
import { UI_TEXT } from '@constants/ui';

export const commentsService = {
  async getAll() {
    return await db.comments.toArray();
  },

  async getById(id: string) {
    return await db.comments.get(id);
  },

  async create(comment: Omit<Comment, 'id'>) {
    const id = crypto.randomUUID();
    await db.comments.add({ ...comment, id });
    return id;
  },

  async update(id: string, updates: Partial<Omit<Comment, 'id'>>) {
    await db.comments.update(id, { ...updates, editedAt: new Date() });
  },

  async delete(id: string) {
    const comment = await db.comments.get(id);
    if (!comment) return;

    const children = await db.comments.where('parentId').equals(id).toArray();

    if (children.length > 0) {
      await db.comments.update(id, {
        text: UI_TEXT.COMMENT_ITEM.STATUS.DELETED,
        author: UI_TEXT.COMMENT_ITEM.STATUS.DELETED,
        editedAt: new Date(),
      });
    } else {
      await db.comments.delete(id);
    }
  },

  async hasChildren(id: string) {
    const count = await db.comments.where('parentId').equals(id).count();
    return count > 0;
  },
};
