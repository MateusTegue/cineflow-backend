import z from 'zod'

export const paramsId = z
  .object({
    id: z.string()
  })
  .strict()

export const isoNumber = z.preprocess((arg) => {
  const parseArg = Number(arg)
  return !Number.isNaN(parseArg) ? parseArg : arg
}, z.number())

export const isoDate = z.preprocess((arg) => {
  if (typeof arg === 'string' || arg instanceof Date) {
    return new Date(arg)
  }
  return arg
}, z.date())

export const paramsIdNumber = z
  .object({
    id: isoNumber
  })
  .strict()
