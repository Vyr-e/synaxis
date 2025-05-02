/**
 * Generates a list of username suggestions based on the provided base username, first name, and last name.
 * 
 * @param baseUsername - The base username to generate suggestions from.
 * @param firstName - The first name of the user.
 * @param lastName - The last name of the user.
 * @returns An array of username suggestions.
 * @description This function generates a list of username suggestions based on the provided base username, first name, and last name.
 * It uses a combination of numeric suffixes, common templates/patterns, name incorporation, character manipulation, and leetspeak-like replacement.
 * The suggestions are then filtered, shuffled, and sliced to return the top 5 unique, shuffled suggestions.
 */
export function generateSuggestions(
  baseUsername: string,
  firstName = '',
  lastName = ''
): string[] {
  if (!baseUsername || baseUsername.length < 2) {
    return [];
  }

  const suggestions: Set<string> = new Set();

  suggestions.add(`${baseUsername}${Math.floor(Math.random() * 90 + 10)}`);
  suggestions.add(`${baseUsername}${Math.floor(Math.random() * 900 + 100)}`);

  suggestions.add(`the_${baseUsername}`);
  suggestions.add(`${baseUsername}_official`);
  suggestions.add(`${baseUsername}${baseUsername.slice(-1)}`); 

  if (firstName) {
    suggestions.add(`${firstName.toLowerCase()}_${baseUsername}`);
  }
  if (lastName) {
    suggestions.add(`${baseUsername}_${lastName.toLowerCase()}`);
  }

  if (baseUsername.length > 3) {
    const pos = Math.floor(Math.random() * (baseUsername.length - 2)) + 1;
    suggestions.add(
      `${baseUsername.slice(0, pos)}${baseUsername[pos + 1]}${baseUsername[pos]}${baseUsername.slice(pos + 2)}`
    );
  }
  const replacements: Record<string, string> = { o: '0', i: '1', e: '3', s: '5' };
  let replaced = false;
  let tempUsername = baseUsername;
  for (const [original, replacement] of Object.entries(replacements)) {
     if (tempUsername.includes(original)) {
       tempUsername = tempUsername.replace(original, replacement);
       replaced = true;
       break; 
     }
  }
  if(replaced) {
    suggestions.add(tempUsername)
  };

  const results = Array.from(suggestions)
    .filter(s => s !== baseUsername && s.length > 3 && s.length < 20)
    .sort(() => 0.5 - Math.random());

  return results.slice(0, 5); 
}
