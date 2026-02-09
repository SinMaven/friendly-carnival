-- Seed Tags
INSERT INTO public.tags (name, slug, color_hex) VALUES 
('Web Exploitation', 'web', '#3b82f6'), 
('Cryptography', 'crypto', '#8b5cf6'),
('Binary Exploitation', 'pwn', '#ef4444'),
('Forensics', 'forensics', '#10b981'),
('Reverse Engineering', 'rev', '#f59e0b')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, color_hex = EXCLUDED.color_hex;

DO $$
DECLARE
  v_web_id INT;
  v_crypto_id INT;
  v_pwn_id INT;
  v_c1_id UUID;
  v_c2_id UUID;
  v_c3_id UUID;
  v_c4_id UUID;
  v_c5_id UUID;
BEGIN
  -- Get Tag IDs
  SELECT id INTO v_web_id FROM public.tags WHERE slug = 'web';
  SELECT id INTO v_crypto_id FROM public.tags WHERE slug = 'crypto';
  SELECT id INTO v_pwn_id FROM public.tags WHERE slug = 'pwn';

  -- Challenge 1: Welcome Check
  INSERT INTO public.challenges (title, slug, description_markdown, difficulty, state, initial_points, min_points, decay_function, requires_container)
  VALUES ('Welcome Check', 'welcome-check', 'Just a warm-up to check if you are paying attention. The flag is visible right here: `flag{welcome_to_the_ctf}`.', 'easy', 'published', 50, 50, 'linear', false)
  RETURNING id INTO v_c1_id;

  INSERT INTO public.challenge_flags (challenge_id, flag_hash) VALUES (v_c1_id, '5d99b8fd5a4e2f791ee4db613b836751cb7f3ebf1a196482ae22ae09886d97d0'); -- flag{welcome_to_the_ctf}
  INSERT INTO public.challenge_tags (challenge_id, tag_id) VALUES (v_c1_id, v_web_id);

  -- Challenge 2: SQL Injection
  INSERT INTO public.challenges (title, slug, description_markdown, difficulty, state, initial_points, min_points, decay_function, requires_container)
  VALUES ('The Login Gate', 'login-gate', 'Can you bypass the login mechanism? The administrator has weak credentials. URL: `http://ctf-target-01.duckurity.io`', 'easy', 'published', 100, 50, 'linear', false)
  RETURNING id INTO v_c2_id;

  INSERT INTO public.challenge_flags (challenge_id, flag_hash) VALUES (v_c2_id, '20aa5f4ace3bdc56691385187f3c08f28dac6352e239985e40ba60a4877ff059'); -- flag{sqli_is_easy_peasy}
  INSERT INTO public.challenge_tags (challenge_id, tag_id) VALUES (v_c2_id, v_web_id);

  -- Challenge 3: Caesar Cipher
  INSERT INTO public.challenges (title, slug, description_markdown, difficulty, state, initial_points, min_points, decay_function, requires_container)
  VALUES ('Caesar Salad', 'caesar-salad', 'Julius Caesar used this simple cipher. Can you break it? Ciphertext: `synt{pnrfne_vcure_vf_oebxra}`', 'easy', 'published', 75, 50, 'linear', false)
  RETURNING id INTO v_c3_id;

  INSERT INTO public.challenge_flags (challenge_id, flag_hash) VALUES (v_c3_id, '0e6e8a59358f1413f84d1e4edaaa8bfe66f248037ef11eeeaf10208cf3ee3447'); -- flag{caesar_cipher_is_broken}
  INSERT INTO public.challenge_tags (challenge_id, tag_id) VALUES (v_c3_id, v_crypto_id);

  -- Challenge 4: RSA
  INSERT INTO public.challenges (title, slug, description_markdown, difficulty, state, initial_points, min_points, decay_function, requires_container)
  VALUES ('Small Keys', 'small-keys', 'The public key is (n=323, e=65537). The private factors are dangerously small. Can you recover the private key?', 'medium', 'published', 200, 100, 'logarithmic', false)
  RETURNING id INTO v_c4_id;

  INSERT INTO public.challenge_flags (challenge_id, flag_hash) VALUES (v_c4_id, 'f93feeaa37259f1d9a86527071999f61713c17fee479f10f677e70dd87fa44f4'); -- flag{rsa_is_number_theory}
  INSERT INTO public.challenge_tags (challenge_id, tag_id) VALUES (v_c4_id, v_crypto_id);

  -- Challenge 5: Buffer Overflow
  INSERT INTO public.challenges (title, slug, description_markdown, difficulty, state, initial_points, min_points, decay_function, requires_container)
  VALUES ('Buffer Overflow 0', 'buffer-overflow-0', 'A classic stack buffer overflow. Overwrite the `admin` variable to 0xCAFEBABE to get the flag.', 'medium', 'published', 250, 100, 'logarithmic', true)
  RETURNING id INTO v_c5_id;

  INSERT INTO public.challenge_flags (challenge_id, flag_hash) VALUES (v_c5_id, 'ceb03301fb6cb6c6beb1aa118f20edac507a5db8d3ab7e4dd723d5d3d4b33c34'); -- flag{buffer_overflow_ftw}
  INSERT INTO public.challenge_tags (challenge_id, tag_id) VALUES (v_c5_id, v_pwn_id);

END $$;
