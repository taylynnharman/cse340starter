-- Task 1
-- 1
INSERT INTO account (account_firstname, account_lastname, account_email, account_password) 
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- 2
UPDATE account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

-- 3
DELETE FROM account
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';


-- 4
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_model = 'Hummer';

-- 5
SELECT 
	inv.inv_make, 
    inv.inv_model, 
    c.classification_name
FROM 
    public.inventory inv
INNER JOIN 
    public.classification c
ON 
    inv.classification_id = c.classification_id
WHERE 
    c.classification_name = 'Sport';

-- 6
UPDATE 
	public.inventory
SET 
  inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
  inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles')
WHERE
	inv_image LIKE '%/images%';
