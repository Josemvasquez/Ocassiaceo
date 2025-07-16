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

export const digitalEvents = pgTable("digital_events", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(), // event host
  title: varchar("title").notNull(), // "Dinner at Eddie V's"
  eventType: eventTypeEnum("event_type").notNull(),
  description: text("description"),
  eventDate: timestamp("event_date"),
  venueName: varchar("venue_name"), // "Eddie V's Prime Seafood"
  venueAddress: text("venue_address"),
  venueWebsite: varchar("venue_website"),
  reservationLink: varchar("reservation_link"),
  guestLimit: integer("guest_limit"),
  rsvpDeadline: timestamp("rsvp_deadline"),
  sharedWishlistId: varchar("shared_wishlist_id"), // for group gifts
  invitationTemplateId: varchar("invitation_template_id"),
  customMessage: text("custom_message"),
  eventSettings: jsonb("event_settings"), // privacy, notifications, etc.
  status: eventStatusEnum("status").notNull().default('planning'),
  hostNotes: text("host_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Event RSVPs and guest management
export const rsvpResponseEnum = pgEnum('rsvp_response', ['pending', 'attending', 'not_attending', 'maybe']);

export const eventRsvps = pgTable("event_rsvps", {
  id: varchar("id").primaryKey(),
  eventId: varchar("event_id").references(() => digitalEvents.id).notNull(),
  guestEmail: varchar("guest_email").notNull(),
  guestName: varchar("guest_name"),
  response: rsvpResponseEnum("response").notNull().default('pending'),
  guestCount: integer("guest_count").default(1), // including +1s
  dietaryRestrictions: text("dietary_restrictions"),
  specialRequests: text("special_requests"),
  guestMessage: text("guest_message"),
  respondedAt: timestamp("responded_at"),
  invitedAt: timestamp("invited_at"),
  remindersSent: integer("reminders_sent").default(0),
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

export const digitalInvitations = pgTable("digital_invitations", {
  id: varchar("id").primaryKey(),
  eventId: varchar("event_id").references(() => digitalEvents.id).notNull(),
  templateId: varchar("template_id").notNull(),
  title: varchar("title").notNull(),
  designConfig: jsonb("design_config"), // colors, fonts, layout settings
  customMessage: text("custom_message"),
  eventDetails: jsonb("event_details"), // date, time, venue, dress code, etc.
  rsvpInstructions: text("rsvp_instructions"),
  shareableLink: varchar("shareable_link").notNull(),
  requiresRsvp: boolean("requires_rsvp").default(true),
  allowGuestMessage: boolean("allow_guest_message").default(true),
  allowPlusOnes: boolean("allow_plus_ones").default(true),
  maxGuestsPerInvite: integer("max_guests_per_invite").default(2),
  trackingEnabled: boolean("tracking_enabled").default(true),
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

export type DigitalEvent = typeof digitalEvents.$inferSelect;
export type InsertDigitalEvent = typeof digitalEvents.$inferInsert;

export type EventRsvp = typeof eventRsvps.$inferSelect;
export type InsertEventRsvp = typeof eventRsvps.$inferInsert;

export type RecommendedVendor = typeof recommendedVendors.$inferSelect;
export type InsertRecommendedVendor = typeof recommendedVendors.$inferInsert;

export type EventVendorBooking = typeof eventVendorBookings.$inferSelect;
export type InsertEventVendorBooking = typeof eventVendorBookings.$inferInsert;

export type DigitalInvitation = typeof digitalInvitations.$inferSelect;
export type InsertDigitalInvitation = typeof digitalInvitations.$inferInsert;

export type InvitationRecipient = typeof invitationRecipients.$inferSelect;
export type InsertInvitationRecipient = typeof invitationRecipients.$inferInsert;

export type LuxuryAffiliatePartner = typeof luxuryAffiliatePartners.$inferSelect;
export type InsertLuxuryAffiliatePartner = typeof luxuryAffiliatePartners.$inferInsert;