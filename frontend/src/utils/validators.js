// Validate the format of email
export function validateEmailFormat (email) {
  const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
  return regex.test(email)
}

// Validate password strength
export function validatePasswordStrength (password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d\W]{8,}$/
  return regex.test(password)
}

// Validate username
export function validateUsername (username) {
  const regex = /^[a-zA-Z0-9_.-]+$/
  return regex.test(username)
}
