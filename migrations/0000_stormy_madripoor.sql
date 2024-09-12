CREATE TABLE `invitation_cfg` (
	`id` text NOT NULL,
	`created_at` text NOT NULL,
	`used` integer DEFAULT false NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`hash` text NOT NULL,
	`salt` text NOT NULL
);
