// Premium Tier Database Schema Extensions
import {
  pgTable,
  varchar,
  text,
  integer,
  timestamp,
  boolean,
  decimal,
  jsonb,
  pgEnum
} from "drizzle-orm/pg-core";
import { users } from "./schema";

// Subscription management
export const planTypeEnum = pgEnum('plan_type', ['free', 'premium']);
export const subscriptionStatusEnum = pgEnum('subscription_status', ['active', 'cancelled', 'past_due', 'trialing']);

export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  plan: planTypeEnum("plan").notNull().default('free'),
  status: subscriptionStatusEnum("status").notNull().default('active'),
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  stripePriceId: varchar("stripe_price_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  stripeCustomerId: varchar("stripe_customer_id"),
  trialEndsAt: timestamp("trial_ends_at"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Event planning
export const eventTypeEnum = pgEnum('event_type', [
  'birthday', 'anniversary', 'wedding', 'engagement', 'baby_shower', 
  'graduation', 'corporate', 'holiday', 'retirement', 'memorial', 'custom'
]);
export const eventStatusEnum = pgEnum('event_status', ['planning', 'confirmed', 'executing', 'completed', 'cancelled']);

export const eventPlans = pgTable("event_plans", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: varchar("title").notNull(),
  eventType: eventTypeEnum("event_type").notNull(),
  description: text("description"),
  eventDate: timestamp("event_date"),
  venue: varchar("venue"),
  venueAddress: text("venue_address"),
  guestCount: integer("guest_count"),
  budgetMin: decimal("budget_min", { precision: 10, scale: 2 }),
  budgetMax: decimal("budget_max", { precision: 10, scale: 2 }),
  budgetBreakdown: jsonb("budget_breakdown"), // { venue: 5000, catering: 3000, etc. }
  specialRequests: text("special_requests"),
  status: eventStatusEnum("status").notNull().default('planning'),
  plannerNotes: text("planner_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Event timeline and tasks
export const taskStatusEnum = pgEnum('task_status', ['pending', 'in_progress', 'completed', 'cancelled']);
export const taskPriorityEnum = pgEnum('task_priority', ['low', 'medium', 'high', 'urgent']);

export const eventTasks = pgTable("event_tasks", {
  id: varchar("id").primaryKey(),
  eventId: varchar("event_id").references(() => eventPlans.id).notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date"),
  status: taskStatusEnum("status").notNull().default('pending'),
  priority: taskPriorityEnum("priority").notNull().default('medium'),
  assignedTo: varchar("assigned_to"), // vendor ID or 'client' or 'planner'
  estimatedCost: decimal("estimated_cost", { precision: 10, scale: 2 }),
  actualCost: decimal("actual_cost", { precision: 10, scale: 2 }),
  notes: text("notes"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Recommended vendors and services
export const vendorCategoryEnum = pgEnum('vendor_category', [
  'catering', 'photography', 'videography', 'entertainment', 'florals', 
  'decorations', 'venue', 'transportation', 'bakery', 'other'
]);

export const recommendedVendors = pgTable("recommended_vendors", {
  id: varchar("id").primaryKey(),
  name: varchar("name").notNull(),
  category: vendorCategoryEnum("category").notNull(),
  description: text("description"),
  contactEmail: varchar("contact_email"),
  contactPhone: varchar("contact_phone"),
  website: varchar("website"),
  location: varchar("location"),
  priceRange: varchar("price_range"), // '$', '$$', '$$$', '$$$$'
  rating: decimal("rating", { precision: 3, scale: 2 }), // 1.00 to 5.00
  reviewCount: integer("review_count").default(0),
  specialties: text("specialties").array(),
  availabilityCalendar: jsonb("availability_calendar"),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }), // percentage
  isPartner: boolean("is_partner").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Event vendor bookings
export const bookingStatusEnum = pgEnum('booking_status', ['inquiry', 'quoted', 'booked', 'confirmed', 'completed', 'cancelled']);

export const eventVendorBookings = pgTable("event_vendor_bookings", {
  id: varchar("id").primaryKey(),
  eventId: varchar("event_id").references(() => eventPlans.id).notNull(),
  vendorId: varchar("vendor_id").references(() => recommendedVendors.id).notNull(),
  serviceDetails: text("service_details"),
  quotedPrice: decimal("quoted_price", { precision: 10, scale: 2 }),
  finalPrice: decimal("final_price", { precision: 10, scale: 2 }),
  status: bookingStatusEnum("status").notNull().default('inquiry'),
  contactedAt: timestamp("contacted_at"),
  bookedAt: timestamp("booked_at"),
  serviceDate: timestamp("service_date"),
  notes: text("notes"),
  contractSigned: boolean("contract_signed").default(false),
  paymentSchedule: jsonb("payment_schedule"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Custom invitations
export const invitationStatusEnum = pgEnum('invitation_status', ['draft', 'sent', 'viewed', 'responded']);
export const rsvpStatusEnum = pgEnum('rsvp_status', ['pending', 'attending', 'not_attending', 'maybe']);

export const customInvitations = pgTable("custom_invitations", {
  id: varchar("id").primaryKey(),
  eventId: varchar("event_id").references(() => eventPlans.id).notNull(),
  templateId: varchar("template_id"),
  title: varchar("title").notNull(),
  designConfig: jsonb("design_config"), // colors, fonts, layout settings
  customMessage: text("custom_message"),
  eventDetails: jsonb("event_details"), // date, time, venue, dress code, etc.
  rsvpDeadline: timestamp("rsvp_deadline"),
  requiresRsvp: boolean("requires_rsvp").default(true),
  allowGuestMessage: boolean("allow_guest_message").default(true),
  maxGuestsPerInvite: integer("max_guests_per_invite").default(2),
  isDigitalOnly: boolean("is_digital_only").default(true),
  printingRequested: boolean("printing_requested").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Individual invitation recipients
export const invitationRecipients = pgTable("invitation_recipients", {
  id: varchar("id").primaryKey(),
  invitationId: varchar("invitation_id").references(() => customInvitations.id).notNull(),
  contactId: varchar("contact_id"), // reference to contacts table if applicable
  recipientName: varchar("recipient_name").notNull(),
  recipientEmail: varchar("recipient_email"),
  recipientPhone: varchar("recipient_phone"),
  personalizedMessage: text("personalized_message"),
  sentAt: timestamp("sent_at"),
  viewedAt: timestamp("viewed_at"),
  status: invitationStatusEnum("status").notNull().default('draft'),
  rsvpStatus: rsvpStatusEnum("rsvp_status").notNull().default('pending'),
  guestCount: integer("guest_count").default(1),
  dietaryRestrictions: text("dietary_restrictions"),
  specialRequests: text("special_requests"),
  guestMessage: text("guest_message"),
  rsvpAt: timestamp("rsvp_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Luxury affiliate partners (premium tier exclusive)
export const luxuryAffiliatePartners = pgTable("luxury_affiliate_partners", {
  id: varchar("id").primaryKey(),
  name: varchar("name").notNull(),
  brand: varchar("brand").notNull(),
  category: varchar("category").notNull(), // jewelry, fashion, home, experiences
  description: text("description"),
  logoUrl: varchar("logo_url"),
  websiteUrl: varchar("website_url"),
  affiliateUrl: varchar("affiliate_url"),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }),
  minimumOrder: decimal("minimum_order", { precision: 10, scale: 2 }),
  averageOrderValue: decimal("average_order_value", { precision: 10, scale: 2 }),
  exclusivityLevel: varchar("exclusivity_level"), // 'standard', 'premium', 'exclusive'
  apiEndpoint: varchar("api_endpoint"),
  apiKey: varchar("api_key"),
  isActive: boolean("is_active").default(true),
  premiumOnly: boolean("premium_only").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Premium user analytics and tracking
export const premiumUsageTracking = pgTable("premium_usage_tracking", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  feature: varchar("feature").notNull(), // 'event_planning', 'luxury_gifts', 'custom_invitations'
  action: varchar("action").notNull(), // 'created', 'viewed', 'purchased', 'shared'
  metadata: jsonb("metadata"), // additional tracking data
  value: decimal("value", { precision: 10, scale: 2 }), // monetary value if applicable
  timestamp: timestamp("timestamp").defaultNow(),
});

// Type exports for TypeScript
export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

export type EventPlan = typeof eventPlans.$inferSelect;
export type InsertEventPlan = typeof eventPlans.$inferInsert;

export type EventTask = typeof eventTasks.$inferSelect;
export type InsertEventTask = typeof eventTasks.$inferInsert;

export type RecommendedVendor = typeof recommendedVendors.$inferSelect;
export type InsertRecommendedVendor = typeof recommendedVendors.$inferInsert;

export type EventVendorBooking = typeof eventVendorBookings.$inferSelect;
export type InsertEventVendorBooking = typeof eventVendorBookings.$inferInsert;

export type CustomInvitation = typeof customInvitations.$inferSelect;
export type InsertCustomInvitation = typeof customInvitations.$inferInsert;

export type InvitationRecipient = typeof invitationRecipients.$inferSelect;
export type InsertInvitationRecipient = typeof invitationRecipients.$inferInsert;

export type LuxuryAffiliatePartner = typeof luxuryAffiliatePartners.$inferSelect;
export type InsertLuxuryAffiliatePartner = typeof luxuryAffiliatePartners.$inferInsert;