export interface IPost {
  post_id: number;
  post_title: string;
  tag_label: string;
  created_at: string;
  user_id: number;
  user_name: string;
  total_likes: string;
  total_comments: string;
  cate_name: string[];
}