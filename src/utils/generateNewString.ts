export const generateNewString = (stringList: string[], base: string) => {
    let index = 1;
    const newNameRegex = new RegExp(`^${base}([1-9]\d*$)`);
    const takenNumbers = stringList
      .map((s) => {
        const result = newNameRegex.exec(s);
        return result !== null ? Number(result[1]) : null 
      }).filter(s => s !== null)
      .sort();
    const smallestNumber = takenNumbers[0];
    let foundNumber = false;
    if (smallestNumber === index) {
      for (let i = 1; i < takenNumbers.length; i++) {
        if (index + 1 !== takenNumbers[i]) {
          index += 1;
          foundNumber = true;
          break;
        } else {
          index = takenNumbers[i];
        }
      }
    } else {
      foundNumber = true;
    }
    if (foundNumber === false) {
      index = takenNumbers[takenNumbers.length - 1] + 1;
    }
    return base + index.toString() 
}