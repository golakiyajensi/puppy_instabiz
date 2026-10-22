import { Router } from 'express'
import { body, param, query } from 'express-validator'
import { handleValidation } from '../middleware/validate.js'
import { formLimiter } from '../middleware/rateLimit.js'
import { listPuppies, getPuppy } from '../controllers/puppiesController.js'
import { health, getSettings, getHome, getFaqs, getTestimonials, getFamilyPhotos } from '../controllers/contentController.js'
import { createEnquiry, createContactMessage } from '../controllers/formsController.js'

const router = Router()

// Keep only the digits in a phone number.
function getDigits(value) {
  return String(value).replace(/\D/g, '')
}

const personRules = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Please tell us your name (at least 2 letters).'),
  body('phone')
    .trim()
    .matches(/^\+?[\d\s().-]{7,25}$/)
    .withMessage('Please enter a valid phone number, for example +971 50 123 4567.')
    .bail()
    .custom((value) => getDigits(value).length >= 7 && getDigits(value).length <= 15)
    .withMessage('Please enter a valid phone number, for example +971 50 123 4567.'),
  body('email')
    .optional({ values: 'falsy' })
    .trim()
    .isEmail()
    .withMessage('That email address does not look right.')
    .isLength({ max: 150 }),
  body('message')
    .optional({ values: 'falsy' })
    .isString()
    .isLength({ max: 2000 })
    .withMessage('Your message is too long (2000 characters at most).'),
  body('puppySlug').optional({ values: 'falsy' }).isString().isLength({ max: 120 }),
]

const enquiryRules = [...personRules, body('area').optional({ values: 'falsy' }).isString().isLength({ max: 100 }).withMessage('Your area is too long.')]
const contactRules = [...personRules, body('location').optional({ values: 'falsy' }).isString().isLength({ max: 100 }).withMessage('Your location is too long.')]

const listRules = [
  query('status').optional().isIn(['available', 'gone_home']).withMessage('status must be available or gone_home'),
  query('origin').optional().isIn(['local', 'imported']).withMessage('origin must be local or imported'),
  query('breed').optional().isSlug().withMessage('breed must be a slug, e.g. shih-tzu'),
  query('sex').optional().isIn(['boy', 'girl']).withMessage('sex must be boy or girl'),
  query('teacup').optional().isIn(['0', '1']),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be 1-100'),
]

// Status, settings, and home page information.
router.get('/health', health)
router.get('/settings', getSettings)
router.get('/home', getHome)

// Puppy lists and individual puppy details.
router.get('/puppies', listRules, handleValidation, listPuppies)
router.get('/puppies/:slug', param('slug').isSlug(), handleValidation, getPuppy)

// Other website content.
router.get('/faqs', getFaqs)
router.get('/testimonials', getTestimonials)
router.get('/family-photos', getFamilyPhotos)

// Form submissions are rate-limited and checked before they are saved.
router.post('/enquiries', formLimiter, enquiryRules, handleValidation, createEnquiry)
router.post('/contact', formLimiter, contactRules, handleValidation, createContactMessage)

export default router
