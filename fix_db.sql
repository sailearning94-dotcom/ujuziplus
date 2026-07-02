-- Fix: rename columns back to camelCase to match the Prisma schema
-- (the MySQL->PostgreSQL conversion lowercased all column names,
--  but the app code expects camelCase column names)

-- users table
ALTER TABLE users RENAME COLUMN fullname TO "fullName";
ALTER TABLE users RENAME COLUMN passwordhash TO "passwordHash";
ALTER TABLE users RENAME COLUMN avatarurl TO "avatarUrl";
ALTER TABLE users RENAME COLUMN isactive TO "isActive";
ALTER TABLE users RENAME COLUMN emailverified TO "emailVerified";
ALTER TABLE users RENAME COLUMN createdat TO "createdAt";
ALTER TABLE users RENAME COLUMN updatedat TO "updatedAt";

-- courses table
ALTER TABLE courses RENAME COLUMN thumbnailurl TO "thumbnailUrl";
ALTER TABLE courses RENAME COLUMN instructorid TO "instructorId";
ALTER TABLE courses RENAME COLUMN discountprice TO "discountPrice";
ALTER TABLE courses RENAME COLUMN isfree TO "isFree";
ALTER TABLE courses RENAME COLUMN durationhours TO "durationHours";
ALTER TABLE courses RENAME COLUMN targetaudience TO "targetAudience";
ALTER TABLE courses RENAME COLUMN linkedkitslugs TO "linkedKitSlugs";
ALTER TABLE courses RENAME COLUMN metatitle TO "metaTitle";
ALTER TABLE courses RENAME COLUMN metadesc TO "metaDesc";
ALTER TABLE courses RENAME COLUMN enablecert TO "enableCert";
ALTER TABLE courses RENAME COLUMN reviewnote TO "reviewNote";
ALTER TABLE courses RENAME COLUMN createdat TO "createdAt";
ALTER TABLE courses RENAME COLUMN updatedat TO "updatedAt";
ALTER TABLE courses RENAME COLUMN whatyoulearn TO "whatYouLearn";

-- course_modules
ALTER TABLE course_modules RENAME COLUMN courseid TO "courseId";
ALTER TABLE course_modules RENAME COLUMN orderindex TO "orderIndex";
ALTER TABLE course_modules RENAME COLUMN createdat TO "createdAt";

-- lessons
ALTER TABLE lessons RENAME COLUMN moduleid TO "moduleId";
ALTER TABLE lessons RENAME COLUMN articlebody TO "articleBody";
ALTER TABLE lessons RENAME COLUMN durationseconds TO "durationSeconds";
ALTER TABLE lessons RENAME COLUMN isfreepreview TO "isFreePreview";
ALTER TABLE lessons RENAME COLUMN orderindex TO "orderIndex";
ALTER TABLE lessons RENAME COLUMN createdat TO "createdAt";
ALTER TABLE lessons RENAME COLUMN updatedat TO "updatedAt";

-- enrollments (table name might be enrollments)
ALTER TABLE enrollments RENAME COLUMN userid TO "userId";
ALTER TABLE enrollments RENAME COLUMN courseid TO "courseId";
ALTER TABLE enrollments RENAME COLUMN enrolledat TO "enrolledAt";
ALTER TABLE enrollments RENAME COLUMN completedat TO "completedAt";

-- lesson_progress
ALTER TABLE lesson_progress RENAME COLUMN enrollmentid TO "enrollmentId";
ALTER TABLE lesson_progress RENAME COLUMN lessonid TO "lessonId";
ALTER TABLE lesson_progress RENAME COLUMN completedat TO "completedAt";

-- certificates
ALTER TABLE certificates RENAME COLUMN userid TO "userId";
ALTER TABLE certificates RENAME COLUMN courseid TO "courseId";

-- certificate_templates
ALTER TABLE certificate_templates RENAME COLUMN courseid TO "courseId";

-- orders
ALTER TABLE orders RENAME COLUMN userid TO "userId";
ALTER TABLE orders RENAME COLUMN discountamount TO "discountAmount";
ALTER TABLE orders RENAME COLUMN createdat TO "createdAt";
ALTER TABLE orders RENAME COLUMN updatedat TO "updatedAt";

