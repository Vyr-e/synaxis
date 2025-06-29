import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { USER_PROFILE_STEPS, USER_ROLES } from './schema';
import type {
  events,
  accounts,
  brandCommunities,
  brands,
  chatMessages,
  chatParticipants,
  chatRooms,
  collaborations,
  communityMembers,
  eventFaqs,
  eventMedia,
  eventMetrics,
  invitations,
  members,
  notifications,
  referrals,
  sessions,
  ticketDiscounts,
  ticketPurchases,
  tickets,
  users,
  verifications,
} from './schema';

// Brand Types
export type Brand = InferSelectModel<typeof brands>;
export type NewBrand = InferInsertModel<typeof brands>;

export type BrandCommunity = InferSelectModel<typeof brandCommunities>;
export type NewBrandCommunity = InferInsertModel<typeof brandCommunities>;

export type CommunityMember = InferSelectModel<typeof communityMembers>;
export type NewCommunityMember = InferInsertModel<typeof communityMembers>;

// User Types
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
export type UserProfileStep =
  (typeof USER_PROFILE_STEPS)[keyof typeof USER_PROFILE_STEPS];

export type Session = InferSelectModel<typeof sessions>;
export type NewSession = InferInsertModel<typeof sessions>;

export type Account = InferSelectModel<typeof accounts>;
export type NewAccount = InferInsertModel<typeof accounts>;

export type Verification = InferSelectModel<typeof verifications>;
export type NewVerification = InferInsertModel<typeof verifications>;

// Event Types
export type Event = InferSelectModel<typeof events>;
export type NewEvent = InferInsertModel<typeof events>;

// Ticket Types
export type Ticket = InferSelectModel<typeof tickets>;
export type NewTicket = InferInsertModel<typeof tickets>;

export type TicketDiscount = InferSelectModel<typeof ticketDiscounts>;
export type NewTicketDiscount = InferInsertModel<typeof ticketDiscounts>;

export type TicketPurchase = InferSelectModel<typeof ticketPurchases>;
export type NewTicketPurchase = InferInsertModel<typeof ticketPurchases>;

// Chat Types
export type ChatRoom = InferSelectModel<typeof chatRooms>;
export type NewChatRoom = InferInsertModel<typeof chatRooms>;

export type ChatMessage = InferSelectModel<typeof chatMessages>;
export type NewChatMessage = InferInsertModel<typeof chatMessages>;

export type ChatParticipant = InferSelectModel<typeof chatParticipants>;
export type NewChatParticipant = InferInsertModel<typeof chatParticipants>;

// Collaboration Types
export type Collaboration = InferSelectModel<typeof collaborations>;
export type NewCollaboration = InferInsertModel<typeof collaborations>;

export type EventFaq = InferSelectModel<typeof eventFaqs>;
export type NewEventFaq = InferInsertModel<typeof eventFaqs>;

// Media Types
export type EventMedia = InferSelectModel<typeof eventMedia>;
export type NewEventMedia = InferInsertModel<typeof eventMedia>;

// Analytics Types
export type EventMetric = InferSelectModel<typeof eventMetrics>;
export type NewEventMetric = InferInsertModel<typeof eventMetrics>;

// Notification Types
export type Notification = InferSelectModel<typeof notifications>;
export type NewNotification = InferInsertModel<typeof notifications>;

// Referral Types
export type Referral = InferSelectModel<typeof referrals>;
export type NewReferral = InferInsertModel<typeof referrals>;

export type Members = InferSelectModel<typeof members>;
export type NewMembers = InferInsertModel<typeof members>;

export type Invitations = InferSelectModel<typeof invitations>;
export type NewInvitations = InferInsertModel<typeof invitations>;

// Utility Types
export type WithTimestamps = {
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};

export type WithId = {
  id: string;
};

// Common Response Types
export type ApiResponse<T> = {
  data: T;
  error?: string;
  message?: string;
};

export type PaginatedResponse<T> = ApiResponse<T> & {
  meta: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
};

// Re-export schema types
export type {
  accounts,
  brandCommunities,
  brands,
  chatMessages,
  chatParticipants,
  chatRooms,
  collaborations,
  communityMembers,
  eventFaqs,
  eventMedia,
  eventMetrics,
  events,
  invitations,
  members,
  notifications,
  referrals,
  sessions,
  ticketDiscounts,
  ticketPurchases,
  tickets,
  users,
  verifications,
};
