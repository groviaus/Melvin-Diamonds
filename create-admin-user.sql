SELECT id, email, role FROM users WHERE email = 'admin@mavendiamonds.com';

INSERT INTO users (id, name, email, password, provider, role, emailVerified, createdAt, updatedAt)
VALUES (
    'admin-1766827000173',
    'Admin User',
    'admin@mavendiamonds.com',
    '$2b$10$EosPrfSsa57WSf/Vnut5p.t2JDrXF06Rd12VHaCc6TPxD.kg0.HG.',
    'credentials',
    'admin',
    NOW(),
    NOW(),
    NOW()
);

UPDATE users 
SET 
    role = 'admin', 
    password = '$2b$10$EosPrfSsa57WSf/Vnut5p.t2JDrXF06Rd12VHaCc6TPxD.kg0.HG.',
    provider = 'credentials',
    updatedAt = NOW()
WHERE email = 'admin@mavendiamonds.com';

SELECT id, name, email, role, provider, createdAt FROM users WHERE email = 'admin@mavendiamonds.com';