-- order_items
ALTER TABLE order_items RENAME COLUMN orderid TO "orderId";
ALTER TABLE order_items RENAME COLUMN courseid TO "courseId";
ALTER TABLE order_items RENAME COLUMN kitid TO "kitId";

-- kit_purchases
ALTER TABLE kit_purchases RENAME COLUMN userid TO "userId";
ALTER TABLE kit_purchases RENAME COLUMN kitid TO "kitId";

-- password_reset_tokens
ALTER TABLE password_reset_tokens RENAME COLUMN userid TO "userId";
ALTER TABLE password_reset_tokens RENAME COLUMN expiresat TO "expiresAt";
ALTER TABLE password_reset_tokens RENAME COLUMN usedat TO "usedAt";
ALTER TABLE password_reset_tokens RENAME COLUMN createdat TO "createdAt";

-- discussions
ALTER TABLE discussions RENAME COLUMN authorid TO "authorId";
ALTER TABLE discussions RENAME COLUMN courseid TO "courseId";
ALTER TABLE discussions RENAME COLUMN coverimageurl TO "coverImageUrl";
ALTER TABLE discussions RENAME COLUMN ispinned TO "isPinned";
ALTER TABLE discussions RENAME COLUMN isresolved TO "isResolved";
ALTER TABLE discussions RENAME COLUMN createdat TO "createdAt";
ALTER TABLE discussions RENAME COLUMN updatedat TO "updatedAt";

-- discussion_replies
ALTER TABLE discussion_replies RENAME COLUMN discussionid TO "discussionId";
ALTER TABLE discussion_replies RENAME COLUMN authorid TO "authorId";
ALTER TABLE discussion_replies RENAME COLUMN isaccepted TO "isAccepted";
ALTER TABLE discussion_replies RENAME COLUMN createdat TO "createdAt";
ALTER TABLE discussion_replies RENAME COLUMN updatedat TO "updatedAt";

-- discussion_likes
ALTER TABLE discussion_likes RENAME COLUMN userid TO "userId";
ALTER TABLE discussion_replies RENAME COLUMN discussionid TO "discussionId";
ALTER TABLE discussion_likes RENAME COLUMN replyid TO "replyId";

-- notifications
ALTER TABLE notifications RENAME COLUMN userid TO "userId";
ALTER TABLE notifications RENAME COLUMN isread TO "isRead";
ALTER TABLE notifications RENAME COLUMN createdat TO "createdAt";

-- notification_preferences
ALTER TABLE notification_preferences RENAME COLUMN userid TO "userId";
ALTER TABLE notification_preferences RENAME COLUMN emailenabled TO "emailEnabled";
ALTER TABLE notification_preferences RENAME COLUMN inappenabled TO "inAppEnabled";
ALTER TABLE notification_preferences RENAME COLUMN pushenabled TO "pushEnabled";

-- assignments
ALTER TABLE assignments RENAME COLUMN lessonid TO "lessonId";
ALTER TABLE assignments RENAME COLUMN maxscore TO "maxScore";
ALTER TABLE assignments RENAME COLUMN dueat TO "dueAt";
ALTER TABLE assignments RENAME COLUMN createdat TO "createdAt";
ALTER TABLE assignments RENAME COLUMN updatedat TO "updatedAt";

-- assignment_submissions
ALTER TABLE assignment_submissions RENAME COLUMN assignmentid TO "assignmentId";
ALTER TABLE assignment_submissions RENAME COLUMN enrollmentid TO "enrollmentId";
ALTER TABLE assignment_submissions RENAME COLUMN userid TO "userId";
ALTER TABLE assignment_submissions RENAME COLUMN textresponse TO "textResponse";
ALTER TABLE assignment_submissions RENAME COLUMN githuburl TO "githubUrl";
ALTER TABLE assignment_submissions RENAME COLUMN submittedat TO "submittedAt";
ALTER TABLE assignment_submissions RENAME COLUMN gradedat TO "gradedAt";
ALTER TABLE assignment_submissions RENAME COLUMN gradedbyid TO "gradedById";
ALTER TABLE assignment_submissions RENAME COLUMN createdat TO "createdAt";
ALTER TABLE assignment_submissions RENAME COLUMN updatedat TO "updatedAt";

