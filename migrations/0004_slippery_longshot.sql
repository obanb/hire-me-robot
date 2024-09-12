CREATE TABLE `agent` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text,
	`description` text NOT NULL,
	`name` text NOT NULL,
	`priority` integer NOT NULL,
	`invitationId` text NOT NULL,
	FOREIGN KEY (`invitationId`) REFERENCES `invitation`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `question` ADD `agent` text NOT NULL;