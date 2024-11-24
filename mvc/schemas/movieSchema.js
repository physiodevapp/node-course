import z from 'zod'

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'Movie title must be a string',
    required_error: 'Movie must have a value'
  }),
  year: z.number().int().min(1900).max(2025),
  director: z.string({
    required_error: 'Director name is required'
  }),
  duration: z.number().int().positive(),
  poster: z.string().url({
    message: 'URL value is invalid'
  }),
  genre: z.array(z.enum(['Action', 'Adventure', 'Crime', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi']), {
    invalid_type_error: 'Genre value is invalid',
    required_error: 'Genre is required'
  }),
  rate: z.number().min(0).max(10).default(5)
})

export function validateMovie (input) {
  return movieSchema.safeParse(input)
}

export function validateUpdateMovie (input) {
  return movieSchema.partial().safeParse(input)
}
