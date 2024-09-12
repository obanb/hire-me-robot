CREATE TABLE `question` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text,
	`used` integer DEFAULT false NOT NULL,
	`text` text NOT NULL,
	`invitationId` text NOT NULL,
	FOREIGN KEY (`invitationId`) REFERENCES `invitation`(`id`) ON UPDATE no action ON DELETE cascade
);