-- instructor_payout_profiles
ALTER TABLE instructor_payout_profiles RENAME COLUMN userid TO "userId";
ALTER TABLE instructor_payout_profiles RENAME COLUMN preferredmethod TO "preferredMethod";
ALTER TABLE instructor_payout_profiles RENAME COLUMN mpesaphone TO "mpesaPhone";
ALTER TABLE instructor_payout_profiles RENAME COLUMN bankname TO "bankName";
ALTER TABLE instructor_payout_profiles RENAME COLUMN bankaccountname TO "bankAccountName";
ALTER TABLE instructor_payout_profiles RENAME COLUMN bankaccountnumber TO "bankAccountNumber";
ALTER TABLE instructor_payout_profiles RENAME COLUMN bankswift TO "bankSwift";
ALTER TABLE instructor_payout_profiles RENAME COLUMN updatedat TO "updatedAt";

-- instructor_payouts
ALTER TABLE instructor_payouts RENAME COLUMN instructorid TO "instructorId";
ALTER TABLE instructor_payouts RENAME COLUMN processedat TO "processedAt";
ALTER TABLE instructor_payouts RENAME COLUMN createdat TO "createdAt";
ALTER TABLE instructor_payouts RENAME COLUMN updatedat TO "updatedAt";

-- kits
ALTER TABLE kits RENAME COLUMN thumbnailurl TO "thumbnailUrl";
ALTER TABLE kits RENAME COLUMN isfree TO "isFree";
ALTER TABLE kits RENAME COLUMN learningoutcomes TO "learningOutcomes";
ALTER TABLE kits RENAME COLUMN projectideas TO "projectIdeas";
ALTER TABLE kits RENAME COLUMN relatedcourseslugs TO "relatedCourseSlugs";
ALTER TABLE kits RENAME COLUMN inventorycount TO "inventoryCount";
ALTER TABLE kits RENAME COLUMN createdat TO "createdAt";
ALTER TABLE kits RENAME COLUMN updatedat TO "updatedAt";

-- kit_components
ALTER TABLE kit_components RENAME COLUMN kitid TO "kitId";
ALTER TABLE kit_components RENAME COLUMN orderindex TO "orderIndex";

-- kit_materials
ALTER TABLE kit_materials RENAME COLUMN kitid TO "kitId";
ALTER TABLE kit_materials RENAME COLUMN durationminutes TO "durationMinutes";
ALTER TABLE kit_materials RENAME COLUMN orderindex TO "orderIndex";

-- kit_gallery_images
ALTER TABLE kit_gallery_images RENAME COLUMN kitid TO "kitId";
ALTER TABLE kit_gallery_images RENAME COLUMN isprimary TO "isPrimary";
ALTER TABLE kit_gallery_images RENAME COLUMN orderindex TO "orderIndex";

-- wishlist_items
ALTER TABLE wishlist_items RENAME COLUMN userid TO "userId";
ALTER TABLE wishlist_items RENAME COLUMN courseid TO "courseId";
ALTER TABLE wishlist_items RENAME COLUMN createdat TO "createdAt";

-- programs
ALTER TABLE programs RENAME COLUMN thumbnailurl TO "thumbnailUrl";
ALTER TABLE programs RENAME COLUMN enrolledcount TO "enrolledCount";
ALTER TABLE programs RENAME COLUMN createdat TO "createdAt";
ALTER TABLE programs RENAME COLUMN updatedat TO "updatedAt";

-- program_registrations
ALTER TABLE program_registrations RENAME COLUMN userid TO "userId";
ALTER TABLE program_registrations RENAME COLUMN programid TO "programId";
ALTER TABLE program_registrations RENAME COLUMN registeredat TO "registeredAt";

-- competitions
ALTER TABLE competitions RENAME COLUMN thumbnailurl TO "thumbnailUrl";
ALTER TABLE competitions RENAME COLUMN createdat TO "createdAt";
ALTER TABLE competitions RENAME COLUMN updatedat TO "updatedAt";

