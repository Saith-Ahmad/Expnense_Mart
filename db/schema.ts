import {
    pgTable,
    uuid,
    varchar,
    numeric,
    timestamp,
    json,
    integer,
  } from "drizzle-orm/pg-core";
  
  

  export const Budgets = pgTable("budgets", {
    id: uuid("id").defaultRandom().primaryKey(), 
    name: varchar("name", { length: 100 }).notNull(), 
    amount: integer("amount").notNull(), 
    icon: varchar("icon", { length: 255 }), 
    timeFrame: varchar("timeFrame", { length: 20 }).notNull(), // "monthly" or "yearly"
    period: varchar("period", { length: 20 }).notNull(), // E.g., "January 2024" or "2024"
    createdBy: varchar("createdBy").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(), 
    updatedAt: timestamp("updatedAt").defaultNow().notNull(), 
  });


  export const Expenses = pgTable("expenses", {
    id: uuid("id").defaultRandom().primaryKey(), 
    name: varchar("name", { length: 100 }).notNull(), 
    amount: integer("amount").notNull(),
    budgetId: uuid("budgetId")
      .references(() => Budgets.id, { onDelete: "cascade" }) 
      .notNull(),
    category: varchar("category", { length: 50 }).notNull(), 
    createdAt: timestamp("createdAt").defaultNow().notNull(), 
  });
  