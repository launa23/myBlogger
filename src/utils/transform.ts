import { IPost } from "../posts/post.interface";
import { IComment } from "../comments/comment.interface";

export function groupedCategory(arr: any[]): IPost[]{
  const result = arr.reduce((acc, cur) => {
    if ( !acc[cur.post_id] ){
      acc[cur.post_id] = {
        post_id: cur.post_id,
        post_title: cur.post_title,
        post_content: cur.post_content,
        tag_label: cur.tag_label,
        created_at: cur.post_createdAt,
        user_id: cur.userId,
        user_name: cur.user_name,
        total_likes: cur.totallikes,
        total_comments: cur.totalcomments,
        cate_name: [cur.cate_name]
      }
    }
    else{
      acc[cur.post_id].cate_name.push(cur.cate_name)
    }
    return acc;
  },{})
  return Object.values(result);
}

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