-- competition_registrations
ALTER TABLE competition_registrations RENAME COLUMN userid TO "userId";
ALTER TABLE competition_registrations RENAME COLUMN competitionid TO "competitionId";
ALTER TABLE competition_registrations RENAME COLUMN registeredat TO "registeredAt";

-- organizations
ALTER TABLE organizations RENAME COLUMN logourl TO "logoUrl";
ALTER TABLE organizations RENAME COLUMN membercount TO "memberCount";
ALTER TABLE organizations RENAME COLUMN isverified TO "isVerified";
ALTER TABLE organizations RENAME COLUMN createdat TO "createdAt";
ALTER TABLE organizations RENAME COLUMN updatedat TO "updatedAt";

-- organization_members
ALTER TABLE organization_members RENAME COLUMN orgid TO "orgId";
ALTER TABLE organization_members RENAME COLUMN userid TO "userId";

-- org_kit_inventory
ALTER TABLE org_kit_inventory RENAME COLUMN orgid TO "orgId";
ALTER TABLE org_kit_inventory RENAME COLUMN kitid TO "kitId";
ALTER TABLE org_kit_inventory RENAME COLUMN quantityonhand TO "quantityOnHand";
ALTER TABLE org_kit_inventory RENAME COLUMN quantityallocated TO "quantityAllocated";
ALTER TABLE org_kit_inventory RENAME COLUMN reorderlevel TO "reorderLevel";

-- org_kit_requests
ALTER TABLE org_kit_requests RENAME COLUMN orgid TO "orgId";
ALTER TABLE org_kit_requests RENAME COLUMN kitid TO "kitId";
ALTER TABLE org_kit_requests RENAME COLUMN requesterid TO "requesterId";
ALTER TABLE org_kit_requests RENAME COLUMN createdat TO "createdAt";
ALTER TABLE org_kit_requests RENAME COLUMN updatedat TO "updatedAt";

-- org_invites
ALTER TABLE org_invites RENAME COLUMN orgid TO "orgId";
ALTER TABLE org_invites RENAME COLUMN invitedbyid TO "invitedById";
ALTER TABLE org_invites RENAME COLUMN acceptedat TO "acceptedAt";
ALTER TABLE org_invites RENAME COLUMN createdat TO "createdAt";
ALTER TABLE org_invites RENAME COLUMN expiresat TO "expiresAt";

-- push_subscriptions
ALTER TABLE push_subscriptions RENAME COLUMN userid TO "userId";
ALTER TABLE push_subscriptions RENAME COLUMN createdat TO "createdAt";

-- fcm_device_tokens
ALTER TABLE fcm_device_tokens RENAME COLUMN userid TO "userId";
ALTER TABLE fcm_device_tokens RENAME COLUMN token TO "token";
ALTER TABLE fcm_device_tokens RENAME COLUMN platform TO "platform";
ALTER TABLE fcm_device_tokens RENAME COLUMN label TO "label";
ALTER TABLE fcm_device_tokens RENAME COLUMN createdat TO "createdAt";
ALTER TABLE fcm_device_tokens RENAME COLUMN updatedat TO "updatedAt";

-- quiz_attempts
ALTER TABLE quiz_attempts RENAME COLUMN quizid TO "quizId";
ALTER TABLE quiz_attempts RENAME COLUMN userid TO "userId";
ALTER TABLE quiz_attempts RENAME COLUMN startedat TO "startedAt";
ALTER TABLE quiz_attempts RENAME COLUMN completedat TO "completedAt";

-- quiz_attempt_answers
ALTER TABLE quiz_attempt_answers RENAME COLUMN attemptid TO "attemptId";
ALTER TABLE quiz_attempt_answers RENAME COLUMN questionid TO "questionId";
ALTER TABLE quiz_attempt_answers RENAME COLUMN optionid TO "optionId";

-- user_follows
ALTER TABLE user_follows RENAME COLUMN followerid TO "followerId";
ALTER TABLE user_follows RENAME COLUMN followingid TO "followingId";
ALTER TABLE user_follows RENAME COLUMN createdat TO "createdAt";
