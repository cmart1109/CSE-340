-- Step 1
INSERT INTO public.account (
	account_id,
	account_firstname,
	account_lastname,
	account_email,
	account_password,
	account_type
) VALUES (
	DEFAULT,
	'Tony',
	'Stark',
	'tony@starkent.com',
	'Iam1ronM@n',
	'Client'
);

-- Step 2 
UPDATE public.account SET account_type = 'Admin' WHERE account_firstname = 'Tony';

-- Step 3
DELETE FROM public.account WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

-- Step 4
UPDATE 
	public.inventory
SET
	inv_description = REPLACE( inv_description, 'the small interiors','a huge interiors')
WHERE 
	inv_make = 'GM' AND inv_model = 'Hummer';

-- Step 5
SELECT inv_make, inv_model, classification_name FROM public.inventory
JOIN public.classification
ON public.inventory.classification_id = public.classification.classification_id
WHERE public.classification.classification_name = 'Sport';

-- Step 6
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');
