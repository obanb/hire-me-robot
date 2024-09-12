CREATE TABLE `invitation` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text,
	`used` integer DEFAULT false NOT NULL,
	`email` text NOT NULL,
	`vectorKey` text NOT NULL
);
--> statement-breakpoint
DROP TABLE `invitation_cfg`;