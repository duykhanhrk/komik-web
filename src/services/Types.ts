export type ErrorResponse = {
  message: string;
}

export type SuccessResponse = {
  message: string;
}

export type Pagination<DataType=unknown> = {
  data: Array<DataType>;
  paginate: {
    page: number;
    per_page: number;
    total_pages: number;
    total_objects: number;
  };
}

export type SignUpForm = {
  username: string;
  email: string;
  password: string;
}

export type SignInForm = {
  username_or_email: string;
  password: string;
}

export type UserTokens = {
  access_token: null | string;
  refresh_token: null | string;
}

export type Category = {
  id?: number;
  name: string;
  description: string;
}

export type Chapter = {
  id?: number;
  name: string;
  image_urls?: Array<string>;
  free: boolean;
  read?: boolean;
  next_chapter?: null | Chapter;
  previous_chapter?: null | Chapter;
  created_at?: Date;
  updated_at?: Date;
}

export type Comic = {
  id?: number;
  slug?: string;
  name: string;
  other_names: string;
  description: string;
  views?: number;
  favorites?: number;
  follows?: number;
  image_url?: string;
  status?: string;
  favorited?: boolean;
  followed?: boolean;
  active?: boolean;
  reading_chapter?: Chapter;
  release_date?: Date;
  rating?: number;
  authors?: Array<Author>;
  author_ids?: Array<number>;
  categories?: Array<Category>;
  category_ids?: Array<number>;
  up_coming?: boolean;
  last_updated_chapter_at?: Date;
  last_read_at?: Date;
  new_chapters?: number;
}

export type User = {
  avatar_url?: string;
  firstname: string;
  lastname: string;
  birthday: Date;
  username: string;
  email: string;
  current_plan?: Purchase;
  role?: number;
  locked?: boolean;
  password?: string;
}

export type Plan = {
  id?: number;
  name: string;
  description: string;
  price: number;
  value: number;
}

export type PaymentMethod = {
  key: string;
  name: string;
}

export type Purchase = {
  id?: number;
  plan: Plan;
  price: number;
  effective_at: Date;
  expires_at: Date;
  payment_method: string;
  owner?: User;
}

export type Notification = {
  id?: number;
  message: {
    title: string;
    body: string;
    data?: any;
  },
  seen: boolean;
  created_at: Date;
}

export type Suggestion<T = any> = {
  keyword: string;
  type: string;
  data?: T;
}

export type Feedback = {
  id?: number;
  user?: User;
  title: string;
  content: string;
  created_at?: string;
}

export type Review = {
  id?: number;
  user?: User;
  title: string;
  content: string;
  agreement_count?: number;
  disagreement_count?: number;
  transgression_count?: number;
  point_of_view?: number;
  created_at?: Date;
  updated_at?: Date;
}

export type Author = {
  id?: number;
  firstname: string;
  lastname: string;
  birthday: Date;
  introduction: string;
  image_url?: string;
}
