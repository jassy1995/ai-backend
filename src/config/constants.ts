export const UserRoles = {
  USER: 'user',
  ADMIN: 'admin',
  WRITER: 'writer',
} as const;

export const UserType = {
  HUMAN: 'human',
  AI: 'ai',
};

export const InsightStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
};

export enum InsightTypes {
  INFOGRAPHIC = 'infographic',
  NEWS = 'news',
  POST = 'post',
}

export const Reactions = {
  LIKE: 'like',
};

export enum WriterRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export const BusinessMemberRoles = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MEMBER: 'member',
  GUEST: 'guest',
};

export const TRANSACTION_EMAIL_SENDER = 'noreply@statisense.co';
