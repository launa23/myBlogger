import { IPost } from "../posts/post.interface";
import { IComment } from "../comments/comment.interface";

export function buildCommentTree(comments: any[]): IComment[]{
  const commentMap: { [key: number]: IComment } = {};

  comments.forEach((comment) => {
    commentMap[comment.cmt_id] = comment;
  });

  const rootComments: IComment[] = [];

  comments.forEach((comment) => {
    if (comment.parent_id === null) {
      rootComments.push(comment);
    } else {
      const parent = commentMap[comment.parent_id];
      if (parent) {
        if (!parent.replies) {
          parent.replies = [];
        }
        parent.replies.push(comment);
      }
    }
  });
  return rootComments;
}