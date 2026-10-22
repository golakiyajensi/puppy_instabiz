-- ============================================================================
--  Puppy Website Clone - MySQL schema
--  Works on MySQL 5.7+ and MySQL 8.x (InnoDB, utf8mb4).
--
--  HOW TO USE
--    1. Easiest:  cd server  &&  npm run db:setup      (runs schema.sql + seed.sql for you)
--    2. Manually: import  puppy_clone.sql  in MySQL Workbench / phpMyAdmin / HeidiSQL,
--                 or run   mysql -u root -p < database/puppy_clone.sql
--
--  WARNING: this script DROPS and re-creates every table, so running it again
--  resets the database (all saved enquiries are deleted).
-- ============================================================================

CREATE DATABASE IF NOT EXISTS puppy_clone
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE puppy_clone;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP VIEW  IF EXISTS v_inbox;
DROP TABLE IF EXISTS contact_messages;
DROP TABLE IF EXISTS enquiries;
DROP TABLE IF EXISTS puppy_images;
DROP TABLE IF EXISTS puppies;
DROP TABLE IF EXISTS breeds;
DROP TABLE IF EXISTS faqs;
DROP TABLE IF EXISTS testimonials;
DROP TABLE IF EXISTS family_photos;
DROP TABLE IF EXISTS journey_steps;
DROP TABLE IF EXISTS trust_points;
DROP TABLE IF EXISTS site_settings;

SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------------------------------------------------------
-- breeds: one row per breed family. `show_in_filter` = shown as a chip on /puppies
-- ----------------------------------------------------------------------------
CREATE TABLE breeds (
  id             SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug           VARCHAR(40)       NOT NULL,
  name           VARCHAR(80)       NOT NULL,
  show_in_filter TINYINT(1)        NOT NULL DEFAULT 0,
  sort_order     SMALLINT          NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_breeds_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- puppies: every puppy, available or already gone home
--   name         NULL for puppies without a name (the page then shows the breed)
--   breed_label  the text shown to visitors, e.g. "Korean Teacup Maltipoo"
--   age_label    free text, e.g. "3 months" or "3 months Maltipoo & 2 months Cavapoo"
--   origin       local = in the Dubai showroom, imported = ordered from abroad
-- ----------------------------------------------------------------------------
CREATE TABLE puppies (
  id          INT UNSIGNED      NOT NULL AUTO_INCREMENT,
  slug        VARCHAR(120)      NOT NULL,
  name        VARCHAR(60)       NULL,
  breed_id    SMALLINT UNSIGNED NOT NULL,
  breed_label VARCHAR(120)      NOT NULL,
  sex         ENUM('boy','girl','boy_girl') NOT NULL,
  age_label   VARCHAR(120)      NOT NULL,
  colour      VARCHAR(60)       NULL,
  origin      ENUM('local','imported')      NOT NULL DEFAULT 'imported',
  is_teacup   TINYINT(1)        NOT NULL DEFAULT 0,
  has_video   TINYINT(1)        NOT NULL DEFAULT 0,
  status      ENUM('available','gone_home') NOT NULL DEFAULT 'available',
  sort_order  INT               NOT NULL DEFAULT 0,
  created_at  TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_puppies_slug (slug),
  KEY idx_puppies_status_order (status, sort_order),
  KEY idx_puppies_origin (origin),
  KEY idx_puppies_breed (breed_id),
  CONSTRAINT fk_puppies_breed FOREIGN KEY (breed_id) REFERENCES breeds (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- puppy_images: photo gallery of each puppy (is_video_poster = poster frame of a video)
-- ----------------------------------------------------------------------------
CREATE TABLE puppy_images (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  puppy_id        INT UNSIGNED NOT NULL,
  url             VARCHAR(255) NOT NULL,
  alt             VARCHAR(255) NULL,
  is_video_poster TINYINT(1)   NOT NULL DEFAULT 0,
  sort_order      SMALLINT     NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_images_puppy (puppy_id, sort_order),
  CONSTRAINT fk_images_puppy FOREIGN KEY (puppy_id) REFERENCES puppies (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Content tables
-- ----------------------------------------------------------------------------
CREATE TABLE faqs (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  question     VARCHAR(255) NOT NULL,
  answer       TEXT         NOT NULL,
  show_on_home TINYINT(1)   NOT NULL DEFAULT 0,
  is_active    TINYINT(1)   NOT NULL DEFAULT 1,
  sort_order   INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_faqs_active_order (is_active, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE testimonials (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  author_name     VARCHAR(80)  NOT NULL,
  author_location VARCHAR(80)  NULL,
  puppy_breed     VARCHAR(80)  NULL,
  quote           TEXT         NOT NULL,
  is_featured     TINYINT(1)   NOT NULL DEFAULT 0,
  sort_order      INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE family_photos (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  image_url  VARCHAR(255) NOT NULL,
  caption    VARCHAR(160) NULL,
  alt        VARCHAR(255) NULL,
  sort_order INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_family_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE journey_steps (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  step_no     TINYINT      NOT NULL,
  title       VARCHAR(120) NOT NULL,
  description VARCHAR(500) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_journey_step (step_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE trust_points (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title       VARCHAR(80)  NOT NULL,
  description VARCHAR(255) NOT NULL,
  icon_key    VARCHAR(30)  NOT NULL,
  sort_order  INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE site_settings (
  setting_key   VARCHAR(60)  NOT NULL,
  setting_value VARCHAR(500) NOT NULL,
  PRIMARY KEY (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Form submissions
--   enquiries         = "Ask about Max" form on a puppy page
--   contact_messages  = "Dear TeddyPups" letter on the contact page
--   status            = new -> contacted -> closed (for whoever reads the inbox)
-- ----------------------------------------------------------------------------
CREATE TABLE enquiries (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  puppy_id   INT UNSIGNED    NULL,
  name       VARCHAR(100)    NOT NULL,
  phone      VARCHAR(30)     NOT NULL,
  email      VARCHAR(150)    NULL,
  area       VARCHAR(100)    NULL,
  message    TEXT            NULL,
  status     ENUM('new','contacted','closed') NOT NULL DEFAULT 'new',
  ip_address VARCHAR(45)     NULL,
  user_agent VARCHAR(255)    NULL,
  created_at TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_enquiries_status_created (status, created_at),
  KEY idx_enquiries_puppy (puppy_id),
  CONSTRAINT fk_enquiries_puppy FOREIGN KEY (puppy_id) REFERENCES puppies (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE contact_messages (
  id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  puppy_interest_id INT UNSIGNED    NULL,
  name              VARCHAR(100)    NOT NULL,
  phone             VARCHAR(30)     NOT NULL,
  email             VARCHAR(150)    NULL,
  location          VARCHAR(100)    NULL,
  message           TEXT            NULL,
  status            ENUM('new','contacted','closed') NOT NULL DEFAULT 'new',
  ip_address        VARCHAR(45)     NULL,
  user_agent        VARCHAR(255)    NULL,
  created_at        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_contact_status_created (status, created_at),
  CONSTRAINT fk_contact_puppy FOREIGN KEY (puppy_interest_id) REFERENCES puppies (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- v_inbox: both kinds of submissions in one list, newest first
--   Try it:  SELECT * FROM v_inbox ORDER BY created_at DESC;
-- ----------------------------------------------------------------------------
CREATE VIEW v_inbox AS
  SELECT 'puppy_enquiry' AS source, e.id, e.created_at, e.status, e.name, e.phone, e.email,
         e.area AS location, e.message, p.slug AS puppy_slug
  FROM enquiries e
  LEFT JOIN puppies p ON p.id = e.puppy_id
  UNION ALL
  SELECT 'contact_form' AS source, c.id, c.created_at, c.status, c.name, c.phone, c.email,
         c.location AS location, c.message, p.slug AS puppy_slug
  FROM contact_messages c
  LEFT JOIN puppies p ON p.id = c.puppy_interest_id;
