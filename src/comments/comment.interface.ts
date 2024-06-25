export interface IComment {
  cmt_id: number;
  cmt_content: string;
  parent_id: number | null;
  post_title: string;
  post_id: number,
  user_id: number,
  user_name: string,
  replies?: IComment[];
}