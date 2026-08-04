INSERT INTO offer_tickets
(offer_id, ticket_id, display_name, min_qty, free_qty, display_order)
VALUES

-- 1. Early Bird
(1,1,'Adult - Early Bird',1,0,1),

-- 2. Student
(2,4,'Student - College Offer',1,0,1),

-- 3. Double Dhamaka
(3,5,'Double Dhamaka Adult',1,0,1),
(3,6,'Double Dhamaka Child',1,0,2),

-- 4. Birthday
(4,1,'Adult - Birthday Offer',1,1,1),

-- 5. Aadi
(5,1,'Adult - Aadi Offer',2,1,1),

-- 6. Friendship
(6,1,'Adult - Friendship Offer',2,1,1),

-- 7. Little Legend
(7,2,'Child - Little Legend Offer',1,2,1);