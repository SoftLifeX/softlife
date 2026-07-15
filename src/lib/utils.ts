type ClassValue = string | boolean | null | undefined | ClassValue[]

export function cn(...classes: ClassValue[]): string {
  const flatten = (arr: ClassValue[]): string[] =>
    arr.flatMap((c) => {
      if (Array.isArray(c)) return flatten(c) 
      if (typeof c === 'string' && c.trim() !== '') return [c]
      return []
    })

  return flatten(classes).join(' ')
}
