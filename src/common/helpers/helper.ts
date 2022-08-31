export class Helper {
  static generateRandomNumber(length = 4): string {
    const numbers = '0123456789';
    const numberLength = numbers.length;
    let generatedNumber = '';
    for (let i = 0; i < length; i++) {
      generatedNumber += numbers.charAt(
        Math.floor(Math.random() * numberLength),
      );
    }

    return generatedNumber;
  }

  static generateRandomString(numLength: number): string {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < numLength; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
