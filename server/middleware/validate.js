import { validationResult } from 'express-validator'

// Runs after the express-validator rules: answers 422 with a friendly list of problems
export function handleValidation(req, res, next) {
  const result = validationResult(req)
  if (result.isEmpty()) return next()
  const errors = {}
  for (const e of result.array({ onlyFirstError: true })) errors[e.path] = e.msg
  res.status(422).json({ success: false, message: 'Please check the highlighted fields.', errors })
}
