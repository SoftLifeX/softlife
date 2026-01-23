type ClassValue = string | boolean | null | undefined | ClassValue[]

export function cn(...classes: ClassValue[]): string {
  const flatten = (arr: ClassValue[]): string[] =>
    arr.flatMap((c) => {
      if (Array.isArray(c)) return flatten(c)      // recursively flatten arrays
      if (typeof c === 'string' && c.trim() !== '') return [c] // keep valid strings
      return []                                    // skip falsy values
    })

  return flatten(classes).join(' ')
}
