INSERT INTO site_settings (key, value) VALUES
    ('hero_slider_1', '/images/hero/hero-1.jpg'),
    ('hero_slider_2', '/images/hero/hero-2-new.jpg'),
    ('hero_slider_3', '/images/hero/hero-3.jpg'),
    ('hero_slider_4', '/images/hero/hero-4.jpg'),
    ('category_image_url_raw-silk', '/images/categories/raw-silk.jpg'),
    ('category_image_url_chiffon', '/images/categories/chiffon.jpg'),
    ('category_image_url_organza', '/images/categories/organza.jpg'),
    ('category_image_url_georgette', '/images/categories/georgette.jpg'),
    ('category_image_url_net', '/images/categories/net.jpg'),
    ('category_image_url_velvet', '/images/categories/velvet.jpg'),
    ('about_image_url', '/images/about-brand-photography.jpg'),
    ('about_body', 'Discover the artistry and heritage woven into every piece. Rahim''s Collection is a tribute to timeless elegance, bringing you the finest unstitched fabrics crafted with uncompromising quality.

For over a decade, we have partnered with master artisans to source premium raw silk, pure chiffon, and delicate organza. Each collection is thoughtfully curated to empower you to create ensembles that reflect your unique style.

We believe that true luxury lies in the details. From the initial thread to the final weave, our commitment to excellence ensures that you don''t just wear a fabric — you wear a legacy.')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
